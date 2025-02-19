import { EmptyIcon } from '~/components/icons/empty'
import { NormalContainer } from '~/components/layout/container/Normal'

export const NothingFound: Component = () => {
  return (
    <NormalContainer className="center flex h-[500px] flex-col space-y-4 [&_p]:my-4">
      <EmptyIcon />
      <p>这里空空如也</p>
      <p>稍后再来看看吧！</p>
    </NormalContainer>
  )
}
