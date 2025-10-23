/**
 * 認証エラーメッセージマッピング
 */
export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  no_code: '認証コードが見つかりませんでした',
  auth_failed: '認証に失敗しました',
  unexpected: '予期しないエラーが発生しました',
} as const

/**
 * エラーコードからエラーメッセージを取得する
 *
 * @param errorCode - エラーコード
 * @returns エラーメッセージ（存在しない場合はnull）
 */
export function getAuthErrorMessage(errorCode?: string): string | null {
  return errorCode ? (AUTH_ERROR_MESSAGES[errorCode] ?? null) : null
}
