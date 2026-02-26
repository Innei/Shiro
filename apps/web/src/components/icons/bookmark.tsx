import type { SVGProps } from 'react'

export function RegularBookmark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 16 16" {...props}>
      <path
        fill="currentColor"
        d="M3.78 13.918a.5.5 0 0 1-.778-.416V4.01a2 2 0 0 1 1.996-2l6-.011a2 2 0 0 1 2.004 1.996v9.506a.5.5 0 0 1-.778.416l-4.222-2.82l-4.222 2.82ZM12.002 4l-.007-.118A1 1 0 0 0 11 3l-6 .01a1 1 0 0 0-.998 1v8.557l3.722-2.486a.5.5 0 0 1 .556 0l3.722 2.486V4Z"
      />
    </svg>
  )
}

export function SolidBookmark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 16 16" {...props}>
      <path
        fill="currentColor"
        d="M3.78 13.918a.5.5 0 0 1-.778-.416V4.01a2 2 0 0 1 1.996-2l6-.011a2 2 0 0 1 2.004 1.996v9.506a.5.5 0 0 1-.778.416l-4.222-2.82l-4.222 2.82Z"
      />
    </svg>
  )
}
