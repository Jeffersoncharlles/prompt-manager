import { useCallback, useEffect, useRef, useState } from 'react'

type UseCopyToClipboardOptions = {
  onSuccess?: (text: string) => void
  onError?: (error: Error) => void
  resetDelay?: number
}

export function useCopyToClipboard(options?: UseCopyToClipboardOptions) {
  const [isCopied, setIsCopied] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const optionsRef = useRef(options)

  useEffect(() => {
    optionsRef.current = options
  }, [options])

  const { resetDelay = 2000 } = options || {}

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const copyToClipboard = useCallback(
    async (text: string) => {
      const trimmedText = text.trim()

      if (!trimmedText) {
        return
      }

      try {
        await navigator.clipboard.writeText(trimmedText)
        setIsCopied(true)

        clearTimer()
        timerRef.current = setTimeout(() => {
          setIsCopied(false)
        }, resetDelay)

        optionsRef.current?.onSuccess?.(trimmedText)
      } catch (error) {
        optionsRef.current?.onError?.(error as Error)
      }
    },
    [clearTimer, resetDelay],
  )

  useEffect(() => {
    return () => {
      clearTimer()
    }
  }, [clearTimer])

  return { isCopied, copyToClipboard }
}
