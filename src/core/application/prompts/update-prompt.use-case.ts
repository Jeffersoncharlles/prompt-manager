import type { PromptRepository } from '@/core/domain/prompts/prompt.repository'
import { ConflictError, ResourceNotFoundError } from '@/core/errors/app-errors'
import type { UpdatePromptDto } from './update-prompt.dto'

export class UpdatePromptUseCase {
  constructor(private promptRepository: PromptRepository) {}

  async execute(data: UpdatePromptDto) {
    const existingPrompt = await this.promptRepository.findById(data.id)
    if (!existingPrompt) {
      throw new ResourceNotFoundError('PROMPT')
    }

    if (data.title) {
      const promptWithSameTitle = await this.promptRepository.findByTitle(
        data.title,
      )

      if (promptWithSameTitle && promptWithSameTitle.id !== data.id) {
        throw new ConflictError()
      }
    }

    return await this.promptRepository.update(data)
  }
}
