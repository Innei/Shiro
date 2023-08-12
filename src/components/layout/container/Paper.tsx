import { clsxm } from '~/lib/helper'

export const Paper: Component<{
  as?: keyof JSX.IntrinsicElements | Component
}> = ({ children, className, as: As = 'main' }) => {
  return (
    <As
      className={clsxm(
        'relative bg-slate-50 dark:bg-zinc-900 md:col-start-1 lg:col-auto',
        '-m-4 p-[2rem_1rem] md:m-0 lg:p-[30px_45px]',
        'rounded-[0_6px_6px_0] border-zinc-200/70 shadow-sm dark:border-neutral-800 dark:shadow-[#333] lg:border',
        'note-layout-main',
        'min-w-0',
        className,
      )}
    >
      {children}

      {/* <svg
        className="paper absolute bottom-0 right-0 rotate-180 text-zinc-200/80 dark:text-neutral-800"
        xmlns="http://www.w3.org/2000/svg"
        width="70"
        height="70"
        viewBox="0 0 70 70"
      >
        <g mask="url(#mask-0.12140810982892192)">
          <path
            fill="black"
            fillOpacity="0.3"
            filter="url(#blur-0.12140810982892192)"
            d="M0,0L0,70L70,0Z"
            className="__web-inspector-hide-shortcut__"
          />
          <path
            fill="currentColor"
            d="M35,30.333333333333332C35,30.333333333333332,9.666666666666666,33,-2,44.666666666666664L46.666666666666664,0C33,9.666666666666666,35,30.333333333333332,35,30.333333333333332Z"
            className="__web-inspector-hide-shortcut__"
          />
          <path
            fill="url(#gradient-0.12140810982892192)"
            d="M35,30.333333333333332C35,30.333333333333332,9.666666666666666,33,-2,44.666666666666664L46.666666666666664,0C33,9.666666666666666,35,30.333333333333332,35,30.333333333333332Z"
            className="__web-inspector-hide-shortcut__"
          />
        </g>
        <mask id="mask-0.12140810982892192">
          <path
            fill="white"
            d="M0,60.666666666666664C0,46.666666666666664,0,46.666666666666664,23.333333333333332,23.333333333333332C46.666666666666664,0,46.666666666666664,0,60.666666666666664,0L140,0L140,140L0,140L0,60.666666666666664"
          />
        </mask>
        <defs>
          <linearGradient
            id="gradient-0.12140810982892192"
            x1="0.48"
            x2="0.6"
            y1="0.45"
            y2="0.6"
          >
            <stop offset="0%" stopColor="#ffffff60" />
            <stop offset="100%" stopColor="currentColor" />
          </linearGradient>
          <filter
            id="blur-0.12140810982892192"
            x="-58"
            y="-45.9995"
            width="140"
            height="140"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="14"
              result="effect1_foregroundBlur_221_5067"
            />
          </filter>
        </defs>
      </svg> */}
    </As>
  )
}
