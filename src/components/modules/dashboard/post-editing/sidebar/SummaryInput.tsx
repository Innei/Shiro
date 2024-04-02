import { TextArea } from '~/components/ui/input'

import { SidebarSection } from '../../writing/SidebarBase'
import { usePostModelSingleFieldAtom } from '../data-provider'

export const SummaryInput = () => {
  const [summary, setSummary] = usePostModelSingleFieldAtom('summary')

  return (
    <SidebarSection label="摘要" className="relative">
      <TextArea
        className="p-2 focus-visible:border-accent"
        rounded="md"
        placeholder="摘要"
        value={summary || ''}
        onChange={(e) => {
          setSummary(e.target.value)
        }}
      />
    </SidebarSection>
  )
}
