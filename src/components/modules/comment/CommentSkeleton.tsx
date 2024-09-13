const CommentSkeletonSingle = (
  <li className="content-auto relative list-none">
    <div className="group flex w-full items-stretch gap-2">
      <div className="flex w-9 shrink-0 items-end">
        <div className="size-9 rounded-full bg-gray-300 dark:bg-neutral-600" />
      </div>

      <div className="flex w-full min-w-0 flex-1 flex-col items-start">
        <span className="relative mb-2 flex w-full min-w-0 items-center justify-center gap-2">
          <span className="flex grow items-center gap-2">
            <span className="ml-2 h-4 w-20 bg-gray-300 dark:bg-neutral-600" />
            <span className="flex select-none items-center space-x-2">
              <span className="inline-flex h-4 w-20 bg-gray-300 text-[0.71rem] font-medium opacity-40 dark:bg-neutral-600" />
              <span className="h-4 w-20 bg-gray-300 text-[0.71rem] opacity-30 dark:bg-neutral-600" />
            </span>
          </span>
        </span>

        <div className="relative flex w-full flex-col gap-2">
          <div className="relative ml-2 inline-block h-4 w-[calc(100%-3rem)] rounded-xl bg-gray-300 px-2 py-1 dark:bg-neutral-600" />
          <div className="relative ml-2 inline-block h-4 w-[120px] rounded-xl bg-gray-300 px-2 py-1 dark:bg-neutral-600" />
        </div>
      </div>
    </div>

    <span className="sr-only">Loading...</span>
  </li>
)

export const CommentSkeleton: Component = () => (
  <div className="flex min-h-[400px] flex-col space-y-4">
    {CommentSkeletonSingle}
    {CommentSkeletonSingle}
    {CommentSkeletonSingle}
    {CommentSkeletonSingle}
    {CommentSkeletonSingle}
  </div>
)
