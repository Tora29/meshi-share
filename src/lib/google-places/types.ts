/**
 * Google Places API (New) の型定義
 */

/**
 * 場所の位置情報
 */
export type Location = {
  latitude: number
  longitude: number
}

/**
 * 表示名（多言語対応）
 */
export type LocalizedText = {
  text: string
  languageCode?: string
}

/**
 * 店舗情報
 */
export type Place = {
  /** Place ID（例: ChIJ...） */
  id: string
  /** 表示名 */
  displayName: LocalizedText
  /** フォーマット済み住所 */
  formattedAddress: string
  /** カテゴリ（例: ["restaurant", "food"]） */
  types: string[]
  /** 位置情報 */
  location: Location
  /** Google Maps URL */
  googleMapsUri: string
  /** 写真 */
  photos?: PlacePhoto[]
}

/**
 * 写真情報
 */
export type PlacePhoto = {
  /** 写真の名前（APIリクエスト用） */
  name: string
  /** 幅（ピクセル） */
  widthPx: number
  /** 高さ（ピクセル） */
  heightPx: number
}

/**
 * Text Search のレスポンス
 */
export type TextSearchResponse = {
  places: Place[]
}

/**
 * エラーレスポンス
 */
export type PlacesApiError = {
  error: {
    code: number
    message: string
    status: string
  }
}
