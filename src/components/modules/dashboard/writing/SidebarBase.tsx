import { useId } from 'react'
import type { FC, PropsWithChildren } from 'react'

import { Label } from '~/components/ui/label'

export const SidebarWrapper = (props: PropsWithChildren) => {
  return (
    <div className="flex max-h-[calc(100vh-6rem)] flex-grow flex-col gap-8 overflow-auto px-2 pb-4 font-medium scrollbar-none lg:h-0 lg:max-h-[auto]">
      {props.children}
    </div>
  )
}

export const SidebarSection: FC<
  PropsWithChildren<{
    label: string
    className?: string
  }>
> = ({ label, children, className }) => {
  const id = useId()
  return (
    <section className="relative flex flex-col gap-6">
      <Label className="ml-1" htmlFor={id}>
        {label}
      </Label>
      <div className={className} id={id}>
        {children}
      </div>
    </section>
  )
}
