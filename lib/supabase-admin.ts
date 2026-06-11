import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client serveur — accès total, à utiliser uniquement dans les Route Handlers et Server Components
export const supabaseAdmin = createClient(url, service);
