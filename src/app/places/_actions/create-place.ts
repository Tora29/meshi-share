'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import {
  placeCreateSchema,
  type PlacePostInput,
} from '@/app/places/_schemas/place.schema'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { type ServerActionResponse } from '@/shared/types/server-action'
import { isPrismaUniqueConstraintError } from '@/shared/utils/prisma-error'

import { MUTATION_ERROR_MESSAGES } from '../_consts/errorMessages'

/**
 * createPlace のレスポンス型
 */
type PlaceCreateResponse = ServerActionResponse<{ placeId: string }>

/**
 * 店舗を作成する Server Action
 *
 * @param input - 店舗投稿データ
 * @returns 作成結果
 */
export async function createPlace(
  input: PlacePostInput
): Promise<PlaceCreateResponse> {
  // 1. 認証チェック
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (!user || authError) {
    return {
      success: false,
      error: MUTATION_ERROR_MESSAGES.AUTH_REQUIRED,
    }
  }

  // 2. バリデーション
  const validationResult = placeCreateSchema.safeParse({
    ...input,
    createdBy: user.id,
  })

  if (!validationResult.success) {
    return {
      success: false,
      error: MUTATION_ERROR_MESSAGES.VALIDATION_FAILED,
      details: validationResult.error.flatten(),
    }
  }

  const validatedData = validationResult.data

  try {
    // 3. Prisma でDB保存
    const newPlace = await prisma.place.create({
      data: {
        placeId: validatedData.placeId,
        name: validatedData.name,
        mapUrl: validatedData.mapUrl,
        address: validatedData.address,
        genres: validatedData.genres,
        priceRange: validatedData.priceRange,
        description: validatedData.description,
        photos: validatedData.photos,
        createdBy: validatedData.createdBy,
      },
    })

    // 4. キャッシュ再検証
    revalidatePath('/places')
    revalidatePath('/dashboard')

    // 5. 詳細ページへリダイレクト
    redirect(`/places/${newPlace.id}`)
  } catch (error) {
    console.error('DB save error:', error)

    // Unique制約違反のチェック（重複）
    if (isPrismaUniqueConstraintError(error)) {
      return {
        success: false,
        error: MUTATION_ERROR_MESSAGES.PLACE_ALREADY_EXISTS,
      }
    }

    return {
      success: false,
      error: MUTATION_ERROR_MESSAGES.CREATE_FAILED,
    }
  }
}
