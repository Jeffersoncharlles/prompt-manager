export type Prompts = {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export type PromptSummary = Pick<Prompts, 'id' | 'title' | 'content'>
