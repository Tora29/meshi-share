import { createLogger } from '@logdock/client'

/**
 * Logdockロギングクライアント
 *
 * 必要な環境変数:
 * - LOGDOCK_API_URL: Logdock APIエンドポイント
 * - LOGDOCK_API_KEY: API認証キー
 * - CF_ACCESS_CLIENT_ID: Cloudflare Access ID（オプション）
 * - CF_ACCESS_CLIENT_SECRET: Cloudflare Accessシークレット（オプション）
 */
export const logger = createLogger({
  apiUrl: process.env.LOGDOCK_API_URL ?? '',
  apiKey: process.env.LOGDOCK_API_KEY ?? '',
  app: 'meshi-share',
  cfAccessClientId: process.env.CF_ACCESS_CLIENT_ID,
  cfAccessClientSecret: process.env.CF_ACCESS_CLIENT_SECRET,
  debug: process.env.NODE_ENV === 'development',
})
