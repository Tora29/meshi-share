import {
  DEFAULT_FIELD_MASKS,
  DEFAULT_MAX_RESULTS,
  DEFAULT_LANGUAGE_CODE,
  PLACES_API_BASE_URL,
} from './constants'

import type { TextSearchResponse, Place } from './types'

/**
 * Google Places API クライアント
 */
export class GooglePlacesClient {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  /**
   * テキスト検索で店舗を検索
   *
   * @param query - 検索クエリ（店舗名 + 地域など）
   * @param maxResults - 最大結果数（デフォルト: 5）
   * @param fieldMask - 取得するフィールドマスク（デフォルト: 標準フィールド）
   * @returns 検索結果
   */
  async searchText(
    query: string,
    maxResults = DEFAULT_MAX_RESULTS,
    fieldMask = DEFAULT_FIELD_MASKS.SEARCH_TEXT
  ): Promise<Place[]> {
    const url = `${PLACES_API_BASE_URL}/places:searchText`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': this.apiKey,
        'X-Goog-FieldMask': fieldMask,
      },
      body: JSON.stringify({
        textQuery: query,
        maxResultCount: maxResults,
        languageCode: DEFAULT_LANGUAGE_CODE,
      }),
    })

    if (!response.ok) {
      const errorData = (await response.json()) as {
        error?: { message?: string }
      }
      throw new Error(
        `Places API error: ${errorData.error?.message ?? response.statusText}`
      )
    }

    const data = (await response.json()) as TextSearchResponse

    return data.places ?? []
  }

  /**
   * Place Details を取得
   *
   * @param placeId - Place ID（例: ChIJ...）
   * @param fieldMask - 取得するフィールドマスク（デフォルト: 標準フィールド）
   * @returns 店舗詳細情報
   */
  async getPlaceDetails(
    placeId: string,
    fieldMask = DEFAULT_FIELD_MASKS.PLACE_DETAILS
  ): Promise<Place> {
    const url = `${PLACES_API_BASE_URL}/places/${placeId}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Goog-Api-Key': this.apiKey,
        'X-Goog-FieldMask': fieldMask,
      },
    })

    if (!response.ok) {
      const errorData = (await response.json()) as {
        error?: { message?: string }
      }
      throw new Error(
        `Places API error: ${errorData.error?.message ?? response.statusText}`
      )
    }

    const data = (await response.json()) as Place

    return data
  }
}

/**
 * Google Places API クライアントのシングルトンインスタンス
 *
 * @returns Google Places API クライアント
 * @throws {Error} GOOGLE_PLACES_API_KEYが設定されていない場合
 */
export function createPlacesClient(): GooglePlacesClient {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY

  if (!apiKey) {
    throw new Error('GOOGLE_PLACES_API_KEY is not set')
  }

  return new GooglePlacesClient(apiKey)
}
