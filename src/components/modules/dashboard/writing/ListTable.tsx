import { createContext, memo, useContext, useMemo } from 'react'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import { atom, useAtom, useAtomValue, useStore } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import type { PaginateResult } from '@mx-space/api-client'
import type { FC, PropsWithChildren } from 'react'

import { useIsMobile } from '~/atoms'
import { StyledButton } from '~/components/ui/button'
import { RelativeTime } from '~/components/ui/relative-time'
import { AbsoluteCenterSpinner } from '~/components/ui/spinner'
import { useQueryPager } from '~/hooks/biz/use-query-pager'
import { useEventCallback } from '~/hooks/common/use-event-callback'
import { useRefValue } from '~/hooks/common/use-ref-value'
import { buildNSKey } from '~/lib/ns'
import { useModalStack } from '~/providers/root/modal-stack-provider'

enum ViewStyle {
  Table,
  List,
}

const createDefaultCtxValue = () => {
  return {
    viewStyleAtom: atomWithStorage(buildNSKey('view-style'), ViewStyle.Table),

    selectionAtom: atom(new Set<string>()),
  }
}

const ListTableContext = createContext<ListTableContextValue>(null!)

type ListTableContextValue = ReturnType<typeof createDefaultCtxValue>

type HeaderProps = {
  onNewClick?: () => void
  onBatchDeleteClick?: (ids: string[]) => void
  canDisplayCardView: boolean
}

const Header: FC<HeaderProps> = ({
  canDisplayCardView,
  onNewClick,
  onBatchDeleteClick,
}) => {
  const { viewStyleAtom, selectionAtom } = useContext(ListTableContext)
  const [viewStyle, setViewStyle] = useAtom(viewStyleAtom)
  const [selection, setSelection] = useAtom(selectionAtom)

  const { present } = useModalStack()
  const hasSelection = selection.size > 0

  const actionButtonClick = useEventCallback(() => {
    if (hasSelection) {
      present({
        title: '删除',
        content: ({ dismiss }) => (
          <div className="flex w-full flex-col">
            <span>
              {/* {t('common.delete')} {selection.size} {t('common.items')}? */}
            </span>
            <div className="flex w-full justify-end">
              {/* <Button
                color="destructive"
                onClick={() => {
                  onBatchDeleteClick?.(Array.from(selection))
                  setSelection(new Set())
                  dismiss()
                }}
              >
                {t('common.sure')}
              </Button> */}
            </div>
          </div>
        ),
      })
    } else {
      onNewClick?.()
    }
  })
  const isMobile = useIsMobile()
  return (
    <div className="mb-6 flex h-12 justify-between space-x-2">
      {/* {!isMobile && canDisplayCardView ? (
        <Button
          iconOnly
          variant="outline"
          color="secondary"
          onClick={() => {
            setViewStyle((prev) => {
              if (prev === ViewStyle.Table) {
                return ViewStyle.List
              }
              return ViewStyle.Table
            })
          }}
        >
          {viewStyle === ViewStyle.Table ? (
            <i className="icon-[mingcute--table-2-line]" />
          ) : (
            <i className="icon-[mingcute--menu-line]" />
          )}
        </Button>
      ) : (
        <b />
      )} */}

      <div className="space-x-2">
        {/* <SortAndFilterButton /> */}

        {(onNewClick || onBatchDeleteClick) && (
          <StyledButton
            onClick={actionButtonClick}
            color={hasSelection ? 'destructive' : 'primary'}
            // icon={
            //   hasSelection ? (
            //     <i className="icon-[mingcute--delete-2-line]" />
            //   ) : (
            //     <AddCircleLine />
            //   )
            // }
          >
            {hasSelection ? '删除' : '新建'}
          </StyledButton>
        )}
      </div>
    </div>
  )
}

type DataBaseType = {
  id: string
  title: string
  isPublished?: boolean
  created?: string | Date
}

type ListTableWrapperProps<Data extends DataBaseType> = PropsWithChildren<{
  data?: PaginateResult<Data> | null | Data[]
  isLoading?: boolean
  renderTableRowKeyValue?: (data: Data) => React.ReactNode
}> &
  Partial<Pick<CardsRenderProps<Data>, 'renderCardBody' | 'renderCardFooter'>> &
  Omit<HeaderProps, 'canDisplayCardView'> & {
    tableClassName?: string
  }

export const ListTable = <Data extends DataBaseType>({
  onNewClick,
  onBatchDeleteClick,
  data,
  isLoading,
  renderTableRowKeyValue: renderPostKeyValue,
  columns,
  renderCardBody,
  renderCardFooter,
  tableClassName,
}: ListTableWrapperProps<Data>) => {
  const ctxValue = useMemo(createDefaultCtxValue, [])
  const [page, , setPage] = useQueryPager()
  const isMobile = useIsMobile()
  const viewStyle = useAtomValue(ctxValue.viewStyleAtom)

  if (!data) {
    return <AbsoluteCenterSpinner />
  }
  const { data: listData, pagination } = Array.isArray(data)
    ? { data, pagination: null }
    : data || {}

  const canDisplayCardView = !!renderCardBody && !!renderCardFooter

  return (
    <ListTableContext.Provider value={ctxValue}>
      <Header
        canDisplayCardView={canDisplayCardView}
        onNewClick={onNewClick}
        onBatchDeleteClick={onBatchDeleteClick}
      />

      {/* {(viewStyle == ViewStyle.Table && !isMobile) || !canDisplayCardView ? (
        <TableRender
          data={listData}
          renderPostKeyValue={renderPostKeyValue}
          columns={columns}
          isLoading={isLoading}
          tableClassName={tableClassName}
        />
      ) : (
        <CardsRender
          data={listData}
          renderCardBody={renderCardBody}
          renderCardFooter={renderCardFooter}
          isLoading={isLoading}
        />
      )} */}

      <CardsRender
        data={listData}
        renderCardBody={renderCardBody!}
        renderCardFooter={renderCardFooter!}
        isLoading={isLoading}
      />

      {/* {!!pagination && pagination.totalPage > 1 && (
        <motion.div
          layout="position"
          className="mt-8 flex w-full flex-shrink-0 items-center justify-end gap-4"
        >
          <Pagination
            showControls
            total={pagination.totalPage}
            initialPage={page}
            variant="light"
            onChange={setPage}
          />
        </motion.div>
      )} */}
    </ListTableContext.Provider>
  )
}

// type ColDataType = 'text' | 'datetime' | 'number'
// export type ListColumn<T, Key extends string = string> = Omit<
//   TableColumnProps<T>,
//   'key' | 'children'
// > & {
//   label: ReactNode
//   key: Key
//   render?: (data: T) => ReactNode

//   type?: ColDataType
// }

// interface TableRenderProps<
//   T extends DataBaseType,
//   Col extends ListColumn<T> = ListColumn<T>,
//   Cols extends Col[] = Col[],
// > {
//   isLoading?: boolean
//   columns: Cols
//   renderPostKeyValue?: (data: T, key: Cols[number]['key']) => React.ReactNode
//   data?: T[]

//   tableClassName?: string
// }

// const TableRender = <T extends DataBaseType>({
//   isLoading,
//   data,
//   columns,
//   renderPostKeyValue,
//   tableClassName: className,
// }: TableRenderProps<T>) => {
//   const { selectionAtom } = useContext(ListTableContext)
//   const [selection, setSelection] = useAtom(selectionAtom)

//   const [memoColumns] = useState(columns)
//   const colKeyMap = useMemo(() => {
//     return memoColumns.reduce(
//       (prev, curr) => {
//         prev[curr.key] = curr
//         return prev
//       },
//       {} as Record<string, ListColumn<T>>,
//     )
//   }, [memoColumns])

//   const renderValue = useCallback(
//     (payload: {
//       item: T
//       key: string
//       col: ListColumn<T>
//       type?: ColDataType
//     }) => {
//       const { item, key } = payload
//       switch (payload.type) {
//         case 'datetime': {
//           if (!item[key]) return '-'
//           return <RelativeTime time={item[key]} />
//         }
//         case 'number':
//           return formatNumber(+get(item, key) ?? 0)
//         case 'text':
//         default:
//           return get(item, key) ?? ''
//       }
//     },
//     [],
//   )
//   return (
//     <Table
//       className={clsxm(
//         'relative min-h-[32.8rem] flex-grow overflow-auto bg-transparent [&_table]:min-w-[1000px]',
//         className,
//       )}
//       removeWrapper
//       selectionMode="multiple"
//       onSelectionChange={useEventCallback((e) => {
//         if (e === 'all') {
//           setSelection(new Set(data!.map((item) => item.id)))
//           return
//         }
//         setSelection(new Set(e) as Set<string>)
//       })}
//       selectedKeys={selection}
//       isHeaderSticky
//     >
//       <TableHeader>
//         {memoColumns.map((column) => (
//           // @ts-expect-error
//           <TableColumn key={column.key} {...column}>
//             {column.label}
//           </TableColumn>
//         ))}
//       </TableHeader>
//       <TableBody
//         loadingState={isLoading ? 'loading' : 'idle'}
//         loadingContent={
//           <Spinner className="absolute inset-0 flex items-center justify-center" />
//         }
//         emptyContent={<Empty />}
//         items={data || []}
//       >
//         {(item) => (
//           <TableRow key={item!.id}>
//             {(columnKey) => (
//               <TableCell>
//                 {colKeyMap[columnKey as string].render?.(item) ??
//                   renderPostKeyValue?.(item! as any, columnKey as any) ??
//                   renderValue({
//                     item,
//                     key: columnKey as any,
//                     col: colKeyMap[columnKey as string],
//                     type: colKeyMap[columnKey as string].type,
//                   })}
//               </TableCell>
//             )}
//           </TableRow>
//         )}
//       </TableBody>
//     </Table>
//   )
// }

interface CardsRenderProps<T extends DataBaseType> {
  isLoading?: boolean
  renderCardBody: (data: T) => React.ReactNode
  renderCardFooter: (data: T) => React.ReactNode
  data: T[]
}

const CardsRender = <T extends DataBaseType>({
  data,
  renderCardBody,
  renderCardFooter,
  isLoading,
}: CardsRenderProps<T>) => {
  const columnsCountBreakPoints = useRefValue(() => ({
    640: 1,
    768: 2,
    1024: 3,
    1280: 4,
    1536: 5,
    1920: 6,
  }))

  return (
    <ResponsiveMasonry
      className="relative min-h-[32.8rem] flex-grow"
      columnsCountBreakPoints={columnsCountBreakPoints}
    >
      <Masonry gutter="16px">
        {data.map((item) => (
          <MemoedCard
            item={item}
            renderCardBody={renderCardBody}
            renderCardFooter={renderCardFooter}
            key={item.id}
          />
        ))}
      </Masonry>
    </ResponsiveMasonry>
  )
}
const MemoedCardImpl = <T extends DataBaseType>({
  item,

  renderCardBody,
  renderCardFooter,
}: {
  item: T
} & Pick<CardsRenderProps<T>, 'renderCardBody' | 'renderCardFooter'>) => {
  const { selectionAtom } = useContext(ListTableContext)
  const store = useStore()

  return <div>{item.created ? <RelativeTime date={item.created} /> : null}</div>
  // return (
  //   <Card
  //     as={MotionDivToBottom}
  //     shadow="none"
  //     className="ring-1 ring-zinc-200/60 dark:ring-neutral-800/70"
  //     key={item.id}
  //   >
  //     <CardHeader className="flex justify-between gap-2 px-5">
  //       <TitleExtra className="text-lg font-medium" data={item} />

  //       <span className="flex-shrink-0 opacity-60">
  //         {item.created ? <RelativeTime time={item.created} /> : null}
  //       </span>
  //     </CardHeader>
  //     <Divider />
  //     <CardBody className="text-small flex flex-col gap-2 px-5">
  //       {renderCardBody(item)}
  //     </CardBody>
  //     <CardFooter className="bg-foreground-100/50 flex justify-between !py-1">
  //       <Checkbox
  //         size="sm"
  //         defaultSelected={store.get(selectionAtom).has(item.id)}
  //         onValueChange={(value) => {
  //           store.set(selectionAtom, (prev) => {
  //             if (value) {
  //               prev.add(item.id)
  //             } else {
  //               prev.delete(item.id)
  //             }
  //             return new Set(prev)
  //           })
  //         }}
  //       />
  //       {renderCardFooter(item)}
  //     </CardFooter>
  //   </Card>
  // )
}
const MemoedCard = memo(MemoedCardImpl) as typeof MemoedCardImpl
