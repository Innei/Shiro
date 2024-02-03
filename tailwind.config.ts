import daisyui from 'daisyui'
import { withTV } from 'tailwind-variants/transformer'
import type { Config } from 'tailwindcss'
import type { CSSRuleObject, PluginAPI } from 'tailwindcss/types/config'

import { addDynamicIconSelectors } from '@iconify/tailwind'
import typography from '@tailwindcss/typography'

const UIKitColors = {
  red: {
    light: '#FF3B30',
    dark: '#FF453A',
  },
  orange: {
    light: '#FF9500',
    dark: '#FF9F0A',
  },
  yellow: {
    light: '#FFCC00',
    dark: '#FFD60A',
  },
  green: {
    light: '#34C759',
    dark: '#30D158',
  },
  mint: {
    light: '#00C7BE',
    dark: '#63E6E2',
  },
  teal: {
    light: '#30B0C7',
    dark: '#40CBE0',
  },
  cyan: {
    light: '#32ADE6',
    dark: '#64D2FF',
  },
  blue: {
    light: '#007AFF',
    dark: '#0A84FF',
  },
  indigo: {
    light: '#5856D6',
    dark: '#5E5CE6',
  },
  purple: {
    light: '#AF52DE',
    dark: '#BF5AF2',
  },
  pink: {
    light: '#FF2D55',
    dark: '#FF375F',
  },
  brown: {
    light: '#A2845E',
    dark: '#AC8E68',
  },
  grey: {
    light: '#8E8E93',
    dark: '#8E8E93',
  },
  grey2: {
    light: '#AEAEB2',
    dark: '#636366',
  },
  grey3: {
    light: '#C7C7CC',
    dark: '#48484A',
  },
  grey4: {
    light: '#D1D1D6',
    dark: '#3A3A3C',
  },
  gray5: {
    light: '#E5E5EA',
    dark: '#2C2C2E',
  },
  grey6: {
    light: '#F2F2F7',
    dark: '#1C1C1E',
  },

  // Separator
  separator: {
    opaque: {
      light: '#C6C6C8',
      dark: '#38383A',
    },
    non_opaque: {
      light: 'rgba(60, 60, 67, 0.36)',
      dark: 'rgba(84, 84, 88, 0.65)',
    },
  },

  // Label
  label: {
    primary: {
      dark: '#FFF',
      light: '#000',
    },
    secondary: {
      light: '#3C3C4399',
      dark: '#EBEBF599',
    },
    tertiary: {
      light: '#3C3C434D',
      dark: '#EBEBF54D',
    },
    quarternary: {
      light: '#3C3C432E',
      dark: '#EBEBF529',
    },
  },

  // Background
  background: {
    primary: {
      light: '#fff',
      dark: '#1C1C1E',
    },
    secondary: {
      light: '#F2F2F7',
      dark: '#2C2C2E',
    },
    tertiary: {
      light: '#FFFFFF',
      dark: '#3A3A3C',
    },
  },

  // Grouped Background
  grouped: {
    primary: {
      light: '#F2F2F7',
      dark: '#1C1C1E',
    },
    secondary: {
      light: '#FFFFFF',
      dark: '#2C2C2E',
    },
    tertiary: {
      light: '#F2F2F7',
      dark: '#3A3A3C',
    },
  },

  // Fill
  fill: {
    primary: {
      light: '#78788033',
      dark: '#7878805C',
    },
    secondary: {
      light: '#78788029',
      dark: '#78788052',
    },
    tertiary: {
      light: '#7676801F',
      dark: '#7676803D',
    },
    quarternary: {
      light: '#74748014',
      dark: '#7474802E',
    },
  },
}

const twConfig: Config = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  safelist: [
    'font-light',
    'text-3xl',
    'rounded',
    'p-1',
    'bg-gray-200',
    'dark:bg-gray-800/0',
    'hover:dark:bg-gray-800/100',
    'bg-opacity-0',
    'hover:bg-opacity-100',
    'transition-background',

    'w-[1px]',
    'h-8',
    '-bottom-2',
    'bg-gray-800/80',
    'dark:bg-gray-200/80',
    'group-hover:opacity-100',
    'transition-opacity',
    'group-hover:animation-blink',

    '!w-full',
    'w-full',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: 'var(--font-sans),system-ui,-apple-system,PingFang SC,"Microsoft YaHei",Segoe UI,Roboto,Helvetica,noto sans sc,hiragino sans gb,"sans-serif",Apple Color Emoji,Segoe UI Emoji,Not Color Emoji',
        serif:
          '"Noto Serif CJK SC","Noto Serif SC",var(--font-serif),"Source Han Serif SC","Source Han Serif",source-han-serif-sc,SongTi SC,SimSum,"Hiragino Sans GB",system-ui,-apple-system,Segoe UI,Roboto,Helvetica,"Microsoft YaHei","WenQuanYi Micro Hei",sans-serif',
        mono: `"OperatorMonoSSmLig Nerd Font","Cascadia Code PL","FantasqueSansMono Nerd Font","operator mono",JetBrainsMono,"Fira code Retina","Fira code","Consolas", Monaco, "Hannotate SC", monospace, -apple-system`,
      },
      screens: {
        'light-mode': { raw: '(prefers-color-scheme: light)' },
        'dark-mode': { raw: '(prefers-color-scheme: dark)' },

        'w-screen': '100vw',
        'h-screen': '100vh',
      },
      maxWidth: {
        screen: '100vw',
      },
      width: {
        screen: '100vw',
      },
      height: {
        screen: '100vh',
      },
      maxHeight: {
        screen: '100vh',
      },

      colors: {
        uk: UIKitColors,

        themed: {
          bg_opacity: 'var(--bg-opacity)',
        },
      },
    },
  },

  daisyui: {
    logs: false,
    themes: [
      {
        light: {
          'color-scheme': 'light',
          // 浅葱
          primary: '#33A6B8',

          secondary: '#A8D8B9',

          accent: '#33A6B8',

          'accent-content': '#fafafa',

          neutral: UIKitColors.grey3.light,

          'base-100': UIKitColors.background.primary.light,
          'base-content': UIKitColors.label.primary.light,

          info: UIKitColors.blue.light,
          success: UIKitColors.green.light,
          warning: UIKitColors.orange.light,
          error: UIKitColors.red.light,

          '--rounded-btn': '1.9rem',
          '--tab-border': '2px',
          '--tab-radius': '.5rem',
        },
      },
      {
        dark: {
          'color-scheme': 'dark',
          // 桃
          primary: '#F596AA',
          // 洗朱
          secondary: '#FB966E',
          accent: '#F596AA',

          neutral: UIKitColors.grey3.dark,

          'base-100': UIKitColors.background.primary.dark,
          'base-content': UIKitColors.label.primary.dark,

          info: UIKitColors.blue.dark,
          success: UIKitColors.green.dark,
          warning: UIKitColors.orange.dark,
          error: UIKitColors.red.dark,

          '--rounded-btn': '1.9rem',
          '--tab-border': '2px',
          '--tab-radius': '.5rem',
        },
      },
    ],
    darkTheme: 'dark',
  },

  plugins: [
    addDynamicIconSelectors(),
    addShortcutPlugin,

    typography,
    daisyui,

    require('tailwind-scrollbar'),
    require('@tailwindcss/container-queries'),
  ],
}

function addShortcutPlugin({ addUtilities }: PluginAPI) {
  const styles: CSSRuleObject = {
    '.content-auto': {
      'content-visibility': 'auto',
    },
    '.shadow-out-sm': {
      'box-shadow':
        '0 0 10px rgb(120 120 120 / 10%), 0 5px 20px rgb(120 120 120 / 20%)',
    },
    '.backface-hidden': {
      '-webkit-backface-visibility': 'hidden',
      '-moz-backface-visibility': 'hidden',
      '-webkit-transform': 'translate3d(0, 0, 0)',
      '-moz-transform': 'translate3d(0, 0, 0)',
    },
    '.center': {
      'align-items': 'center',
      'justify-content': 'center',
    },
    '.fill-content': {
      'min-height': `calc(100vh - 17.5rem)`,
    },
    '.card-shadow': {
      'box-shadow': '0 0 0 1px rgba(0,0,0,.08),0 4px 6px rgba(0,0,0,.04)',
    },
    '.card-shadow:hover': {
      'box-shadow': '0 0 0 1px rgba(0,0,0,.08),0 6px 14px rgba(0,0,0,.08)',
    },
  }
  addUtilities(styles)
}

export default withTV(twConfig)
