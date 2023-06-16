import React, { useState } from 'react'
import clsx from 'clsx'
import type { FC, ReactNode } from 'react'

import { IcRoundKeyboardDoubleArrowRight } from '~/components/icons/arrow'

import { Collapse } from '../../collapse'
import styles from './collapse.module.css'

export const MDetails: FC<{ children: ReactNode[] }> = (props) => {
  const [open, setOpen] = useState(false)

  const $head = props.children[0]

  return (
    <div className={styles.collapse}>
      <div
        className={styles.title}
        onClick={() => {
          setOpen((o) => !o)
        }}
      >
        <i
          className={clsx(
            'mr-2 transform transition-transform duration-500',
            open && 'rotate-90',
          )}
        >
          <IcRoundKeyboardDoubleArrowRight />
        </i>
        {$head}
      </div>
      <Collapse isOpened={open} className="my-2">
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
