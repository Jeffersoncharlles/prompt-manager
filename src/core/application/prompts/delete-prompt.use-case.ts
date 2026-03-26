import type { PromptRepository } from '@/core/domain/prompts/prompt.repository'
import { ResourceNotFoundError } from '@/core/errors/app-errors'
import type { DeletePromptDto } from './delete-prompt.dto'

export class DeletePromptUseCase {
  constructor(private promptRepository: PromptRepository) {}

  async execute({ id }: DeletePromptDto) {
    const existingPrompt = await this.promptRepository.findById(id)
    if (!existingPrompt) {
      throw new ResourceNotFoundError('PROMPT')
    }

    return await this.promptRepository.delete({ id })
  }
}
