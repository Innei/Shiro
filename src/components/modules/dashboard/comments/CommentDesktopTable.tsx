export const CommentDesktopTable = () => {
  return null
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
