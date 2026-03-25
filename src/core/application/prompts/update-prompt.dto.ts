import { z } from 'zod'

export const updatePromptSchema = z.object({
  id: z.string().cuid('ID inválido.'),
  title: z.string().min(1, 'O título é obrigatório.').optional(),
  content: z.string().min(1, 'O conteúdo é obrigatório.').optional(),
})

export type UpdatePromptDto = z.infer<typeof updatePromptSchema>
