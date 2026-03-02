'use client'

import { ArrowLeftToLine, ArrowRightToLine, Plus, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { startTransition, useState } from 'react'

import Logo from '../logo/logo'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Sidebar } from '../ui/sidebar'

type Prompts = {
  id: string
  title: string
  content: string
}

export type SidebarContentProps = {
  prompts: Prompts[]
}

export const SidebarContent = ({ prompts }: SidebarContentProps) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [query, setQuery] = useState(searchParams.get('q') || '')

  const [isCollapsed, setIsCollapsed] = useState(false)

  const collapseSidebar = () => setIsCollapsed(true)

  const expandSidebar = () => {
    setIsCollapsed(false)
  }

  const handleNewPrompt = () => {
    router.push('/prompts/new')
  }

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value
    setQuery(newQuery)
    startTransition(() => {
      const url = newQuery ? `/?q=${encodeURIComponent(newQuery)}` : '/'

      router.push(url, { scroll: false })
    })
  }

  return (
    <Sidebar.Root data-collapsed={isCollapsed}>
      <Sidebar.Section aria-label="sidebar content" title="sidebar content">
        {/* menu Hamburg */}
        <Sidebar.Menu>
          <div className="flex items-center justify-between">
            <Button
              variant={'secondary'}
              aria-label="Fechar menu"
              title="Fechar menu"
            >
              <X className="size-5 text-neutral-100" />
            </Button>
          </div>
        </Sidebar.Menu>

        <div className="flex w-full items-center justify-between mb-6">
          {/* closed aside */}
          <Sidebar.Header>
            <Logo />
            <Button
              variant={'sidebar'}
              onClick={collapseSidebar}
              aria-label="Minimizar menu"
              title="Minimizar menu"
            >
              <ArrowLeftToLine className="size-5 text-neutral-100" />
            </Button>
          </Sidebar.Header>
        </div>
        <section className="mb-5">
          <form>
            <Input
              type="text"
              name="q"
              value={query}
              placeholder="Buscar prompts..."
              onChange={handleQueryChange}
              autoFocus
            />
          </form>
        </section>
        <div className="">
          <Button onClick={handleNewPrompt} className="w-full" size="lg">
            <Plus className="size-5 text-neutral-100 mr-2" />
            Novo Prompt
          </Button>
        </div>
      </Sidebar.Section>

      {/* expand aside */}
      <Sidebar.SectionExpand
        aria-label="expand side bar"
        title="expand side bar"
      >
        <Button
          variant={'sidebar'}
          aria-label="Expandir menu"
          title="Expandir menu"
          onClick={expandSidebar}
        >
          <ArrowRightToLine className="size-5 text-neutral-100" />
        </Button>
      </Sidebar.SectionExpand>

      {prompts.map((prompt) => (
        <div
          key={prompt.id}
          className="p-4 rounded-md hover:bg-neutral-700 cursor-pointer"
        >
          {prompt.title}
        </div>
      ))}
    </Sidebar.Root>
  )
}
