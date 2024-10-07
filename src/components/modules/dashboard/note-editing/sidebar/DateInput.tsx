import { SidebarDateInputField } from '../../writing/SidebarDateInputField'
import { useNoteModelSingleFieldAtom } from '../data-provider'

export const CustomCreatedInput = () => (
  <SidebarDateInputField getSet={useNoteModelSingleFieldAtom('created')} />
)

export const PublicAtInput = () => (
  <SidebarDateInputField
    getSet={useNoteModelSingleFieldAtom('created')}
    label="发布于"
  />
)
