// A way to be told that mail is broken, which does not itself depend on mail.
//
// ALERT_WEBHOOK_URL takes a plain POST. It is deliberately format-agnostic so
// the same variable works with ntfy.sh (body = the text), Slack/Discord
// (JSON {text} / {content}) or Pushover — see README for the two-minute setup.
// Unset: everything still works, just without the push.

const TIMEOUT_MS = 4000;

export async function pushAlert(text: string): Promise<boolean> {
  const url = process.env.ALERT_WEBHOOK_URL;
  if (!url) return false;

  const message = `Holstrup TS: ${text}`.slice(0, 900);
  const isJson = /slack\.com|discord(app)?\.com/.test(url);
  const body = isJson
    ? JSON.stringify(url.includes("discord") ? { content: message } : { text: message })
    : message;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: isJson
        ? { "Content-Type": "application/json" }
        : { "Content-Type": "text/plain", Title: "Holstrup TS", Priority: "high" },
      body,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) console.error("[holstrup/alert] webhook returned", res.status);
    return res.ok;
  } catch (e) {
    // An alert channel that throws must never take the request down with it.
    console.error("[holstrup/alert] webhook failed", e);
    return false;
  }
}
