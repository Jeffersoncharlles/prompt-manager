import { z } from 'zod'

export const deletePromptSchema = z.object({
  id: z.string().cuid('ID inválido.'),
})

export type DeletePromptDto = z.infer<typeof deletePromptSchema>
