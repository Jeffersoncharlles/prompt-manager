'use server'

import type { PromptSummary } from '@/core/domain/prompts/prompt.entity'
import { prisma } from '@/lib/prisma'

type SearchFormState = {
  success: boolean
  prompts?: PromptSummary[]
  msg?: string
}

export const searchPromptAction = async (
  _prev: SearchFormState,
  formData: FormData,
): Promise<SearchFormState> => {
  const term = String(formData.get('q') || '').trim()

  try {
    const prompts = await prisma.prompt.findMany({
      where: term
        ? {
            OR: [
              { title: { contains: term, mode: 'insensitive' } },
              { content: { contains: term, mode: 'insensitive' } },
            ],
          }
        : undefined,
      orderBy: {
        createdAt: 'desc',
      },
    })

    const summaries = prompts.map((prompt) => ({
      id: prompt.id,
      title: prompt.title,
      content: prompt.content,
    }))

    return {
      success: true,
      prompts: summaries,
    }
  } catch (_error) {
    return {
      success: false,
      msg: 'Ocorreu um erro ao buscar os prompts.',
    }
  }
}
