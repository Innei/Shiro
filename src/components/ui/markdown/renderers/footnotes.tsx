import React from 'react'
import type { FC, PropsWithChildren } from 'react'

import { KeyboardReturnRounded } from '~/components/icons/return'
import { springScrollToElement } from '~/lib/scroller'

import { Divider } from '../../divider'
import { getFootNoteDomId, getFootNoteRefDomId } from '../utils/get-id'
import { redHighlight } from '../utils/redHighlight'

export const MFootNote: FC<PropsWithChildren> = (props) => {
  return (
    <div className="children:my-2 children:leading-6 children:text-base mt-4">
      <Divider />
      {React.Children.map(props.children, (child) => {
        if (React.isValidElement(child)) {
          const id = child.props.id
          return (
            <div id={`${getFootNoteDomId(id)}`}>
              <div className="inline">
                {React.cloneElement(child as React.ReactElement, {
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
              </div>
            </div>
          )
        } else {
          return null // 或者其他处理方式
        }
      })}
    </div>
  )
}
