import { Loading } from '~/components/ui/loading'

export default function LoadingPage() {
  return (
    <div className="flex w-full center fill-content">
      <Loading useDefaultLoadingText />
    </div>
  )
}
