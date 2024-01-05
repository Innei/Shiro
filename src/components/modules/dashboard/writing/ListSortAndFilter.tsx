import { createContext, useMemo } from 'react'
import { atom } from 'jotai'
import type { FC, PropsWithChildren } from 'react'

const filterAtom = atom([] as string[])
const sortingAtom = atom({ key: 'created', order: 'desc' } as {
  key: string
  order: 'asc' | 'desc'
})

const ListSortAndFilterContext = createContext({
  filterAtom,
  sortingAtom,
})

export const defaultSortingKeyMap = {
  created: '创建时间',
  modified: '修改时间',
} as Record<string, string>

type SortingOrderListItem = {
  key: string
  label: string
}

export const defaultSortingOrderList = [
  {
    key: 'desc',
    label: '降序',
  },
  {
    key: 'asc',
    label: '升序',
  },
] as SortingOrderListItem[]

const ListSortAndFilterListContext = createContext({
  sortingKeyMap: defaultSortingKeyMap,
  sortingOrderList: defaultSortingOrderList,
})

export const ListSortAndFilterProvider: FC<
  PropsWithChildren<{
    sortingKeyMap?: Record<string, string>
    sortingOrderList?: SortingOrderListItem[]

    filterAtom: typeof filterAtom
    sortingAtom: typeof sortingAtom
  }>
> = (props) => {
  const { sortingOrderList, sortingKeyMap, children, sortingAtom, filterAtom } =
    props

  return (
    <ListSortAndFilterContext.Provider
      value={useMemo(
        () => ({
          filterAtom,
          sortingAtom,
        }),
        [filterAtom, sortingAtom],
      )}
    >
      <ListSortAndFilterListContext.Provider
        value={useMemo(
          () => ({
            sortingKeyMap: sortingKeyMap ?? defaultSortingKeyMap,
            sortingOrderList: sortingOrderList ?? defaultSortingOrderList,
          }),
          [sortingKeyMap, sortingOrderList],
        )}
      >
        {children}
      </ListSortAndFilterListContext.Provider>
    </ListSortAndFilterContext.Provider>
  )
}
