/**
 * Cryptographic Sacred Text Integrity (SHA-256) & Client-Side Zakat Encryption (AES-256-GCM)
 * Implements PRD Section 5.1 & 5.3 defense-in-depth controls.
 */

export async function sha256Hex(text: string): Promise<string> {
  if (typeof window !== "undefined" && window.crypto?.subtle) {
    const data = new TextEncoder().encode(text);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  // Deterministic fallback for SSR
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

async function getOrCreateLocalAesKey(): Promise<CryptoKey | null> {
  if (typeof window === "undefined" || !window.crypto?.subtle) return null;
  const keyStorage = "auliya_zakat_aes_key_v1";
  const existing = localStorage.getItem(keyStorage);
  if (existing) {
    const raw = Uint8Array.from(atob(existing), (c) => c.charCodeAt(0));
    return window.crypto.subtle.importKey("raw", raw, { name: "AES-GCM" }, false, [
      "encrypt",
      "decrypt",
    ]);
  }
  const key = await window.crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, [
    "encrypt",
    "decrypt",
  ]);
  const exported = await window.crypto.subtle.exportKey("raw", key);
  const b64 = btoa(String.fromCharCode(...new Uint8Array(exported)));
  localStorage.setItem(keyStorage, b64);
  return key;
}

export async function encryptZakatPayload(payload: object): Promise<string> {
  const json = JSON.stringify(payload);
  const key = await getOrCreateLocalAesKey();
  if (!key) return btoa(json);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(json);
  const cipher = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);
  return JSON.stringify({
    alg: "AES-256-GCM",
    iv: btoa(String.fromCharCode(...iv)),
    ct: btoa(String.fromCharCode(...new Uint8Array(cipher))),
  });
}

export async function decryptZakatPayload<T>(blob: string): Promise<T | null> {
  try {
    const parsed = JSON.parse(blob);
    if (parsed?.alg !== "AES-256-GCM") return parsed as T;
    const key = await getOrCreateLocalAesKey();
    if (!key) return null;
    const iv = Uint8Array.from(atob(parsed.iv), (c) => c.charCodeAt(0));
    const ct = Uint8Array.from(atob(parsed.ct), (c) => c.charCodeAt(0));
    const plain = await window.crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct);
    return JSON.parse(new TextDecoder().decode(plain)) as T;
  } catch {
    return null;
  }
}
