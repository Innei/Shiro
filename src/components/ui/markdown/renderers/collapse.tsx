import React, { useCallback, useState } from 'react'
import clsx from 'clsx'
import type { FC, ReactNode } from 'react'

import { IcRoundKeyboardDoubleArrowRight } from '~/components/icons/arrow'

import { Collapse } from '../../collapse'

export const MDetails: FC<{ children: ReactNode[] }> = (props) => {
  const [open, setOpen] = useState(false)

  const $head = props.children[0]

  const handleOpen = useCallback(() => {
    setOpen((o) => !o)
  }, [])
  return (
    <div className="my-2">
      <button
        className="mb-2 flex cursor-pointer items-center pl-2"
        onClick={handleOpen}
      >
        <i
          className={clsx(
            'icon-[mingcute--align-arrow-down-line] mr-2 transform transition-transform duration-500',
            !open && '-rotate-90',
          )}
        >
          <IcRoundKeyboardDoubleArrowRight />
        </i>
        {$head}
      </button>
      <Collapse withBackground isOpened={open} className="my-2">
        <div
          className={clsx(
            open ? 'opacity-100' : 'opacity-0',
            'transition-opacity duration-500',
          )}
        >
          {props.children.slice(1)}
        </div>
      </Collapse>
    </div>
  )
}
