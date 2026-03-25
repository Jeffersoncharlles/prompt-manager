import type { CreatePromptDto } from '@/core/application/prompts/create-prompt.dto'
import type { UpdatePromptDto } from '@/core/application/prompts/update-prompt.dto'
import type { PromptSummary, Prompts } from './prompt.entity'

export interface PromptRepository {
  findMany(): Promise<PromptSummary[]>
  searchMany(term?: string): Promise<PromptSummary[]>
  create(data: CreatePromptDto): Promise<Prompts>
  update(
    data: { id: string } & Partial<Omit<UpdatePromptDto, 'id'>>,
  ): Promise<Prompts>
  findByTitle(title: string): Promise<Prompts | null>
  findById(id: string): Promise<Prompts | null>
}
