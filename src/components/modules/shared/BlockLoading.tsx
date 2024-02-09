import { clsxm } from '~/lib/helper'

export const BlockLoading: Component = (props) => {
  return (
    <div
      className={clsxm(
        'flex h-[500px] items-center justify-center rounded-lg bg-slate-100 text-sm dark:bg-neutral-800',
        props.className,
      )}
    >
      {props.children}
    </div>
  )
}
