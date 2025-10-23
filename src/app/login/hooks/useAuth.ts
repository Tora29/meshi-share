'use client'

import { useState } from 'react'

import { getErrorMessage } from '@/shared/utils/error'

import {
  signInWithGoogleOAuth,
  type OAuthResponse,
} from '../server/authProviders'

/**
 * 認証フックの戻り値型
 */
export interface UseAuthReturn {
  /** ローディング状態 */
  isLoading: boolean
  /** エラーメッセージ */
  error: string | null
  /** ログイン処理を実行する関数 */
  signIn: () => Promise<{ success: boolean }>
}

/**
 * 認証フック
 *
 * Googleアカウントを使用したログイン処理を管理します。
 * ローディング状態、エラーハンドリング、リダイレクトを含む認証フロー全体を扱います。
 *
 * @returns 認証フックの戻り値（isLoading, error, signIn関数）
 */
export function useAuth(): UseAuthReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const signIn = async (): Promise<{ success: boolean }> => {
    setIsLoading(true)
    setError(null)

    try {
      const result: OAuthResponse = await signInWithGoogleOAuth()

      if (result.error) {
        setError(result.error.message)
        setIsLoading(false)
        return { success: false }
      }

      // 成功時はリダイレクトURLへ遷移
      if (result.data.url) {
        window.location.href = result.data.url
      }

      return { success: true }
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err)
      setError(errorMessage)
      setIsLoading(false)
      return { success: false }
    }
  }

  return { signIn, isLoading, error }
}
