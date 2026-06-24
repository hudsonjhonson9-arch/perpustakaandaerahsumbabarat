import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

let _client = null;

function getClient() {
  if (!_client && SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
      _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (_) {
      _client = null;
    }
  }
  return _client;
}

export const supabase = new Proxy({}, {
  get(_, prop) {
    const c = getClient();
    return c ? c[prop].bind(c) : async () => ({ data: null, error: new Error("Supabase not configured") });
  },
});
