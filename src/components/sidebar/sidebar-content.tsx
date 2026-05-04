'use client'

import { ArrowLeftToLine, ArrowRightToLine, Menu, Plus, X } from 'lucide-react'
import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { useQueryState } from 'nuqs'
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from 'react'
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
  const router = useRouter()
  const [query, setQuery] = useQueryState('q', {
    defaultValue: '',
  })
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const formRef = useRef<HTMLFormElement | null>(null)
  const initialMotion = { opacity: 0 }
  const fadeTransition = { duration: 0.3, delay: 0.1 }

  const [searchFormState, setSearchFormState, isPending] = useActionState(
    searchPromptAction,
    {
      success: true,
      prompts,
    },
  )

  const hasQuery = query.trim().length > 0
  const promptList = hasQuery ? (searchFormState.prompts ?? prompts) : prompts

  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleNewPrompt = () => {
    router.push('/prompts/new')
  }

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value
    setQuery(newQuery)
    startTransition(() => {
      formRef.current?.requestSubmit() //for digitando submit
    })
  }

  useEffect(() => {
    if (!hasQuery) {
      return
    }

    formRef.current?.requestSubmit()
  }, [hasQuery])

  return (
    <>
      <Button
        title="Abrir Menu"
        aria-label="Abrir Menu"
        variant={'secondary'}
        className="fixed top-6 left-6 z-40 md:!hidden inline-flex"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu className="size-5 text-neutral-100" />
      </Button>

      <Sidebar.Root
        initial={false}
        data-collapsed={isCollapsed}
        data-mobile-open={isMobileOpen}
      >
        <Sidebar.Section aria-label="sidebar content" title="sidebar content">
          {/* menu Hamburg */}
          <Sidebar.Menu>
            <div className="flex items-center justify-between">
              <Button
                variant={'secondary'}
                aria-label="Fechar menu"
                title="Fechar menu"
                onClick={() => setIsMobileOpen(false)}
                className="md:hidden"
              >
                <X className="size-5 text-neutral-100" />
              </Button>
            </div>
          </Sidebar.Menu>

          <motion.div
            className="flex w-full items-center justify-between mb-6"
            initial={initialMotion}
            animate={{ opacity: 1 }}
            transition={fadeTransition}
          >
            {/* closed aside */}
            <Sidebar.Header>
              <Logo />
              <Button
                variant={'sidebar'}
                onClick={() => setIsCollapsed(!isCollapsed)}
                aria-label="Minimizar menu"
                title="Minimizar menu"
              >
                <ArrowLeftToLine className="size-5 text-neutral-100" />
              </Button>
            </Sidebar.Header>
          </motion.div>
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
            <motion.div
              initial={initialMotion}
              animate={{ opacity: 1 }}
              transition={fadeTransition}
              exit={{ opacity: 0 }}
            >
              <Button onClick={handleNewPrompt} className="w-full" size="lg">
                <Plus className="size-5 text-neutral-100 mr-2" />
                Novo Prompt
              </Button>
            </motion.div>
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
            onClick={() => setIsCollapsed(false)}
          >
            <ArrowRightToLine className="size-5 text-neutral-100" />
          </Button>
          {isCollapsed && (
            <motion.div
              initial={initialMotion}
              animate={{ opacity: 1 }}
              transition={fadeTransition}
              className="flex items-center"
            >
              <Button
                onClick={handleNewPrompt}
                title="Novo Prompt"
                aria-label="Novo prompt"
                className="cursor-pointer"
              >
                <Plus className="size-5 text-neutral-100 " />
              </Button>
            </motion.div>
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
    </>
  )
}
