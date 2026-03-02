import type { PromptRepository } from '@/core/domain/prompts/prompt.repository'
import type { CreatePromptDto } from './create-prompt.dto'

export class CreatePromptUseCase {
  constructor(private promptRepository: PromptRepository) {}

  async execute(data: CreatePromptDto) {
    const existingPrompt = await this.promptRepository.findByTitle(data.title)
    if (existingPrompt) {
      throw new Error('Prompt_with_this_title_already_exists.')
    }

    return await this.promptRepository.create(data)
  }
}
