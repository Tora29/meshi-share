/**
 * Prisma エラーユーティリティ
 *
 * Prismaのエラーを型安全に判定するためのユーティリティ関数群
 *
 * @see https://www.prisma.io/docs/reference/api-reference/error-reference
 */

/**
 * Prismaエラーコード
 */
export const PRISMA_ERROR_CODES = {
  /** Unique制約違反 */
  UNIQUE_CONSTRAINT: 'P2002',
  /** Foreign Key制約違反 */
  FOREIGN_KEY_CONSTRAINT: 'P2003',
  /** レコードが見つからない */
  RECORD_NOT_FOUND: 'P2025',
} as const

/**
 * Prismaエラーの型ガード
 *
 * @param error - チェック対象のエラー
 * @returns Prismaエラーの場合はtrue
 */
export function isPrismaError(error: unknown): error is { code: string } {
  return (
    error !== null &&
    typeof error === 'object' &&
    'code' in error &&
    typeof error.code === 'string'
  )
}

/**
 * Unique制約違反エラーかどうかを判定
 *
 * 同じデータが既に存在する場合に発生するエラー
 *
 * @param error - チェック対象のエラー
 * @returns Unique制約違反の場合はtrue
 *
 * @example
 * ```typescript
 * try {
 *   await prisma.place.create({ data: { placeId: '123', ... } })
 * } catch (error) {
 *   if (isPrismaUniqueConstraintError(error)) {
 *     return { success: false, error: 'この店舗は既に登録されています' }
 *   }
 * }
 * ```
 */
export function isPrismaUniqueConstraintError(error: unknown): boolean {
  return (
    isPrismaError(error) && error.code === PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT
  )
}

/**
 * Foreign Key制約違反エラーかどうかを判定
 *
 * 参照先のレコードが存在しない場合に発生するエラー
 *
 * @param error - チェック対象のエラー
 * @returns Foreign Key制約違反の場合はtrue
 */
export function isPrismaForeignKeyConstraintError(error: unknown): boolean {
  return (
    isPrismaError(error) &&
    error.code === PRISMA_ERROR_CODES.FOREIGN_KEY_CONSTRAINT
  )
}

/**
 * レコードが見つからないエラーかどうかを判定
 *
 * update, delete時に対象レコードが存在しない場合に発生するエラー
 *
 * @param error - チェック対象のエラー
 * @returns レコードが見つからない場合はtrue
 */
export function isPrismaRecordNotFoundError(error: unknown): boolean {
  return (
    isPrismaError(error) && error.code === PRISMA_ERROR_CODES.RECORD_NOT_FOUND
  )
}
