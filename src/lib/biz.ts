import { getCurrentNoteData } from '~/providers/note/CurrentNoteDataProvider'
import { getGlobalCurrentPostData } from '~/providers/post/CurrentPostDataProvider'

import { isServerSide } from './env'

export const getCurrentPageId = () => {
  if (isServerSide) return
  const pathname = window.location.pathname

  if (pathname.startsWith('/notes/')) {
    const noteId = getCurrentNoteData()

    return noteId?.data.id
  }

  if (pathname.startsWith('/posts/')) {
    return getGlobalCurrentPostData().id
  }
}
