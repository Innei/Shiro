import { BackToTopFAB, FABContainer } from '~/components/ui/fab'
import { OnlyMobile } from '~/components/ui/viewport/OnlyMobile'
import { TocFAB } from '~/components/widgets/toc/TocFAB'

import { Content } from '../content/Content'
import { Footer } from '../footer'
import { Header } from '../header'

export const Root: Component = ({ children }) => {
  return (
    <>
      <Header />
      <Content>{children}</Content>

      <Footer />
      <FABContainer>
        <BackToTopFAB />
        <OnlyMobile>
          <TocFAB />
        </OnlyMobile>
      </FABContainer>
    </>
  )
}
