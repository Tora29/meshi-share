import { PrismaClient } from '@prisma/client'

import { seedGenreMasters } from './seeds/genre-masters'
import { seedPriceRangeMasters } from './seeds/price-range-masters'

const prisma = new PrismaClient()

async function main(): Promise<void> {
  console.log('Start seeding...')

  // ジャンルマスタを投入
  await seedGenreMasters(prisma)

  // 価格帯マスタを投入
  await seedPriceRangeMasters(prisma)

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
