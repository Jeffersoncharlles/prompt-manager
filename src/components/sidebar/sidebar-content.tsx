'use client'

import { ArrowLeftToLine, ArrowRightToLine, Plus, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Logo from '../logo/logo'
import { Button } from '../ui/button'
import { Sidebar } from './sidebar'

export const SidebarContent = () => {
  const router = useRouter()

  const [isCollapsed, setIsCollapsed] = useState(false)

  const collapseSidebar = () => setIsCollapsed(true)

  const expandSidebar = () => {
    setIsCollapsed(false)
  }

  const handleNewPrompt = () => {
    router.push('/prompts/new')
  }

  return (
    <Sidebar.Root data-collapsed={isCollapsed}>
      <Sidebar.Section aria-label="sidebar content" title="sidebar content">
        <Sidebar.Menu className="">
          <div className="flex items-center justify-between">
            <Button
              variant={'secondary'}
              aria-label="Fechar menu"
              title="Fechar menu"
              onClick={collapseSidebar}
            >
              <X className="size-5 text-neutral-100" />
            </Button>
          </div>
        </Sidebar.Menu>

        <div className="flex w-full items-center justify-between mb-6">
          <Sidebar.Header>
            <Logo />
            <Button
              variant={'icon'}
              onClick={collapseSidebar}
              className="cursor-pointer hidden md:inline-flex p-2 hover:bg-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded-lg transition-colors"
            >
              <ArrowLeftToLine className="size-5 text-neutral-100" />
            </Button>
          </Sidebar.Header>
        </div>

        <div className="">
          <Button onClick={handleNewPrompt} className="w-full" size="lg">
            <Plus className="size-5 text-neutral-100 mr-2" />
            Novo Prompt
          </Button>
        </div>
      </Sidebar.Section>

      <Sidebar.SectionExpand
        aria-label="expand side bar"
        title="expand side bar"
      >
        <Button
          variant={'icon'}
          aria-label="Expandir menu"
          title="Expandir menu"
          onClick={expandSidebar}
          className="p-2 hover:bg-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded-lg transition-colors"
        >
          <ArrowRightToLine className="size-5 text-neutral-100" />
        </Button>
      </Sidebar.SectionExpand>
    </Sidebar.Root>
  )
}
