import { Label } from './Label'

export const ErrorLabelLine = ({
  errorMessage,
  id,
}: {
  id: string
  errorMessage: string
}) => {
  return (
    <div className="mt-2">
      <Label className="text-xs font-medium text-error" htmlFor={id}>
        {errorMessage}
      </Label>
    </div>
  )
}
