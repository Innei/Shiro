import { AbsoluteCenterSpinner } from '~/components/ui/spinner'

interface Props {
  loadingText?: string
}

export const PageLoading: Component<Props> = (props) => {
  return (
    <AbsoluteCenterSpinner>
      <span>{props.loadingText}</span>
    </AbsoluteCenterSpinner>
  )
}
