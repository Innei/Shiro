'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { MdiClockTimeThreeOutline } from '~/components/icons/clock'
import { OnlyMobile } from '~/components/ui/viewport/OnlyMobile'
import { routeBuilder, Routes } from '~/lib/route-builder'
import { springScrollToTop } from '~/lib/scroller'
import { useCurrentNoteDataSelector } from '~/providers/note/CurrentNoteDataProvider'

export const NoteFooterNavigation = () => {
  const data = useCurrentNoteDataSelector((data) =>
    !data
      ? null
      : {
          nextNid: data.next?.nid,
          prevNid: data.prev?.nid,
          currentObjectId: data.data.id,
        },
  )

  const router = useRouter()

  if (!data) return null

  const { nextNid, prevNid, currentObjectId } = data

  return (
    <>
      {/* // 没有 0 的情况 */}
      {(!!prevNid || !!nextNid) && (
        <>
          <section className="relative mt-4 py-2 text-center" data-hide-print>
            <div className="flex items-center justify-between [&>*]:inline-flex [&>*]:items-center [&>*]:space-x-2 [&>*]:px-2 [&>*]:py-2">
              {!!nextNid && (
                <Link
                  href={routeBuilder(Routes.Note, {
                    id: nextNid.toString(),
                  })}
                  className="hover:text-accent"
                  scroll={false}
                  prefetch={false}
                >
                  <i className="icon-[mingcute--arrow-left-line]" />
                  <span>前一篇</span>
                </Link>
              )}

              {!!prevNid && (
                <Link
                  href={routeBuilder(Routes.Note, {
                    id: prevNid.toString(),
                  })}
                  prefetch={false}
                  scroll={false}
                  className="hover:text-accent"
                >
                  <span>后一篇</span>
                  <i className="icon-[mingcute--arrow-right-line]" />
                </Link>
              )}
            </div>
            <div
              tabIndex={1}
              role="button"
              className="absolute bottom-0 left-1/2 top-0 flex -translate-x-1/2 transform items-center space-x-2 text-accent opacity-80 hover:text-accent"
              onClick={() => {
                springScrollToTop()
                router.push(
                  routeBuilder(Routes.Timelime, {
                    type: 'note',
                    selectId: currentObjectId,
                  }),
                )
              }}
            >
              <span>时间线</span>
              <MdiClockTimeThreeOutline />
            </div>
          </section>
        </>
      )}
    </>
  )
}

export const NoteFooterNavigationBarForMobile: typeof NoteFooterNavigation =
  () => {
    return (
      <OnlyMobile>
        <NoteFooterNavigation />
      </OnlyMobile>
    )
  }
