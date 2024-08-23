/* eslint-disable unicorn/switch-case-braces */
import { simpleCamelcaseKeys as camelcaseKeys } from '@mx-space/api-client'
import { m, useMotionTemplate, useMotionValue } from 'framer-motion'
import Link from 'next/link'
import type React from 'react'
import type { FC, ReactNode, SyntheticEvent } from 'react'
import { useCallback, useMemo, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import RemoveMarkdown from 'remove-markdown'
import uniqolor from 'uniqolor'

import { LazyLoad } from '~/components/common/Lazyload'
import { MingcuteStarHalfFill } from '~/components/icons/star'
import { usePeek } from '~/components/modules/peek/usePeek'
import { LanguageToColorMap } from '~/constants/language'
import { useIsClientTransition } from '~/hooks/common/use-is-client'
import useIsCommandOrControlPressed from '~/hooks/common/use-is-command-or-control-pressed'
import { preventDefault } from '~/lib/dom'
import { fetchGitHubApi } from '~/lib/github'
import { clsxm } from '~/lib/helper'
import { getDominantColor } from '~/lib/image'
import { apiClient } from '~/lib/request'
import { useFeatureEnabled } from '~/providers/root/app-feature-provider'

import { LinkCardSource } from './enums'
import styles from './LinkCard.module.css'

export interface LinkCardProps {
  id: string
  source?: LinkCardSource
  className?: string

  fallbackUrl?: string
  placeholder: ReactNode
}

export const LinkCard = (props: Omit<LinkCardProps, 'placeholder'>) => {
  const isClient = useIsClientTransition()

  const placeholder = (
    <LinkCardSkeleton
      className={props.source === 'tmdb' ? '!w-screen max-w-full' : ''}
    />
  )

  if (!isClient) return placeholder

  return (
    <LazyLoad placeholder={placeholder}>
      <LinkCardImpl {...props} placeholder={placeholder} />
    </LazyLoad>
  )
}

type CardState = {
  title?: ReactNode
  desc?: ReactNode
  image?: string
  color?: string

  classNames?: Partial<{
    image: string
    cardRoot: string
  }>
}

const LinkCardImpl: FC<LinkCardProps> = (props) => {
  const { id, source = LinkCardSource.Self, className, fallbackUrl } = props

  const [loading, setLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [fullUrl, setFullUrl] = useState(fallbackUrl || 'javascript:;')

  const [cardInfo, setCardInfo] = useState<CardState>()

  const peek = usePeek()
  const isCommandPressed = useIsCommandOrControlPressed()

  const handleCanPeek = useCallback(
    async (e: SyntheticEvent<any>) => {
      if (isCommandPressed) return
      const success = peek(fullUrl)
      if (success) preventDefault(e)
    },
    [fullUrl, isCommandPressed, peek],
  )

  const tmdbEnabled = useFeatureEnabled('tmdb')
  const validTypeAndFetchFunction = useCallback(
    (source: LinkCardSource, id: string) => {
      const fetchDataFunctions = {
        [LinkCardSource.MixSpace]: fetchMxSpaceData,
        [LinkCardSource.GHRepo]: fetchGitHubRepoData,
        [LinkCardSource.GHCommit]: fetchGitHubCommitData,
        [LinkCardSource.GHPr]: fetchGitHubPRData,
        [LinkCardSource.Self]: fetchMxSpaceData,
        [LinkCardSource.LEETCODE]: fetchLeetCodeQuestionData,
      } as Record<LinkCardSource, FetchObject>
      if (tmdbEnabled)
        fetchDataFunctions[LinkCardSource.TMDB] = fetchTheMovieDBData

      const fetchFunction = fetchDataFunctions[source]
      if (!fetchFunction) {
        return { isValid: false, fetchFn: null }
      }

      const isValid = fetchFunction.isValid(id)
      return { isValid, fetchFn: isValid ? fetchFunction.fetch : null }
    },
    [tmdbEnabled],
  )

  const { isValid, fetchFn } = useMemo(
    () => validTypeAndFetchFunction(source, id),
    [source, id],
  )

  const fetchInfo = useCallback(async () => {
    if (!fetchFn) {
      return
    }
    setLoading(true)

    await fetchFn(id, setCardInfo, setFullUrl).catch((err) => {
      console.error('fetch card info error:', err)
      setIsError(true)
    })
    setLoading(false)
  }, [fetchFn, id])

  const { ref } = useInView({
    triggerOnce: true,
    onChange(inView) {
      if (!inView) {
        return
      }

      fetchInfo()
    },
  })

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const radius = useMotionValue(0)
  const handleMouseMove = useCallback(
    ({ clientX, clientY, currentTarget }: React.MouseEvent) => {
      const bounds = currentTarget.getBoundingClientRect()
      mouseX.set(clientX - bounds.left)
      mouseY.set(clientY - bounds.top)
      radius.set(Math.hypot(bounds.width, bounds.height) * 1.3)
    },
    [mouseX, mouseY, radius],
  )

  const background = useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, var(--spotlight-color) 0%, transparent 65%)`

  if (!isValid) {
    return null
  }

  const LinkComponent = source === 'self' ? Link : 'a'

  const classNames = cardInfo?.classNames || {}

  if (loading) {
    return (
      <a
        ref={ref}
        href={fullUrl}
        target={source !== 'self' ? '_blank' : '_self'}
        rel="noreferrer"
      >
        {props.placeholder}
      </a>
    )
  }
  return (
    <LinkComponent
      href={fullUrl}
      target={source !== 'self' ? '_blank' : '_self'}
      className={clsxm(
        styles['card-grid'],
        (loading || isError) && styles['skeleton'],
        isError && styles['error'],
        'not-prose',

        'group',

        className,
        classNames.cardRoot,
      )}
      style={{
        borderColor: cardInfo?.color ? `${cardInfo.color}30` : undefined,
      }}
      onClick={handleCanPeek}
      onMouseMove={handleMouseMove}
    >
      {cardInfo?.color && (
        <>
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundColor: cardInfo?.color,
              opacity: 0.06,
            }}
          />
          <m.div
            layout
            className="absolute inset-0 z-0 opacity-0 duration-500 group-hover:opacity-100"
            style={
              {
                '--spotlight-color': `${cardInfo?.color}50`,
                background,
              } as any
            }
          />
        </>
      )}
      <span className={styles['contents']}>
        <span className={styles['title']}>{cardInfo?.title}</span>
        <span className={styles['desc']}>{cardInfo?.desc}</span>
      </span>
      {(loading || cardInfo?.image) && (
        <span
          className={clsxm(styles['image'], classNames.image)}
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

const LinkCardSkeleton: FC<{
  className?: string
}> = ({ className }) => {
  return (
    <span className={clsxm(styles['card-grid'], styles['skeleton'], className)}>
      <span className={styles['contents']}>
        <span className={styles['title']} />
        <span className={styles['desc']} />
      </span>
      <span className={styles['image']} />
    </span>
  )
}

type FetchFunction = (
  id: string,
  setCardInfo: React.Dispatch<React.SetStateAction<CardState | undefined>>,
  setFullUrl: (url: string) => void,
) => Promise<void>

type FetchObject = {
  isValid: (id: string) => boolean
  fetch: FetchFunction
}

const fetchGitHubRepoData: FetchObject = {
  isValid: (id) => {
    // owner/repo
    const parts = id.split('/')
    return parts.length === 2 && parts[0].length > 0 && parts[1].length > 0
  },
  fetch: async (id, setCardInfo, setFullUrl) => {
    const [owner, repo] = id.split('/')
    try {
      const response = await fetchGitHubApi(
        `https://api.github.com/repos/${owner}/${repo}`,
      )
      const data = camelcaseKeys(response)

      setCardInfo({
        title: (
          <span className="flex items-center gap-2">
            <span className="flex-1">{data.name}</span>
            <span className="shrink-0 self-end justify-self-end">
              {data.stargazersCount > 0 && (
                <span className="inline-flex shrink-0 items-center gap-1 self-center text-sm text-orange-400 dark:text-yellow-500">
                  <i className="icon-[mingcute--star-line]" />
                  <span className="font-sans font-medium">
                    {data.stargazersCount}
                  </span>
                </span>
              )}
            </span>
          </span>
        ),
        desc: data.description,
        image: data.owner.avatarUrl,
        color: (LanguageToColorMap as any)[data.language?.toLowerCase()],
      })

      setFullUrl(data.htmlUrl)
    } catch (err) {
      console.error('Error fetching GitHub data:', err)
      throw err
    }
  },
}

const fetchGitHubCommitData: FetchObject = {
  isValid: (id) => {
    // 假设 'gh-commit' 类型的 id 应该是 'username/repo/commit/commitId' 的形式
    const parts = id.split('/')
    return (
      parts.length === 4 &&
      parts.every((part) => part.length > 0) &&
      parts[2] === 'commit'
    )
  },
  fetch: async (id, setCardInfo, setFullUrl) => {
    const [owner, repo, , commitId] = id.split('/')
    try {
      const response = await fetchGitHubApi(
        `https://api.github.com/repos/${owner}/${repo}/commits/${commitId}`,
      )
      const data = camelcaseKeys(response)

      setCardInfo({
        title: (
          <span className="font-normal">
            {data.commit.message.replace(/Signed-off-by:.+/, '')}
          </span>
        ),
        desc: (
          <span className="flex items-center space-x-5 font-mono">
            <span className="text-uk-green-light">+{data.stats.additions}</span>
            <span className="text-uk-red-light">-{data.stats.deletions}</span>

            <span className="text-sm">{data.sha.slice(0, 7)}</span>

            <span className="text-sm opacity-80">
              {owner}/{repo}
            </span>
          </span>
        ),
        image: data.author?.avatarUrl,
      })

      setFullUrl(`https://github.com/${owner}/${repo}/commit/${commitId}`)
    } catch (err) {
      console.error('Error fetching GitHub commit data:', err)
      throw err
    }
  },
}

const fetchGitHubPRData: FetchObject = {
  isValid: (id) => {
    // ${owner}/${repo}/${pr}
    const parts = id.split('/')
    return parts.length === 3 && parts.every((part) => part.length > 0)
  },
  fetch: async (id, setCardInfo, setFullUrl) => {
    const [owner, repo, prNumber] = id.split('/')
    try {
      const response = await fetchGitHubApi(
        `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`,
      )
      const data = camelcaseKeys(response)

      setCardInfo({
        title: `PR: ${data.title}`,
        desc: (
          <span className="flex items-center space-x-5 font-mono">
            <span className="text-uk-green-light">+{data.additions}</span>
            <span className="text-uk-red-light">-{data.deletions}</span>
            <span className="text-sm opacity-80">
              {owner}/{repo}
            </span>
          </span>
        ),
        image: data.user.avatarUrl,
      })

      setFullUrl(data.htmlUrl)
    } catch (err) {
      console.error('Error fetching GitHub PR data:', err)
      throw err
    }
  },
}

const fetchMxSpaceData: FetchObject = {
  isValid: (id) => {
    // 'posts/cate/slug' 或 'notes/nid'
    const [type, ...rest] = id.split('/')
    if (type !== 'posts' && type !== 'notes') {
      return false
    }

    if (type === 'posts') {
      return rest.length === 2
    }
    return rest.length === 1
  },
  fetch: async (id, setCardInfo, setFullUrl) => {
    const [type, ...rest] = id.split('/')
    try {
      let data: {
        title: string
        text: string
        images?: { src: string }[]
        meta?: Record<string, any>
        cover?: string
        summary?: string | null
      } = { title: '', text: '' }

      if (type === 'posts') {
        const [cate, slug] = rest
        const response = await apiClient.post.getPost(cate, slug)
        data = response
        setFullUrl(`/posts/${cate}/${slug}`)
      } else if (type === 'notes') {
        const [nid] = rest
        const response = await apiClient.note.getNoteById(+nid)
        data = response.data
        setFullUrl(`/notes/${nid}`)
      }

      const coverImage = data.cover || data.meta?.cover
      let spotlightColor = ''
      if (coverImage) {
        const $image = new Image()
        $image.src = coverImage
        $image.crossOrigin = 'Anonymous'
        $image.onload = () => {
          setCardInfo((info) => {
            if (info?.title !== data.title) return info
            return { ...info, color: getDominantColor($image) }
          })
        }
      } else {
        spotlightColor = uniqolor(data.title, {
          saturation: [30, 35],
          lightness: [60, 70],
        }).color
      }
      setCardInfo({
        title: data.title,
        desc: data.summary || `${RemoveMarkdown(data.text).slice(0, 50)}...`,
        image: coverImage || data.images?.[0]?.src,
        color: spotlightColor,
      })
    } catch (err) {
      console.error('Error fetching self data:', err)
      throw err
    }
  },
}

const fetchTheMovieDBData: FetchObject = {
  isValid(id) {
    // tv/218230
    const [type, realId] = id.split('/')

    const canParsedTypes = ['tv', 'movie']
    return canParsedTypes.includes(type) && realId.length > 0
  },
  async fetch(id, setCardInfo, setFullUrl) {
    const [type, realId] = id.split('/')

    setCardInfo({
      classNames: { cardRoot: '!w-full' },
    })
    const json = await fetch(`/api/tmdb/${type}/${realId}?language=zh-CN`)
      .then((r) => r.json())
      .catch((err) => {
        console.error('Error fetching TMDB data:', err)
        throw err
      })

    const title = type === 'tv' ? json.name : json.title
    const originalTitle =
      type === 'tv' ? json.original_name : json.original_title
    setCardInfo({
      title: (
        <span className="flex flex-wrap items-end gap-2">
          <span>{title}</span>
          {title !== originalTitle && (
            <span className="text-sm opacity-70">({originalTitle})</span>
          )}
          <span className="inline-flex shrink-0 items-center gap-1 self-center text-xs text-orange-400 dark:text-yellow-500">
            <MingcuteStarHalfFill />
            <span className="font-sans font-medium">
              {json.vote_average > 0 && json.vote_average.toFixed(1)}
            </span>
          </span>
        </span>
      ),
      desc: (
        <span className="line-clamp-none overflow-visible whitespace-pre-wrap">
          {json.overview}
        </span>
      ),
      image: `https://image.tmdb.org/t/p/w500${json.poster_path}`,
      color: uniqolor(json.name, {
        saturation: [30, 35],
        lightness: [60, 70],
      }).color,

      classNames: {
        image: 'self-start !h-[75px] !w-[50px]',
        cardRoot: '!w-full !flex-row-reverse',
      },
    })
    json.homepage && setFullUrl(json.homepage)
  },
}

const fetchLeetCodeQuestionData: FetchObject = {
  isValid: (id) => {
    // 检查 titleSlug 是否是一个有效的字符串
    return typeof id === 'string' && id.length > 0
  },
  fetch: async (id, setCardInfo, setFullUrl) => {
    try {
      //获取题目信息
      const body = {
        query: `query questionData($titleSlug: String!) {\n  question(titleSlug: $titleSlug) {translatedTitle\n   difficulty\n    likes\n     topicTags { translatedName\n }\n    stats\n  }\n}\n`,
        variables: { titleSlug: id },
      }
      const questionData = await fetch(`/api/leetcode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }).then(async (res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch LeetCode question title')
        }
        return res.json()
      })
      const questionTitleData = camelcaseKeys(questionData.data.question)
      const stats = JSON.parse(questionTitleData.stats)
      // 设置卡片信息
      setCardInfo({
        title: (
          <>
            <span className="flex items-center gap-2">
              <span className="flex-1">
                {questionTitleData.translatedTitle}
              </span>
              <span className="shrink-0 self-end justify-self-end">
                {questionTitleData.likes > 0 && (
                  <span className="inline-flex shrink-0 items-center gap-1 self-center text-sm text-orange-400 dark:text-yellow-500">
                    <i className="icon-[mingcute--thumb-up-line]" />
                    <span className="font-sans font-medium">
                      {questionTitleData.likes}
                    </span>
                  </span>
                )}
              </span>
            </span>
          </>
        ),
        desc: (
          <>
            <span
              className={`mr-4 font-bold ${getDifficultyColorClass(questionTitleData.difficulty)}`}
            >
              {questionTitleData.difficulty}
            </span>
            <span className="overflow-hidden">
              {questionTitleData.topicTags
                .map((tag: any) => tag.translatedName)
                .join(' / ')}
            </span>
            <span className="float-right overflow-hidden">
              AR: {stats.acRate}
            </span>
          </>
        ),
        image:
          'https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png',
        color: getDifficultyColor(questionTitleData.difficulty),
      })

      setFullUrl(`https://leetcode.cn/problems/${id}/description`)
    } catch (err) {
      console.error('Error fetching LeetCode question data:', err)
      throw err
    }

    function getDifficultyColor(difficulty: string) {
      switch (difficulty) {
        case 'Easy':
          return '#00BFA5'
        case 'Medium':
          return '#FFA726'
        case 'Hard':
          return '#F44336'
        default:
          return '#757575'
      }
    }

    function getDifficultyColorClass(difficulty: string) {
      switch (difficulty) {
        case 'Easy':
          return 'text-green-500'
        case 'Medium':
          return 'text-yellow-500'
        case 'Hard':
          return 'text-red-500'
        default:
          return 'text-gray-500'
      }
    }
  },
}
