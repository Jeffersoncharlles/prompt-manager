import { expect, type Page, test } from '@playwright/test'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/generated/prisma/client'

type PageProps = {
  page: Page
}

test.describe('Prompt Search sidebar', async () => {
  test('It should filter the list of prompts in real time based on the term typed.', async ({
    page,
  }: PageProps) => {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    })
    const prisma = new PrismaClient({ adapter })

    const uniqueAlpha = `E2E search Alpha ${Date.now()}`
    const uniqueBeta = `E2E search Beta ${Date.now()}`

    await prisma.prompt.createMany({
      data: [
        { title: uniqueAlpha, content: 'Alpha content' },
        { title: uniqueBeta, content: 'Beta content' },
      ],
    })

    await prisma.$disconnect()

    await page.goto('/')
    const searchInput = page.getByPlaceholder('Buscar prompts...')

    await expect(searchInput).toBeVisible()
    await searchInput.fill(uniqueAlpha)
    await expect(page.getByText(uniqueAlpha)).toBeVisible()
    await expect(page.getByText(uniqueAlpha)).toHaveCount(1)
    // await expect(page.getByText(uniqueBeta)).not.toBeVisible()

    await searchInput.fill(uniqueBeta)
    await expect(page.getByText(uniqueAlpha)).toHaveCount(1)

    const notExist = `E2E Search Not Exist ${Date.now()}`
    await searchInput.fill(notExist)
    await expect(page.getByText(notExist)).toHaveCount(0)
  })
})
