'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import {
  placeCreateSchema,
  type PlacePostInput,
} from '@/app/places/_schemas/place.schema'
import { logger } from '@/lib/logger'
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
    logger.warn('Place creation failed - authentication required', undefined, {
      action: 'create_place',
      result: 'error',
      metadata: {
        errorType: 'auth_required',
      },
    })
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
    logger.warn('Place creation failed - validation error', undefined, {
      userId: user.id,
      userName:
        (user.user_metadata.full_name as string | undefined) ?? 'Unknown',
      action: 'create_place',
      result: 'error',
      metadata: {
        errorType: 'validation',
        validationErrors: validationResult.error.flatten(),
      },
    })
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

    // 4. 成功ログ
    logger.info('Place created successfully', undefined, {
      userId: user.id,
      userName:
        (user.user_metadata.full_name as string | undefined) ?? 'Unknown',
      action: 'create_place',
      result: 'success',
      metadata: {
        placeId: newPlace.id,
        placeName: newPlace.name,
        googlePlaceId: newPlace.placeId,
      },
    })

    // 5. キャッシュ再検証
    revalidatePath('/places')
    revalidatePath('/dashboard')

    // 6. 詳細ページへリダイレクト
    redirect(`/places/${newPlace.id}`)
  } catch (error) {
    // Unique制約違反のチェック（重複）
    if (isPrismaUniqueConstraintError(error)) {
      logger.warn('Place creation failed - duplicate', undefined, {
        userId: user.id,
        userName:
          (user.user_metadata.full_name as string | undefined) ?? 'Unknown',
        action: 'create_place',
        result: 'error',
        metadata: {
          errorType: 'duplicate',
          googlePlaceId: validatedData.placeId,
        },
      })
      return {
        success: false,
        error: MUTATION_ERROR_MESSAGES.PLACE_ALREADY_EXISTS,
      }
    }

    // DB保存エラー
    logger.error('Place creation failed - database error', undefined, {
      userId: user.id,
      userName:
        (user.user_metadata.full_name as string | undefined) ?? 'Unknown',
      action: 'create_place',
      result: 'error',
      metadata: {
        errorType: 'database',
        errorMessage: error instanceof Error ? error.message : String(error),
        googlePlaceId: validatedData.placeId,
      },
    })

    return {
      success: false,
      error: MUTATION_ERROR_MESSAGES.CREATE_FAILED,
    }
  }
}
