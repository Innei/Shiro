import clsx from 'clsx'

export const Paper: Component = ({ children }) => {
  return (
    <main
      className={clsx(
        'relative bg-slate-50 dark:bg-zinc-900 md:col-start-1 lg:col-auto',
        '-m-4 p-[2rem_1rem] md:m-0 lg:p-[30px_45px]',
        'rounded-[0_6px_6px_0] border-neutral-100 shadow-sm dark:border-neutral-800 dark:shadow-[#333] lg:border',
        'note-layout-main',
      )}
    >
      {children}
    </main>
  )
}
