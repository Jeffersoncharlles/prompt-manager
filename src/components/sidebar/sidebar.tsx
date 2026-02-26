import { Section } from 'lucide-react'
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
        'border border-neutral-700 bg-neutral-800 transition-[transform,width] duration-300',
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
      className={twMerge('flex w-full items-center justify-between', className)}
      {...props}
    />
  )
}

interface SidebarMenuProps extends ComponentProps<'div'> {}
const SidebarMenu = ({ className, ...props }: SidebarMenuProps) => {
  return <div className={twMerge('md:hidden mb-4', className)} {...props} />
}

interface SidebarSectionProps extends ComponentProps<'section'> {}
const SidebarSection = ({ className, ...props }: SidebarSectionProps) => {
  return (
    <section
      className={twMerge('group-data-[collapsed=true]:hidden p-6', className)}
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
        'transition-[transform,width] duration-300',
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
}
