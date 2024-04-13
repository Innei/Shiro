'use client'

import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import clsx from 'clsx'
import { m } from 'framer-motion'

import { ScrollArea } from '~/components/ui/scroll-area'
import { softBouncePreset } from '~/constants/spring'
import { apiClient } from '~/lib/request'

import { ActivityCard, iconClassName } from './ActivityCard'
import { InViewScreen } from './Screen'

export const ActivityRecent = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['home-activity-recent'],
    queryFn: async () => {
      return (await apiClient.activity.getRecentActivities()).$serialized
    },
    refetchOnMount: true,
    meta: {
      persist: true,
    },
  })

  const flatData = useMemo(() => {
    return [...Object.entries(data || {})]
      .map(([type, items]) => {
        if (!Array.isArray(items)) return []
        return items.map((item: any) => {
          return { ...item, bizType: type }
        })
      })
      .flat()
      .sort((a, b) => {
        return new Date(b.created).getTime() - new Date(a.created).getTime()
      })
    // .slice(0, 6) as ReactActivityType[]
  }, [data])

  return (
    <InViewScreen>
      <m.div
        initial={{ opacity: 0.0001, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={softBouncePreset}
        className="mt-8 text-lg lg:mt-0"
      >
        <m.h2 className="mb-8 ml-14 text-2xl font-medium leading-loose">
          最近发生的事
        </m.h2>

        {isLoading ? (
          <div className="relative h-[400px] max-h-[80vh]">
            <ul className="shiro-timeline mt-4 flex animate-pulse flex-col pb-4 pl-2 text-slate-200 dark:!text-neutral-700">
              {new Array(4).fill(null).map((_, i) => {
                return (
                  <li key={i} className="flex w-full items-center gap-2">
                    <div
                      className={clsx(
                        iconClassName,
                        'border-0 bg-current text-inherit',
                      )}
                    />

                    <div className="mb-4 box-content h-16 w-full rounded-md bg-current" />
                  </li>
                )
              })}
            </ul>
          </div>
        ) : (
          <ScrollArea.ScrollArea rootClassName="h-[400px] relative max-h-[80vh]">
            <ul className="shiro-timeline mt-4 flex flex-col pb-8 pl-2">
              {flatData.map((activity) => {
                return (
                  <li
                    key={activity.id}
                    className="flex min-w-0 justify-between"
                  >
                    <ActivityCard activity={activity} />
                  </li>
                )
              })}
            </ul>
          </ScrollArea.ScrollArea>
        )}
      </m.div>
    </InViewScreen>
  )
}
