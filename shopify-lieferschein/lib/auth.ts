// Web Crypto statt node:crypto, damit derselbe Code im Proxy (Edge) und in
// Server Actions (Node) läuft.
const SECRET = process.env.AUTH_SECRET ?? "lieferschein-demo-secret";

export const SESSION_COOKIE = "session";
export const DEMO_USER = "Test";
export const DEMO_PASSWORD = "Test";

export async function sessionToken(): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(`user:${DEMO_USER}`)
  );
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function isValidSession(
  value: string | undefined
): Promise<boolean> {
  if (!value) return false;
  return value === (await sessionToken());
}
