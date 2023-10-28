import React from 'react'
import type { FC, PropsWithChildren } from 'react'

import { springScrollToElement } from '~/lib/scroller'

import { Divider } from '../../divider'

export const MFootNote: FC<PropsWithChildren> = (props) => {
  return (
    <div className="children:my-2 children:leading-6 children:text-base mt-4">
      <Divider />
      {React.Children.map(props.children, (child, index) => {
        return (
          <div id={`fn:${index}`}>
            <p>{child}</p>
            <a
              href={`#fnref:${index}`}
              onClick={(e) => {
                e.preventDefault()
                springScrollToElement(
                  document.getElementById(`fnref:${index + 1}`)!,
                  -window.innerHeight / 2,
                )
              }}
            >
              ↩
            </a>
          </div>
        )
      })}
    </div>
  )
}
