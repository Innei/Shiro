export interface Rule<T = unknown> {
  message: string
  validator: (value: T) => boolean | Promise<boolean>
}

type ValidateStatus = 'error' | 'success'
export interface Field {
  rules: (Rule<any> & { status?: ValidateStatus })[]

  $ref: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null
}

export type FormFieldBaseProps<T> = {
  rules?: Rule<T>[]
}
