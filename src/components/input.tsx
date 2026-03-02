import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export const InputContent = ({ ...rest }) => {
  return (
    <input
      placeholder="Buscar prompts..."
      {...rest}
      className="group-data-[collapsed=true]:hidden w-full rounded-md border border-neutral-700 bg-transparent px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    />
  )
}

const InputRoot = ({ className, ...props }: ComponentProps<'div'>) => {
  return (
    <div
      className={twMerge(
        'group-data-[collapsed=true]:hidden',
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  )
}

export const Input = {
  Root: InputRoot,
  Content: InputContent,
}
