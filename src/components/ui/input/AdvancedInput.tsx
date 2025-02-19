import clsx from 'clsx'
import type { ContextType, FC, PropsWithChildren } from 'react'
import * as React from 'react'
import { createContext, useContext, useEffect, useId } from 'react'
import { tv } from 'tailwind-variants'

import { clsxm } from '~/lib/helper'
import { isUndefined, merge } from '~/lib/lodash'

import { MotionButtonBase } from '../button'
import { ErrorLabelLine } from '../label'
import { Label } from '../label/Label'

const InputPropsContext = createContext<
  Pick<
    AdvancedInputProps,
    'labelPlacement' | 'inputClassName' | 'labelClassName'
  >
>({})

const useAdvancedInputPropsContext = () => useContext(InputPropsContext)

export const AdvancedInputProvider: FC<
  ContextType<typeof InputPropsContext> & PropsWithChildren
> = ({ children, ...props }) => {
  return (
    <InputPropsContext.Provider value={props}>
      {children}
    </InputPropsContext.Provider>
  )
}

export interface AdvancedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  labelPlacement?: 'top' | 'left' | 'inside'
  labelClassName?: string
  inputClassName?: string
  isLoading?: boolean
  endContent?: React.ReactNode

  errorMessage?: string
  isInvalid?: boolean

  bindValue?: string
}

export const AdvancedInput = React.forwardRef<
  HTMLInputElement,
  AdvancedInputProps
>((props, ref) => {
  const {
    className,
    type,
    label,

    isLoading,
    errorMessage,
    isInvalid,
    endContent,

    labelPlacement: _,
    inputClassName: __,

    bindValue,

    ...inputProps
  } = props
  const id = useId()

  const ctxProps = useAdvancedInputPropsContext()

  const { value, onChange, onBlur, onFocus, labelClassName, ...rest } =
    inputProps

  const [isFocused, setIsFocused] = React.useState(false)
  const handleFocus = React.useCallback(() => {
    setIsFocused(true)
  }, [])
  const handleBlur = React.useCallback(() => {
    setIsFocused(false)
  }, [])

  const [inputValue, setValue] = React.useState(inputProps.value)

  useEffect(() => {
    setValue(inputProps.value)
  }, [inputProps.value])

  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false)

  const mergedProps = merge({}, ctxProps, props)
  const { labelPlacement = 'top' } = mergedProps

  const labelClassNames = clsxm(ctxProps.inputClassName, props.labelClassName)
  const inputClassNames = clsxm(ctxProps.inputClassName, props.inputClassName)

  return (
    <div className="flex w-full flex-col">
      <div
        className={clsxm(
          {
            'flex flex-col': labelPlacement === 'top',
            'flex grow flex-row items-center': labelPlacement === 'left',
          },
          'peer relative',
          className,
        )}
      >
        {label && (
          <Label
            className={clsx(
              {
                'mr-4': labelPlacement === 'left',
                'mb-2 flex': labelPlacement === 'top',
              },
              labelPlacement === 'inside' && {
                'absolute left-3 top-2 z-[1] select-none duration-200': true,
                'text-primary': isFocused,
                'bottom-2 top-2 flex items-center text-lg':
                  !value && !isFocused,
              },
              labelClassNames,
            )}
            htmlFor={id}
          >
            {label}
          </Label>
        )}
        <div className="relative grow">
          <input
            id={id}
            value={isUndefined(bindValue) ? inputValue : bindValue}
            onChange={(e) => {
              setValue(e.target.value)
              onChange?.(e)
            }}
            onBlur={(e) => {
              handleBlur()
              onBlur?.(e)
            }}
            onFocus={(e) => {
              handleFocus()
              onFocus?.(e)
            }}
            type={
              type === 'password' && !isPasswordVisible ? 'password' : 'text'
            }
            className={clsxm(
              'flex h-10 w-full rounded-md border px-3 py-2 text-sm',
              'focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50',
              'border-zinc-200 bg-white placeholder:text-slate-500 focus-visible:border-primary dark:border-neutral-800 dark:bg-zinc-900',
              // 'placeholder:text-muted-foreground   border-base-200 bg-base-100 focus-visible:border-primary ',
              labelPlacement === 'inside' && 'h-auto pb-2 pt-8',
              type === 'password' && [
                'pr-6',
                !isPasswordVisible && 'font-mono',
              ],
              isLoading && 'pr-6',
              isInvalid && '!border-red-400 !bg-red-600/50',

              inputClassNames,
            )}
            ref={ref}
            {...rest}
          />
          {type === 'password' && !isLoading && (
            <MotionButtonBase
              className={rightContentVariants({
                placement: labelPlacement,
              })}
              onClick={() => {
                setIsPasswordVisible(!isPasswordVisible)
              }}
            >
              <i
                className={clsx(
                  'text-lg text-gray-500',

                  isPasswordVisible
                    ? 'i-mingcute-eye-line'
                    : 'i-mingcute-eye-close-line',
                )}
              />
            </MotionButtonBase>
          )}

          {!isLoading && endContent && (
            <div
              className={rightContentVariants({
                placement: labelPlacement,
              })}
            >
              {endContent}
            </div>
          )}

          {isLoading && (
            <div
              className={rightContentVariants({
                placement: labelPlacement,
              })}
            >
              <i className="loading loading-spinner size-5 text-primary/80" />
            </div>
          )}
        </div>
      </div>
      {isInvalid && errorMessage && (
        <ErrorLabelLine id={id} errorMessage={errorMessage} />
      )}
    </div>
  )
})

const rightContentVariants = tv({
  base: 'absolute right-2',
  variants: {
    placement: {
      inside: 'bottom-2',
      left: 'bottom-0 top-0 flex items-center',
      top: 'bottom-0 top-0 flex items-center',
    },
  },
})

AdvancedInput.displayName = 'Input'
