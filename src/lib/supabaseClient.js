import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey =
  // Prefer Supabase's publishable key name; fall back to the legacy anon key for compatibility.
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey)

export const supabase =
  supabaseConfigured
    ? createClient(supabaseUrl, supabasePublishableKey)
    : null
