'use client'

import Image from 'next/image'
import { useState } from 'react'

import { IMAGE_ERROR_MESSAGES } from '@/app/places/_consts/errorMessages'
import { IMAGE_MESSAGES } from '@/app/places/_consts/messages'
import { imageUploadSchema } from '@/app/places/_schemas/place.schema'
import { uploadPlaceImage, deletePlaceImage } from '@/lib/supabase/storage'
import { useToast } from '@/shared/components/Toast'
import { getErrorMessage } from '@/shared/utils/error'

type ImageUploadProps = {
  photos: string[]
  onPhotosChange: (urls: string[]) => void
}

/**
 * 画像アップロードコンポーネント
 *
 * ファイル選択、Supabase Storageへのアップロード、プレビュー表示、削除機能を提供
 */
export function ImageUpload({
  photos,
  onPhotosChange,
}: ImageUploadProps): React.ReactElement {
  const [isUploading, setIsUploading] = useState(false)
  const [tempPlaceId] = useState(() => crypto.randomUUID()) // 仮ID
  const toast = useToast()

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const files = Array.from(e.target.files ?? [])

    if (files.length === 0) return

    // 最大5枚チェック
    if (photos.length + files.length > 5) {
      toast.error(IMAGE_ERROR_MESSAGES.MAX_COUNT_EXCEEDED)
      return
    }

    setIsUploading(true)

    try {
      const uploadPromises = files.map(async (file) => {
        // バリデーション
        const validation = imageUploadSchema.safeParse({ file })
        if (!validation.success) {
          // Zodのエラーメッセージをフォーマット
          const message =
            validation.error.format()._errors[0] ?? 'バリデーションエラー'
          throw new Error(message)
        }

        // アップロード
        return uploadPlaceImage(tempPlaceId, file)
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      onPhotosChange([...photos, ...uploadedUrls])

      toast.success(IMAGE_MESSAGES.IMAGES_UPLOADED(files.length))
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(getErrorMessage(error, IMAGE_ERROR_MESSAGES.UPLOAD_FAILED))
    } finally {
      setIsUploading(false)
      // input要素をリセット（同じファイルを再選択可能にする）
      e.target.value = ''
    }
  }

  const handleRemove = (urlToRemove: string): void => {
    onPhotosChange(photos.filter((url) => url !== urlToRemove))

    // Storage から削除（オプション）
    try {
      const path = new URL(urlToRemove).pathname.split('/').slice(-2).join('/')
      deletePlaceImage(path).catch(console.error)
    } catch (error) {
      console.error('Failed to parse URL for deletion:', error)
    }
  }

  return (
    <div className="space-y-4">
      <label htmlFor="photo-upload" className="label">
        <span className="label-text text-primary font-bold">
          写真（最大5枚）
        </span>
      </label>

      {/* プレビュー */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {photos.map((url, index) => (
            <div key={url} className="relative">
              <Image
                src={url}
                alt={`プレビュー ${index + 1}`}
                width={400}
                height={300}
                className="h-32 w-full rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemove(url)}
                className="btn btn-circle btn-error btn-sm absolute -top-2 -right-2"
                aria-label={`画像 ${index + 1} を削除`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* アップロードボタン */}
      {photos.length < 5 && (
        <label className="btn btn-outline btn-primary w-full">
          {isUploading ? (
            <>
              <span className="loading loading-spinner"></span>
              アップロード中...
            </>
          ) : (
            <>📷 写真を選択</>
          )}
          <input
            id="photo-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
          />
        </label>
      )}
    </div>
  )
}
