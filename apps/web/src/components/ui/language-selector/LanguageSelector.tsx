'use client'

import type { FC } from 'react'
import { useTransition } from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { clsxm } from '~/lib/helper'

export interface LanguageOption {
  code: string
  label: string
  isOriginal?: boolean
}

interface LanguageSelectorProps {
  languages: LanguageOption[]
  currentLanguage: string
  onLanguageChange: (lang: string) => void
  originalLabel?: string
  triggerClassName?: string
  showIcon?: boolean
}

export const LanguageSelector: FC<LanguageSelectorProps> = ({
  languages,
  currentLanguage,
  onLanguageChange,
  originalLabel,
  triggerClassName,
  showIcon = true,
}) => {
  const [isPending, startTransition] = useTransition()

  const currentLabel =
    languages.find((l) => l.code === currentLanguage)?.label || currentLanguage

  const handleSelect = (lang: string) => {
    if (lang === currentLanguage) return
    startTransition(() => {
      onLanguageChange(lang)
    })
  }

  if (languages.length <= 1) {
    return null
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={isPending}
          className={clsxm(
            'flex items-center gap-1 rounded-md px-1.5 py-0.5 text-sm transition-colors',
            'hover:bg-zinc-100 dark:hover:bg-zinc-800 data-[state=open]:bg-zinc-100 dark:data-[state=open]:bg-zinc-800',
            isPending && 'opacity-50',
            triggerClassName,
          )}
        >
          {showIcon && <i className="i-mingcute-translate-2-line" />}
          <span>{currentLabel}</span>
          <i className="i-mingcute-down-line text-xs opacity-50" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {languages.map((lang) => {
          const isCurrent = lang.code === currentLanguage

          return (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={isCurrent ? 'bg-zinc-100 dark:bg-zinc-800' : ''}
            >
              <span className="flex w-full items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  {lang.label}
                  {lang.isOriginal && originalLabel && (
                    <span className="rounded bg-zinc-200 px-1 py-0.5 text-[10px] dark:bg-zinc-700">
                      {originalLabel}
                    </span>
                  )}
                </span>
                {isCurrent && (
                  <i className="i-mingcute-check-line text-accent" />
                )}
              </span>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
