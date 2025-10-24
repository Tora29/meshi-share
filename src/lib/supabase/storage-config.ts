/**
 * Supabase Storage設定
 *
 * ストレージに関する設定を一元管理します。
 * 環境ごとに異なるバケット名を使用する場合は、環境変数から読み込むことができます。
 */

/**
 * ストレージバケット名
 */
export const STORAGE_BUCKETS = {
  /** 店舗画像用バケット */
  PLACE_IMAGES: process.env.NEXT_PUBLIC_PLACE_IMAGES_BUCKET ?? 'place-images',
  /** ユーザーアバター用バケット（将来の拡張用） */
  USER_AVATARS: process.env.NEXT_PUBLIC_USER_AVATARS_BUCKET ?? 'user-avatars',
} as const

/**
 * キャッシュコントロール設定（秒）
 */
export const CACHE_CONTROL = {
  /** デフォルト（1時間） */
  DEFAULT: '3600',
  /** 長期キャッシュ（1日） */
  LONG: '86400',
  /** 短期キャッシュ（5分） */
  SHORT: '300',
} as const

/**
 * アップロード設定
 */
export const UPLOAD_CONFIG = {
  /** 同名ファイルの上書きを禁止 */
  UPSERT: false,
  /** デフォルトのキャッシュコントロール */
  DEFAULT_CACHE_CONTROL: CACHE_CONTROL.DEFAULT,
} as const
