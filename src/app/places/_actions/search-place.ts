'use server'

import { createPlacesClient } from '@/lib/google-places/client'
import type { Place } from '@/lib/google-places/types'
import { type ServerActionResponse } from '@/shared/types/server-action'
import { getErrorMessage } from '@/shared/utils/error'

import { SEARCH_ERROR_MESSAGES } from '../_consts/errorMessages'

/**
 * 店舗検索のレスポンス型
 */
export type SearchPlaceResponse = ServerActionResponse<Place[]>

/**
 * Google Maps URLまたは店舗名で店舗を検索
 *
 * @param query - 検索クエリ（店舗名、住所、Google Maps URLなど）
 * @returns 検索結果
 */
export async function searchPlace(query: string): Promise<SearchPlaceResponse> {
  if (query.trim().length === 0) {
    return {
      success: false,
      error: SEARCH_ERROR_MESSAGES.QUERY_REQUIRED,
    }
  }

  try {
    const client = createPlacesClient()
    const places = await client.searchText(query.trim(), 5) // 最大5件

    return {
      success: true,
      data: places,
    }
  } catch (error) {
    console.error('Search place error:', error)
    return {
      success: false,
      error: getErrorMessage(error, SEARCH_ERROR_MESSAGES.SEARCH_FAILED),
    }
  }
}
