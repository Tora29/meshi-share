import { NextResponse } from 'next/server'

import { logger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'

import type { NextRequest } from 'next/server'

/**
 * 認証エラーコード
 */
const AUTH_ERROR_CODE = {
  NO_CODE: 'no_code',
  AUTH_FAILED: 'auth_failed',
  UNEXPECTED: 'unexpected',
} as const

/**
 * リダイレクトパス
 */
const REDIRECT_PATH = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
} as const

/**
 * Supabase認証のコールバック処理
 *
 * @param request - Next.jsのリクエストオブジェクト
 * @returns 認証結果に応じたリダイレクトレスポンス
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  // 認証コードがない場合はログインページへリダイレクト
  if (!code) {
    return NextResponse.redirect(
      new URL(
        `${REDIRECT_PATH.LOGIN}?error=${AUTH_ERROR_CODE.NO_CODE}`,
        requestUrl.origin
      )
    )
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    // 認証エラーがあればログインページへリダイレクト
    if (error) {
      logger.error('Authentication error', undefined, {
        action: 'login',
        result: 'error',
        metadata: {
          errorType: 'auth_failed',
          errorMessage: error.message,
        },
      })
      return NextResponse.redirect(
        new URL(
          `${REDIRECT_PATH.LOGIN}?error=${AUTH_ERROR_CODE.AUTH_FAILED}`,
          requestUrl.origin
        )
      )
    }

    // 認証成功時のログ記録
    // getUserIdコールバックが自動的にGoogle登録名を取得
    try {
      logger.info('User logged in successfully', undefined, {
        userId: data.user.id,
        userName:
          (data.user.user_metadata.full_name as string | undefined) ??
          'Unknown',
        action: 'login',
        result: 'success',
        metadata: {
          email: data.user.email,
          provider: data.user.app_metadata.provider,
        },
      })
    } catch (logError) {
      // ログ送信に失敗してもユーザー認証は続行
      console.error('[LogDock] Failed to log login success:', logError)
    }

    // 認証成功時はダッシュボードにリダイレクト
    return NextResponse.redirect(
      new URL(REDIRECT_PATH.DASHBOARD, requestUrl.origin)
    )
  } catch (err: unknown) {
    // 予期しないエラーの場合もログインページへリダイレクト
    logger.error('Unexpected error during authentication', undefined, {
      action: 'login',
      result: 'error',
      metadata: {
        errorType: 'unexpected',
        errorMessage: err instanceof Error ? err.message : String(err),
      },
    })
    return NextResponse.redirect(
      new URL(
        `${REDIRECT_PATH.LOGIN}?error=${AUTH_ERROR_CODE.UNEXPECTED}`,
        requestUrl.origin
      )
    )
  }
}
