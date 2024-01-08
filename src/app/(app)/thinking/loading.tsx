import { Loading } from '~/components/ui/loading'

export default function Load() {
  return (
    <div className="flex h-[240px] w-full center">
      <Loading useDefaultLoadingText />
    </div>
  )
}
