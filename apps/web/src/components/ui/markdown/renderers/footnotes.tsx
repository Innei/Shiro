import type { FC, PropsWithChildren } from 'react'
import * as React from 'react'

import { KeyboardReturnRounded } from '~/components/icons/return'
import { springScrollToElement } from '~/lib/scroller'

import { Divider } from '../../divider'
import { getFootNoteDomId, getFootNoteRefDomId } from '../utils/get-id'
import { redHighlight } from '../utils/redHighlight'

export const MFootNote: FC<PropsWithChildren> = (props) => (
  <div id="md-footnote" className="mt-4">
    <Divider />
    <ul className="list-[upper-roman] space-y-3 text-base text-zinc-600 dark:text-neutral-400">
      {React.Children.map(props.children, (child) => {
        if (React.isValidElement(child)) {
          const { id } = child.props as any as { id: string }
          return (
            <li id={`${getFootNoteDomId(id)}`} key={id}>
              {React.cloneElement(child as React.ReactElement<any>, {
                className: 'inline',
              })}
              <a
                href={`#${getFootNoteRefDomId(id)}`}
                onClick={(e) => {
                  e.preventDefault()
                  springScrollToElement(
                    document.getElementById(`${getFootNoteRefDomId(id)}`)!,
                    -window.innerHeight / 2,
                  )
                  redHighlight(`${getFootNoteRefDomId(id)}`)
                }}
                className="ml-2 inline-flex items-center"
              >
                <KeyboardReturnRounded />
                <span className="sr-only">
                  返回
                  {id}
                </span>
              </a>
            </li>
          )
        } else {
          return null // 或者其他处理方式
        }
      })}
    </ul>
  </div>
)
