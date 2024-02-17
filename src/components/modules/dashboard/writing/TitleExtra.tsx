import { PhEyeSlash } from '~/components/icons/EyeSlashIcon'
import { MotionButtonBase } from '~/components/ui/button'
import { EllipsisHorizontalTextWithTooltip } from '~/components/ui/typography'
import { clsxm } from '~/lib/helper'
import { apiClient } from '~/lib/request'

type RequiredField = { id: string; title: string }
type OptionalField = Partial<{
  hide: boolean
  pin: string | null
}>

export const TitleExtra = <T extends RequiredField & OptionalField>(props: {
  data: T
  className?: string
}) => {
  const { className, data } = props
  const { title, id, hide, pin } = data

  return (
    <div className={clsxm('relative flex w-[300px] items-center', className)}>
      <div className="relative flex w-0 min-w-0 flex-grow flex-row items-center space-x-2 [&_i]:opacity-60 [&_svg]:opacity-60">
        {pin && <i className="icon-[mingcute--pin-line] !text-warning" />}
        <div className="relative flex min-w-0 flex-shrink items-center">
          <EllipsisHorizontalTextWithTooltip wrapperClassName="inline-block !w-auto max-w-full">
            {title}
          </EllipsisHorizontalTextWithTooltip>
          <div className="absolute bottom-0 right-[-8px] top-0 flex translate-x-full items-center space-x-2">
            {hide && <PhEyeSlash />}
            <MotionButtonBase
              className="inline-flex items-center"
              onClick={async () => {
                const url = await apiClient.proxy
                  .helper('url-builder')(id)
                  .get<{
                    data: string
                  }>()

                window.open(url?.data, '_blank')
              }}
            >
              <i className="icon-[mingcute--arrow-right-up-line]" />
            </MotionButtonBase>
          </div>
        </div>
      </div>
    </div>
  )
}
