import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

interface SidebarRootProps extends ComponentProps<'aside'> {}
const SidebarRoot = ({ className, ...props }: SidebarRootProps) => {
  return (
    <aside
      {...props}
      className={twMerge(
        'group flex flex-col h-full bg-neutral-800 border-r border-neutral-700 ',
        'transition-[width,transform] duration-300 ease-in-out',
        // MOBILE (Base): Fixo e escondido
        'fixed inset-y-0 left-0 z-50 w-[80vw] sm:w-[320px]',
        'data-[mobile-open=false]:-translate-x-full data-[mobile-open=true]:translate-x-0',
        // DESKTOP (MD):
        'md:!relative md:!inset-auto md:!translate-x-0 md:!z-0 md:flex-shrink-0',
        // LARGURA DESKTOP
        'data-[collapsed=true]:md:w-16 data-[collapsed=false]:md:w-[384px]',
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
        'flex items-center justify-between w-full px-6 py-4',
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
        'mb-4 md:hidden block', // block força ele a existir no mobile
        'group-data-[mobile-open=false]:hidden', // Só some se a sidebar fechar
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
