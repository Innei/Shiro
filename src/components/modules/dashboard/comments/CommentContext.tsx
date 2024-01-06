import { createContext, useContext } from 'react'
import { createContextState } from 'foxact/create-context-state'
import type {
  CommentModel,
  CommentState,
  NoteModel,
  PaginateResult,
  PostModel,
} from '@mx-space/api-client'
import type { InfiniteData } from '@tanstack/react-query'

export const CommentStateContext = createContext<CommentState>(null!)
interface CommentDataSourceContextType {
  isLoading: boolean
  data?: InfiniteData<PaginateResult<CommentModel>>
}

export const CommentDataSourceContext =
  createContext<CommentDataSourceContextType>(null!)
export const CommentDataContext = createContext<{
  refModelMap: Map<string, PostModel | NoteModel>
}>(null!)
export const useCommentDataSource = () => useContext(CommentDataSourceContext)

export const [
  CommentSelectionKeysProvider,
  useCommentSelectionKeys,
  useSetCommentSelectionKeys,
] = createContextState(new Set<string>())
