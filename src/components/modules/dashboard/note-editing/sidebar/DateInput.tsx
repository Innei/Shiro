import { SidebarDateInputField } from '../../writing/SidebarDateInputField'
import { useNoteModelSingleFieldAtom } from '../data-provider'

export const CustomCreatedInput = () => {
  return (
    <SidebarDateInputField getSet={useNoteModelSingleFieldAtom('created')} />
  )
}

export const PublicAtInput = () => {
  return (
    <SidebarDateInputField
      getSet={useNoteModelSingleFieldAtom('created')}
      label="发布于"
    />
  )
}
