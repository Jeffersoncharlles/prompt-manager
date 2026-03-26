import { DeletePromptUseCase } from '@/core/application/prompts/delete-prompt.use-case'
import type { PromptRepository } from '@/core/domain/prompts/prompt.repository'

const makeRepository = (
  override: Partial<PromptRepository> = {},
): PromptRepository => {
  const base = {
    delete: jest.fn(async () => {}),
    findById: jest.fn(async () => {}),
  }
  return { ...base, ...override } as PromptRepository
}

describe('DeletePromptUseCase', () => {
  const promptData = {
    id: 'clx1234567890abcdef12345',
    title: 'Prompt 1',
    content: 'Content 1',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  it('should delete a prompt successfully', async () => {
    const repository = makeRepository({
      findById: jest.fn().mockResolvedValue(promptData),
      delete: jest.fn().mockResolvedValue(undefined),
    })

    const useCase = new DeletePromptUseCase(repository)
    const result = await useCase.execute({ id: promptData.id })

    expect(repository.findById).toHaveBeenCalledWith(promptData.id)
    expect(repository.delete).toHaveBeenCalledWith({ id: promptData.id })
    expect(result).toBeUndefined()
  })

  it('should throw ResourceNotFoundError if prompt does not exist', async () => {
    const repository = makeRepository({
      findById: jest.fn().mockResolvedValue(null),
      delete: jest.fn().mockResolvedValue(undefined),
    })

    const useCase = new DeletePromptUseCase(repository)

    await expect(useCase.execute({ id: promptData.id })).rejects.toThrow(
      'PROMPT_NOT_FOUND',
    )
    expect(repository.findById).toHaveBeenCalledWith(promptData.id)
    expect(repository.delete).not.toHaveBeenCalled()
  })
})
