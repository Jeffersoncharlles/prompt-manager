import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

interface SidebarRootProps extends ComponentProps<'aside'> {}
const SidebarRoot = ({ className, ...props }: SidebarRootProps) => {
  return (
    <aside
      {...props}
      className={twMerge(
        'group',
        'flex flex-col h-full ease-in-out ',
        'border border-neutral-700 bg-neutral-800 ',
        //animacāo de colapsar e expandir
        'transition-[transform,width] duration-300 ease-[cubic-bezier(0.2,1,0.2,1)]',
        'data-[collapsed=true]:md:w-16 data-[collapsed=false]:md:w-[384px]',
        'fixed md:relative left-0 top-0 z-50 md:z-auto w-[80vw] sm:w-[320px]',
        className,
      )}
    />
  )
}

interface SidebarHeaderProps extends ComponentProps<'header'> {}
const SidebarHeader = ({ className, ...props }: SidebarHeaderProps) => {
  return (
    <header
      className={twMerge(
        'flex w-full items-center justify-between',
        // 2. Mantém a largura máxima para o Header não espremer
        'w-[80vw] sm:w-[320px] md:w-[384px]',
        className,
      )}
      {...props}
    />
  )
}

interface SidebarMenuProps extends ComponentProps<'div'> {}
const SidebarMenu = ({ className, ...props }: SidebarMenuProps) => {
  return (
    <div
      className={twMerge(
        'group-data-[collapsed=true]:hidden  md:hidden mb-4',
        // Transição de opacidade combinada com 'invisible' (para não ser clicável quando invisível)
        // 'group-data-[collapsed=true]:opacity-0 group-data-[collapsed=true]:invisible md:hidden',
        className,
      )}
      {...props}
    />
  )
}

interface SidebarSectionProps extends ComponentProps<'section'> {}
const SidebarSection = ({ className, ...props }: SidebarSectionProps) => {
  return (
    <section
      className={twMerge(
        'group-data-[collapsed=true]:hidden p-6',
        'transition-[opacity,visibility] duration-200 ease-in-out',
        // Faz um fade out rápido e elegante antes da sidebar terminar de encolher
        'group-data-[collapsed=true]:opacity-0 group-data-[collapsed=true]:invisible',
        className,
      )}
      {...props}
    />
  )
}

interface SidebarSectionExpandProps extends ComponentProps<'section'> {}
const SidebarSectionExpand = ({
  className,
  ...props
}: SidebarSectionExpandProps) => {
  return (
    <section
      className={twMerge(
        'hidden md:flex h-full items-start justify-center p-3 group-data-[collapsed=false]:hidden',
        'group-data-[collapsed=true]:flex group-data-[collapsed=true]:justify-start group-data-[collapsed=true]:flex-col',
        'group-data-[collapsed=true]:space-y-4 group-data-[collapsed=true]:items-center',
        'transition-[transform,width] duration-300 delay-100 ease-in-out',
        // Esse ícone só aparece (fade in) quando a sidebar ESTÁ colapsada
        'group-data-[collapsed=false]:opacity-0 group-data-[collapsed=false]:invisible',
        className,
      )}
      {...props}
    />
  )
}
interface SidebarSectionNavProps extends ComponentProps<'nav'> {}
const SidebarSectionNav = ({ className, ...props }: SidebarSectionNavProps) => {
  return (
    <nav
      className={twMerge(
        'group-data-[collapsed=true]:hidden group-data-[collapsed=false]:block',
        'flex-1 overflow-auto px-6 pb-6',
        className,
      )}
      {...props}
    />
  )
}

export const Sidebar = {
  Root: SidebarRoot,
  Header: SidebarHeader,
  Menu: SidebarMenu,
  Section: SidebarSection,
  SectionExpand: SidebarSectionExpand,
  SectionNav: SidebarSectionNav,
}
