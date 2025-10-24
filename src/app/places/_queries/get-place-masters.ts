import { prisma } from '@/lib/prisma'

/**
 * ジャンルマスタのデータ型
 */
export type GenreMaster = {
  id: string
  value: string
  label: string
  displayOrder: number
}

/**
 * 価格帯マスタのデータ型
 */
export type PriceRangeMaster = {
  id: string
  value: number
  label: string
  description: string | null
  displayOrder: number
}

/**
 * ジャンルマスタを取得
 *
 * アクティブなジャンルを表示順でソートして返す
 *
 * @returns ジャンルマスタの配列
 */
export async function getGenreMasters(): Promise<GenreMaster[]> {
  const genres = await prisma.genreMaster.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: 'asc' },
    select: {
      id: true,
      value: true,
      label: true,
      displayOrder: true,
    },
  })

  return genres
}

/**
 * 価格帯マスタを取得
 *
 * アクティブな価格帯を表示順でソートして返す
 *
 * @returns 価格帯マスタの配列
 */
export async function getPriceRangeMasters(): Promise<PriceRangeMaster[]> {
  const priceRanges = await prisma.priceRangeMaster.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: 'asc' },
    select: {
      id: true,
      value: true,
      label: true,
      description: true,
      displayOrder: true,
    },
  })

  return priceRanges
}
