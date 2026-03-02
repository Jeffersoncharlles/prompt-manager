import { PrismaPromptRepository } from '@/infra/repository/prisma-prompt.repository'

function createMockPrisma() {
  const mock = {
    prompt: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  }
  return mock
}

describe('PrismaPromptRepository', () => {
  let prisma: ReturnType<typeof createMockPrisma>
  let repository: PrismaPromptRepository

  beforeEach(() => {
    prisma = createMockPrisma()
    repository = new PrismaPromptRepository(prisma as any)
  })

  describe('findMany', () => {
    it('should order results by createdAt descending', async () => {
      const now = new Date()
      const input = [
        {
          id: '1',
          title: 'Prompt 1',
          content: 'Content 1',
          createdAt: now,
          updatedAt: now,
        },
        {
          id: '2',
          title: 'Prompt 2',
          content: 'Content 2',
          createdAt: now,
          updatedAt: now,
        },
      ]

      prisma.prompt.findMany.mockResolvedValue(input)

      const result = await repository.findMany()

      expect(prisma.prompt.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      })
      expect(result).toMatchObject(input)
    })
  })

  describe('searchMany', () => {
    it('should search prompts by title and content', async () => {
      const now = new Date()
      const input = [
        {
          id: '1',
          title: 'Prompt 1',
          content: 'Content 1',
          createdAt: now,
          updatedAt: now,
        },
      ]

      prisma.prompt.findMany.mockResolvedValue(input)

      const result = await repository.searchMany('Prompt 1')

      expect(prisma.prompt.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { title: { contains: 'Prompt 1', mode: 'insensitive' } },
            { content: { contains: 'Prompt 1', mode: 'insensitive' } },
          ],
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
      expect(result).toMatchObject(input)
    })
  })

  describe('create', () => {
    it('should create a new prompt', async () => {
      const now = new Date()
      const input = {
        id: '1',
        title: 'New Prompt',
        content: 'New Content',
        createdAt: now,
        updatedAt: now,
      }

      prisma.prompt.create.mockResolvedValue(input)

      const result = await repository.create({
        title: 'New Prompt',
        content: 'New Content',
      })

      expect(prisma.prompt.create).toHaveBeenCalledWith({
        data: {
          title: 'New Prompt',
          content: 'New Content',
        },
      })
      expect(result).toMatchObject(input)
    })
  })
})
