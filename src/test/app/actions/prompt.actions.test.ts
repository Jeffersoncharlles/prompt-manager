import { getAllPrompts, searchPromptAction } from '@/app/actions/prompt.actions'

// Mock prisma to avoid TextEncoder error in JSDOM
jest.mock('@/lib/prisma', () => ({
  prisma: {},
}))

const mockedSearchExecute = jest.fn()
const mockedFindManyExecute = jest.fn()

jest.mock('@/infra/repository/prisma-prompt.repository', () => ({
  PrismaPromptRepository: jest.fn().mockImplementation(() => ({})),
}))

jest.mock('@/core/application/prompts/search-prompts.use-case', () => ({
  SearchPromptsUseCase: jest.fn().mockImplementation(() => ({
    execute: mockedSearchExecute,
  })),
}))
jest.mock('@/core/application/prompts/get-all-prompts.use-case', () => ({
  GetAllPromptsUseCase: jest.fn().mockImplementation(() => ({
    execute: mockedFindManyExecute,
  })),
}))

describe('Server Actions - Prompt Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('searchPromptAction', () => {
    it('should return prompts matching the search term', async () => {
      const input = [
        {
          id: '01',
          title: 'Example Prompt',
          content: 'This is an example prompt.',
        },
      ]
      mockedSearchExecute.mockResolvedValue(input)

      const formData = new FormData()
      formData.append('q', 'Example Prompt')

      const result = await searchPromptAction({ success: true }, formData)

      expect(result.success).toBe(true)
      expect(result.prompts).toEqual(input)
    })

    it('should return prompts matching the search term is empty', async () => {
      const input = [
        {
          id: '01',
          title: 'Example Prompt',
          content: 'This is an example prompt.',
        },
        {
          id: '02',
          title: 'Another Example Prompt',
          content: 'This is another example prompt.',
        },
      ]
      mockedSearchExecute.mockResolvedValue(input)

      const formData = new FormData()
      formData.append('q', '')

      const result = await searchPromptAction({ success: true }, formData)

      expect(result.success).toBeDefined()
      expect(result.prompts).toEqual(input)
    })

    it('should return an error message if the search fails', async () => {
      const input = [
        {
          id: '01',
          title: 'Example Prompt',
          content: 'This is an example prompt.',
        },
      ]
      mockedSearchExecute.mockRejectedValue(
        new Error('Ocorreu um erro ao buscar os prompts.'),
      )

      const formData = new FormData()
      formData.append('q', 'Example Prompt')

      const result = await searchPromptAction({ success: true }, formData)

      expect(result.success).toBe(false)
      expect(result.prompts).toBeUndefined()
      expect(result.msg).toBe('Ocorreu um erro ao buscar os prompts.')
    })

    it('should trim whitespace from the search term fist execute', async () => {
      const input = [
        {
          id: '01',
          title: 'Example Prompt',
          content: 'This is an example prompt.',
        },
      ]
      mockedSearchExecute.mockResolvedValue(input)

      const formData = new FormData()
      formData.append('q', '  Example Prompt ')

      const result = await searchPromptAction({ success: true }, formData)

      expect(mockedSearchExecute).toHaveBeenCalledWith('Example Prompt')
      expect(result.success).toBe(true)
      expect(result.prompts).toEqual(input)
    })

    it('should treating the absence of a query as empty', async () => {
      const input = [
        {
          id: '01',
          title: 'Example Prompt',
          content: 'This is an example prompt.',
        },
        {
          id: '02',
          title: 'Another Example Prompt',
          content: 'This is another example prompt.',
        },
      ]
      mockedSearchExecute.mockResolvedValue(input)

      const formData = new FormData()

      const result = await searchPromptAction({ success: true }, formData)

      expect(mockedSearchExecute).toHaveBeenCalledWith('')
      expect(result.success).toBe(true)
      expect(result.prompts).toEqual(input)
    })
  })

  describe('getAllPromptsAction', () => {
    it('should return all prompts', async () => {
      const input = [
        {
          id: '01',
          title: 'Example Prompt',
          content: 'This is an example prompt.',
        },
        {
          id: '02',
          title: 'Another Example Prompt',
          content: 'This is another example prompt.',
        },
      ]
      mockedFindManyExecute.mockResolvedValue(input)

      const result = await getAllPrompts()

      expect(result.success).toBe(true)
      expect(result.prompts).toEqual(input)
    })
    it('should return all prompts error', async () => {
      mockedFindManyExecute.mockRejectedValue(
        new Error('Erro ao buscar prompts.'),
      )

      const result = await getAllPrompts()

      expect(result.success).toBe(false)
      expect(result.msg).toBe('Erro ao buscar prompts.')
    })
  })
})
