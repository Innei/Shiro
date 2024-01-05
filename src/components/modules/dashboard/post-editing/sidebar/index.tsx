import { PresentComponentFab } from '../../writing/PresentComponentFab'
import { SidebarWrapper } from '../../writing/SidebarBase'
import { CategorySelector } from './CategorySelector'
import { PostCombinedSwitch } from './PostCombinedSwitch'
import { TagsInput } from './TagsInput'

const Sidebar = () => {
  return (
    <SidebarWrapper>
      <CategorySelector />
      <TagsInput />
      <PostCombinedSwitch />
      {/* 
      <TagsInput />
      <RelatedPostSelector />
      <SummaryInput />
      <PostCombinedSwitch />
      <CustomCreatedInput />

      <PostImageSection />
      <PostMetaSection /> */}
    </SidebarWrapper>
  )
}

// const PostImageSection = () => {
//   const [images, setImages] = usePostModelSingleFieldAtom('images')
//   const text = usePostModelSingleFieldAtom('text')[0]
//   return (
//     <ImageDetailSection
//       images={images}
//       onChange={setImages}
//       text={text}
//       withDivider="both"
//     />
//   )
// }

// const PostMetaSection = () => {
//   const [meta, setMeta] = usePostModelSingleFieldAtom('meta')
//   return <MetaKeyValueEditSection keyValue={meta} onChange={setMeta} />
// }

export const PostEditorSidebar = () => {
  return (
    <div className="hidden flex-col lg:flex">
      <Sidebar />

      <PresentComponentFab Component={Sidebar} />
    </div>
  )
}
