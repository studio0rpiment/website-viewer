import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/**
 * null when the env vars are missing — the app then runs read-only from
 * src/data/students.json so a fresh clone still works without a database.
 * Row types live in src/types.ts and are applied in lib/data.ts; if the schema
 * grows, `supabase gen types` can replace them with generated ones.
 */
export const supabase: SupabaseClient | null = url && key ? createClient(url, key) : null
