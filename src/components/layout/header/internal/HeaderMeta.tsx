'use client'

import { AnimatePresence, motion } from 'framer-motion'

import { microReboundPreset } from '~/constants/spring'
import { useAggregationSelector } from '~/providers/root/aggregation-data-provider'

import { useHeaderMetaInfo, useHeaderMetaShouldShow } from './hooks'

const animationProps = {
  initial: {
    opacity: 0,
    y: 20,
  },
  exit: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,

    transition: {
      ...microReboundPreset,
    },
  },
}

export const HeaderMeta = () => {
  const show = useHeaderMetaShouldShow()
  const { description, title, slug } = useHeaderMetaInfo()
  const seoTitle = useAggregationSelector((state) => state.seo.title)

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="absolute inset-0 flex min-w-0 items-center justify-between px-0 lg:px-[4rem]"
          data-testid="header-meta"
          {...animationProps}
        >
          <div className="align-center flex min-w-0 flex-shrink flex-grow flex-col">
            <small className="min-w-0 truncate">
              <span className="text-gray-500">{description}</span>
            </small>
            <h2 className="min-w-0 truncate text-[1.2rem] font-medium leading-[1.5]">
              {title}
            </h2>
          </div>

          <div className="hidden min-w-0 flex-shrink-0 flex-col text-right leading-5 lg:flex">
            <span className="whitespace-pre text-base-content"> {slug}</span>
            <span className="font-medium text-gray-400 dark:text-gray-600">
              {seoTitle}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
