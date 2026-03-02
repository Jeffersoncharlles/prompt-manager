'use client'

import { ArrowLeftToLine, ArrowRightToLine, Plus, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { startTransition, useActionState, useRef, useState } from 'react'
import { searchPromptAction } from '@/app/actions/prompt.actions'
import type { PromptSummary } from '@/core/domain/prompts/prompt.entity'
import Logo from '../logo/logo'
import { PromptList } from '../prompts/prompt-list'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Sidebar } from '../ui/sidebar'
import { Spinner } from '../ui/spinner'

export type SidebarContentProps = {
  prompts: PromptSummary[]
}

export const SidebarContent = ({ prompts }: SidebarContentProps) => {
  const formRef = useRef<HTMLFormElement | null>(null)
  const searchParams = useSearchParams()
  const [searchFormState, setSearchFormState, isPending] = useActionState(
    searchPromptAction,
    {
      success: true,
      prompts,
    },
  )
  const router = useRouter()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const hasQuery = query.trim().length > 0
  const promptList = hasQuery ? (searchFormState.prompts ?? prompts) : prompts

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
      formRef.current?.requestSubmit() //for digitando submit
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
        <section className="mb-5 ">
          <form
            ref={formRef}
            action={setSearchFormState}
            className="relative group w-full"
          >
            <Input
              type="text"
              name="q"
              value={query}
              placeholder="Buscar prompts..."
              onChange={handleQueryChange}
              autoFocus
            />
            {isPending && (
              <div
                title="carregando prompts"
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2"
              >
                <Spinner />
                {/* <span className="text-sm text-neutral-500">Buscando...</span> */}
              </div>
            )}
          </form>
        </section>
        {!isCollapsed && (
          <div>
            <Button onClick={handleNewPrompt} className="w-full" size="lg">
              <Plus className="size-5 text-neutral-100 mr-2" />
              Novo Prompt
            </Button>
          </div>
        )}
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
        {isCollapsed && (
          <div className="group-data-[collapsed=true]:block group-data-[collapsed=false]:hidden flex items-center ">
            <Button
              onClick={handleNewPrompt}
              title="Novo Prompt"
              aria-label="Novo prompt"
              className="cursor-pointer"
            >
              <Plus className="size-5 text-neutral-100 " />
            </Button>
          </div>
        )}
      </Sidebar.SectionExpand>

      {!isCollapsed && (
        <Sidebar.SectionNav
          aria-label="Lista de prompts"
          title="Lista de prompts"
        >
          <PromptList prompts={promptList} />
        </Sidebar.SectionNav>
      )}
    </Sidebar.Root>
  )
}
