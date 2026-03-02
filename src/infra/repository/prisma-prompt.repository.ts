import type { CreatePromptDto } from '@/core/application/prompts/create-prompt.dto'
import type { PromptSummary } from '@/core/domain/prompts/prompt.entity'
import type { PromptRepository } from '@/core/domain/prompts/prompt.repository'
import type { PrismaClient } from '@/generated/prisma/client'

export class PrismaPromptRepository implements PromptRepository {
  constructor(private prisma: PrismaClient) {}
  findByTitle(title: string): Promise<PromptSummary | null> {
    const prompt = this.prisma.prompt.findFirst({
      where: {
        title,
      },
    })
    return prompt
  }
  findById(id: string): Promise<PromptSummary | null> {
    const prompt = this.prisma.prompt.findUnique({
      where: {
        id,
      },
    })
    return prompt
  }
  async create(data: CreatePromptDto): Promise<PromptSummary> {
    const prompt = await this.prisma.prompt.create({
      data,
    })
    return prompt
  }

  async findMany(): Promise<PromptSummary[]> {
    const prompts = await this.prisma.prompt.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return prompts
  }
  async searchMany(term?: string): Promise<PromptSummary[]> {
    const q = term?.trim() ?? ''

    const prompts = await this.prisma.prompt.findMany({
      where: q
        ? {
            OR: [
              { title: { contains: q, mode: 'insensitive' } },
              { content: { contains: q, mode: 'insensitive' } },
            ],
          }
        : undefined,
      orderBy: {
        createdAt: 'desc',
      },
    })
    return prompts
  }
}
