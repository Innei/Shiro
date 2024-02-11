import { clsxm } from '~/lib/helper'

export const BlockLoading: Component<{
  style?: React.CSSProperties
}> = (props) => {
  return (
    <div
      className={clsxm(
        'flex h-[500px] items-center justify-center rounded-lg bg-slate-100 text-sm dark:bg-neutral-800',
        props.className,
      )}
      style={props.style}
    >
      {props.children}
    </div>
  )
}
