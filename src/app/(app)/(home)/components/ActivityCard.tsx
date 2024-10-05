'use client'

import { CollectionRefTypes } from '@mx-space/api-client'
import clsx from 'clsx'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { useMemo } from 'react'
import RemoveMarkdown from 'remove-markdown'

import {
  FaSolidFeatherAlt,
  IcTwotoneSignpost,
  MdiLightbulbOn20,
} from '~/components/icons/menu-collection'
import { routeBuilder, Routes } from '~/lib/route-builder'
import { useAggregationSelector } from '~/providers/root/aggregation-data-provider'

import type { ReactActivityType } from './types'

export const iconClassName =
  'rounded-full border shrink-0 border-accent/30 text-xs center inline-flex size-6 text-accent'

export const ActivityCard = ({ activity }: { activity: ReactActivityType }) => {
  const siteOwner = useAggregationSelector((state) => state.user)
  const Content = useMemo(() => {
    switch (activity.bizType) {
      case 'comment': {
        let toLink = ''
        switch (activity.type) {
          case CollectionRefTypes.Post: {
            toLink = `/posts/${activity.slug}`
            break
          }
          case CollectionRefTypes.Note: {
            toLink = `/notes/${activity.nid}`
            break
          }
          case CollectionRefTypes.Page: {
            toLink = `/${activity.slug}`
            break
          }
          case CollectionRefTypes.Recently: {
            toLink = `/thinking/${activity.id}`
            break
          }
        }
        return (
          <div className="relative flex flex-col justify-center gap-2">
            <div
              className={clsx(
                'absolute left-0 top-1/2 -translate-y-1/4',
                iconClassName,
              )}
            >
              <i className="i-mingcute-comment-line" />
            </div>
            <div className="flex items-center gap-2 pl-8">
              <div className="space-x-2">
                {activity.avatar && (
                  <img
                    src={activity.avatar}
                    className="inline size-[16px] rounded-full ring-2 ring-slate-200 dark:ring-zinc-800"
                  />
                )}
                <span className="font-medium">{activity.author}</span>{' '}
                <small>在</small>{' '}
                <Link className="shiro-link--underline" href={toLink}>
                  <b>
                    {activity.title ||
                      (activity.type === CollectionRefTypes.Recently
                        ? '一条想法中'
                        : null)}
                  </b>
                </Link>{' '}
                <small>说：</small>
              </div>
            </div>
            <div className="flex pl-8">
              <div
                className={clsx(
                  'relative inline-block rounded-xl p-3 text-zinc-800 dark:text-zinc-200',
                  'rounded-tl-sm bg-zinc-600/5 dark:bg-zinc-500/20',
                  'max-w-full overflow-auto',
                )}
              >
                {RemoveMarkdown(activity.text)}
              </div>
            </div>
          </div>
        )
      }
      case 'note': {
        return (
          <div className="flex translate-y-1/4 gap-2">
            <div className={clsx(iconClassName)}>
              <FaSolidFeatherAlt />
            </div>
            <div className="space-x-2">
              <small>发布了</small>{' '}
              <Link href={routeBuilder(Routes.Note, { id: activity.nid })}>
                <b>{activity.title}</b>
              </Link>
            </div>
          </div>
        )
      }
      case 'post': {
        return (
          <div className="flex translate-y-1/4 gap-2">
            <div className={clsx(iconClassName)}>
              <IcTwotoneSignpost />
            </div>
            <div className="space-x-2">
              <small>发布了</small>{' '}
              <Link href={`/posts/${activity.slug}`}>
                <b>{activity.title}</b>
              </Link>
            </div>
          </div>
        )
      }
      case 'recent': {
        return (
          <div className="relative flex flex-col justify-center gap-2">
            <div
              className={clsx(
                'absolute left-0 top-1/2 -translate-y-1/4',
                iconClassName,
              )}
            >
              <MdiLightbulbOn20 />
            </div>

            <div className="flex gap-2 pl-8">
              <img
                src={siteOwner?.avatar}
                className="mt-4 hidden size-6 rounded-full lg:inline"
              />
              <div
                className={clsx(
                  'relative inline-block rounded-xl p-3 text-zinc-800 dark:text-zinc-200',
                  'rounded-tl-sm bg-zinc-600/5 dark:bg-zinc-500/20',
                  'max-w-full overflow-auto',
                )}
              >
                {RemoveMarkdown(activity.content)}
              </div>
            </div>
          </div>
        )
      }
      case 'like': {
        let TitleLink: ReactNode = null
        switch (activity.type) {
          case CollectionRefTypes.Post: {
            TitleLink = (
              <Link href={`/posts/${activity.slug}`}>
                <b>{activity.title}</b>
              </Link>
            )
            break
          }
          case CollectionRefTypes.Note: {
            TitleLink = (
              <Link href={`/notes/${activity.nid}`}>
                <b>{activity.title}</b>
              </Link>
            )
            break
          }
          default: {
            TitleLink = <b>已删除的内容</b>
          }
        }
        return (
          <div className="flex translate-y-1/4 items-start gap-2">
            <span className={clsx(iconClassName)}>
              <i className="i-mingcute-heart-line" />
            </span>
            <div className="space-x-2">
              <small>有人点赞了</small> {TitleLink}
            </div>
          </div>
        )
      }
    }
  }, [activity, siteOwner?.avatar])

  return <div className="pb-4 text-base">{Content}</div>
}
