import { getPrompts } from '@/http/get-promps'
import { SidebarContent } from './sidebar/sidebar-content'

export const SidebarComponent = async () => {
  const prompts = await getPrompts()

  return <SidebarContent />
}

export default SidebarComponent
