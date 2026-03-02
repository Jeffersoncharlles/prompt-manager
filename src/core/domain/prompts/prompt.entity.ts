export type Prompts = {
  id: string
  title: string
  content: string
  createAt: Date
  updateAt: Date
}

export type PromptSummary = Pick<Prompts, 'id' | 'title' | 'content'>
