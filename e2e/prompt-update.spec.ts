import { expect, type Page, test } from '@playwright/test'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { PrismaClient } from '@/generated/prisma/client'

type PageProps = {
  page: Page
}

test.describe('Prompt Update Page', async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)
  const now = Date.now()

  test('should update an existing prompt successfully', async ({
    page,
  }: PageProps) => {
    const originalTitle = `Test Prompt Update e2e ${now}`
    const originalContent = 'This is the original content of the prompt.'
    const updatedTitle = `Updated Test Prompt e2e ${now}`
    const updatedContent = 'This is the updated content of the prompt.'

    const prisma = new PrismaClient({ adapter })
    await prisma.prompt.deleteMany({
      where: {
        title: originalTitle,
      },
    })
    const createdPrompt = await prisma.prompt.create({
      data: {
        title: originalTitle,
        content: originalContent,
      },
    })
    await prisma.$disconnect()

    await page.goto(`/prompts/${createdPrompt.id}`)

    await expect(page.getByPlaceholder('Titulo do prompt')).toBeVisible()

    await page.fill('input[name="title"]', updatedTitle)
    await page.fill('textarea[name="content"]', updatedContent)

    await page.click('button[type="submit"]')

    await page.waitForSelector('text=Prompt atualizado com sucesso.', {
      timeout: 15000,
      state: 'visible',
    })

    await expect(
      page.getByRole('heading', { name: updatedTitle }),
    ).toBeVisible()
    await expect(page.locator('input[name="title"]')).toHaveValue(updatedTitle)
  })
})
