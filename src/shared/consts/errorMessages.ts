/**
 * エラーメッセージユーティリティ
 *
 * エラーコードとメッセージのマッピング、エラーメッセージ取得のヘルパー関数を提供します。
 *
 * 各機能のエラーメッセージ定数は、それぞれの機能ディレクトリ配下の _consts/ に配置してください。
 * - 認証関連: /src/app/login/_consts/errorMessages.ts
 * - Place関連: /src/app/places/_consts/errorMessages.ts
 */

/**
 * 汎用エラーメッセージ
 *
 * 機能に依存しない、アプリケーション全体で使用される汎用的なエラーメッセージ
 */
export const GENERIC_ERROR_MESSAGES = {
  /** 予期しないエラー */
  UNEXPECTED: '予期しないエラーが発生しました',
  /** ネットワークエラー */
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  /** サーバーエラー */
  SERVER_ERROR: 'サーバーエラーが発生しました',
  /** 認証が必要 */
  AUTH_REQUIRED: 'ログインが必要です',
  /** 権限不足 */
  PERMISSION_DENIED: '権限がありません',
} as const

/**
 * エラーコードマップからエラーメッセージを取得する
 *
 * URLクエリパラメータなどから渡されるエラーコードを、
 * ユーザーフレンドリーなメッセージに変換する汎用関数
 *
 * @param errorCode - エラーコード
 * @param errorMap - エラーコードとメッセージのマッピング
 * @param fallback - エラーコードが見つからない場合のフォールバックメッセージ
 * @returns エラーメッセージ（存在しない場合はnullまたはfallback）
 *
 * @example
 * ```typescript
 * const AUTH_ERRORS = {
 *   'no_code': '認証コードが見つかりません',
 *   'auth_failed': '認証に失敗しました',
 * }
 *
 * const message = getErrorMessageFromCode('no_code', AUTH_ERRORS)
 * // => '認証コードが見つかりません'
 * ```
 */
export function getErrorMessageFromCode(
  errorCode: string | undefined,
  errorMap: Record<string, string>,
  fallback?: string
): string | null {
  if (!errorCode) {
    return null
  }

  if (errorCode in errorMap) {
    return errorMap[errorCode]
  }

  return fallback ?? null
}
