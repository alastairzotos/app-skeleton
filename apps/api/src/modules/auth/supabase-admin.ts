import { createClient, SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient<any, "public", any> | null = null;

export const getSupabase = () => {
  if (!client) {
    client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
  }

  return client;
}
