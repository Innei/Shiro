export interface CommentBaseProps {
  refId: string

  afterSubmit?: () => void
  initialValue?: string
}
