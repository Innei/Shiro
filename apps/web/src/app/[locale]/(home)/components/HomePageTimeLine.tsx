'use client'

import { useQuery } from '@tanstack/react-query'
import { m } from 'motion/react'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'

import { useViewport } from '~/atoms/hooks/viewport'
import { FloatPopover } from '~/components/ui/float-popover'
import { Spring } from '~/constants/spring'
import { Link } from '~/i18n/navigation'
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
    postsByDate.push(new Array(daysInMonth).fill(null))
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
  const t = useTranslations('home')
  const { data: yearData } = useQuery({
    queryKey: ['home-timeline'],
    queryFn: async () => apiClient.activity.getLastYearPublication(),
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
  const [animationStarted, setAnimationStarted] = useState(false)

  // Add InView detection
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const w = useViewport((v) => v.w)
  useEffect(() => {
    // scroll to end
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth
    }
  }, [w])

  useEffect(() => {
    // Start animation when data is loaded AND component is in view
    if (yearData && inView && !animationStarted) {
      setAnimationStarted(true)
    }
  }, [yearData, inView, animationStarted])

  return (
    <div className="mt-24 w-full" ref={inViewRef}>
      <m.div
        className="my-5 whitespace-pre-line text-balance text-center text-2xl font-medium"
        initial={{ opacity: 0, y: 10 }}
        transition={Spring.presets.snappy}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {t('timeline_title')}
      </m.div>
      <div
        className="scrollbar-none m-auto my-12 w-full overflow-x-auto overflow-y-hidden"
        ref={scrollRef}
      >
        <div
          className={`relative mx-auto flex h-[200px] min-w-[900px] max-w-[1800px] items-end px-6 pb-12 lg:px-12 xl:px-16 2xl:px-36 ${
            animationStarted ? 'timeline-reveal' : 'timeline-hidden'
          }`}
        >
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
                      data[idx].map((items, dayIdx) =>
                        items?.map((item, index) => {
                          const created = new Date(item.created)
                          const dateInThisMonth = created.getDate()
                          const thisMonthTotalDays = new Date(
                            created.getFullYear(),
                            created.getMonth() + 1,
                            0,
                          ).getDate()

                          const leftPercentage =
                            (dateInThisMonth / thisMonthTotalDays) * 90 + 10

                          // Calculate delay for staggered animation
                          const animationDelay =
                            3 + (idx * 12 + dayIdx + index) * 0.02

                          return (
                            <m.div
                              key={item.id}
                              className="absolute"
                              style={{
                                left: `${leftPercentage}%`,
                              }}
                              initial={{
                                y: -100,
                                opacity: 0,
                              }}
                              animate={{
                                y: 0,
                                opacity: 1,
                              }}
                              transition={{
                                delay: animationDelay,
                                duration: 0.6,
                                ease: 'easeOut',
                                type: 'spring',
                                stiffness: 100,
                                damping: 15,
                              }}
                            >
                              <FloatPopover
                                mobileAsSheet
                                type="tooltip"
                                asChild
                                placement="bottom"
                                triggerElement={
                                  <div
                                    className="absolute top-0 lg:top-1/2"
                                    style={{
                                      transform: `translateX(-50%) translateY(calc(-100% + ${-1 * index * 13}px - ${3 * index}px))`,
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
                            </m.div>
                          )
                        }),
                      )}
                    <m.div
                      className="absolute left-0 top-1/2"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        delay: 3 + idx * 0.1,
                        duration: 0.3,
                        ease: 'easeOut',
                      }}
                    >
                      <div className="size-[8px] -translate-x-1/4 -translate-y-1/2 rounded-full bg-accent" />
                    </m.div>

                    <FloatPopover
                      type="tooltip"
                      mobileAsSheet
                      placement="bottom"
                      triggerElement={
                        <m.div
                          className="absolute left-0"
                          style={{
                            top: 'calc(50% + 2px)',
                            transform: 'translateX(calc(100% - 0.5px))',
                          }}
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{
                            delay: 3.2 + idx * 0.1,
                            duration: 0.5,
                            ease: 'easeOut',
                          }}
                        >
                          <div
                            className="w-[3px] rounded-md bg-accent"
                            style={{
                              height: `${Math.min(thisMonthTotalPost * 12, 250)}px`,
                              transformOrigin: 'bottom',
                              transform: 'translateY(-100%)',
                            }}
                          />
                        </m.div>
                      }
                      asChild
                    >
                      {t('timeline_published', { count: thisMonthTotalPost })}
                    </FloatPopover>

                    <m.span
                      className="pointer-events-none absolute left-0 top-1/2 mt-4 inline-block -translate-x-1/2"
                      initial={{ opacity: 0, y: 10, x: '-50%' }}
                      animate={{ opacity: 1, y: 0, x: '-50%' }}
                      transition={{
                        delay: 3.5 + idx * 0.1,
                        duration: 0.3,
                        ease: 'easeOut',
                      }}
                    >
                      {label}
                    </m.span>
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
