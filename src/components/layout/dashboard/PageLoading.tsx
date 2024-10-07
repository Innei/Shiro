import { AbsoluteCenterSpinner } from '~/components/ui/spinner'

interface Props {
  loadingText?: string
}

export const PageLoading: Component<Props> = (props) => (
  <AbsoluteCenterSpinner className="!fixed">
    <span>{props.loadingText}</span>
  </AbsoluteCenterSpinner>
)
