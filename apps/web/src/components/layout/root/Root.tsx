import { ClientOnly } from '~/components/common/ClientOnly'
import { FABContainer } from '~/components/ui/fab'

import { Content } from '../content/Content'
import { Footer } from '../footer'
import { Header } from '../header'
import { RootDataAttributeBinder } from './RootDataAttributeBinder'

export const Root: Component = ({ children }) => (
  <>
    <Header />
    <Content>{children}</Content>

    <Footer />
    <ClientOnly>
      <FABContainer />
      <RootDataAttributeBinder />
    </ClientOnly>
  </>
)
