import React from 'react'

import { TocAside } from '../toc'
import { ReadIndicator } from './ReadIndicator'

export const ArticleRightAside: Component = ({ children }) => {
  return (
    <aside className="sticky top-2 h-[calc(100vh-6rem-4.5rem-150px)]">
      <TocAside
        as="div"
        className="top-[120px] ml-4"
        treeClassName="absolute h-full min-h-[120px]"
        accessory={ReadIndicator}
      />
      {React.cloneElement(children as any, {
        className: 'ml-4 translate-y-full',
      })}
    </aside>
  )
}
