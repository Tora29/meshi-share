import { z } from 'zod'

import { VALIDATION_ERROR_MESSAGES as ERROR_MESSAGES } from '../_consts/errorMessages'
import {
  PLACE_VALIDATION_RULES as RULES,
  isGoogleMapsUrl,
} from '../_validation/validation-rules'

/**
 * 店舗投稿フォームのバリデーションスキーマ
 */
export const placePostSchema = z.object({
  // Google Place ID（自動取得、必須）
  placeId: z
    .string()
    .min(1, { message: ERROR_MESSAGES.PLACE_ID_REQUIRED })
    .trim(),

  // 店舗名（自動取得、必須、1-200文字）
  name: z
    .string()
    .min(1, { message: ERROR_MESSAGES.NAME_REQUIRED })
    .max(RULES.NAME.MAX_LENGTH, {
      message: `店舗名は${RULES.NAME.MAX_LENGTH}文字以内で入力してください`,
    })
    .trim(),

  // Google Maps URL（必須）
  mapUrl: z
    .string()
    .min(1, { message: ERROR_MESSAGES.MAP_URL_REQUIRED })
    .url({ message: ERROR_MESSAGES.MAP_URL_INVALID })
    .refine(isGoogleMapsUrl, {
      message: ERROR_MESSAGES.MAP_URL_NOT_GOOGLE_MAPS,
    })
    .trim(),

  // 住所（自動取得、必須）
  address: z
    .string()
    .min(1, { message: ERROR_MESSAGES.ADDRESS_REQUIRED })
    .max(RULES.ADDRESS.MAX_LENGTH, {
      message: `住所は${RULES.ADDRESS.MAX_LENGTH}文字以内で入力してください`,
    })
    .trim(),

  // ジャンル（複数選択可、最大3つ）
  genres: z
    .array(z.string())
    .max(RULES.GENRES.MAX_COUNT, {
      message: `ジャンルは最大${RULES.GENRES.MAX_COUNT}つまで選択できます`,
    })
    .default([]),

  // 価格帯（オプション、1-3の整数）
  priceRange: z
    .number()
    .int({ message: ERROR_MESSAGES.PRICE_RANGE_INVALID })
    .min(RULES.PRICE_RANGE.MIN, {
      message: `価格帯は${RULES.PRICE_RANGE.MIN}〜${RULES.PRICE_RANGE.MAX}の範囲で選択してください`,
    })
    .max(RULES.PRICE_RANGE.MAX, {
      message: `価格帯は${RULES.PRICE_RANGE.MIN}〜${RULES.PRICE_RANGE.MAX}の範囲で選択してください`,
    })
    .optional()
    .nullable(),

  // 説明（オプション、1-2000文字）
  description: z
    .string()
    .max(RULES.DESCRIPTION.MAX_LENGTH, {
      message: `説明は${RULES.DESCRIPTION.MAX_LENGTH}文字以内で入力してください`,
    })
    .trim()
    .optional()
    .nullable(),

  // 写真URL配列（オプション、最大5枚）
  photos: z
    .array(z.string().url({ message: '有効なURLを指定してください' }))
    .max(RULES.PHOTOS.MAX_COUNT, {
      message: `画像は最大${RULES.PHOTOS.MAX_COUNT}枚までアップロードできます`,
    })
    .default([]),
})

/**
 * 型推論用の型定義
 */
export type PlacePostInput = z.infer<typeof placePostSchema>

/**
 * 画像アップロード用のバリデーションスキーマ
 */
export const imageUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= RULES.PHOTOS.MAX_SIZE_BYTES, {
      message: `ファイルサイズは${RULES.PHOTOS.MAX_SIZE_MB}MB以下にしてください`,
    })
    .refine(
      (file) =>
        RULES.PHOTOS.ALLOWED_TYPES.includes(
          file.type as (typeof RULES.PHOTOS.ALLOWED_TYPES)[number]
        ),
      {
        message: `${RULES.PHOTOS.ALLOWED_TYPES_LABEL}形式の画像のみアップロードできます`,
      }
    ),
})

/**
 * サーバー側でのバリデーション用スキーマ
 * createdBy を追加
 */
export const placeCreateSchema = placePostSchema.extend({
  createdBy: z.string().uuid({ message: '不正なユーザーIDです' }),
})

export type PlaceCreateInput = z.infer<typeof placeCreateSchema>
