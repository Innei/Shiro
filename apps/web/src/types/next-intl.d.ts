import type messages from '../messages/zh'

type Messages = typeof messages

declare global {
  type IntlMessages = Messages
}
