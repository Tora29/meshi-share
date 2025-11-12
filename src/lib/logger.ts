import { createLogger } from '@tora29/logdock-client'

import { createClient } from './supabase/server'

/**
 * Logdockロギングクライアント
 *
 * 必要な環境変数:
 * - LOGDOCK_API_URL: Logdock APIエンドポイント
 * - LOGDOCK_API_KEY: API認証キー
 * - CF_ACCESS_CLIENT_ID: Cloudflare Access ID（オプション）
 * - CF_ACCESS_CLIENT_SECRET: Cloudflare Accessシークレット（オプション）
 * - LOGDOCK_DEBUG: デバッグモード強制有効化（オプション、'true'で有効）
 */
const isDebugForced = process.env.LOGDOCK_DEBUG === 'true'
const isDevelopment = process.env.NODE_ENV === 'development'
const debugEnabled = isDebugForced ? true : isDevelopment

export const logger = createLogger({
  apiUrl: process.env.LOGDOCK_API_URL ?? '',
  apiKey: process.env.LOGDOCK_API_KEY ?? '',
  app: 'meshi-share',
  cfAccessClientId: process.env.CF_ACCESS_CLIENT_ID,
  cfAccessClientSecret: process.env.CF_ACCESS_CLIENT_SECRET,
  debug: debugEnabled,
  getUserId: async () => {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return (user?.user_metadata.full_name as string | undefined) ?? 'Unknown'
  },
})
