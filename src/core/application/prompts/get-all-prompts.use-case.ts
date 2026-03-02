import type { PromptRepository } from '@/core/domain/prompts/prompt.repository'

export class GetAllPromptsUseCase {
  constructor(private promptRepository: PromptRepository) {}

  async execute() {
    return this.promptRepository.findMany()
  }
}
