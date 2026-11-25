import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { COMPANY } from "@/lib/portal-data";

const askSchema = z.object({
  history: z
    .array(z.object({ role: z.enum(["fox", "user"]), text: z.string().trim().max(500) }))
    .max(10),
});

const SYSTEM = `You are Jom, the friendly fox mascot of the DuitJom merchant portal.
The website is under ongoing maintenance and should be back in about 2 hours.
Answer the customer's last message in 1-3 short, warm sentences, in the language they used.
Facts you may share: company ${COMPANY.name}, ${COMPANY.ssm}, contact ${COMPANY.fax}, address ${COMPANY.address}.
Never invent account details, approval status or dates. Never ask for or reveal PINs, passkeys or passwords.
If you cannot help, suggest trying Retry after 2 hours or contacting the company.`;

/** Asks the mascot a question; the gateway key stays on the server. */
export const askMascot = createServerFn({ method: "POST" })
  .inputValidator((data: { history: { role: "fox" | "user"; text: string }[] }) => askSchema.parse(data))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) return { reply: "I'm resting right now. Please try again after 2 hours!" };

    const transcript = data.history
      .map((m) => `${m.role === "fox" ? "Jom" : "Customer"}: ${m.text}`)
      .join("\n");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "fetch" },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        instructions: SYSTEM,
        input: transcript,
        stream: true,
        store: false,
        reasoning: { effort: "low" },
      }),
    });
    if (!res.ok || !res.body) {
      const body = await res.text().catch(() => "");
      console.error(`mascot gateway failed [${res.status}]: ${body}`);
      return { reply: "Oops, my thinking cap slipped! Please ask me again in a moment." };
    }

    // Read the stream on the server and return only the final text.
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let reply = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const evt = JSON.parse(payload) as { type?: string; delta?: string };
          if (evt.type === "response.output_text.delta" && typeof evt.delta === "string") reply += evt.delta;
        } catch {
          // ignore non-JSON keep-alives
        }
      }
    }
    return { reply: reply.trim() || "Hmm, I'm not sure. Please try Retry after 2 hours!" };
  });
