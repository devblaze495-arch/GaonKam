import { seedAllMasterData } from '../src/utils/seedData.js'
import { prisma } from '../src/utils/prisma.js'

async function main() {
  console.log('Seeding master data (roles, skills, job categories, service categories, demo services)...')
  await seedAllMasterData()
  console.log('Master data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error during database seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
