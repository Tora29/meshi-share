import { createBrowserClient } from '@supabase/ssr'

/**
 * Supabase Client (ブラウザ用)
 * Client Componentで使用する
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
