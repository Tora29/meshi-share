/**
 * 認証（Login）関連のエラーメッセージ
 *
 * ログイン機能で使用されるエラーメッセージを一元管理します。
 */

import { getErrorMessageFromCode } from '@/shared/consts/errorMessages'

/**
 * 認証エラーコードとメッセージのマッピング
 *
 * URLクエリパラメータから渡されるエラーコードに対応
 */
export const AUTH_ERROR_CODES = {
  /** 認証コードが見つからない */
  NO_CODE: 'no_code',
  /** 認証処理が失敗 */
  AUTH_FAILED: 'auth_failed',
  /** 予期しないエラー */
  UNEXPECTED: 'unexpected',
} as const

/**
 * エラーコードごとのメッセージ
 */
export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  [AUTH_ERROR_CODES.NO_CODE]: '認証コードが見つかりませんでした',
  [AUTH_ERROR_CODES.AUTH_FAILED]: '認証に失敗しました',
  [AUTH_ERROR_CODES.UNEXPECTED]: '予期しないエラーが発生しました',
} as const

/**
 * エラーコードからエラーメッセージを取得する
 *
 * @param errorCode - エラーコード
 * @returns エラーメッセージ（存在しない場合はnull）
 */
export function getAuthErrorMessage(errorCode?: string): string | null {
  return getErrorMessageFromCode(errorCode, AUTH_ERROR_MESSAGES)
}
