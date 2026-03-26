'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import {
  createPromptAction,
  updatePromptAction,
} from '@/app/actions/prompt.actions'
import {
  type CreatePromptDto,
  createPromptSchema,
} from '@/core/application/prompts/create-prompt.dto'
import type { Prompts } from '@/core/domain/prompts/prompt.entity'
import { CopyButton } from '../button-actions/copy-button'
import { Button } from '../ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'

export type PromptFormProps = {
  prompt?: Prompts | null
}

export const PromptForm = ({ prompt }: PromptFormProps) => {
  const router = useRouter()
  const form = useForm<CreatePromptDto>({
    resolver: zodResolver(createPromptSchema),
    defaultValues: {
      title: prompt?.title || '',
      content: prompt?.content || '',
    },
  })

  const submitHandler = async (data: CreatePromptDto) => {
    const result = prompt?.id
      ? await updatePromptAction({ id: prompt.id, ...data })
      : await createPromptAction(data)

    if (!result.success) {
      return toast.error(result.msg)
    }
    toast.success(`${result.msg}`)
    router.refresh()
  }

  const content = useWatch({
    control: form.control,
    name: 'content',
  })

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(submitHandler)}>
        <header className="flex flex-wrap gap-2 items-center mb-6 justify-end">
          <CopyButton content={content} />
          <Button title="salvar" type="submit" size={'sm'}>
            Salvar
          </Button>
        </header>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  variant={'transparent'}
                  placeholder="Titulo do prompt"
                  size={'lg'}
                  autoFocus
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  {...field}
                  variant={'transparent'}
                  placeholder="Digite o conteudo do prompt..."
                  size={'lg'}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
