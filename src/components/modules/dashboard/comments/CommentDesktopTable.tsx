import { memo } from 'react'
import type { CommentModel } from '@mx-space/api-client'

import { CommentAuthorCell } from './CommentAuthorCell'
import { CommentContentCell } from './CommentContentCell'
import {
  useCommentDataSource,
  useCommentSelectionKeys,
  useSetCommentSelectionKeys,
} from './CommentContext'

export const CommentDesktopTable = () => {
  const { data, isLoading } = useCommentDataSource()

  const selectionKeys = useCommentSelectionKeys()
  const setSelectionKeys = useSetCommentSelectionKeys()

  const flatData = data?.pages.flatMap((page) => page.data)
  return (
    <div className="mt-16 flex flex-col gap-3">
      {flatData?.map((item) => {
        return <MemoCommentItem key={item.id} comment={item} />
      })}
    </div>
  )

  // const t = useI18n()
  // const { data, isLoading } = useCommentDataSource()

  // const selectionKeys = useCommentSelectionKeys()
  // const setSelectionKeys = useSetCommentSelectionKeys()
  // return (
  //   // <ScrollArea.ScrollArea rootClassName="mt-4 flex-shrink h-0 flex-grow">
  //   <div className="relative flex h-0 flex-shrink flex-grow flex-col overflow-auto">
  //     {isLoading && (
  //       <Spinner className="absolute inset-0 z-[10] flex items-center justify-center" />
  //     )}
  //     <Table
  //       selectedKeys={selectionKeys}
  //       onSelectionChange={(key) => {
  //         if (key === 'all') {
  //           setSelectionKeys(new Set(data?.map((item) => item.id)))
  //           return
  //         }
  //         setSelectionKeys(key as Set<string>)
  //       }}
  //       removeWrapper
  //       isHeaderSticky
  //       selectionMode="multiple"
  //       className="mt-4 flex-grow [&_tr:first-child_td]:border-t-[1rem] [&_tr:first-child_td]:border-t-transparent"
  //     >
  //       <TableHeader>
  //         <TableColumn key="author">{t('common.author')}</TableColumn>
  //         <TableColumn key="content">{t('common.content')}</TableColumn>
  //       </TableHeader>
  //       <TableBody
  //         className={isLoading ? 'pointer-events-none opacity-80' : ''}
  //         items={data || []}
  //         emptyContent={<Empty />}
  //       >
  //         {(item) => {
  //           const itemOmitRef = omit(item, 'ref') as CommentModel
  //           return (
  //             <TableRow key={item.id}>
  //               <TableCell width={400}>
  //                 <CommentAuthorCell {...itemOmitRef} />
  //               </TableCell>
  //               <TableCell className="align-top" width={2000} key="content">
  //                 <CommentContentCell {...itemOmitRef} />
  //               </TableCell>
  //             </TableRow>
  //           )
  //         }}
  //       </TableBody>
  //     </Table>
  //   </div>

  //   // </ScrollArea.ScrollArea>
  // )
}

const CommentItem = ({ comment }: { comment: CommentModel }) => {
  return (
    <div className="grid grid-cols-[80px_300px_auto] gap-3">
      <div />
      <CommentAuthorCell className="mt-0" comment={comment} />
      <CommentContentCell className="mt-0" comment={comment} />
    </div>
  )
}
const MemoCommentItem = memo(CommentItem)
