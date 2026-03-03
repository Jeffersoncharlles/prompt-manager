import { Suspense } from 'react'
import { getAllPrompts } from '@/app/actions/prompt.actions'
import { SidebarContent } from './sidebar/sidebar-content'
import { Spinner } from './ui/spinner'

export const SidebarComponent = async () => {
  const promptsState = await getAllPrompts()

  return (
    <Suspense fallback={<Spinner className="size-6" />}>
      <SidebarContent prompts={promptsState.prompts} />
    </Suspense>
  )
}

export default SidebarComponent
