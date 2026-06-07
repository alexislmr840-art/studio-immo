import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client public (navigateur) — limité par RLS
export const supabase = createClient(url, anon);

// Client serveur — accès total, à utiliser uniquement dans les Route Handlers et Server Components
export const supabaseAdmin = createClient(url, service);
