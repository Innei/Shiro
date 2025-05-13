// @ts-nocheck
import { Tag } from '../../tag/Tag'

export const MTag: Component = ({ children }) => {
  const text = children?.[0]
  if (typeof text !== 'string') return null
  return <Tag className="rounded-full px-3 py-0" text={children[0]} />
}
