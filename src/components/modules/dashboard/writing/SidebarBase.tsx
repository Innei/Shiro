import { useId } from 'react'
import { clsx } from 'clsx'
import type { FC, PropsWithChildren } from 'react'

import { Label } from '~/components/ui/label'
import { useMaskScrollArea } from '~/hooks/shared/use-mask-scrollarea'

export const SidebarWrapper = (props: PropsWithChildren) => {
  const [ref, className] = useMaskScrollArea<HTMLDivElement>()
  return (
    <div
      ref={ref}
      className={clsx(
        'flex max-h-[calc(100vh-6rem)] grow flex-col gap-8 overflow-auto px-2 pb-4 font-medium scrollbar-none lg:h-0 lg:max-h-[auto]',

        className,
      )}
    >
      {props.children}
    </div>
  )
}

export const SidebarSection: FC<
  PropsWithChildren<{
    label: string
    className?: string

    actions?: React.ReactNode[] | React.ReactNode
  }>
> = ({ label, children, className, actions }) => {
  const id = useId()
  return (
    <section className="relative flex flex-col gap-4">
      <div className="relative ml-1 flex items-center justify-between">
        <Label htmlFor={id} className="flex-1 shrink-0">
          {label}
        </Label>
        {!!actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className={className} id={id}>
        {children}
      </div>
    </section>
  )
}
