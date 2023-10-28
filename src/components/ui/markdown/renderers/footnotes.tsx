import React from 'react'
import type { FC, PropsWithChildren } from 'react'

import { springScrollToElement } from '~/lib/scroller'

import { Divider } from '../../divider'

export const MFootNote: FC<PropsWithChildren> = (props) => {
  return (
    <div className="children:my-2 children:leading-6 children:text-base mt-4">
      <Divider />
      {React.Children.map(props.children, (child, index) => {
        if (React.isValidElement(child)) {
          return (
            <div id={`fn:${index + 1}`}>
              <p style={{ display: 'inline' }}>
                {React.cloneElement(child as React.ReactElement<any>, {
                  style: { display: 'inline' }, // 设置child的display样式
                })}
                <a
                  href={`#fnref:${index + 1}`}
                  onClick={(e) => {
                    e.preventDefault()
                    springScrollToElement(
                      document.getElementById(`fnref:${index + 1}`)!,
                      -window.innerHeight / 2,
                    )
                    red_highlight(`fnref:${index + 1}`)
                  }}
                  style={{ display: 'inline' }}
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

export function red_highlight(id: string) {
  const fnRefElement = document.getElementById(id)
  if (fnRefElement) {
    fnRefElement.style.color = 'red'
    setTimeout(() => {
      fnRefElement.style.color = ''
    }, 5000)
  } else {
    console.log(`Element with id fnref:${id} not found.`)
  }
}