import { useCallback, useMemo, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import axios from 'axios'
import clsx from 'clsx'
import Link from 'next/link'
import RemoveMarkdown from 'remove-markdown'
import type { FC } from 'react'

import { simpleCamelcaseKeys as camelcaseKeys } from '@mx-space/api-client'

import { useIsUnMounted } from '~/hooks/common/use-is-unmounted'
import { useSafeSetState } from '~/hooks/common/use-safe-setState'
import { apiClient } from '~/utils/request'

import styles from './LinkCard.module.css'

export type LinkCardSource = 'gh' | 'self' | 'mx-space'
export interface LinkCardProps {
  id: string
  source?: LinkCardSource
  className?: string
}
export const LinkCard: FC<LinkCardProps> = (props) => {
  const { id, source = 'self', className } = props
  const isUnMounted = useIsUnMounted()

  const [loading, setLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const fetchFnRef = useRef<() => Promise<any>>()

  const [fullUrl, _setFullUrl] = useState('about:blank')
  const [cardInfo, _setCardInfo] = useState<{
    title: string
    desc?: string
    image?: string
  }>()
  const setFullUrl = useSafeSetState(_setFullUrl, isUnMounted)
  const setCardInfo = useSafeSetState(_setCardInfo, isUnMounted)

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

          setCardInfo({
            image: data.owner.avatarUrl,
            title: data.fullName,
            desc: data.description,
          })
          setFullUrl(data.htmlUrl)
        }

        return !rest.length
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
