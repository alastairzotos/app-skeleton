// supabase.ts
import { createClient } from '@supabase/supabase-js'
import { getEnv } from '../utils/env'

export const supabase = createClient(
  getEnv().supabaseUrl!,
  getEnv().supabaseAnonKey!,
);
