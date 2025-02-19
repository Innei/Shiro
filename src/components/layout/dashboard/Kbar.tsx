'use client'

import type { Action, ActionId, ActionImpl } from 'kbar'
import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarResults,
  KBarSearch,
  useMatches,
} from 'kbar'
import { useRouter } from 'next/navigation'
import type { FC, PropsWithChildren } from 'react'
import * as React from 'react'
import { useContext } from 'react'

import { DashboardLayoutContext } from '~/components/modules/dashboard/utils/context'
import { useRefValue } from '~/hooks/common/use-ref-value'
import { clsxm } from '~/lib/helper'

export const ComposedKBarProvider: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter()
  const routes = useContext(DashboardLayoutContext)
  const actions: Action[] = useRefValue(
    () =>
      routes
        .map<Action | null>(({ path, config: { title } }) => {
          // if (route.redirect) return null

          let name = ''

          // if (route.parent) {
          //   name = route.parent.title || ''
          // }
          if (title) {
            if (name) name += ' > '
            name += title
          }

          if (!name) return null

          return {
            id: path,
            name,
            perform: () => {
              router.push(path)
            },
          }
        })
        .filter(Boolean) as Action[],
  )

  return (
    <KBarProvider actions={actions}>
      {children}

      <KBarPortal>
        <KBarPositioner>
          <KBarAnimator className="w-full max-w-[600px] overflow-hidden rounded-lg bg-base-100/60 text-base-content shadow-xl backdrop-blur-md">
            <KBarSearch className="w-full border-none bg-base-200/30 p-3 text-lg text-base-content outline-none backdrop-blur-md" />
            <RenderResults />
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
    </KBarProvider>
  )
}

function RenderResults() {
  const { results, rootActionId } = useMatches()

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === 'string' ? (
          <div className="px-4 py-2 text-xs uppercase opacity-50">{item}</div>
        ) : (
          <ResultItem
            action={item}
            active={active}
            currentRootActionId={rootActionId!}
          />
        )
      }
    />
  )
}

const ResultItem = React.forwardRef(
  (
    {
      action,
      active,
      currentRootActionId,
    }: {
      action: ActionImpl
      active: boolean
      currentRootActionId: ActionId
    },
    ref: React.Ref<HTMLDivElement>,
  ) => {
    const ancestors = React.useMemo(() => {
      if (!currentRootActionId) return action.ancestors
      const index = action.ancestors.findIndex(
        (ancestor) => ancestor.id === currentRootActionId,
      )
      // +1 removes the currentRootAction; e.g.
      // if we are on the "Set theme" parent action,
      // the UI should not display "Set theme… > Dark"
      // but rather just "Dark"
      return action.ancestors.slice(index + 1)
    }, [action.ancestors, currentRootActionId])

    return (
      <div
        ref={ref}
        className={clsxm(
          `flex cursor-pointer items-center justify-between p-3`,
          active ? 'bg-base-200/70' : '',
        )}
      >
        <div className="flex items-center gap-2 text-sm">
          {action.icon && action.icon}
          <div className="flex flex-col">
            <div>
              {ancestors.length > 0 &&
                ancestors.map((ancestor) => (
                  <React.Fragment key={ancestor.id}>
                    <span className="mr-2 opacity-50">{ancestor.name}</span>
                    <span className="mr-2">&rsaquo;</span>
                  </React.Fragment>
                ))}
              <span>{action.name}</span>
            </div>
            {action.subtitle && (
              <span className="text-xs">{action.subtitle}</span>
            )}
          </div>
        </div>
        {action.shortcut?.length ? (
          <div aria-hidden className="grid grid-flow-col gap-1">
            {action.shortcut.map((sc) => (
              <kbd key={sc} className="rounded bg-base-100/10 p-1 text-sm">
                {sc}
              </kbd>
            ))}
          </div>
        ) : null}
      </div>
    )
  },
)

ResultItem.displayName = 'ResultItem'
