import { GetAllPromptsUseCase } from '@/core/application/prompts/get-all-prompts.use-case'
import type { Prompts } from '@/core/domain/prompts/prompt.entity'
import type { PromptRepository } from '@/core/domain/prompts/prompt.repository'

describe('GetAllPromptsUseCase', () => {
  const input: Prompts[] = [
    {
      id: '01',
      title: 'Example Prompt',
      content: 'This is an example prompt.',
      createAt: new Date(),
      updateAt: new Date(),
    },
    {
      id: '02',
      title: 'Different Prompt',
      content: 'This is a different prompt with other content.',
      createAt: new Date(),
      updateAt: new Date(),
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
  }

  it('should return get all prompts', async () => {
    const useCase = new GetAllPromptsUseCase(repository)

    const result = await useCase.execute()

    expect(result).toEqual(input)
    expect(result).toHaveLength(input.length)
  })
})
