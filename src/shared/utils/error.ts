/**
 * エラーハンドリングユーティリティ
 *
 * プロジェクト全体で統一されたエラー処理を提供します。
 */

/**
 * デフォルトのエラーメッセージ
 */
export const DEFAULT_ERROR_MESSAGE = '予期しないエラーが発生しました'

/**
 * エラーからメッセージを安全に抽出する
 *
 * @param error - unknown型のエラー（try-catchで捕捉されたもの）
 * @param defaultMessage - エラーメッセージが取得できない場合のフォールバック
 * @returns エラーメッセージ文字列
 */
export function getErrorMessage(
  error: unknown,
  defaultMessage: string = DEFAULT_ERROR_MESSAGE
): string {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  return defaultMessage
}

/**
 * エラーオブジェクトを安全にシリアライズする
 *
 * ログ出力やエラートラッキングサービスへの送信時に使用します。
 *
 * @param error - unknown型のエラー
 * @returns シリアライズ可能なエラー情報オブジェクト
 */
export function serializeError(error: unknown): {
  message: string
  name?: string
  stack?: string
  originalError?: unknown
} {
  if (error instanceof Error) {
    return {
      message: error.message,
      name: error.name,
      stack: error.stack,
    }
  }

  if (typeof error === 'string') {
    return {
      message: error,
    }
  }

  return {
    message: DEFAULT_ERROR_MESSAGE,
    originalError: error,
  }
}
