import { IMAGE_ERROR_MESSAGES } from '@/app/places/_consts/errorMessages'
import { createClient } from '@/lib/supabase/client'

import { STORAGE_BUCKETS, UPLOAD_CONFIG } from './storage-config'

/**
 * 店舗画像をアップロード
 * @param placeId 店舗ID（仮ID or 確定ID）
 * @param file アップロードするファイル
 * @param bucketName バケット名（デフォルト: PLACE_IMAGES）
 * @returns 公開URL
 * @throws {Error} アップロードに失敗した場合
 */
export async function uploadPlaceImage(
  placeId: string,
  file: File,
  bucketName: string = STORAGE_BUCKETS.PLACE_IMAGES
): Promise<string> {
  const supabase = createClient()

  // ファイル名生成
  const timestamp = Date.now()
  const randomId = Math.random().toString(36).substring(2, 10)
  const ext = file.name.split('.').pop()
  const fileName = `${timestamp}-${randomId}.${ext}`
  const filePath = `${placeId}/${fileName}`

  // アップロード
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, {
      cacheControl: UPLOAD_CONFIG.DEFAULT_CACHE_CONTROL,
      upsert: UPLOAD_CONFIG.UPSERT,
    })

  if (error) {
    console.error('Upload error:', error)
    throw new Error(IMAGE_ERROR_MESSAGES.UPLOAD_FAILED)
  }

  // 公開URL取得
  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(data.path)

  return publicUrlData.publicUrl
}

/**
 * 店舗画像を削除
 * @param filePath ファイルパス（例: "placeId/timestamp-randomId.jpg"）
 * @param bucketName バケット名（デフォルト: PLACE_IMAGES）
 * @throws {Error} 削除に失敗した場合
 */
export async function deletePlaceImage(
  filePath: string,
  bucketName: string = STORAGE_BUCKETS.PLACE_IMAGES
): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.storage.from(bucketName).remove([filePath])

  if (error) {
    console.error('Delete error:', error)
    throw new Error(IMAGE_ERROR_MESSAGES.DELETE_FAILED)
  }
}
