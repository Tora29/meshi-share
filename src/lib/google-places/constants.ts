/**
 * Google Places API FieldMask 定数
 *
 * FieldMaskは取得するフィールドを指定するために使用されます。
 * 新しいフィールドが必要な場合は、ここに追加することで対応できます。
 *
 * @see https://developers.google.com/maps/documentation/places/web-service/place-data-fields
 */
export const DEFAULT_FIELD_MASKS = {
  /**
   * テキスト検索用のフィールドマスク
   * places プレフィックスが必要
   */
  SEARCH_TEXT:
    'places.id,places.displayName,places.formattedAddress,places.types,places.location,places.googleMapsUri,places.photos',

  /**
   * Place Details 取得用のフィールドマスク
   * プレフィックスなし
   */
  PLACE_DETAILS:
    'id,displayName,formattedAddress,types,location,googleMapsUri,photos',

  /**
   * 価格情報を含むテキスト検索用（将来の拡張用）
   */
  SEARCH_TEXT_WITH_PRICE:
    'places.id,places.displayName,places.formattedAddress,places.types,places.location,places.googleMapsUri,places.photos,places.priceLevel',

  /**
   * 評価情報を含むテキスト検索用（将来の拡張用）
   */
  SEARCH_TEXT_WITH_RATING:
    'places.id,places.displayName,places.formattedAddress,places.types,places.location,places.googleMapsUri,places.photos,places.rating,places.userRatingCount',
} as const

/**
 * デフォルトの検索結果数
 */
export const DEFAULT_MAX_RESULTS = 5

/**
 * Google Places API のベースURL
 */
export const PLACES_API_BASE_URL = 'https://places.googleapis.com/v1'

/**
 * デフォルトの言語コード
 */
export const DEFAULT_LANGUAGE_CODE = 'ja'
