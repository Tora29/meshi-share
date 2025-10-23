'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * OAuth認証のレスポンス型
 */
export interface OAuthResponse {
  data: {
    url: string | null
  }
  error: {
    message: string
    status?: number
  } | null
}

/**
 * デフォルトのローカル開発環境URL
 */
const DEFAULT_LOCAL_URL = 'http://localhost:3000'

/**
 * 認証コールバックパス
 */
const CALLBACK_PATH = '/auth/callback'

/**
 * Google OAuth認証を実行
 *
 * @returns OAuth認証のレスポンス
 * - 成功時: data.urlに認証ページのURLが含まれる
 * - 失敗時: errorにエラー情報が含まれる
 */
export async function signInWithGoogleOAuth(): Promise<OAuthResponse> {
  const supabase = await createClient()

  // リダイレクト先URLを構築（本番・開発環境両対応）
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_LOCAL_URL
  const redirectTo = `${baseUrl}${CALLBACK_PATH}`

  const result = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
    },
  })

  return result
}
