export interface Rule<T = unknown> {
  message: string
  validator: (value: T) => boolean
}
export interface Field {
  rules: Rule<any>[]
}

export type FormFieldBaseProps<T> = {
  rules?: Rule<T>[]
}
