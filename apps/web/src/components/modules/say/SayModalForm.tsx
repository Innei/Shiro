import type { SayModel } from '@mx-space/api-client'
import { useTranslations } from 'next-intl'
import type { FC } from 'react'
import { useRef } from 'react'

import { StyledButton } from '~/components/ui/button'
import type { FormContextType } from '~/components/ui/form'
import { Form, FormInput } from '~/components/ui/form'
import { FormTextarea } from '~/components/ui/form/FormTextarea'
import { useCurrentModal } from '~/components/ui/modal'
import { apiClient } from '~/lib/request'
import { toast } from '~/lib/toast'
import { queryClient } from '~/providers/root/react-query-provider'

import { sayQueryKey } from './hooks'

export const SayModalForm: FC<{
  editingData?: SayModel
}> = ({ editingData }) => {
  const t = useTranslations('says')
  const formRef = useRef<FormContextType>(null)
  const { dismiss } = useCurrentModal()
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const $form = formRef.current
    if (!$form) return
    e.preventDefault()
    const values = $form.getCurrentValues()

    if (editingData) {
      await apiClient.say.proxy(editingData.id).patch({
        data: {
          ...editingData,
          ...values,
        },
      })
      toast.success(t('update_success'))
    } else {
      await apiClient.say.proxy.post({
        data: {
          ...values,
        },
      })
      toast.success(t('publish_success'))
    }

    dismiss()
    queryClient.invalidateQueries({
      queryKey: sayQueryKey,
    })
  }

  return (
    <Form className="flex flex-col gap-2" onSubmit={handleSubmit} ref={formRef}>
      <FormTextarea
        className="field-sizing-content max-h-[300px] min-h-[120px]"
        name="text"
        placeholder={editingData?.text || t('content')}
        required
        defaultValue={editingData?.text}
      />
      <FormInput
        name="source"
        placeholder={editingData?.source || t('source')}
        defaultValue={editingData?.source}
      />
      <FormInput
        name="author"
        placeholder={editingData?.author || t('author')}
        defaultValue={editingData?.author}
      />

      <div className="flex justify-end">
        <StyledButton type="submit">
          {editingData ? t('update') : t('publish')}
        </StyledButton>
      </div>
    </Form>
  )
}
