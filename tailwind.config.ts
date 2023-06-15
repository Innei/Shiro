import daisyui from 'daisyui'
import twColors from 'tailwindcss/colors'
import resolveConfig from 'tailwindcss/resolveConfig'
import type { PluginAPI } from 'tailwindcss/types/config'

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

export default resolveConfig({
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    // colors: createVariableColors(twColors),

    extend: {
      fontFamily: {
        mono: `"OperatorMonoSSmLig Nerd Font","Cascadia Code PL","FantasqueSansMono Nerd Font","operator mono","Fira code Retina","Fira code","Consolas", Monaco, "Hannotate SC", monospace, -apple-system`,
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
        always: { ...twColors },

        themed: {
          bg_opacity: 'var(--bg-opacity)',
        },
      },
    },
  },

  daisyui: {
    themes: [
      {
        light: {
          'color-scheme': 'light',
          primary: '#39C5BB',
          // 'primary-focus': '#25CCA0',
          // 'primary-content': UIKitColors.label.primary.light,
          secondary: '#6495ed',
          // 'secondary-foucs': '#92bbff',
          // 'secondary-content': UIKitColors.label.secondary.light,
          accent: '#39C5BB',
          // 'accent-focus': '#25CCA0',
          // 'accent-content': UIKitColors.label.primary.light,

          neutral: UIKitColors.grey3.light,

          'base-100': '#F9FDFD',

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
          primary: '#1f8f93',
          secondary: '#92bbff',
          accent: '#1f8f93',

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

    daisyui,
    typography,
    require('tailwind-scrollbar'),
    // variableColorsPlugin(twColors),
    // ColorPlugin,
  ],
})

function addShortcutPlugin({ addUtilities }: PluginAPI) {
  const styles = {
    '.content-auto': {
      'content-visibility': 'auto',
    },
    '.shadow-out-sm': {
      'box-shadow':
        '0 0 10px rgb(120 120 120 / 10%), 0 5px 20px rgb(120 120 120 / 20%)',
    },
  }
  addUtilities(styles)
}

// function ColorPlugin({ addUtilities, e, theme, addVariant }: PluginAPI) {
//   const newUtilities = {}
//   const colors = theme('colors.uk')

//   Object.keys(colors).forEach((colorName) => {
//     const colorGroup = colors[colorName]
//     if (typeof colorGroup === 'object') {
//       Object.keys(colorGroup).forEach((shadeName) => {
//         const colorValue = colorGroup[shadeName]
//         for (let i = 1; i <= 10; i++) {
//           const color = Color(colorValue)
//             .lighten(i * 0.1)
//             .hex()
//           newUtilities[`.text-${colorName}-${shadeName}-${i * 100}`] = {
//             color,
//           }
//           newUtilities[`.bg-${colorName}-${shadeName}-${i * 100}`] = {
//             backgroundColor: color,
//           }
//           newUtilities[`.border-${colorName}-${shadeName}-${i * 100}`] = {
//             borderColor: color,
//           }
//         }
//       })
//     }
//   })

//   addUtilities(newUtilities)
// }
