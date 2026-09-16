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

assert.equal(isStale({ submitted: true, status: "new", created_at: hoursAgo(25) }, now), true);
assert.equal(isStale({ submitted: true, status: "new", created_at: hoursAgo(23) }, now), false);
assert.equal(isStale({ submitted: true, status: "contacted", created_at: hoursAgo(99) }, now), false);
assert.equal(isStale({ submitted: false, status: "new", created_at: hoursAgo(99) }, now), false);

/* --- one reminder per day, and nothing when there is nothing to say --- */

assert.equal(isReminderDue(null, now), true, "never reminded before");
assert.equal(isReminderDue(hoursAgo(25), now), true);
assert.equal(isReminderDue(hoursAgo(3), now), false, "already nagged today");

console.log("lead rules OK");
