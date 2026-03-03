'use client'

import { Check, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { Button } from '../ui/button'

type CopyButtonProps = {
  content: string
}

export const CopyButton = ({ content }: CopyButtonProps) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard({
    onSuccess: () => toast.success('Content copied to clipboard!'),
    onError: (error) => toast.error(`Failed to copy: ${error.message}`),
  })

  const isContentEmpty = !content.trim()

  const handleCopy = () => {
    copyToClipboard(content)
  }

  return (
    <Button
      className="disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      variant={'outline'}
      type="button"
      size={'sm'}
      onClick={handleCopy}
      disabled={isContentEmpty}
    >
      {isCopied ? (
        <Check className="size-4 text-green-400" />
      ) : (
        <Copy className="size-4" />
      )}
      <span>{isCopied ? 'Copiado' : 'Copiar'}</span>
    </Button>
  )
}
