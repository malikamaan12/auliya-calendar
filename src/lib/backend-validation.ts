import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().trim().email("Valid email address is required").max(160),
  password: z.string().min(6, "Password must be at least 6 characters").max(128),
  city: z.string().trim().max(60).optional(),
  requestedRole: z.enum(["member", "creator"]).optional(),
});

export const LoginSchema = z.object({
  email: z.string().trim().email("Valid email address is required"),
  password: z.string().min(1, "Password is required").max(128),
});

export const ProgressSnapshotSchema = z.object({
  streakDays: z.number().int().min(0).max(50000).optional(),
  bestQuizTier: z.number().int().min(0).max(15).optional(),
  lastQuranRef: z.string().trim().max(32).optional(),
  tasbihTotalToday: z.number().int().min(0).max(1000000).optional(),
  hawlHijriMonth: z.number().int().min(1).max(12).optional(),
  hawlHijriDay: z.number().int().min(1).max(30).optional(),
  updatedAt: z.string().optional(),
});

export const UpdateProfileSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  title: z.string().trim().max(60).optional(),
  city: z.string().trim().max(50).optional(),
  xpDelta: z.number().finite().min(-10000).max(50000).optional(),
  progress: ProgressSnapshotSchema.optional(),
});

export const AdminUpdateUserSchema = z.object({
  targetUserId: z.string().min(1, "Target user ID is required"),
  role: z.enum(["super_admin", "editor", "creator", "member"]).optional(),
  status: z.enum(["active", "suspended"]).optional(),
  title: z.string().trim().max(60).optional(),
});

export const ReviewSubmissionSchema = z.object({
  targetType: z.enum(["auliya", "urs"]),
  id: z.string().min(1, "Record ID is required"),
  decision: z.enum(["approve", "request_changes"]),
  reviewNotes: z.string().trim().max(500).optional(),
});

export const AuliyaUpsertSchema = z
  .object({
    id: z.string().optional(),
    slug: z.string().optional(),
    name: z.string().trim().min(2, "Saint name is required").max(140),
    urduName: z.string().trim().min(1, "Urdu/Arabic name is required").max(160),
    arabicName: z.string().trim().max(160).optional(),
    city: z.string().trim().min(1, "City is required").max(80),
    country: z.string().trim().min(1, "Country is required").max(80),
    ursMonth: z.coerce.number().int().min(1).max(12).optional(),
    ursDay: z.coerce.number().int().min(1).max(30).optional(),
    lat: z.coerce.number().min(-90).max(90).optional(),
    lng: z.coerce.number().min(-180).max(180).optional(),
    status: z.enum(["Draft", "Scholarly Verification", "Published"]).optional(),
  })
  .passthrough();

export const UrsUpsertSchema = z
  .object({
    id: z.string().optional(),
    title: z.string().trim().min(2, "Event title is required").max(160),
    month: z.coerce.number().int().min(1).max(12),
    day: z.coerce.number().int().min(1).max(30),
    type: z.enum(["urs", "sacred", "fasting"]).optional(),
    status: z.enum(["Draft", "Scholarly Verification", "Published"]).optional(),
  })
  .passthrough();

export const BarsiUpsertSchema = z
  .object({
    id: z.string().optional(),
    personName: z.string().trim().min(2, "Name is required").max(120),
    hijriMonth: z.coerce.number().int().min(1).max(12),
    hijriDay: z.coerce.number().int().min(1).max(30),
    visibility: z.enum(["private", "community"]).optional(),
  })
  .passthrough();

export const SnapshotRestoreSchema = z.object({
  schemaVersion: z.number().int().min(1),
  users: z.array(z.any()).min(1),
  sessions: z.array(z.any()),
  auliyaRecords: z.array(z.any()),
  ursEvents: z.array(z.any()),
  barsiRecords: z.array(z.any()),
  modules: z.array(z.any()).min(1),
  zakatConfig: z.record(z.string(), z.any()),
  gamificationConfig: z.record(z.string(), z.any()),
  platformSettings: z.record(z.string(), z.any()),
  auditLogs: z.array(z.any()),
});
