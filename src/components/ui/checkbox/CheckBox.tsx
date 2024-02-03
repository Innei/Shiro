import { useId } from 'react'
import clsx from 'clsx'
import type { FC } from 'react'

export const CheckBoxLabel: FC<{
  label: string
  checked?: boolean
  onCheckChange?: (checked: boolean) => void
  disabled?: boolean
}> = ({ label, checked, disabled, onCheckChange }) => {
  const id = useId()
  return (
    <div className="inline-flex items-center gap-2">
      <input
        onChange={(e) => {
          if (disabled) return
          onCheckChange?.(e.target.checked)
        }}
        disabled={disabled}
        checked={checked}
        type="checkbox"
        className={clsx(
          'checkbox-accent checkbox',
          disabled && 'cursor-not-allowed opacity-50',
        )}
        id={id}
      />
      <label
        htmlFor={id}
        className={clsx(
          'text-sm text-gray-500',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        {label}
      </label>
    </div>
  )
}
