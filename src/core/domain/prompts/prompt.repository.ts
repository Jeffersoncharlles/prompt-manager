import type { CreatePromptDto } from '@/core/application/prompts/create-prompt.dto'
import type { PromptSummary, Prompts } from './prompt.entity'

export interface PromptRepository {
  findMany(): Promise<PromptSummary[]>
  searchMany(term?: string): Promise<PromptSummary[]>
  create(data: CreatePromptDto): Promise<Prompts>
  findByTitle(title: string): Promise<Prompts | null>
  findById(id: string): Promise<Prompts | null>
}
