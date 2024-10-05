'use client'

import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { m } from 'framer-motion'
import Image from 'next/image'
import { createElement, useRef } from 'react'

import { isSupportIcon, SocialIcon } from '~/components/modules/home/SocialIcon'
import {
  fetchHitokoto,
  SentenceType,
} from '~/components/modules/shared/Hitokoto'
import { MotionButtonBase } from '~/components/ui/button'
import {
  BottomToUpTransitionView,
  TextUpTransitionView,
} from '~/components/ui/transition'
import { softBouncePreset } from '~/constants/spring'
import { clsxm } from '~/lib/helper'
import { noopObj } from '~/lib/noop'
import {
  useAggregationSelector,
  useAppConfigSelector,
} from '~/providers/root/aggregation-data-provider'

import { TwoColumnLayout } from './TwoColumnLayout'

export const Hero = () => {
  const { title, description } = useAppConfigSelector((config) => ({
    ...config.hero,
  }))!
  const siteOwner = useAggregationSelector((agg) => agg.user)
  const { avatar, socialIds } = siteOwner || {}

  const titleAnimateD =
    title.template.reduce((acc, cur) => acc + (cur.text?.length || 0), 0) * 50
  return (
    <div className="mx-auto mt-20 min-w-0 max-w-7xl overflow-hidden lg:mt-[-4.5rem] lg:h-dvh lg:min-h-[800px] lg:px-8">
      <TwoColumnLayout
        leftContainerClassName="mt-[120px] lg:mt-0 lg:h-[15rem] lg:h-1/2"
        rightContainerClassName="lg:flex lg:justify-end lg:items-end"
      >
        <>
          <m.div
            className="group relative text-center leading-[4] lg:text-left [&_*]:inline-block"
            initial={{ opacity: 0.0001, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={softBouncePreset}
          >
            {title.template.map((t, i) => {
              const { type } = t
              const prevAllTextLength = title.template
                .slice(0, i)
                .reduce((acc, cur) => acc + (cur.text?.length || 0), 0)
              return createElement(
                type,
                { key: i, className: t.class },
                t.text && (
                  <TextUpTransitionView
                    initialDelay={prevAllTextLength * 0.05}
                    eachDelay={0.05}
                  >
                    {t.text}
                  </TextUpTransitionView>
                ),
              )
            })}
          </m.div>

          <BottomToUpTransitionView
            delay={titleAnimateD + 500}
            transition={softBouncePreset}
            className="my-3 text-center lg:text-left"
          >
            <span className="opacity-80">{description}</span>
          </BottomToUpTransitionView>

          <ul className="center mx-[60px] mt-8 flex flex-wrap gap-4 gap-y-6 lg:mx-auto lg:mt-28 lg:justify-start lg:gap-y-4">
            {Object.entries(socialIds || noopObj).map(
              ([type, id]: any, index) => {
                if (!isSupportIcon(type)) return null
                return (
                  <BottomToUpTransitionView
                    key={type}
                    delay={index * 100 + titleAnimateD + 500}
                    className="inline-block"
                    as="li"
                  >
                    <SocialIcon id={id} type={type} />
                  </BottomToUpTransitionView>
                )
              },
            )}
          </ul>
        </>

        <div
          className={clsx('lg:size-[300px]', 'size-[200px]', 'mt-24 lg:mt-0')}
        >
          <Image
            height={300}
            width={300}
            src={avatar!}
            alt="Site Owner Avatar"
            className={clsxm(
              'aspect-square rounded-full border border-slate-200 dark:border-neutral-800',
              'w-full',
            )}
          />
        </div>

        <m.div
          initial={{ opacity: 0.0001, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={softBouncePreset}
          className={clsx(
            'center inset-x-0 bottom-0 mt-12 flex flex-col lg:absolute lg:mt-0',

            'center text-neutral-800/80 dark:text-neutral-200/80',
          )}
        >
          <FootHitokoto />
          <span className="mt-8 animate-bounce">
            <i className="i-mingcute-right-line rotate-90 text-2xl" />
          </span>
        </m.div>
      </TwoColumnLayout>
    </div>
  )
}

const FootHitokoto = () => {
  const { custom, random } = useAppConfigSelector(
    (config) => config.hero.hitokoto || {},
  )!

  if (random) return <RemoteHitokoto />
  return (
    <small className="text-center">
      {custom ?? '当第一颗卫星飞向大气层外，我们便以为自己终有一日会征服宇宙。'}
    </small>
  )
}

const RemoteHitokoto = () => {
  const {
    data: hitokoto,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['hitokoto'],
    queryFn: () =>
      fetchHitokoto([
        SentenceType.动画,
        SentenceType.原创,
        SentenceType.哲学,
        SentenceType.文学,
      ]).then((data) => {
        const postfix = Object.values({
          from: data.from,
          from_who: data.from_who,
          creator: data.creator,
        }).find(Boolean)
        if (!data.hitokoto) {
          return null
        } else {
          return data.hitokoto + (postfix ? ` —— ${postfix}` : '')
        }
      }),
    refetchInterval: 30_0000,
    staleTime: Infinity,
    refetchOnMount: 'always',
    meta: {
      persist: true,
    },
  })

  const memoedLoadingRef = useRef(isLoading)

  if (!hitokoto) return null

  return (
    <m.small
      initial={
        isLoading ? { opacity: 0.0001, y: 50 } : memoedLoadingRef.current
      }
      animate={{ opacity: 1, y: 0 }}
      className="group flex w-[80ch] items-center justify-center text-balance"
    >
      {hitokoto}
      <MotionButtonBase
        className={clsxm(
          'ml-3 flex items-center duration-200 group-hover:opacity-100',

          isRefetching ? 'animate-spin' : 'opacity-0',
        )}
        disabled={isRefetching}
        onClick={() => refetch()}
      >
        <i className="i-mingcute-refresh-2-line" />
      </MotionButtonBase>
    </m.small>
  )
}
