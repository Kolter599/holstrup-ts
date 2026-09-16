"use client";

import { useSyncExternalStore } from "react";
import type { ServiceGroup } from "@/lib/service-groups";

// A page can carry the form twice — compact next to the promise, full-width
// after the proof. They are the same lead, so they are the same state: type in
// one and it is in the other, only one can be open, one row, one notification.
// Module scope rather than context, so pages just drop the component in.

export type LeadPhoto = { file: File; preview: string };

export type LeadState = {
  /** Which page this state belongs to; a new page starts a new lead. */
  pathname: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  group: ServiceGroup | null;
  detail: string;
  photos: LeadPhoto[];
  photoError: string | null;
  touched: { phone?: boolean; email?: boolean };
  /** Id of the instance showing step 2, if any. */
  expandedId: string | null;
  /** Instance the visitor is actually typing in — the only one that autosaves. */
  activeId: string | null;
  /** Where the lead was won. Set once, never overwritten. */
  leadSource: string;
  /** Instance that should scroll itself into view on the next paint. */
  pendingScroll: string | null;
  partialSent: boolean;
  status: "idle" | "sending" | "error";
  serverMessage: string;
  done: boolean;
};

function empty(pathname: string, group: ServiceGroup | null, detail: string): LeadState {
  return {
    pathname,
    name: "",
    phone: "",
    email: "",
    message: "",
    group,
    detail,
    photos: [],
    photoError: null,
    touched: {},
    expandedId: null,
    activeId: null,
    leadSource: "",
    pendingScroll: null,
    partialSent: false,
    status: "idle",
    serverMessage: "",
    done: false,
  };
}

let state: LeadState = empty("", null, "");
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

/** Never mutates: every change is a new state object. */
export function patch(next: Partial<LeadState>): void {
  state = { ...state, ...next };
  emit();
}

/** Records where the lead came from the first time it matters, then leaves it. */
export function claimSource(id: string, source: string): void {
  patch({ activeId: state.activeId ?? id, leadSource: state.leadSource || source });
}

export function resetForPath(pathname: string, group: ServiceGroup | null, detail: string): void {
  if (state.pathname === pathname) return;
  state = empty(pathname, group, detail);
  emit();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getState(): LeadState {
  return state;
}

export function useLeadState(): LeadState {
  return useSyncExternalStore(subscribe, getState, getState);
}
