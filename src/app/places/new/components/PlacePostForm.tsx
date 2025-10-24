'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { createPlace } from '@/app/places/_actions/create-place'
import {
  FORM_MESSAGES,
  SUBMISSION_MESSAGES,
} from '@/app/places/_consts/messages'
import type {
  GenreMaster,
  PriceRangeMaster,
} from '@/app/places/_queries/get-place-masters'
import {
  placePostSchema,
  type PlacePostInput,
} from '@/app/places/_schemas/place.schema'
import type { Place } from '@/lib/google-places/types'
import { Button } from '@/shared/components/Button'
import { useToast } from '@/shared/components/Toast'
import { GENERIC_ERROR_MESSAGES } from '@/shared/consts/errorMessages'

import { ImageUpload } from './ImageUpload'
import { PlaceFormFields } from './PlaceFormFields'
import { PlaceSearch } from './PlaceSearch'

type PlacePostFormProps = {
  defaultValues?: Partial<PlacePostInput>
  genres: GenreMaster[]
  priceRanges: PriceRangeMaster[]
}

/**
 * 店舗投稿フォーム
 *
 * React Hook Form + Zod でバリデーションを行い、
 * Server Action経由で店舗を投稿します
 */
export function PlacePostForm({
  defaultValues,
  genres,
  priceRanges,
}: PlacePostFormProps): React.ReactElement {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<PlacePostInput>({
    resolver: zodResolver(placePostSchema),
    defaultValues: {
      placeId: '',
      name: '',
      mapUrl: '',
      address: '',
      genres: [],
      priceRange: null,
      description: null,
      photos: [],
      ...defaultValues,
    },
    mode: 'onBlur',
  })

  const photos = watch('photos')

  /**
   * 店舗選択時の処理
   * Google Places APIから取得した店舗情報をフォームに自動入力
   */
  const handlePlaceSelect = (place: Place): void => {
    setValue('placeId', place.id, { shouldValidate: true })
    setValue('name', place.displayName.text, { shouldValidate: true })
    setValue('mapUrl', place.googleMapsUri, { shouldValidate: true })
    setValue('address', place.formattedAddress, { shouldValidate: true })

    // ジャンルの自動推定（オプション）
    // types から genre をマッピング（例: "restaurant" → "洋食"）
    // 今回は手動選択のままにする

    toast.success(FORM_MESSAGES.PLACE_INFO_AUTO_FILLED)
  }

  /**
   * フォームクリア処理
   */
  const handleClear = (): void => {
    reset()
    toast.info(FORM_MESSAGES.FORM_CLEARED)
  }

  const onSubmit = async (data: PlacePostInput): Promise<void> => {
    setIsSubmitting(true)

    try {
      const result = await createPlace(data)

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success(SUBMISSION_MESSAGES.PLACE_CREATED)
      // redirect() は Server Action 内で実行される
    } catch (error) {
      console.error('Submission error:', error)
      toast.error(GENERIC_ERROR_MESSAGES.UNEXPECTED)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 店舗検索 */}
      <PlaceSearch onPlaceSelect={handlePlaceSelect} />

      <div className="divider text-primary">店舗情報</div>

      {/* フォームフィールド */}
      <PlaceFormFields
        register={register}
        errors={errors}
        setValue={setValue}
        watch={watch}
        genres={genres}
        priceRanges={priceRanges}
      />

      <div className="divider text-primary">写真（任意）</div>

      {/* 画像アップロード */}
      <ImageUpload
        photos={photos}
        onPhotosChange={(urls) => setValue('photos', urls)}
      />

      {/* 送信ボタン */}
      <div className="flex items-center justify-between">
        {/* 左下: クリアボタン */}
        <Button
          type="button"
          style="ghost"
          onClick={handleClear}
          disabled={isSubmitting}
        >
          クリア
        </Button>

        {/* 右下: キャンセル・投稿ボタン */}
        <div className="flex gap-4">
          <Button
            type="button"
            style="outline"
            onClick={() => window.history.back()}
          >
            キャンセル
          </Button>
          <Button
            type="submit"
            color="success"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? '投稿中...' : '投稿する'}
          </Button>
        </div>
      </div>
    </form>
  )
}
