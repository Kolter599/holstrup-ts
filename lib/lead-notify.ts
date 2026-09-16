import { buildLeadHtml, buildLeadText, partialSubject, sendLeadMail } from "@/lib/lead-mail";

export type PartialRow = {
  name: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  service: string | null;
  message: string | null;
};

/** Mail Finn about an abandoned draft. Returns whether it actually went out. */
export async function notifyPartial(row: PartialRow): Promise<boolean> {
  const fields = {
    name: (row.name ?? "").trim(),
    email: (row.email ?? "").trim(),
    phone: (row.phone ?? "").trim(),
    city: (row.city ?? "").trim(),
    service: (row.service ?? "").trim(),
    message: (row.message ?? "").trim(),
  };
  const { sent, error } = await sendLeadMail({
    subject: partialSubject(fields),
    html: buildLeadHtml("partial", fields),
    text: buildLeadText("partial", fields),
    replyTo: fields.email,
  });
  if (error) console.error("[holstrup/partial] mail failed", error);
  return sent;
}
