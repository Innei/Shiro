import { NormalContainer } from '~/components/layout/container/Normal'
import { Loading } from '~/components/ui/loading'

export default function PostListLoading() {
  return (
    <NormalContainer>
      <Loading useDefaultLoadingText />
    </NormalContainer>
  )
}
