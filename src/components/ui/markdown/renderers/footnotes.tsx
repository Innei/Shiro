import React from 'react'
import type { FC, PropsWithChildren } from 'react'

import { springScrollToElement } from '~/lib/scroller'

import { Divider } from '../../divider'
import { redHighlight } from '../utils/redHighlight'

export const MFootNote: FC<PropsWithChildren> = (props) => {
  return (
    <div className="children:my-2 children:leading-6 children:text-base mt-4">
      <Divider />
      {React.Children.map(props.children, (child, index) => {
        if (React.isValidElement(child)) {
          return (
            <div id={`fn:${index + 1}`}>
              <p className="inline">
                {React.cloneElement(child as React.ReactElement<any>, {
                  style: { display: 'inline' }, // 设置 child 的 display 样式
                })}
                <a
                  href={`#fnref:${index + 1}`}
                  onClick={(e) => {
                    e.preventDefault()
                    springScrollToElement(
                      document.getElementById(`fnref:${index + 1}`)!,
                      -window.innerHeight / 2,
                    )
                    redHighlight(`fnref:${index + 1}`)
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
