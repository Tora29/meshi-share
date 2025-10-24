import type { PrismaClient } from '@prisma/client'

/**
 * 価格帯マスタの初期データ
 */
const PRICE_RANGE_MASTERS = [
  {
    value: 1,
    label: '¥（〜999円）',
    description: '1,000円未満',
    displayOrder: 1,
  },
  {
    value: 2,
    label: '¥¥（1,000〜2,999円）',
    description: '1,000円〜2,999円',
    displayOrder: 2,
  },
  {
    value: 3,
    label: '¥¥¥（3,000円〜）',
    description: '3,000円以上',
    displayOrder: 3,
  },
]

/**
 * 価格帯マスタのシードデータを投入
 *
 * @param prisma - Prismaクライアントインスタンス
 */
export async function seedPriceRangeMasters(
  prisma: PrismaClient
): Promise<void> {
  console.log('Seeding price range masters...')

  for (const priceRange of PRICE_RANGE_MASTERS) {
    await prisma.priceRangeMaster.upsert({
      where: { value: priceRange.value },
      update: {},
      create: priceRange,
    })
  }

  console.log(`✓ Created ${PRICE_RANGE_MASTERS.length} price range masters`)
}
