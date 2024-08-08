import { XLogEnable } from '../../crossbell/XLogEnabled'
import { CoverInput } from '../../writing/CoverInput'
import { ImageDetailSection } from '../../writing/ImageDetailSection'
import { MetaKeyValueEditSection } from '../../writing/MetaKeyValueEditSection'
import { PresentComponentFab } from '../../writing/PresentComponentFab'
import { SidebarWrapper } from '../../writing/SidebarBase'
import { useNoteModelSingleFieldAtom } from '../data-provider'
import { NoteCombinedSwitch } from './NoteCombinedSwitch'
import { NoteWeatherAndMood } from './NoteWeatherAndMood'
import { TopicSelector } from './TopicSelector'

const Sidebar = () => (
  <SidebarWrapper>
    <NoteWeatherAndMood />
    <TopicSelector />
    <NoteCombinedSwitch />
    <XLogEnable />
    <NoteCoverInput />
    <ImageSection />
    <MetaSection />
  </SidebarWrapper>
)

const NoteCoverInput = () => (
  <CoverInput accessor={useNoteModelSingleFieldAtom('meta')} />
)
const ImageSection = () => {
  const [images, setImages] = useNoteModelSingleFieldAtom('images')
  const text = useNoteModelSingleFieldAtom('text')[0]
  return (
    <ImageDetailSection
      images={images}
      onChange={setImages}
      text={text}
      withDivider="both"
    />
  )
}

const MetaSection = () => {
  const [meta, setMeta] = useNoteModelSingleFieldAtom('meta')
  return <MetaKeyValueEditSection keyValue={meta} onChange={setMeta} />
}

export const NoteEditorSidebar = () => (
  <div className="hidden flex-col lg:flex">
    <Sidebar />

    <PresentComponentFab Component={Sidebar} />
  </div>
)
