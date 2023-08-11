// @ts-nocheck
import { Tag } from '../../tag/Tag'

export const MTag: Component = ({ children }) => {
  const text = children?.[0]
  if (typeof text !== 'string') return null
  return <Tag text={children[0]} />
}
