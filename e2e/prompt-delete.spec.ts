import { expect, test } from '@playwright/test'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { PrismaClient } from '@/generated/prisma/client'

test.describe('Prompt Deletion', () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)
  const now = Date.now()

  test('should delete a prompt successfully', async ({ page }) => {
    const uniqueTitle = `Test Prompt Deletion e2e ${now}`
    const content = 'This is the content of the prompt to be deleted.'

    const prisma = new PrismaClient({ adapter })
    await prisma.prompt.create({
      data: {
        title: uniqueTitle,
        content,
      },
    })
    await prisma.$disconnect()

    await page.goto('/')

    const list = page.getByRole('list')
    await expect(list).toBeVisible()

    const heading = list.getByRole('heading', { name: uniqueTitle })
    await expect(heading).toBeVisible({ timeout: 15000 })
    const promptItem = page
      .getByRole('listitem')
      .filter({ hasText: uniqueTitle })
    await expect(promptItem).toBeVisible()

    const deleteButton = promptItem.getByRole('button', {
      name: 'Remover Prompt',
    })
    await deleteButton.click()

    await page.getByRole('button', { name: 'Confirmar Remoção' }).click()

    await expect(page.getByText('Prompt deletado com sucesso.')).toBeVisible()
    await expect(heading).not.toBeVisible({ timeout: 10000 })
  })
})
