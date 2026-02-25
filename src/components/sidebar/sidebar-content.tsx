'use client'

import { ArrowLeftToLine, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Sidebar } from './sidebar'

export const SidebarContent = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const collapseSidebar = () => setIsCollapsed(true)

  const expandSidebar = () => {
    setIsCollapsed(false)
  }

  return (
    <Sidebar.Root data-collapsed={isCollapsed}>
      {!isCollapsed && (
        <section className="p-6">
          <Sidebar.Menu className="">
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
            <Sidebar.Header>
              Prompt manager
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
            <Button>
              <Plus className="size-5 text-neutral-100 mr-2" />
              Novo Prompt
            </Button>
          </div>
        </section>
      )}
    </Sidebar.Root>
  )
}
