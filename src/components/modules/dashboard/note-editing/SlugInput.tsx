import { useNoteModelSingleFieldAtom } from './data-provider'

export const SlugInput = () => {
  const webUrl = location.origin

  const [nid, setNid] = useNoteModelSingleFieldAtom('nid')

  const isLoading = !nid
  return (
    <>
      {isLoading ? (
        <div className="h-2 w-[120px] animate-pulse bg-white " />
      ) : (
        <label className="text-base-content">{`${webUrl}/notes/`}</label>
      )}

      <div className="relative ml-1 inline-flex min-w-[2rem] items-center overflow-hidden rounded-md bg-white py-1 dark:bg-zinc-900 [&_*]:leading-4">
        <input
          className="input input-sm absolute w-full translate-y-[1px] !border-0 bg-transparent !outline-none"
          value={nid}
          onChange={(e) => {
            setNid(e.target.value)
          }}
        />
        <span className="pointer-events-none whitespace-nowrap text-transparent">
          {nid}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span>
      </div>
    </>
  )
}
