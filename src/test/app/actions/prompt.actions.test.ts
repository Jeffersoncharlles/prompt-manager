import {
  createPromptAction,
  getAllPrompts,
  searchPromptAction,
  updatePromptAction,
} from '@/app/actions/prompt.actions'
import { ConflictError, ResourceNotFoundError } from '@/core/errors/app-errors'

// Mock prisma to avoid TextEncoder error in JSDOM
jest.mock('@/lib/prisma', () => ({
  prisma: {},
}))

const mockedSearchExecute = jest.fn()
const mockedFindManyExecute = jest.fn()
const mockedCreateExecute = jest.fn()
const mockedUpdateExecute = jest.fn()

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
jest.mock('@/core/application/prompts/create-prompt.use-case', () => ({
  CreatePromptUseCase: jest.fn().mockImplementation(() => ({
    execute: mockedCreateExecute,
  })),
}))
jest.mock('@/core/application/prompts/update-prompt.use-case', () => ({
  UpdatePromptUseCase: jest.fn().mockImplementation(() => ({
    execute: mockedUpdateExecute,
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

  describe('createPromptAction', () => {
    it('should return an error message if the data is invalid', async () => {
      const data = {
        title: '',
        content: '',
      }
      const result = await createPromptAction(data)
      expect(result.success).toBe(false)
      expect(result.msg).toBe('Dados inválidos.')
      expect(result.errors).toBeDefined()
    })
    it('should create a prompt successfully', async () => {
      const data = {
        title: 'Test Prompt',
        content: 'This is a test prompt.',
      }
      const result = await createPromptAction(data)
      expect(result.success).toBe(true)
    })
    it('should return an error message if the prompt already exists', async () => {
      const data = {
        title: 'Test Prompt',
        content: 'This is a test prompt.',
      }
      mockedCreateExecute.mockRejectedValue(
        new Error('Prompt_with_this_title_already_exists.'),
      )
      const result = await createPromptAction(data)
      expect(result.success).toBe(false)
      expect(result.msg).toBe('Já existe um prompt com este título.')
    })

    it('should return a generic error message if creation fails with other error', async () => {
      const data = {
        title: 'Test Prompt',
        content: 'This is a test prompt.',
      }
      mockedCreateExecute.mockRejectedValue(
        new Error('Database connection error'),
      )
      const result = await createPromptAction(data)
      expect(result.success).toBe(false)
      expect(result.msg).toBe('Ocorreu um erro ao criar o prompt.')
    })
  })
  describe('updatePromptAction', () => {
    it('should update a prompt successfully', async () => {
      mockedUpdateExecute.mockResolvedValue({})

      const data = {
        id: 'clx1234567890abcdef12345',
        title: 'Test Prompt',
        content: 'This is a test prompt.',
      }

      const result = await updatePromptAction(data)
      expect(result.success).toBe(true)
      expect(result).toMatchObject({
        success: true,
        msg: 'Prompt atualizado com sucesso.',
      })
    })

    it('should return an error message if the data is invalid', async () => {
      const data = {
        id: '01',
        title: '',
        content: '',
      }
      const result = await updatePromptAction(data)
      expect(result.success).toBe(false)
      expect(result.msg).toBe('Dados inválidos.')
      expect(result.errors).toBeDefined()
    })
    it('should return an error message ResourceNotFoundError if the prompt does not exist', async () => {
      mockedUpdateExecute.mockRejectedValue(new ResourceNotFoundError('PROMPT'))
      const data = {
        id: 'clx1234567890abcdef12345',
        title: 'Test Prompt',
        content: 'This is a test prompt.',
      }

      const result = await updatePromptAction(data)
      expect(result.success).toBe(false)
      expect(result.msg).toBe('Prompt não encontrado.')
    })

    it('should return an error message if the prompt title already exists', async () => {
      mockedUpdateExecute.mockRejectedValue(new ConflictError())
      const data = {
        id: 'clx1234567890abcdef12345',
        title: 'Test Prompt',
        content: 'This is a test prompt.',
      }

      const result = await updatePromptAction(data)
      expect(result.success).toBe(false)
      expect(result.msg).toBe('Já existe um prompt com este título.')
    })
    it('should return a generic error message if update fails with other error', async () => {
      mockedUpdateExecute.mockRejectedValue(
        new Error('Database connection error'),
      )
      const data = {
        id: 'clx1234567890abcdef12345',
        title: 'Test Prompt',
        content: 'This is a test prompt.',
      }

      const result = await updatePromptAction(data)
      expect(result.success).toBe(false)
      expect(result.msg).toBe('Ocorreu um erro ao atualizar o prompt.')
    })
  })
})
