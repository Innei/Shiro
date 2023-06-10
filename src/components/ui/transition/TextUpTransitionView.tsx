'use client'

import { motion } from 'framer-motion'
import type { FC } from 'react'
import React from 'react'

import { microReboundPreset } from '~/constants/spring'

export const TextUpTransitionView: FC<
  {
    text?: string
    children?: string

    appear?: boolean

    eachDelay?: number
    initialDelay?: number
  } & JSX.IntrinsicElements['div']
> = (props) => {
  const {
    appear = true,
    eachDelay = 0.1,
    initialDelay = 0,
    children,
    text,
    ...rest
  } = props

  if (!appear) {
    // @ts-ignore
    return <div {...rest}>{text ?? children}</div>
  }
  return (
    <div {...rest}>
      {Array.from(text ?? (children as string)).map((char, i) => (
        <motion.span
          key={i}
          className="inline-block whitespace-pre"
          initial={{ transform: 'translateY(10px)', opacity: 0 }}
          animate={{
            transform: 'translateY(0px)',

            opacity: 1,
            transition: {
              ...microReboundPreset,
              duration: 0.1,
              delay: i * eachDelay + initialDelay,
            },
          }}
        >
          {char}
        </motion.span>
      ))}
    </div>
  )
}
