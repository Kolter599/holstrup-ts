"use client";

import { useSyncExternalStore } from "react";
import type { CustomerType, ServiceGroup } from "@/lib/service-groups";

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
  customerType: CustomerType | null;
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
    customerType: null,
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
  save();
  emit();
}

/** Records where the lead came from the first time it matters, then leaves it. */
export function claimSource(id: string, source: string): void {
  patch({ activeId: state.activeId ?? id, leadSource: state.leadSource || source });
}

export function resetForPath(pathname: string, group: ServiceGroup | null, detail: string): void {
  if (state.pathname === pathname) return;
  state = restore(pathname) ?? empty(pathname, group, detail);
  emit();
}

/* ------------------------------ persistence ------------------------------ */

// Describing a job can take days: people go looking for the tilstandsrapport,
// photos, measurements. So what they typed survives a reload, a closed tab and
// a dead battery, and step 2 never folds itself back up. Photos are File
// objects and cannot be stored, so they are the one thing that does not return.
const KEY = "holstrup_lead_draft";
const MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000;

type Stored = Pick<LeadState, "pathname" | "name" | "phone" | "email" | "message" | "group" | "detail" | "customerType" | "expandedId" | "leadSource" | "partialSent"> & { savedAt: number };

function save(): void {
  if (typeof window === "undefined") return;
  const { pathname, name, phone, email, message, group, detail, customerType, expandedId, leadSource, partialSent } = state;
  if (!name && !phone && !email && !message) return;
  try {
    const payload: Stored = { pathname, name, phone, email, message, group, detail, customerType, expandedId, leadSource, partialSent, savedAt: Date.now() };
    window.localStorage.setItem(KEY, JSON.stringify(payload));
  } catch {
    // Private mode or a full quota: the form still works, it just forgets.
  }
}

function restore(pathname: string): LeadState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw) as Stored;
    if (stored.pathname !== pathname) return null;
    if (!stored.savedAt || Date.now() - stored.savedAt > MAX_AGE_MS) {
      window.localStorage.removeItem(KEY);
      return null;
    }
    return { ...empty(pathname, stored.group, stored.detail), ...stored, photos: [], photoError: null, touched: {}, activeId: null, pendingScroll: null, status: "idle", serverMessage: "", done: false };
  } catch {
    return null;
  }
}

/** Called when the lead is sent, so the next visitor on this browser starts clean. */
export function clearSaved(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
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
