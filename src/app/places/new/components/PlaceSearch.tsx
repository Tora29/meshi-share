'use client'

import { useState } from 'react'

import { searchPlace } from '@/app/places/_actions/search-place'
import {
  SEARCH_ERROR_MESSAGES,
  MUTATION_ERROR_MESSAGES,
} from '@/app/places/_consts/errorMessages'
import { SEARCH_MESSAGES } from '@/app/places/_consts/messages'
import type { Place } from '@/lib/google-places/types'
import { Button } from '@/shared/components/Button'
import { Input } from '@/shared/components/Input'
import { useToast } from '@/shared/components/Toast'

type PlaceSearchProps = {
  onPlaceSelect: (place: Place) => void
}

/**
 * 店舗検索コンポーネント
 *
 * Google Places APIで店舗を検索し、候補を表示して選択させる
 */
export function PlaceSearch({
  onPlaceSelect,
}: PlaceSearchProps): React.ReactElement {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [candidates, setCandidates] = useState<Place[]>([])
  const [inputError, setInputError] = useState<string | null>(null)
  const toast = useToast()

  /**
   * ブラーハンドラー
   * フォーカスを外したときに空白チェックを行う
   */
  const handleBlur = (): void => {
    if (!searchQuery.trim()) {
      setInputError(SEARCH_ERROR_MESSAGES.SEARCH_REQUIRED)
    }
  }

  /**
   * 入力変更ハンドラー
   * 入力時にエラーをクリア
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value)
    if (inputError) {
      setInputError(null)
    }
  }

  const handleSearch = async (): Promise<void> => {
    if (!searchQuery.trim()) {
      setInputError(SEARCH_ERROR_MESSAGES.INPUT_PLACEHOLDER)
      return
    }

    setInputError(null)

    setIsSearching(true)
    setCandidates([])

    try {
      const result = await searchPlace(searchQuery)

      if (!result.success) {
        toast.error(result.error)
        return
      }

      if (result.data.length === 0) {
        toast.info(SEARCH_MESSAGES.NO_RESULTS)
        return
      }

      setCandidates(result.data)
      toast.success(SEARCH_MESSAGES.RESULTS_FOUND(result.data.length))
    } catch (error) {
      console.error('Search error:', error)
      toast.error(MUTATION_ERROR_MESSAGES.UNEXPECTED)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelect = (place: Place): void => {
    onPlaceSelect(place)
    setCandidates([])
    setSearchQuery('')
    setInputError(null)
  }

  return (
    <div className="space-y-4">
      {/* 検索フィールド */}
      <div className="form-control">
        <label className="label">
          <span className="label-text text-primary pb-2 font-bold">
            1. 店舗を検索 <span className="text-primary">*</span>
          </span>
        </label>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="店舗名またはGoogle Maps URLを入力"
            className="text-primary placeholder:text-primary/60 flex-1"
            value={searchQuery}
            onChange={handleChange}
            onBlur={handleBlur}
            error={Boolean(inputError)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                void handleSearch()
              }
            }}
          />
          <Button
            type="button"
            color="primary"
            onClick={handleSearch}
            loading={isSearching}
            disabled={isSearching || !searchQuery.trim()}
          >
            {isSearching ? '検索中...' : '検索'}
          </Button>
        </div>
        {inputError && (
          <p className="text-error mt-1 text-sm" role="alert">
            {inputError}
          </p>
        )}
      </div>
      {/* 候補リスト */}
      {candidates.length > 0 && (
        <div className="form-control">
          <label className="label">
            <span className="label-text text-primary font-bold">
              2. 該当する店舗を選択してください
            </span>
          </label>
          <div className="space-y-2">
            {candidates.map((place) => (
              <button
                key={place.id}
                type="button"
                onClick={() => handleSelect(place)}
                className="bg-base-200 hover:bg-base-300 block w-full rounded-lg p-4 text-left transition-colors"
              >
                <div className="font-bold">{place.displayName.text}</div>
                <div className="text-base-content/70 text-sm">
                  {place.formattedAddress}
                </div>
                <div className="text-base-content/50 mt-1 text-xs">
                  {place.types.slice(0, 3).join(', ')}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
