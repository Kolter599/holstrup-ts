// Runnable check for the rules that decide whether Finn hears about a lead.
//   node scripts/check-lead-rules.ts
// No framework on purpose — if these asserts pass, no lead can go unnoticed
// for a reason we understand.

import assert from "node:assert/strict";
import {
  isPartialNotifiable,
  isReminderDue,
  isStale,
  needsEmailRetry,
} from "../lib/lead-rules.ts";

/* --- partial trigger: a way to reach them is the whole bar --- */

// The 7 abandoned drafts that should have raised an alert.
assert.equal(isPartialNotifiable({ phone: "40 17 38 93", name: "Lasse" }), true);
assert.equal(isPartialNotifiable({ phone: "+4540173893", city: "Hillerød" }), true);
assert.equal(isPartialNotifiable({ phone: "40173893" }), true, "a number on its own is a lead");
assert.equal(isPartialNotifiable({ email: "a@b.dk" }), true);

// Nothing to ring or write to: not a lead, however much else they typed.
assert.equal(isPartialNotifiable({ name: "Lasse", city: "Hillerød" }), false);
assert.equal(isPartialNotifiable({ phone: "401", name: "Lasse" }), false, "too few digits");
assert.equal(isPartialNotifiable({ email: "ikke-en-mail", name: "Lasse" }), false);
assert.equal(isPartialNotifiable({}), false);

/* --- retry eligibility --- */

// The 8 September lead: submitted, never emailed, nothing logged.
assert.equal(needsEmailRetry({ submitted: true, email_sent: false }), true);
assert.equal(needsEmailRetry({ submitted: true, email_sent: true }), false);
assert.equal(needsEmailRetry({ submitted: false, email_sent: false }), false, "drafts are not retried");

/* --- staleness --- */

const now = new Date("2026-09-16T12:00:00Z");
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600_000).toISOString();

// Four days, not one: a lead is not neglected because it is a day old.
assert.equal(isStale({ submitted: true, status: "new", created_at: hoursAgo(97) }, now), true);
assert.equal(isStale({ submitted: true, status: "new", created_at: hoursAgo(95) }, now), false);
assert.equal(
  isStale({ submitted: true, status: "new", created_at: hoursAgo(25) }, now),
  false,
  "a day old is not yet worth a reminder",
);
assert.equal(isStale({ submitted: true, status: "contacted", created_at: hoursAgo(999) }, now), false);
assert.equal(isStale({ submitted: false, status: "new", created_at: hoursAgo(999) }, now), false);

/* --- one reminder per lead, ever --- */

// The cron's SQL carries this rule (reminder_sent_at IS NULL); these asserts
// pin the shape it relies on, so a lead already reminded is never picked again.
const remindable = (row: { reminder_sent_at: string | null; created_at: string }) =>
  isStale({ submitted: true, status: "new", created_at: row.created_at }, now) &&
  row.reminder_sent_at === null;

assert.equal(remindable({ reminder_sent_at: null, created_at: hoursAgo(97) }), true);
assert.equal(
  remindable({ reminder_sent_at: hoursAgo(24), created_at: hoursAgo(97) }),
  false,
  "Lasse was reminded once; he must never be nagged again",
);
assert.equal(
  remindable({ reminder_sent_at: hoursAgo(9999), created_at: hoursAgo(9999) }),
  false,
  "one reminder is one reminder, however long ago it was",
);

/* --- the daily digest still only goes out once a day --- */

assert.equal(isReminderDue(null, now), true, "never reminded before");
assert.equal(isReminderDue(hoursAgo(25), now), true);
assert.equal(isReminderDue(hoursAgo(3), now), false, "already sent a digest today");

/* --- two placements on one page are one lead --- */

const store = await import("../lib/lead-form-store.ts");

store.resetForPath("/ydelser/tagrenovering", "Tag", "Tagrenovering og tagudskiftning");
assert.equal(store.getState().group, "Tag", "the page's slug preselects the chip");

// Typing in the compact one claims the lead for that position.
store.patch({ phone: "40173893" });
store.claimSource("tilbud-top", "/ydelser/tagrenovering#top");
assert.equal(store.getState().activeId, "tilbud-top");
assert.equal(store.getState().leadSource, "/ydelser/tagrenovering#top");

// The wide one below must not steal the attribution when they finish there.
store.claimSource("tilbud", "/ydelser/tagrenovering#efter-proof");
assert.equal(store.getState().leadSource, "/ydelser/tagrenovering#top", "source is set once");
assert.equal(store.getState().phone, "40173893", "state is shared between placements");

// Only one placement can be open, and the handoff keeps what was typed.
store.patch({ expandedId: "tilbud" });
assert.equal(store.getState().expandedId, "tilbud");
assert.equal(store.getState().phone, "40173893");

// Same page again = same lead; a different page starts a fresh one.
const before = store.getState();
store.resetForPath("/ydelser/tagrenovering", "Tag", "");
assert.equal(store.getState(), before, "re-mount on the same page keeps the lead");
store.resetForPath("/blog/hvad-koster-nyt-tag-2026", null, "");
assert.equal(store.getState().phone, "", "a new page starts a new lead");
assert.equal(store.getState().leadSource, "");

/* --- what a saved draft is allowed to bring back --- */

// The store checks for `window` at call time, so stubbing it here exercises the
// real save/restore path. A draft that came back reading "0" in the e-mail
// field is what this section exists to prevent.
const mem = new Map();
// defineProperty rather than assignment: the store only ever touches
// window.localStorage, so there is no reason to satisfy all of Window.
Object.defineProperty(globalThis, "window", {
  configurable: true,
  value: {
    localStorage: {
      get length() {
        return mem.size;
      },
      key: (i: number) => [...mem.keys()][i] ?? null,
      clear: () => mem.clear(),
      getItem: (k: string) => mem.get(k) ?? null,
      setItem: (k: string, v: string) => void mem.set(k, v),
      removeItem: (k: string) => void mem.delete(k),
    },
  },
});

store.resetForPath("/kontakt", null, "");
store.patch({ email: "0" });
assert.equal(mem.get("holstrup_lead_draft"), undefined, '"0" is not an address and must not come back');

store.patch({ phone: "401" });
assert.equal(mem.get("holstrup_lead_draft"), undefined, "three digits is not a number we can ring");

store.patch({ email: "finn@holstrup-ts.dk" });
assert.equal(
  JSON.parse(mem.get("holstrup_lead_draft")).email,
  "finn@holstrup-ts.dk",
  "a real address is worth keeping for 14 days",
);
assert.equal(JSON.parse(mem.get("holstrup_lead_draft")).phone, "", "the unusable number did not ride along");

// Clearing the form is how a draft is thrown away.
store.patch({ email: "", name: "", phone: "", message: "" });
assert.equal(mem.get("holstrup_lead_draft"), undefined, "an emptied form erases the saved draft");

console.log("lead rules OK");
