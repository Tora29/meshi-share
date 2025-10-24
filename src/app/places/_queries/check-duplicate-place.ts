import { prisma } from '@/lib/prisma'

/**
 * 重複チェック結果の型
 */
export type DuplicateCheckResult = {
  /** 重複が存在するか */
  hasDuplicate: boolean
  /** 重複している店舗の情報 */
  duplicates: {
    id: string
    name: string
    mapUrl: string
  }[]
}

/**
 * 店舗の重複をチェック
 *
 * 同じGoogle Maps URLまたは類似する店舗名が存在するかチェック
 *
 * @param mapUrl - Google Maps URL
 * @param name - 店舗名
 * @returns 重複チェック結果
 */
export async function checkDuplicatePlace(
  mapUrl: string,
  name: string
): Promise<DuplicateCheckResult> {
  // 1. 同じmapUrlの店舗を検索
  const duplicatesByUrl = await prisma.place.findMany({
    where: { mapUrl },
    select: {
      id: true,
      name: true,
      mapUrl: true,
    },
  })

  // 2. 類似する店舗名を検索（部分一致）
  const duplicatesByName = await prisma.place.findMany({
    where: {
      name: {
        contains: name,
        mode: 'insensitive', // 大文字小文字を区別しない
      },
    },
    select: {
      id: true,
      name: true,
      mapUrl: true,
    },
    take: 5, // 最大5件
  })

  // 3. 結果をマージ（重複排除）
  const duplicatesMap = new Map<string, (typeof duplicatesByUrl)[0]>()

  for (const place of [...duplicatesByUrl, ...duplicatesByName]) {
    duplicatesMap.set(place.id, place)
  }

  const duplicates = Array.from(duplicatesMap.values())

  return {
    hasDuplicate: duplicates.length > 0,
    duplicates,
  }
}
