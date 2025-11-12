import { createLogger } from '@tora29/logdock-client'

import { createClient } from './supabase/server'

/**
 * Logdockロギングクライアント
 *
 * 必要な環境変数:
 * - LOGDOCK_API_URL: Logdock APIエンドポイント（例: https://logdock.net）
 * - LOGDOCK_API_KEY: API認証キー
 * - CF_ACCESS_CLIENT_ID: Cloudflare Access ID（オプション）
 * - CF_ACCESS_CLIENT_SECRET: Cloudflare Accessシークレット（オプション）
 * - LOGDOCK_DEBUG: デバッグモード強制有効化（オプション、'true'で有効）
 */

// デバッグ情報の出力（初期化時のみ）
const isDebugMode =
  process.env.LOGDOCK_DEBUG === 'true' || process.env.NODE_ENV === 'development'

if (isDebugMode) {
  console.log('[LogDock Init] Configuration:', {
    apiUrl: process.env.LOGDOCK_API_URL ? '✓ Set' : '✗ Missing',
    apiKey: process.env.LOGDOCK_API_KEY ? '✓ Set' : '✗ Missing',
    cfAccessClientId: process.env.CF_ACCESS_CLIENT_ID ? '✓ Set' : '✗ Missing',
    cfAccessClientSecret: process.env.CF_ACCESS_CLIENT_SECRET
      ? '✓ Set'
      : '✗ Missing',
    debugMode: isDebugMode,
    environment: process.env.NODE_ENV,
  })
}

export const logger = createLogger({
  apiUrl: process.env.LOGDOCK_API_URL ?? '',
  apiKey: process.env.LOGDOCK_API_KEY ?? '',
  app: 'meshi-share',
  cfAccessClientId: process.env.CF_ACCESS_CLIENT_ID,
  cfAccessClientSecret: process.env.CF_ACCESS_CLIENT_SECRET,
  debug: isDebugMode,
  getUserId: async () => {
    try {
      const supabase = await createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      return (user?.user_metadata.full_name as string | undefined) ?? 'Unknown'
    } catch (error) {
      console.error('[LogDock] getUserId failed:', error)
      return 'Unknown'
    }
  },
})
