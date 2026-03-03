import { SearchPromptsUseCase } from '@/core/application/prompts/search-prompts.use-case'
import type { Prompts } from '@/core/domain/prompts/prompt.entity'
import type { PromptRepository } from '@/core/domain/prompts/prompt.repository'

describe('SearchPromptsUseCase', () => {
  const input: Prompts[] = [
    {
      id: '01',
      title: 'Example Prompt',
      content: 'This is an example prompt.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '02',
      title: 'Different Prompt',
      content: 'This is a different prompt with other content.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  const repository: PromptRepository = {
    findMany: async () => input,
    searchMany: async (query: string) =>
      input.filter(
        (prompt) =>
          prompt.title
            .toLocaleLowerCase()
            .includes(query.toLocaleLowerCase()) ||
          prompt.content
            .toLocaleLowerCase()
            .includes(query.toLocaleLowerCase()),
      ),
    create: jest.fn(),
    findByTitle: jest.fn(),
    findById: jest.fn(),
  }

  it('should return prompts when the search term is empty', async () => {
    const useCase = new SearchPromptsUseCase(repository)

    const result = await useCase.execute('')

    expect(result).toEqual(input)
    expect(result).toHaveLength(input.length)
  })

  it('should return matching prompts when the search term is provided', async () => {
    const useCase = new SearchPromptsUseCase(repository)
    const query = 'Example Prompt'

    const result = await useCase.execute(query)

    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Example Prompt')
  })
  it('should verify  trim clear space', async () => {
    const findMany = jest.fn().mockResolvedValue(input)
    const searchMany = jest.fn().mockResolvedValue(input)

    const repository: PromptRepository = {
      findMany,
      searchMany,
      create: jest.fn(),
      findByTitle: jest.fn(),
      findById: jest.fn(),
    }

    const useCase = new SearchPromptsUseCase(repository)
    const query = '   '

    const result = await useCase.execute(query)
    expect(result).toHaveLength(2)
  })

  it('should return all prompts when search term is null or undefined', async () => {
    const findMany = jest.fn().mockResolvedValue(input)
    const searchMany = jest.fn().mockResolvedValue([])

    const repository: PromptRepository = {
      findMany,
      searchMany,
      create: jest.fn(),
      findByTitle: jest.fn(),
      findById: jest.fn(),
    }

    const useCase = new SearchPromptsUseCase(repository)

    const result = await useCase.execute(undefined as any)

    expect(findMany).toHaveBeenCalled()
    expect(searchMany).not.toHaveBeenCalled()
    expect(result).toEqual(input)
  })
})
