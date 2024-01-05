import { SidebarDateInputField } from '../../writing/SidebarDateInputField'
import { usePostModelSingleFieldAtom } from '../data-provider'

export const CustomCreatedInput = () => {
  return (
    <SidebarDateInputField getSet={usePostModelSingleFieldAtom('created')} />
  )
}
