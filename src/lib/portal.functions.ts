import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Server-side lookups ported from the source project's src/api/*.ts endpoints.
 * The merchant identifier is public app data (it is shown on the merchant
 * card); the passkey is never stored in this file — it is read from the
 * secure secret store inside the handler.
 */

const MERCHANT_ID = "2000162100241";

const lookupSchema = z.object({ merchantId: z.string().trim().min(1).max(64) });

export const findMerchant = createServerFn({ method: "POST" })
  .inputValidator((data: { merchantId: string }) => lookupSchema.parse(data))
  .handler(async ({ data }) => ({ valid: data.merchantId.trim() === MERCHANT_ID }));

const verifySchema = z.object({
  merchantId: z.string().trim().min(1).max(64),
  passkey: z.string().max(128).optional(),
});

export const verifyMerchant = createServerFn({ method: "POST" })
  .inputValidator((data: { merchantId: string; passkey?: string }) => verifySchema.parse(data))
  .handler(async ({ data }) => {
    const idOk = data.merchantId.trim() === MERCHANT_ID;
    if (data.passkey === undefined) return { valid: idOk, configured: true };

    const expected = process.env["MERCHANT_PASSKEY"];
    if (expected === undefined || expected === "") {
      // No credential configured yet: refuse instead of guessing.
      return { valid: false, configured: false };
    }
    return { valid: idOk && data.passkey === expected, configured: true };
  });

const adminSchema = z.object({
  username: z.string().trim().min(1).max(64),
  password: z.string().min(1).max(128),
});

/**
 * Admin gate. Credentials live in the secure secret store and are compared
 * inside the handler only; nothing is hardcoded here.
 */
export const verifyAdmin = createServerFn({ method: "POST" })
  .inputValidator((data: { username: string; password: string }) => adminSchema.parse(data))
  .handler(async ({ data }) => {
    const user = process.env["ZITE_ADMIN_USERNAME"];
    const pass = process.env["ZITE_ADMIN_PASSWORD"];
    if (user === undefined || pass === undefined || user === "" || pass === "") {
      return { valid: false, configured: false };
    }
    return { valid: data.username === user && data.password === pass, configured: true };
  });

export const checkDashboardAvailability = createServerFn({ method: "POST" }).handler(async () => ({
  available: false,
}));

const registrationSchema = z.object({
  merchantId: z.string().trim().min(1).max(64),
  role: z.string().trim().max(32).default("user"),
  phone: z
    .string()
    .trim()
    .regex(/^\d{8,11}$/, "Enter a valid phone number"),
  pin: z.string().regex(/^\d{6}$/, "PIN must be 6 digits"),
  email: z.string().trim().email("Enter a valid e-mail"),
});

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Stores a new client registration. The access PIN is hashed before it is
 * written and is never emailed or returned to the browser.
 */
export const submitRegistration = createServerFn({ method: "POST" })
  .inputValidator((data: { merchantId: string; role: string; phone: string; pin: string; email: string }) =>
    registrationSchema.parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const pinHash = await sha256(data.pin);
    const { error } = await supabaseAdmin.from("client_registrations").insert({
      merchant_id: data.merchantId.trim(),
      role: data.role,
      phone: `+60${data.phone}`,
      email: data.email,
      pin_hash: pinHash,
    });
    if (error) {
      console.error("registration insert failed", error.message);
      throw new Error("Could not save your details. Please try again.");
    }
    return { success: true };
  });

const reportSchema = z.object({
  fullName: z.string().trim().max(120),
  myKad: z.string().trim().max(32),
  email: z.string().trim().email(),
  phone: z.string().trim().max(32),
  product: z.string().trim().max(120),
  status: z.string().trim().max(64),
});

/**
 * Records a report request. Gmail delivery is still pending connection, so the
 * request is stored instead of emailed.
 */
export const requestReport = createServerFn({ method: "POST" })
  .inputValidator((data: { fullName: string; myKad: string; email: string; phone: string; product: string; status: string }) =>
    reportSchema.parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("report_requests").insert({
      full_name: data.fullName,
      my_kad: data.myKad,
      email: data.email,
      phone: data.phone,
      product: data.product,
      status: data.status,
    });
    if (error) {
      console.error("report request insert failed", error.message);
      throw new Error("Could not record the report request. Please try again.");
    }
    return { success: true };
  });
