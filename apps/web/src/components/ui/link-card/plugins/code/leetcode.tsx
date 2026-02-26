import { simpleCamelcaseKeys as camelcaseKeys } from '@mx-space/api-client'

import type { LinkCardData, LinkCardPlugin, UrlMatchResult } from '../../types'

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
      return 'text-zinc-500'
  }
}

export const leetcodePlugin: LinkCardPlugin = {
  name: 'leetcode',
  displayName: 'LeetCode',
  priority: 65,
  typeClass: 'wide',

  matchUrl(url: URL): UrlMatchResult | null {
    if (url.hostname !== 'leetcode.cn' && url.hostname !== 'leetcode.com')
      return null

    // /problems/two-sum/description
    const parts = url.pathname.split('/').filter(Boolean)
    if (parts[0] !== 'problems' || !parts[1]) return null

    return {
      id: parts[1],
      fullUrl: url.toString(),
    }
  },

  isValidId(id: string): boolean {
    return typeof id === 'string' && id.length > 0
  },

  async fetch(id: string): Promise<LinkCardData> {
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

    return {
      title: (
        <span className="flex items-center gap-2">
          <span className="flex-1">{questionTitleData.translatedTitle}</span>
          <span className="shrink-0 place-self-end">
            {questionTitleData.likes > 0 && (
              <span className="inline-flex shrink-0 items-center gap-1 self-center text-sm text-orange-400 dark:text-yellow-500">
                <i className="i-mingcute-thumb-up-line" />
                <span className="font-sans font-medium">
                  {questionTitleData.likes}
                </span>
              </span>
            )}
          </span>
        </span>
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
    }
  },
}
