'use client'

import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import axios from 'axios'
import clsx from 'clsx'
import Link from 'next/link'
import RemoveMarkdown from 'remove-markdown'
import type { FC, ReactNode, SyntheticEvent } from 'react'

import { simpleCamelcaseKeys as camelcaseKeys } from '@mx-space/api-client'

import { LazyLoad } from '~/components/common/Lazyload'
import { usePeek } from '~/components/widgets/peek/usePeek'
import { useIsClientTransition } from '~/hooks/common/use-is-client'
import { preventDefault } from '~/lib/dom'
import { apiClient } from '~/lib/request'

import styles from './LinkCard.module.css'

export type LinkCardSource = 'gh' | 'self' | 'mx-space' | 'gh-commit'
export interface LinkCardProps {
  id: string
  source?: LinkCardSource
  className?: string
}

export const LinkCard = (props: LinkCardProps) => {
  const isClient = useIsClientTransition()

  if (!isClient) return null

  return (
    <LazyLoad placeholder={<LinkCardSkeleton />}>
      <LinkCardImpl {...props} />
    </LazyLoad>
  )
}
const LinkCardImpl: FC<LinkCardProps> = (props) => {
  const { id, source = 'self', className } = props

  const [loading, setLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const fetchFnRef = useRef<() => Promise<any>>()

  const [fullUrl, setFullUrl] = useState('about:blank')
  const [cardInfo, setCardInfo] = useState<{
    title: ReactNode
    desc?: ReactNode
    image?: string
  }>()

  const peek = usePeek()
  const handleCanPeek = useCallback(
    async (e: SyntheticEvent<any>) => {
      const success = peek(fullUrl)
      if (success) preventDefault(e)
    },
    [fullUrl],
  )

  const isValidType = useMemo(() => {
    switch (source) {
      case 'mx-space':
      case 'self': {
        const [variant, params, ...rest] = id.split('/')

        if (!params) {
          return false
        }

        switch (variant) {
          case 'notes': {
            // e.g. variant === 'notes' ,  params === 124
            const valid = !isNaN(+params)
            if (!valid) {
              return false
            }
            fetchFnRef.current = async () => {
              return apiClient.note.getNoteById(+params).then((res) => {
                const { title, images, text } = res.data
                setCardInfo({
                  title,
                  desc: `${RemoveMarkdown(text).slice(0, 50)}...`,
                  // TODO
                  image: images?.[0]?.src,
                })
              })
            }
            setFullUrl(`/notes/${params}`)

            return true
          }
          case 'posts': {
            // e.g. posts/programming/shell-output-via-sse
            const [slug] = rest
            if (!slug || !params) {
              return false
            }

            fetchFnRef.current = async () => {
              return apiClient.post.getPost(params, slug).then((res) => {
                const { title, images, text, summary } = res
                setCardInfo({
                  title,
                  desc: summary ?? `${RemoveMarkdown(text).slice(0, 50)}...`,
                  // TODO
                  image: images?.[0]?.src,
                })
              })
            }
            setFullUrl(`/posts/${params}/${slug}`)

            return true
          }
          default: {
            return false
          }
        }
      }
      case 'gh': {
        // e.g. mx-space/kami
        const [namespace, repo, ...rest] = id.split('/')
        if (!namespace || !repo) {
          return false
        }

        fetchFnRef.current = async () => {
          // https://api.github.com/repos/mx-space/core
          const data = await axios
            .get<any>(`https://api.github.com/repos/${namespace}/${repo}`)
            .then((data) => camelcaseKeys(data.data))
            .catch(() => {
              // set fallback url
              //
              setFullUrl(`https://github.com/${namespace}/${repo}`)
            })

          setCardInfo({
            image: data.owner.avatarUrl,
            title: data.fullName,
            desc: data.description,
          })
          setFullUrl(data.htmlUrl)
        }

        return !rest.length
      }
      case 'gh-commit': {
        // e.g. mx-space/kami/commit/1234567890
        const [namespace, repo, variant, commitId] = id.split('/')

        if (!namespace || !repo || !commitId) {
          return false
        }
        if (variant !== 'commit') {
          return false
        }

        fetchFnRef.current = async () => {
          const data = await axios
            .get<any>(
              `https://api.github.com/repos/${namespace}/${repo}/commits/${commitId}`,
            )
            .then((data) => camelcaseKeys(data.data))
            .catch(() => {
              // set fallback url
              //
              setFullUrl(
                `https://github.com/${namespace}/${repo}/commit/${commitId}`,
              )
            })

          setCardInfo({
            image: data.author.avatarUrl,
            title: (
              <span className="space-x-2">
                <span>
                  {namespace}/{repo}
                </span>
                <span className="font-normal">
                  {data.commit.message.replace(/Signed-off-by:.+/, '')}
                </span>
              </span>
            ),
            desc: (
              <span className="space-x-5 font-mono">
                <span className="text-uk-green-light">
                  +{data.stats.additions}
                </span>
                <span className="text-uk-red-light">
                  -{data.stats.deletions}
                </span>

                <span className="text-sm">{data.sha.slice(0, 7)}</span>
              </span>
            ),
          })
          setFullUrl(data.htmlUrl)
        }

        return true
      }
    }
  }, [source, id])
  const fetchInfo = useCallback(async () => {
    if (!fetchFnRef.current) {
      return
    }
    setLoading(true)

    await fetchFnRef.current().catch((err) => {
      console.log('fetch card info error: ', err)
      setIsError(true)
    })
    setLoading(false)
  }, [])

  const { ref } = useInView({
    triggerOnce: true,
    onChange(inView) {
      if (!inView) {
        return
      }

      fetchInfo()
    },
  })

  if (!isValidType) {
    return null
  }

  const LinkComponent = source === 'self' ? Link : 'a'

  return (
    <LinkComponent
      href={fullUrl}
      target={source !== 'self' ? '_blank' : '_self'}
      ref={ref}
      className={clsx(
        styles['card-grid'],
        (loading || isError) && styles['skeleton'],
        isError && styles['error'],
        className,
      )}
      onClick={handleCanPeek}
    >
      <span className={styles['contents']}>
        <span className={styles['title']}>{cardInfo?.title}</span>
        <span className={styles['desc']}>{cardInfo?.desc}</span>
      </span>
      {(loading || cardInfo?.image) && (
        <span
          className={styles['image']}
          data-image={cardInfo?.image || ''}
          style={{
            backgroundImage: cardInfo?.image
              ? `url(${cardInfo.image})`
              : undefined,
          }}
        />
      )}
    </LinkComponent>
  )
}

const LinkCardSkeleton = () => {
  return (
    <span className={clsx(styles['card-grid'], styles['skeleton'])}>
      <span className={styles['contents']}>
        <span className={styles['title']} />
        <span className={styles['desc']} />
      </span>
      <span className={styles['image']} />
    </span>
  )
}
