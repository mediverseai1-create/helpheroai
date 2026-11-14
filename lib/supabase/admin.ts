import "server-only";
import { createClient } from "@supabase/supabase-js";
// Service role: bypasses RLS. Server only. Callers must validate everything themselves.
export const supabaseAdmin = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
