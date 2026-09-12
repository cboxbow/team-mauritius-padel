import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const SUPABASE_URL = url;

export const isSupabaseConfigured = Boolean(url && anonKey);

// Only ever null when env vars are missing (local dev without credentials) — every
// call site must check isSupabaseConfigured (or handle a null client) before using this.
export const supabase = isSupabaseConfigured ? createClient(url as string, anonKey as string) : null;
