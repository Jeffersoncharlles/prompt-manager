import { getAllPrompts } from '@/app/actions/prompt.actions'
import { SidebarContent } from './sidebar/sidebar-content'

export const SidebarComponent = async () => {
  // const [promptsState, setPromptsState] = useActionState(getAllPrompts, {
  //   success: true,
  //   prompts: [],
  // })

  const promptsState = await getAllPrompts()

  return <SidebarContent prompts={promptsState.prompts} />
}

export default SidebarComponent
