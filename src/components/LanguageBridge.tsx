"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useApp } from "@/lib/store";
import { translatePhrase } from "@/lib/phrase-dict";
import type { LangCode } from "@/lib/i18n";

interface TextRecord {
  base: string;
  applied: string;
}

const textRegistry = new WeakMap<Text, TextRecord>();
const attrRegistry = new WeakMap<Element, Record<string, TextRecord>>();
const trackedTextNodes = new Set<WeakRef<Text>>();
const trackedAttrElements = new Set<WeakRef<Element>>();

const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "CODE", "PRE", "SVG"]);
const TRANSLATED_ATTRS = ["placeholder", "title"] as const;

function shouldSkipElement(el: Element | null): boolean {
  if (!el) return true;
  if (SKIP_TAGS.has(el.tagName)) return true;
  if (el.closest("[data-no-translate], .font-arabic, [contenteditable='true']")) return true;
  return false;
}

function applyToTextNode(node: Text, lang: LangCode): void {
  const current = node.nodeValue ?? "";
  if (!current.trim()) return;
  if (shouldSkipElement(node.parentElement)) return;

  const existing = textRegistry.get(node);
  let base = current;
  if (existing) {
    // If React updated nodeValue behind the scenes, capture the new base string
    base = current === existing.applied ? existing.base : current;
  }

  if (lang === "en") {
    if (existing && current !== base) {
      node.nodeValue = base;
      textRegistry.set(node, { base, applied: base });
    }
    return;
  }

  const next = translatePhrase(lang, base);
  if (next !== base) {
    if (current !== next) {
      node.nodeValue = next;
    }
    if (!existing) {
      trackedTextNodes.add(new WeakRef(node));
    }
    textRegistry.set(node, { base, applied: next });
  } else if (existing && current !== base) {
    node.nodeValue = base;
    textRegistry.set(node, { base, applied: base });
  }
}

function applyToAttributes(el: Element, lang: LangCode): void {
  if (shouldSkipElement(el)) return;
  let map = attrRegistry.get(el);

  for (const attr of TRANSLATED_ATTRS) {
    const val = el.getAttribute(attr);
    if (!val || !val.trim()) continue;

    const existing = map?.[attr];
    const base = existing ? (val === existing.applied ? existing.base : val) : val;

    if (lang === "en") {
      if (existing && val !== base) {
        el.setAttribute(attr, base);
        existing.applied = base;
      }
      continue;
    }

    const next = translatePhrase(lang, base);
    if (next !== base) {
      if (val !== next) el.setAttribute(attr, next);
      if (!map) {
        map = {};
        attrRegistry.set(el, map);
        trackedAttrElements.add(new WeakRef(el));
      }
      map[attr] = { base, applied: next };
    }
  }
}

function walkSubtree(root: Node, lang: LangCode): void {
  if (root.nodeType === Node.TEXT_NODE) {
    applyToTextNode(root as Text, lang);
    return;
  }
  if (root.nodeType !== Node.ELEMENT_NODE) return;
  const rootEl = root as Element;
  if (SKIP_TAGS.has(rootEl.tagName)) return;

  applyToAttributes(rootEl, lang);

  const walker = document.createTreeWalker(
    rootEl,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT
  );

  let curr = walker.nextNode();
  while (curr) {
    if (curr.nodeType === Node.TEXT_NODE) {
      applyToTextNode(curr as Text, lang);
    } else if (curr.nodeType === Node.ELEMENT_NODE) {
      applyToAttributes(curr as Element, lang);
    }
    curr = walker.nextNode();
  }
}

function revertAllToEnglish(): void {
  for (const ref of trackedTextNodes) {
    const node = ref.deref();
    if (!node) {
      trackedTextNodes.delete(ref);
      continue;
    }
    const rec = textRegistry.get(node);
    if (rec && node.nodeValue === rec.applied && rec.applied !== rec.base) {
      node.nodeValue = rec.base;
      rec.applied = rec.base;
    }
  }
  for (const ref of trackedAttrElements) {
    const el = ref.deref();
    if (!el) {
      trackedAttrElements.delete(ref);
      continue;
    }
    const map = attrRegistry.get(el);
    if (!map) continue;
    for (const attr of TRANSLATED_ATTRS) {
      const rec = map[attr];
      if (rec && el.getAttribute(attr) === rec.applied && rec.applied !== rec.base) {
        el.setAttribute(attr, rec.base);
        rec.applied = rec.base;
      }
    }
  }
}

/**
 * Reversible, React-Fiber-safe phrase localization bridge.
 * Never alters DOM node hierarchy (only updates existing Text.nodeValue & attributes).
 */
export function LanguageBridge() {
  const { lang, hydrated } = useApp();
  const pathname = usePathname();

  useEffect(() => {
    if (!hydrated || typeof document === "undefined") return;

    let rafId = 0;
    let isApplying = false;

    const runPass = () => {
      if (isApplying) return;
      isApplying = true;
      try {
        if (lang === "en") {
          revertAllToEnglish();
        } else {
          walkSubtree(document.body, lang);
        }
      } finally {
        isApplying = false;
      }
    };

    runPass();

    if (lang === "en") return;

    const observer = new MutationObserver((mutations) => {
      if (isApplying) return;
      let relevant = false;
      for (const m of mutations) {
        if (m.type === "childList" && m.addedNodes.length > 0) {
          relevant = true;
          break;
        }
        if (m.type === "characterData") {
          relevant = true;
          break;
        }
      }
      if (!relevant) return;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(runPass);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [lang, pathname, hydrated]);

  return null;
}
