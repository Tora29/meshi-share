/**
 * Server Action の共通レスポンス型
 *
 * 全てのServer Actionで一貫したレスポンス形式を使用するための型定義
 */

/**
 * Server Action 成功時のレスポンス型
 *
 * @template T - 成功時に返すデータの型（デフォルト: void）
 */
export type ServerActionSuccess<T = void> = {
  success: true
  data: T
}

/**
 * Server Action 失敗時のレスポンス型
 */
export type ServerActionError = {
  success: false
  error: string
  /** バリデーションエラーなどの詳細情報（オプション） */
  details?: unknown
}

/**
 * Server Action のレスポンス型
 *
 * @template T - 成功時に返すデータの型（デフォルト: void）
 *
 * @example
 * ```typescript
 * // データを返さない場合
 * async function deletePlace(): Promise<ServerActionResponse> {
 *   // ...
 *   return { success: true, data: undefined }
 * }
 *
 * // データを返す場合
 * async function createPlace(): Promise<ServerActionResponse<{ placeId: string }>> {
 *   // ...
 *   return { success: true, data: { placeId: '123' } }
 * }
 * ```
 */
export type ServerActionResponse<T = void> =
  | ServerActionSuccess<T>
  | ServerActionError

/**
 * 成功レスポンスを作成するヘルパー関数
 *
 * @param data - 成功時に返すデータ
 * @returns 成功レスポンス
 */
export function createSuccessResponse<T>(data: T): ServerActionSuccess<T> {
  return { success: true, data }
}

/**
 * エラーレスポンスを作成するヘルパー関数
 *
 * @param error - エラーメッセージ
 * @param details - エラーの詳細情報（オプション）
 * @returns エラーレスポンス
 */
export function createErrorResponse(
  error: string,
  details?: unknown
): ServerActionError {
  return { success: false, error, details }
}
