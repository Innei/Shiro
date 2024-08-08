import { Provider } from 'jotai'

import { jotaiStore } from '~/lib/store'

export const JotaiStoreProvider: Component = ({ children }) => (
  <Provider store={jotaiStore}>{children}</Provider>
)
