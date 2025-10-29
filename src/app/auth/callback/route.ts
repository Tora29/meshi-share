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
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    // 認証エラーがあればログインページへリダイレクト
    if (error) {
      logger.error('Authentication error', undefined, { error })
      return NextResponse.redirect(
        new URL(
          `${REDIRECT_PATH.LOGIN}?error=${AUTH_ERROR_CODE.AUTH_FAILED}`,
          requestUrl.origin
        )
      )
    }

    // 認証成功時はダッシュボードにリダイレクト
    return NextResponse.redirect(
      new URL(REDIRECT_PATH.DASHBOARD, requestUrl.origin)
    )
  } catch (err: unknown) {
    // 予期しないエラーの場合もログインページへリダイレクト
    logger.error('Unexpected error during authentication', undefined, {
      error: err,
    })
    return NextResponse.redirect(
      new URL(
        `${REDIRECT_PATH.LOGIN}?error=${AUTH_ERROR_CODE.UNEXPECTED}`,
        requestUrl.origin
      )
    )
  }
}
