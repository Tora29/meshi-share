'use client'

import type {
  GenreMaster,
  PriceRangeMaster,
} from '@/app/places/_queries/get-place-masters'
import type { PlacePostInput } from '@/app/places/_schemas/place.schema'
import { Badge } from '@/shared/components/Badge'
import { Input } from '@/shared/components/Input'
import { Textarea } from '@/shared/components/Textarea'

import type {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form'

type PlaceFormFieldsProps = {
  register: UseFormRegister<PlacePostInput>
  errors: FieldErrors<PlacePostInput>
  setValue: UseFormSetValue<PlacePostInput>
  watch: UseFormWatch<PlacePostInput>
  genres: GenreMaster[]
  priceRanges: PriceRangeMaster[]
}

/**
 * 店舗投稿フォームのフィールド群
 *
 * 店舗名、住所、ジャンル、価格帯、説明の入力フィールドを提供
 */
export function PlaceFormFields({
  register,
  errors,
  setValue,
  watch,
  genres,
  priceRanges,
}: PlaceFormFieldsProps): React.ReactElement {
  const selectedGenres = watch('genres')

  const handleGenreToggle = (genreLabel: string): void => {
    const newGenres = selectedGenres.includes(genreLabel)
      ? selectedGenres.filter((g) => g !== genreLabel) // 選択解除
      : [...selectedGenres, genreLabel] // 選択追加

    setValue('genres', newGenres, {
      shouldValidate: true, // バリデーションをトリガー
      shouldTouch: true, // フィールドをタッチ済みにマーク
    })
  }

  return (
    <div className="space-y-4">
      {/* Place ID（隠しフィールド） */}
      <input type="hidden" {...register('placeId')} />

      {/* Google Maps URL（隠しフィールド） */}
      <input type="hidden" {...register('mapUrl')} />

      {/* 店舗名（自動入力、無効化） */}
      <div className="form-control">
        <label htmlFor="name" className="label">
          <span className="label-text text-primary pb-2 font-bold">
            店舗名（自動入力）
          </span>
        </label>
        <Input
          id="name"
          type="text"
          placeholder="上部の検索で店舗を選択してください"
          className="text-primary placeholder:text-primary/60 bg-base-300 w-full"
          error={Boolean(errors.name)}
          disabled
          {...register('name')}
        />
        {errors.name && (
          <p className="text-error mt-1 text-sm" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* 住所（自動入力、無効化） */}
      <div className="form-control">
        <label htmlFor="address" className="label pb-2">
          <span className="label-text text-primary font-bold">
            住所（自動入力）
          </span>
        </label>
        <Input
          id="address"
          type="text"
          placeholder="住所が自動入力されます"
          className="text-primary placeholder:text-primary/60 bg-base-300 w-full"
          error={Boolean(errors.address)}
          disabled
          {...register('address')}
        />
        {errors.address && (
          <p className="text-error mt-1 text-sm" role="alert">
            {errors.address.message}
          </p>
        )}
      </div>

      {/* ジャンル（複数選択） */}
      <div className="form-control">
        <label className="label pb-2">
          <span className="label-text text-primary font-bold">
            ジャンル（最大3つ）
          </span>
        </label>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => {
            const isSelected = selectedGenres.includes(genre.label)
            const isDisabled = !isSelected && selectedGenres.length >= 3
            return (
              <Badge
                key={genre.id}
                outline={false}
                size="lg"
                className={
                  isDisabled
                    ? 'text-primary cursor-not-allowed opacity-30'
                    : isSelected
                      ? 'ring-primary text-primary cursor-pointer ring-1 hover:opacity-90'
                      : 'text-primary cursor-pointer transition-all hover:opacity-70'
                }
                onClick={
                  isDisabled ? undefined : () => handleGenreToggle(genre.label)
                }
              >
                {genre.label}
              </Badge>
            )
          })}
        </div>
        {errors.genres && (
          <p className="text-error mt-1 text-sm" role="alert">
            {errors.genres.message}
          </p>
        )}
      </div>

      {/* 価格帯 */}
      <div className="form-control">
        <label className="label pb-2">
          <span className="label-text text-primary font-bold">価格帯</span>
        </label>
        <div className="flex flex-col gap-2 md:flex-row md:gap-4">
          {priceRanges.map((range) => (
            <label key={range.id} className="label cursor-pointer gap-2">
              <input
                type="radio"
                className="radio radio-primary"
                value={range.value}
                {...register('priceRange', { valueAsNumber: true })}
              />
              <span className="label-text text-primary">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 説明 */}
      <div className="form-control">
        <label htmlFor="description" className="label pb-2">
          <span className="label-text text-primary font-bold">
            説明・おすすめポイント
          </span>
        </label>
        <Textarea
          id="description"
          rows={4}
          placeholder="この店舗のおすすめポイントを教えてください"
          className="text-primary placeholder:text-primary/60 w-full"
          error={Boolean(errors.description)}
          {...register('description')}
        />
        {errors.description && (
          <p className="text-error mt-1 text-sm" role="alert">
            {errors.description.message}
          </p>
        )}
      </div>
    </div>
  )
}
