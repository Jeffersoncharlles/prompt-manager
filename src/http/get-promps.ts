import { prisma } from '@/lib/prisma'

export const getPrompts = async () => {
  const prompts = await prisma.prompt.findMany()

  return prompts
}
