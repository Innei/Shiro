'use client'

import { useQuery } from '@tanstack/react-query'

import { GitHubBrandIcon } from '~/components/icons/platform/GitHubBrandIcon'
import { ProjectList } from '~/components/modules/project/ProjectList'
import { NothingFound } from '~/components/modules/shared/NothingFound'
import { Loading } from '~/components/ui/loading'
import { BottomToUpTransitionView } from '~/components/ui/transition/BottomToUpTransitionView'
import { noopArr } from '~/lib/noop'
import { apiClient } from '~/lib/request.new'
import { useAggregationSelector } from '~/providers/root/aggregation-data-provider'

export default function Page() {
  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const data = await apiClient.project.getAll()
      return data.data
    },
  })

  const githubUsername = useAggregationSelector(
    (state) => state.user?.socialIds?.github,
  )

  if (isLoading) {
    return <Loading useDefaultLoadingText />
  }

  if (!data) return <NothingFound />

  return (
    <div className="mt-10">
      <header className="prose my-12 flex items-center">
        <h1 className="flex items-center">
          项目{' '}
          {githubUsername && (
            <a
              href={`https://github.com/${githubUsername}`}
              className="ml-2 inline-flex !text-inherit"
              target="_blank"
              aria-label="view on GitHub"
              rel="noopener noreferrer"
            >
              <GitHubBrandIcon />
            </a>
          )}
        </h1>
      </header>
      <main>
        <BottomToUpTransitionView>
          <ProjectList projects={data || noopArr} />
        </BottomToUpTransitionView>
      </main>
    </div>
  )
}
