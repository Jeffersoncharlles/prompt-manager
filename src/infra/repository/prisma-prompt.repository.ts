import type { CreatePromptDto } from '@/core/application/prompts/create-prompt.dto'
import type {
  PromptSummary,
  Prompts,
} from '@/core/domain/prompts/prompt.entity'
import type { PromptRepository } from '@/core/domain/prompts/prompt.repository'
import type { PrismaClient } from '@/generated/prisma/client'

export class PrismaPromptRepository implements PromptRepository {
  constructor(private prisma: PrismaClient) {}
  async findByTitle(title: string): Promise<Prompts | null> {
    const prompt = await this.prisma.prompt.findFirst({
      where: {
        title,
      },
    })
    if (!prompt) {
      return null
    }
    return {
      ...prompt,
      createdAt: prompt.createdAt,
      updatedAt: prompt.updatedAt,
    }
  }
  async findById(id: string): Promise<Prompts | null> {
    const prompt = await this.prisma.prompt.findUnique({
      where: {
        id,
      },
    })
    if (!prompt) {
      return null
    }
    return {
      ...prompt,
      createdAt: prompt.createdAt,
      updatedAt: prompt.updatedAt,
    }
  }
  async create(data: CreatePromptDto): Promise<Prompts> {
    const prompt = await this.prisma.prompt.create({
      data,
    })
    return {
      ...prompt,
      createdAt: prompt.createdAt,
      updatedAt: prompt.updatedAt,
    }
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
