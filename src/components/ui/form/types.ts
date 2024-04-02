import type { DetailedHTMLProps, InputHTMLAttributes } from 'react'

export interface Rule<T = unknown> {
  message: string
  validator: (value: T) => boolean | Promise<boolean>
}

type ValidateStatus = 'error' | 'success'
export interface Field {
  rules: (Rule<any> & { status?: ValidateStatus })[]
  /**
   * `getCurrentValues` will return the transformed value
   * @param value field value
   */
  transform?: <X, T = string>(value: T) => X

  $ref: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null
}

export interface FormFieldBaseProps<T> extends Pick<Field, 'transform'> {
  rules?: Rule<T>[]
  name: string
}

export type InputFieldProps<T = string> = Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'name'
> &
  FormFieldBaseProps<T>
