import type { SVGProps } from 'react'

export function GgCoffee(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M6 2.5a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0v-2a1 1 0 0 0-1-1Z" />
        <path
          fillRule="evenodd"
          d="M13 21.5a6.002 6.002 0 0 0 5.917-5H19a4 4 0 0 0 0-8v-1H1v8a6 6 0 0 0 6 6h6ZM3 9.5v6a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4v-6H3Zm18 3a2 2 0 0 1-2 2v-4a2 2 0 0 1 2 2Z"
          clipRule="evenodd"
        />
        <path d="M9 3.5a1 1 0 1 1 2 0v2a1 1 0 1 1-2 0v-2Zm5-1a1 1 0 0 0-1 1v2a1 1 0 1 0 2 0v-2a1 1 0 0 0-1-1Z" />
      </g>
    </svg>
  )
}
