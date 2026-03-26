'use client'

import { Loader2Icon, Trash } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import { deletePromptAction } from '@/app/actions/prompt.actions'
import type { PromptSummary } from '@/core/domain/prompts/prompt.entity'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog'
import { Button } from '../ui/button'

export type PromptCardProps = {
  prompt: PromptSummary
}

export const PromptCard = ({ prompt }: PromptCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deletePromptAction(prompt.id)
      result.success ? toast.success(result.msg) : toast.error(result.msg)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <li className="p-3 rounded-lg transition-all duration-200 group relative hover:bg-neutral-700 flex justify-between">
      <header className="flex items-start justify-between">
        <Link
          href={`/prompts/${prompt.id}`}
          prefetch
          className="flex-1 min-w-0"
          title={prompt.title}
        >
          <h3 className="font-medium text-sm text-white group-hover:text-accent-300 transition-colors">
            {prompt.title}
          </h3>
          <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
            {prompt.content}
          </p>
        </Link>
      </header>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            type="button"
            variant={'icon'}
            size={'icon'}
            title="Remover Prompt"
            aria-label="Remover Prompt"
          >
            <Trash className="size-3" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Prompt</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este prompt? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting && (
                <Loader2Icon className="mr-2 size-5 animate-spin" />
              )}
              Confirmar Remoção
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </li>
  )
}
