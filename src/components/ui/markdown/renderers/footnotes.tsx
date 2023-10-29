import React from 'react'
import type { FC, PropsWithChildren } from 'react'

import { springScrollToElement } from '~/lib/scroller'

import { Divider } from '../../divider'
import { getFootNoteDomId, getFootNoteRefDomId } from '../utils/get-id'
import { redHighlight } from '../utils/redHighlight'

export const MFootNote: FC<PropsWithChildren> = (props) => {
  return (
    <div className="children:my-2 children:leading-6 children:text-base mt-4">
      <Divider />
      {React.Children.map(props.children, (child, index) => {
        if (React.isValidElement(child)) {
          return (
            <div id={`${getFootNoteDomId(index + 1)}`}>
              <p className="inline">
                {React.cloneElement(child as React.ReactElement<any>, {
                  className: 'inline',
                })}
                <a
                  href={`#${getFootNoteRefDomId(index + 1)}`}
                  onClick={(e) => {
                    e.preventDefault()
                    springScrollToElement(
                      document.getElementById(
                        `${getFootNoteRefDomId(index + 1)}`,
                      )!,
                      -window.innerHeight / 2,
                    )
                    redHighlight(`${getFootNoteRefDomId(index + 1)}`)
                  }}
                  className="inline"
                >
                  ↩
                </a>
              </p>
            </div>
          )
        } else {
          return null // 或者其他处理方式
        }
      })}
    </div>
  )
}
