import { XLogEnable } from '../../crossbell/XLogEnabled'
import { ImageDetailSection } from '../../writing/ImageDetailSection'
import { MetaKeyValueEditSection } from '../../writing/MetaKeyValueEditSection'
import { PresentComponentFab } from '../../writing/PresentComponentFab'
import { SidebarWrapper } from '../../writing/SidebarBase'
import { usePostModelSingleFieldAtom } from '../data-provider'
import { CategorySelector } from './CategorySelector'
import { PostCombinedSwitch } from './PostCombinedSwitch'
import { RelatedPostSelector } from './RelatedPostSelector'
import { SummaryInput } from './SummaryInput'
import { TagsInput } from './TagsInput'

const Sidebar = () => (
  <SidebarWrapper>
    <CategorySelector />
    <RelatedPostSelector />
    <TagsInput />
    <PostCombinedSwitch />
    <SummaryInput />
    <XLogEnable />
    <PostImageSection />
    <PostMetaSection />
  </SidebarWrapper>
)

const PostImageSection = () => {
  const [images, setImages] = usePostModelSingleFieldAtom('images')
  const text = usePostModelSingleFieldAtom('text')[0]
  return (
    <ImageDetailSection
      images={images}
      onChange={setImages}
      text={text}
      withDivider="both"
    />
  )
}

const PostMetaSection = () => {
  const [meta, setMeta] = usePostModelSingleFieldAtom('meta')
  return <MetaKeyValueEditSection keyValue={meta} onChange={setMeta} />
}

export const PostEditorSidebar = () => (
  <div className="hidden flex-col lg:flex">
    <Sidebar />

    <PresentComponentFab Component={Sidebar} />
  </div>
)
