import { createBrowserClient } from '@supabase/ssr'

/**
 * Supabase Client (ブラウザ用)
 * Client Componentで使用する
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
