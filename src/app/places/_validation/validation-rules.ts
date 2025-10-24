/**
 * Place（飯どころ）のバリデーションルール定数
 *
 * ビジネスルールの変更時は、このファイルを修正するだけで対応できます。
 * 環境変数から読み込むことも可能です。
 */

/**
 * 店舗名のバリデーションルール
 */
export const NAME_VALIDATION = {
  /** 最大文字数 */
  MAX_LENGTH: 200,
} as const

/**
 * 住所のバリデーションルール
 */
export const ADDRESS_VALIDATION = {
  /** 最大文字数 */
  MAX_LENGTH: 500,
} as const

/**
 * ジャンルのバリデーションルール
 */
export const GENRES_VALIDATION = {
  /** 最大選択可能数 */
  MAX_COUNT: 3,
} as const

/**
 * 価格帯のバリデーションルール
 */
export const PRICE_RANGE_VALIDATION = {
  /** 最小値（¥） */
  MIN: 1,
  /** 最大値（¥¥¥） */
  MAX: 3,
} as const

/**
 * 説明のバリデーションルール
 */
export const DESCRIPTION_VALIDATION = {
  /** 最大文字数 */
  MAX_LENGTH: 2000,
} as const

/**
 * 写真のバリデーションルール
 */
export const PHOTOS_VALIDATION = {
  /** 最大アップロード枚数 */
  MAX_COUNT: 5,
  /** 最大ファイルサイズ（バイト） */
  MAX_SIZE_BYTES: 5 * 1024 * 1024, // 5MB
  /** 最大ファイルサイズ（MB表示用） */
  MAX_SIZE_MB: 5,
  /** 許可される画像形式 */
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'] as const,
  /** 許可される画像形式（表示用ラベル） */
  ALLOWED_TYPES_LABEL: 'JPEG, PNG, WebP',
} as const

/**
 * Google Maps URLのバリデーションルール
 */
export const GOOGLE_MAPS_URL_VALIDATION = {
  /** 許可されるURLパターン */
  ALLOWED_PATTERNS: [
    'google.com/maps',
    'goo.gl/maps',
    'maps.app.goo.gl',
    // 将来的な拡張用コメント：
    // 'g.page/', // Google My Business short links
  ] as const,
} as const

/**
 * 全てのバリデーションルールをまとめたオブジェクト
 */
export const PLACE_VALIDATION_RULES = {
  NAME: NAME_VALIDATION,
  ADDRESS: ADDRESS_VALIDATION,
  GENRES: GENRES_VALIDATION,
  PRICE_RANGE: PRICE_RANGE_VALIDATION,
  DESCRIPTION: DESCRIPTION_VALIDATION,
  PHOTOS: PHOTOS_VALIDATION,
  GOOGLE_MAPS_URL: GOOGLE_MAPS_URL_VALIDATION,
} as const

/**
 * Google Maps URLかどうかを検証
 *
 * @param url - 検証対象のURL
 * @returns Google Maps URLの場合はtrue
 */
export function isGoogleMapsUrl(url: string): boolean {
  return GOOGLE_MAPS_URL_VALIDATION.ALLOWED_PATTERNS.some((pattern) =>
    url.includes(pattern)
  )
}

/**
 * より厳密なGoogle Maps URL検証（正規表現を使用）
 *
 * 将来的により厳密な検証が必要になった場合に使用できます。
 *
 * @param url - 検証対象のURL
 * @returns Google Maps URLの場合はtrue
 */
export function isGoogleMapsUrlStrict(url: string): boolean {
  const patterns = [
    /^https?:\/\/(www\.)?google\.com\/maps\//,
    /^https?:\/\/goo\.gl\/maps\//,
    /^https?:\/\/maps\.app\.goo\.gl\//,
  ]
  return patterns.some((pattern) => pattern.test(url))
}
