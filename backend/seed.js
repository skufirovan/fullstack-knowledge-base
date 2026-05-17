import { PrismaPg } from '@prisma/adapter-pg'
import { hash } from 'argon2'

import { PrismaClient } from './dist/generated/prisma/client.js'

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
})

async function main() {
  // Пользователи
  const password = process.env.PASSWORD

  if (!password) throw new Error('PASSWORD environment variable is not set')

  const hashedPassword = await hash(password)

  await prisma.user.upsert({
    where: { email: 'admin@mail.ru' },
    update: {},
    create: {
      email: 'admin@mail.ru',
      password: hashedPassword,
      role: 'admin',
    },
  })

  await prisma.user.upsert({
    where: { email: 'editor@mail.ru' },
    update: {},
    create: {
      email: 'editor@mail.ru',
      password: hashedPassword,
      role: 'editor',
    },
  })

  await prisma.user.upsert({
    where: { email: 'user@mail.ru' },
    update: {},
    create: {
      email: 'user@mail.ru',
      password: hashedPassword,
      role: 'user',
    },
  })
}

main()
  .catch(e => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
