import type {
  BlockAnchor as BaseBlockAnchor,
  RangeAnchor as BaseRangeAnchor,
} from '@haklex/rich-editor'

export interface BlockAnchor extends BaseBlockAnchor {
  lang?: string | null
}

export interface RangeAnchor extends BaseRangeAnchor {
  lang?: string | null
}

export type CommentAnchor = BlockAnchor | RangeAnchor

export interface CommentBaseProps {
  afterSubmit?: () => void

  anchor?: CommentAnchor | null
  autoFocus?: boolean

  compact?: boolean
  initialValue?: string
  refId: string
}
