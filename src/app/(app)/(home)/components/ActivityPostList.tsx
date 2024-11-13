'use client'

import { m } from 'motion/react'
import Link from 'next/link'
import * as React from 'react'

import { Divider } from '~/components/ui/divider'
import { RelativeTime } from '~/components/ui/relative-time'
import { softBouncePreset } from '~/constants/spring'
import { routeBuilder, Routes } from '~/lib/route-builder'

import { useHomeQueryData } from '../query'

export const ActivityPostList = () => {
  const { notes, posts } = useHomeQueryData()
  return (
    <m.section
      initial={{ opacity: 0.0001, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={softBouncePreset}
      className="mt-8 flex flex-col gap-4 lg:mt-0"
      viewport={{ once: true }}
    >
      <h2 className="text-2xl font-medium leading-loose">最近更新的文稿</h2>
      <ul className="shiro-timeline mt-4">
        {posts.map((post) => {
          return (
            <li key={post.id} className="flex min-w-0 justify-between">
              <Link
                prefetch
                className="min-w-0 shrink truncate"
                href={routeBuilder(Routes.Post, {
                  category: post.category.slug,
                  slug: post.slug,
                })}
              >
                {post.title}
              </Link>

              <span className="ml-2 shrink-0 self-end text-xs opacity-70">
                <RelativeTime
                  date={post.created}
                  displayAbsoluteTimeAfterDay={180}
                />
              </span>
            </li>
          )
        })}
      </ul>

      <Link
        className="flex items-center justify-end opacity-70 duration-200 hover:text-accent"
        href={routeBuilder(Routes.Posts, {})}
      >
        <i className="i-mingcute-arrow-right-circle-line" />
        <span className="ml-2">还有更多</span>
      </Link>

      <Divider />
      <h2 className="text-2xl font-medium leading-loose">最近更新的手记</h2>
      <ul className="shiro-timeline mt-4">
        {notes.map((note, i) => {
          return (
            <li key={note.id} className="flex min-w-0 justify-between">
              <Link
                className="min-w-0 shrink truncate"
                href={routeBuilder(Routes.Note, {
                  id: note.nid,
                })}
              >
                {note.title}
              </Link>

              <span className="ml-2 shrink-0 self-end text-xs opacity-70">
                <RelativeTime
                  date={note.created}
                  displayAbsoluteTimeAfterDay={180}
                />
              </span>
            </li>
          )
        })}
      </ul>
      <Link
        className="flex items-center justify-end opacity-70 duration-200 hover:text-accent"
        href={routeBuilder(Routes.Timelime, { type: 'note' })}
      >
        <i className="i-mingcute-arrow-right-circle-line" />
        <span className="ml-2">还有更多</span>
      </Link>
    </m.section>
  )
}
