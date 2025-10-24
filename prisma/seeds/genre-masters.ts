import type { PrismaClient } from '@prisma/client'

/**
 * ジャンルマスタの初期データ
 */
const GENRE_MASTERS = [
  { value: 'japanese', label: '和食', displayOrder: 1 },
  { value: 'western', label: '洋食', displayOrder: 2 },
  { value: 'chinese', label: '中華', displayOrder: 3 },
  { value: 'italian', label: 'イタリアン', displayOrder: 4 },
  { value: 'french', label: 'フレンチ', displayOrder: 5 },
  { value: 'cafe', label: 'カフェ', displayOrder: 6 },
  { value: 'ramen', label: 'ラーメン', displayOrder: 7 },
  { value: 'izakaya', label: '居酒屋', displayOrder: 8 },
  { value: 'other', label: 'その他', displayOrder: 9 },
]

/**
 * ジャンルマスタのシードデータを投入
 *
 * @param prisma - Prismaクライアントインスタンス
 */
export async function seedGenreMasters(prisma: PrismaClient): Promise<void> {
  console.log('Seeding genre masters...')

  for (const genre of GENRE_MASTERS) {
    await prisma.genreMaster.upsert({
      where: { value: genre.value },
      update: {},
      create: genre,
    })
  }

  console.log(`✓ Created ${GENRE_MASTERS.length} genre masters`)
}
