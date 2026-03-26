import { expect, type Page, test } from '@playwright/test'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { PrismaClient } from '@/generated/prisma/client'

type PageProps = {
  page: Page
}

test.describe('Prompt Create Page', () => {
  test('should create a new prompt successfully', async ({
    page,
  }: PageProps) => {
    const title = `Test Prompt e2e ${Date.now()}`
    const content = 'This is a test prompt created during e2e testing.'

    await page.goto('/prompts/new')

    const titleInput = page.getByPlaceholder('Titulo do prompt')
    await titleInput.waitFor({ state: 'visible' })

    await titleInput.fill(title)
    await page.getByPlaceholder('Digite o conteudo do prompt...').fill(content)

    await page.click('button[type="submit"]')

    await page.waitForSelector('text=Prompt criado com sucesso.', {
      timeout: 15000,
      state: 'visible',
    })
  })
  test('should validate duplicate prompt creation', async ({
    page,
  }: {
    page: Page
  }) => {
    const duplicateTitle = `Duplicate Prompt e2e 01`
    const content = 'This is a test prompt for duplicate validation.'

    const pool = new Pool({ connectionString: process.env.DATABASE_URL })
    const adapter = new PrismaPg(pool)

    const prisma = new PrismaClient({ adapter })
    await prisma.prompt.deleteMany({
      where: {
        title: duplicateTitle,
      },
    })
    await prisma.prompt.create({
      data: {
        title: duplicateTitle,
        content,
      },
    })
    await prisma.$disconnect()

    await page.goto('/prompts/new')
    await expect(page.getByPlaceholder('Titulo do prompt')).toBeVisible()
    await page.fill('input[name="title"]', duplicateTitle)
    await page.fill('textarea[name="content"]', content)

    await page.click('button[type="submit"]')

    await page.waitForSelector('text=Já existe um prompt com este título.', {
      timeout: 15000,
      state: 'visible',
    })

    await expect(
      page.getByRole('heading', { name: duplicateTitle }),
    ).toHaveCount(1)
  })
})
