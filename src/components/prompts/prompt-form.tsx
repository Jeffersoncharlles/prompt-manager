'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  type CreatePromptDto,
  createPromptSchema,
} from '@/core/application/prompts/create-prompt.dto'
import { Button } from '../ui/button'
import { Form, FormControl, FormField, FormItem } from '../ui/form'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'

export const PromptForm = () => {
  const form = useForm<CreatePromptDto>({
    resolver: zodResolver(createPromptSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  })

  return (
    <Form {...form}>
      <form className="space-y-6">
        <header className="flex flex-wrap gap-2 items-center mb-6 justify-end">
          <Button type="submit" size={'sm'}>
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
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
