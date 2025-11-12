import { createLogger } from '@tora29/logdock-client'

import { productionLogger } from './logger-production'
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
 * - USE_PRODUCTION_LOGGER: 本番環境でProductionLoggerを使用（オプション、'true'で有効）
 */

// デバッグ情報の出力（初期化時のみ）
const isDebugMode =
  process.env.LOGDOCK_DEBUG === 'true' || process.env.NODE_ENV === 'development'

// ProductionLoggerは環境変数で明示的に有効化した場合のみ使用
const useProductionLogger = process.env.USE_PRODUCTION_LOGGER === 'true'

if (isDebugMode) {
  console.log('[Logger Init] Configuration:', {
    useProductionLogger,
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

// 本番環境用のフォールバックロガーを使用
export const logger = useProductionLogger
  ? productionLogger
  : createLogger({
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
          return (
            (user?.user_metadata.full_name as string | undefined) ?? 'Unknown'
          )
        } catch (error) {
          console.error('[LogDock] getUserId failed:', error)
          return 'Unknown'
        }
      },
    })
