import type { PromptSummary } from './prompt.entity'

export interface PromptRepository {
  findMany(): Promise<PromptSummary[]>
  searchMany(term?: string): Promise<PromptSummary[]>
}
