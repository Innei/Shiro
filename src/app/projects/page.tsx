'use client'

import { useQuery } from '@tanstack/react-query'

import { CodiconGithubInverted } from '~/components/icons/menu-collection'
import { Loading } from '~/components/ui/loading'
import { BottomToUpTransitionView } from '~/components/ui/transition/BottomToUpTransitionView'
import { ProjectList } from '~/components/widgets/project/ProjectList'
import { NothingFound } from '~/components/widgets/shared/NothingFound'
import { noopArr } from '~/lib/noop'
import { useAggregationSelector } from '~/providers/root/aggregation-data-provider'
import { apiClient } from '~/utils/request'

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
    <div>
      <header className="prose">
        <h1>项目们</h1>
      </header>

      <main className="mt-10">
        <div className="my-12 inline-flex items-center text-3xl font-medium">
          项目{' '}
          {githubUsername && (
            <a
              href={`https://github.com/${githubUsername}`}
              className="ml-2 inline-flex !text-inherit"
              target="_blank"
              aria-label="view on GitHub"
              rel="noopener noreferrer"
            >
              <CodiconGithubInverted />
            </a>
          )}
        </div>
        <BottomToUpTransitionView>
          <ProjectList projects={data || noopArr} />
        </BottomToUpTransitionView>
      </main>
    </div>
  )
}
