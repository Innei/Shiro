import { ImageLazy } from '~/components/ui/image'
import { FlexText } from '~/components/ui/text'
import { clsxm } from '~/lib/helper'

export const ProjectIcon: Component<{ avatar?: string; name?: string }> = (
  props,
) => {
  const { avatar, name, className } = props
  return (
    <div
      className={clsxm(
        'project-icon flex shrink-0 grow items-center justify-center',
        avatar
          ? 'ring-2 ring-slate-200 dark:ring-neutral-800'
          : 'bg-slate-300 text-white dark:bg-neutral-800',
        'mask mask-squircle aspect-square transition-all duration-300',
        className,
      )}
    >
      {avatar ? (
        <ImageLazy
          className="aspect-square rounded-xl transition-shadow duration-300"
          src={avatar}
        />
      ) : (
        <FlexText text={name?.charAt(0).toUpperCase() || ''} scale={0.5} />
      )}
    </div>
  )
}
