import type { PromptSummary } from '@/core/domain/prompts/prompt.entity'

export type SearchFormState = {
  success: boolean
  prompts?: PromptSummary[]
  msg?: string
}

export type GetAllPromptsState = {
  success: boolean
  prompts: PromptSummary[]
  msg?: string
}

export type CreatePromptState = {
  success: boolean
  msg?: string
  errors?: Record<string, string[]>
}

export type FormState = {
  success: boolean
  prompts?: PromptSummary[]
  msg?: string
  errors?: unknown
}
