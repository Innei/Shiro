'use client'

import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'

import { useViewport } from '~/atoms/hooks'
import { FloatPopover } from '~/components/ui/float-popover'
import { apiClient } from '~/lib/request'
import { routeBuilder, Routes } from '~/lib/route-builder'

type Post = {
  id: string
  created: string // ISO datetime string
  title: string
}

type DataByDate<T> = {
  month: string[]
  data: Array<Array<T[] | null>>
}

function organizePostsByDate<T extends Post>(posts: T[]): DataByDate<T> {
  const postsByDate: Array<Array<T[] | null>> = []
  const monthLabels: string[] = []

  // Determine the current month
  const currentMonth = new Date()
  currentMonth.setDate(1) // Set to the first of the month to avoid month overflow issues
  currentMonth.setHours(0, 0, 0, 0) // Normalize the time to midnight

  // Initialize months and data arrays for the last 12 months including the current month
  for (let i = 0; i < 12; i++) {
    const month = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - (11 - i),
      1,
    )
    monthLabels.push(`${month.getFullYear()}.${month.getMonth() + 1}`)
    const daysInMonth = new Date(
      month.getFullYear(),
      month.getMonth() + 1,
      0,
    ).getDate()
    postsByDate.push(Array(daysInMonth).fill(null))
  }

  // Group posts by day
  posts.forEach((post) => {
    const postDate = new Date(post.created)
    const monthIndex = monthLabels.indexOf(
      `${postDate.getFullYear()}.${postDate.getMonth() + 1}`,
    )
    const day = postDate.getDate() - 1 // Arrays are zero-indexed, days are 1-indexed

    if (monthIndex !== -1) {
      if (!postsByDate[monthIndex][day]) {
        postsByDate[monthIndex][day] = []
      }
      postsByDate[monthIndex]?.[day]?.push(post)
    }
  })

  // Convert days with null only to empty arrays
  postsByDate.forEach((month, idx) => {
    month.forEach((day, jdx) => {
      if (!day) {
        postsByDate[idx][jdx] = []
      }
    })
  })

  return { month: monthLabels, data: postsByDate }
}

function PhDotBold() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      className="text-accent"
    >
      <path
        fill="currentColor"
        d="M144 128a16 16 0 1 1-16-16a16 16 0 0 1 16 16"
      />
    </svg>
  )
}

export const HomePageTimeLine = () => {
  const { data: yearData } = useQuery({
    queryKey: ['home-timeline'],
    queryFn: async () => {
      return apiClient.activity.getLastYearPublication()
    },
  })
  const { data, month } = useMemo(
    () =>
      organizePostsByDate([
        ...(yearData?.posts || []),
        ...(yearData?.notes || []),
      ]),
    [yearData?.notes, yearData?.posts],
  )
  const scrollRef = useRef<HTMLDivElement>(null)

  const w = useViewport((v) => v.w)
  useEffect(() => {
    // scroll to end
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth
    }
  }, [w])
  // 我构想的动画是，首先 Line 从左到右 width 0 -> full, 然后每个月的点的一个一个出现

  return (
    <div className="mt-24 w-full">
      <div className="my-5 whitespace-pre-line text-balance text-center text-2xl font-medium">
        热力图的千篇一律，{'\n'}所以我做成了时间线
      </div>
      <div
        className="scrollbar-none m-auto my-12 w-full overflow-auto"
        ref={scrollRef}
      >
        <div className="relative mx-auto flex h-[200px] min-w-[900px] max-w-[1800px] items-end px-6 pb-12 lg:px-12 xl:px-16 2xl:px-36">
          <span className="mr-1 flex translate-y-[6px] select-none items-center -space-x-2 font-medium text-accent">
            <PhDotBold />
            <PhDotBold />
            <PhDotBold />
          </span>
          {/* Line */}
          <div className="relative flex h-px w-full justify-center rounded-md bg-accent">
            <div className="relative w-[calc(100%-1%-30px)]">
              {month.map((label, idx) => {
                const timelineWidthPercent = 99
                const monthLeftPosition =
                  (idx / month.length) * timelineWidthPercent + 2

                const thisMonthTotalPost = data[idx].reduce(
                  (acc, cur) => acc + (cur?.length || 0),
                  0,
                )

                return (
                  <div
                    key={label}
                    className="absolute h-[2px]"
                    style={{
                      left: `${monthLeftPosition}%`,
                      width: `${timelineWidthPercent / month.length}%`,
                    }}
                  >
                    {data[idx].length > 0 &&
                      data[idx].map((items) => {
                        return items?.map((item, index) => {
                          const created = new Date(item.created)
                          const dateInThisMonth = created.getDate()
                          const thisMonthTotalDays = new Date(
                            created.getFullYear(),
                            created.getMonth() + 1,
                            0,
                          ).getDate()

                          const leftPercentage =
                            (dateInThisMonth / thisMonthTotalDays) * 90 + 10

                          return (
                            <FloatPopover
                              mobileAsSheet
                              type="tooltip"
                              key={item.id}
                              asChild
                              placement="bottom"
                              triggerElement={
                                <div
                                  className="absolute top-1/2 -translate-x-1/2 -translate-y-full"
                                  style={{
                                    left: `${leftPercentage}%`,
                                    transform: `translateY(calc(-100% + ${-1 * index * 13}px - ${3 * index}px))`,
                                  }}
                                >
                                  <div className="h-4 w-[2px] rounded-full bg-accent" />
                                </div>
                              }
                            >
                              <Link
                                className="shiro-link--underline"
                                href={
                                  'nid' in item
                                    ? routeBuilder(Routes.Note, {
                                        id: item.nid,
                                      })
                                    : routeBuilder(Routes.Post, {
                                        category: item.category.slug,
                                        slug: item.slug,
                                      })
                                }
                              >
                                {item.title} - {created.toLocaleDateString()}
                              </Link>
                            </FloatPopover>
                          )
                        })
                      })}
                    <div className="absolute left-0 top-1/2 size-[8px] -translate-y-1/2 rounded-full bg-accent">
                      <FloatPopover
                        type="tooltip"
                        mobileAsSheet
                        placement="bottom"
                        triggerElement={
                          <div
                            className="absolute top-[2px] w-[3px] -translate-y-full translate-x-full rounded-md bg-accent"
                            style={{
                              height: `${Math.min(thisMonthTotalPost * 12, 250)}px`,
                            }}
                          />
                        }
                        asChild
                      >
                        本月发布了 {thisMonthTotalPost} 篇，再接再厉
                      </FloatPopover>

                      <span className="pointer-events-none mt-0 inline-block -translate-x-1/2 lg:mt-4">
                        {label}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
