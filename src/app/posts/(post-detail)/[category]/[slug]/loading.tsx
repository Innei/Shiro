import { Loading } from '~/components/ui/loading'

export default () => (
  <div className="absolute inset-0 flex h-[120px] center">
    <Loading useDefaultLoadingText />
  </div>
)
