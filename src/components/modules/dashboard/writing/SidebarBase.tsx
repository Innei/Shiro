import type { PropsWithChildren } from 'react'

export const SidebarWrapper = (props: PropsWithChildren) => {
  return (
    <div className="text-tiny lg:max-h-auto flex max-h-[calc(100vh-6rem)] flex-grow flex-col gap-8 overflow-auto pb-4 font-medium scrollbar-none lg:h-0">
      {props.children}
    </div>
  )
}
