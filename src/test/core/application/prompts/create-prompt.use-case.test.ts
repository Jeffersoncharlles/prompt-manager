import type { CreatePromptDto } from '@/core/application/prompts/create-prompt.dto'
import { CreatePromptUseCase } from '@/core/application/prompts/create-prompt.use-case'
import type { PromptRepository } from '@/core/domain/prompts/prompt.repository'

describe('CreatePromptUseCase', () => {
  let repository: jest.Mocked<PromptRepository>
  let useCase: CreatePromptUseCase

  beforeEach(() => {
    repository = {
      findByTitle: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      searchMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    }
    useCase = new CreatePromptUseCase(repository)
  })

  it('should create a new prompt when title does not exist', async () => {
    const data: CreatePromptDto = {
      title: 'New Prompt',
      content: 'This is a new prompt content.',
    }

    const createdPrompt = {
      id: '1',
      title: 'New Prompt',
      content: 'This is a new prompt content.',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    repository.findByTitle.mockResolvedValueOnce(null)
    repository.create.mockResolvedValueOnce(createdPrompt)

    const result = await useCase.execute(data)

    expect(repository.findByTitle).toHaveBeenCalledWith(data.title)
    expect(repository.create).toHaveBeenCalledWith(data)
    expect(result).toEqual(createdPrompt)
  })

  it('should throw error when prompt with same title already exists', async () => {
    const data: CreatePromptDto = {
      title: 'Existing Prompt',
      content: 'This prompt already exists.',
    }

    const existingPrompt = {
      id: '1',
      title: 'Existing Prompt',
      content: 'This prompt already exists.',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    repository.findByTitle.mockResolvedValueOnce(existingPrompt)

    await expect(useCase.execute(data)).rejects.toThrow(
      'Prompt_with_this_title_already_exists.',
    )

    expect(repository.findByTitle).toHaveBeenCalledWith(data.title)
    expect(repository.create).not.toHaveBeenCalled()
  })

  it('should not create prompt if repository.create fails', async () => {
    const data: CreatePromptDto = {
      title: 'Failing Prompt',
      content: 'This will fail to create.',
    }

    const error = new Error('Database error')
    repository.findByTitle.mockResolvedValueOnce(null)
    repository.create.mockRejectedValueOnce(error)

    await expect(useCase.execute(data)).rejects.toThrow('Database error')

    expect(repository.findByTitle).toHaveBeenCalledWith(data.title)
    expect(repository.create).toHaveBeenCalledWith(data)
  })
})
