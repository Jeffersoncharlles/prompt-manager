import type { UpdatePromptDto } from '@/core/application/prompts/update-prompt.dto'
import { UpdatePromptUseCase } from '@/core/application/prompts/update-prompt.use-case'
import type { PromptRepository } from '@/core/domain/prompts/prompt.repository'

const makeRepository = (overrideValues: Partial<PromptRepository>) => {
  const base = {
    update: jest.fn(async (data) => ({
      id: data.id,
      title: data.title ?? '',
      content: data.content ?? '',
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    findByTitle: jest.fn(async () => null),
    findById: jest.fn(async () => null),
  }
  return { ...base, ...overrideValues } as PromptRepository
}

describe('UpdatePromptUseCase', () => {
  const promptData = {
    id: '01',
    title: 'Example Prompt',
    content: 'This is an example prompt.',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  it('should update when given prompt exists', async () => {
    const repository = makeRepository({
      findById: jest.fn().mockResolvedValue({
        ...promptData,
      }),
      update: jest.fn().mockResolvedValue({
        ...promptData,
        title: 'new Prompt',
        content: 'This is an  prompt.',
      }),
      findByTitle: jest.fn().mockResolvedValue(null),
    })

    const useCase = new UpdatePromptUseCase(repository)
    const input: UpdatePromptDto = {
      id: '01',
      title: 'new Prompt',
      content: 'This is an  prompt.',
    }

    const result = await useCase.execute(input)

    expect(result.title).toBe(input.title)
    expect(repository.update).toHaveBeenCalledWith({
      id: input.id,
      title: input.title,
      content: input.content,
    })
  })

  it('should throw ResourceNotFoundError when prompt does not exist', async () => {
    const repository = makeRepository({
      findById: jest.fn().mockResolvedValue(null),
    })

    const useCase = new UpdatePromptUseCase(repository)
    const input: UpdatePromptDto = {
      id: 'nonexistent-id',
      title: 'new Prompt',
      content: 'This is an  prompt.',
    }

    await expect(useCase.execute(input)).rejects.toThrow('PROMPT')
  })
})
