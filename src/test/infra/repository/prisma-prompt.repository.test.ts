import { PrismaPromptRepository } from '@/infra/repository/prisma-prompt.repository'

function createMockPrisma() {
  const mock = {
    prompt: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
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

  describe('findByTitle', () => {
    it('should find prompt by title', async () => {
      const now = new Date()
      const input = {
        id: '1',
        title: 'Test Prompt',
        content: 'Test Content',
        createdAt: now,
        updatedAt: now,
      }

      prisma.prompt.findFirst.mockResolvedValue(input)

      const result = await repository.findByTitle('Test Prompt')

      expect(prisma.prompt.findFirst).toHaveBeenCalledWith({
        where: { title: 'Test Prompt' },
      })
      expect(result).toMatchObject(input)
    })

    it('should return null when prompt not found by title', async () => {
      prisma.prompt.findFirst.mockResolvedValue(null)

      const result = await repository.findByTitle('Nonexistent')

      expect(prisma.prompt.findFirst).toHaveBeenCalledWith({
        where: { title: 'Nonexistent' },
      })
      expect(result).toBeNull()
    })
  })

  describe('findById', () => {
    it('should find prompt by id', async () => {
      const now = new Date()
      const input = {
        id: 'uuid-123',
        title: 'Test Prompt',
        content: 'Test Content',
        createdAt: now,
        updatedAt: now,
      }

      prisma.prompt.findUnique.mockResolvedValue(input)

      const result = await repository.findById('uuid-123')

      expect(prisma.prompt.findUnique).toHaveBeenCalledWith({
        where: { id: 'uuid-123' },
      })
      expect(result).toMatchObject(input)
    })

    it('should return null when prompt not found by id', async () => {
      prisma.prompt.findUnique.mockResolvedValue(null)

      const result = await repository.findById('nonexistent-id')

      expect(prisma.prompt.findUnique).toHaveBeenCalledWith({
        where: { id: 'nonexistent-id' },
      })
      expect(result).toBeNull()
    })
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

    it('should return empty array when no prompts exist', async () => {
      prisma.prompt.findMany.mockResolvedValue([])

      const result = await repository.findMany()

      expect(prisma.prompt.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      })
      expect(result).toEqual([])
    })
  })

  describe('searchMany', () => {
    it('should search prompts by title', async () => {
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

    it('should search prompts by content', async () => {
      const now = new Date()
      const input = [
        {
          id: '2',
          title: 'Test',
          content: 'SearchableTerm',
          createdAt: now,
          updatedAt: now,
        },
      ]

      prisma.prompt.findMany.mockResolvedValue(input)

      const result = await repository.searchMany('SearchableTerm')

      expect(prisma.prompt.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { title: { contains: 'SearchableTerm', mode: 'insensitive' } },
            { content: { contains: 'SearchableTerm', mode: 'insensitive' } },
          ],
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
      expect(result).toMatchObject(input)
    })

    it('should return all prompts when no term provided', async () => {
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

      const result = await repository.searchMany()

      expect(prisma.prompt.findMany).toHaveBeenCalledWith({
        where: undefined,
        orderBy: {
          createdAt: 'desc',
        },
      })
      expect(result).toMatchObject(input)
    })

    it('should return all prompts when term is empty string', async () => {
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

      const result = await repository.searchMany('')

      expect(prisma.prompt.findMany).toHaveBeenCalledWith({
        where: undefined,
        orderBy: {
          createdAt: 'desc',
        },
      })
      expect(result).toMatchObject(input)
    })

    it('should return all prompts when term is only whitespace', async () => {
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

      const result = await repository.searchMany('   ')

      expect(prisma.prompt.findMany).toHaveBeenCalledWith({
        where: undefined,
        orderBy: {
          createdAt: 'desc',
        },
      })
      expect(result).toMatchObject(input)
    })

    it('should return empty array when no results found', async () => {
      prisma.prompt.findMany.mockResolvedValue([])

      const result = await repository.searchMany('nonexistent')

      expect(prisma.prompt.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { title: { contains: 'nonexistent', mode: 'insensitive' } },
            { content: { contains: 'nonexistent', mode: 'insensitive' } },
          ],
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
      expect(result).toEqual([])
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

    it('should throw error when prisma create fails', async () => {
      const error = new Error('Database constraint violation')
      prisma.prompt.create.mockRejectedValue(error)

      await expect(
        repository.create({
          title: 'New Prompt',
          content: 'New Content',
        }),
      ).rejects.toThrow('Database constraint violation')
    })
  })
})
