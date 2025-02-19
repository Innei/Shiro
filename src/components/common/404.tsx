export const NotFound404: Component = ({ children }) => {
  return (
    <div className="min-h-[500px]">
      <div className="center fixed inset-0 flex flex-col space-y-6">
        <$404SVG className="size-[400px]" />
        <p>这颗星球还没有知识哦，去其他地方探索吧</p>
        {children}
      </div>
    </div>
  )
}

const $404SVG: Component = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 800 600"
    >
      <defs>
        <clipPath id="a">
          <path d="M380.857 346.164c-1.247 4.651-4.668 8.421-9.196 10.06-9.332 3.377-26.2 7.817-42.301 3.5s-28.485-16.599-34.877-24.192c-3.101-3.684-4.177-8.66-2.93-13.311l7.453-27.798a6.948 6.948 0 0 1 6.088-5.13c6.755-.61 20.546-.608 41.785 5.087s33.181 12.591 38.725 16.498a6.948 6.948 0 0 1 2.705 7.488l-7.452 27.798z" />
        </clipPath>
      </defs>
      <g
        fill="none"
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={3}
        style={{
          transformOrigin: '0 0',
        }}
        transform="rotate(-1.985 567.955 108.804)"
      >
        <circle cx={572.859} cy={108.803} r={90.788} />
        <circle
          cx={548.891}
          cy={62.319}
          r={13.074}
          style={{
            transformOrigin: '0 0',
          }}
          transform="translate(2.999)"
        />
        <circle
          cx={591.743}
          cy={158.918}
          r={7.989}
          style={{
            transformOrigin: '0 0',
          }}
          transform="translate(-2.999)"
        />
        <path
          strokeLinecap="round"
          d="M476.562 101.461c-30.404 2.164-49.691 4.221-49.691 8.007 0 6.853 63.166 12.408 141.085 12.408s141.085-5.555 141.085-12.408c0-3.378-15.347-4.988-40.243-7.225"
        />
        <path
          strokeLinecap="round"
          d="M483.985 127.43c23.462 1.531 52.515 2.436 83.972 2.436 36.069 0 68.978-1.19 93.922-3.149"
          opacity={0.5}
        />
      </g>
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeMiterlimit={10}
        strokeWidth={3}
      >
        <g
          style={{
            transformOrigin: '0 0',
          }}
        >
          <path d="m518.071 245.375-.002 21.206M508.129 255.977l19.881.002" />
        </g>
        <g
          style={{
            transformOrigin: '0 0',
          }}
        >
          <path d="m154.549 231.391.002 21.207M144.609 241.996l19.881-.002" />
        </g>
        <g
          style={{
            transformOrigin: '0 0',
          }}
        >
          <path d="M320.135 132.746v21.206M310.194 143.349h19.881" />
        </g>
        <g
          style={{
            transformOrigin: '0 0',
          }}
        >
          <path d="M200.67 483.11v21.206M210.611 493.713H190.73" />
        </g>
      </g>
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeMiterlimit={10}
        strokeWidth={3}
      >
        <g
          style={{
            transformOrigin: '0 0',
          }}
        >
          <path d="M432.173 380.52v11.31M426.871 386.175h10.603" />
        </g>
        <g
          style={{
            transformOrigin: '0 0',
          }}
        >
          <path d="M489.555 299.765v8.359M485.636 303.945h7.837" />
        </g>
        <g
          style={{
            transformOrigin: '0 0',
          }}
        >
          <path d="M231.468 291.009v8.36M227.55 295.189h7.837" />
        </g>
        <g
          style={{
            transformOrigin: '0 0',
          }}
        >
          <path d="M244.032 547.539v8.359M247.95 551.719h-7.837" />
        </g>
        <g
          style={{
            transformOrigin: '0 0',
          }}
        >
          <path d="M186.359 406.967v8.359M190.277 411.146h-7.837" />
        </g>
        <g
          style={{
            transformOrigin: '0 0',
          }}
        >
          <path
            d="M480.296 406.967v8.359M484.215 411.146h-7.837"
            transform="matrix(.999 0 0 .9999 .48 .041)"
          />
        </g>
      </g>
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeMiterlimit={10}
        strokeWidth={3}
        transform="translate(0 -1.999)"
      >
        <circle
          cx={588.977}
          cy={255.978}
          r={7.952}
          style={{
            transformOrigin: '0 0',
          }}
        />
        <circle
          cx={450.066}
          cy={320.259}
          r={7.952}
          style={{
            transformOrigin: '0 0',
          }}
        />
        <circle
          cx={168.303}
          cy={353.753}
          r={7.952}
          style={{
            transformOrigin: '0 0',
          }}
        />
        <circle
          cx={429.522}
          cy={201.185}
          r={7.952}
          style={{
            transformOrigin: '0 0',
          }}
        />
        <circle
          cx={200.67}
          cy={176.313}
          r={7.952}
          style={{
            transformOrigin: '0 0',
          }}
        />
        <circle
          cx={133.343}
          cy={477.014}
          r={7.952}
          style={{
            transformOrigin: '0 0',
          }}
        />
        <circle
          cx={283.521}
          cy={568.033}
          r={7.952}
          style={{
            transformOrigin: '0 0',
          }}
        />
        <circle
          cx={413.618}
          cy={482.387}
          r={7.952}
          style={{
            transformOrigin: '0 0',
          }}
        />
      </g>
      <g fill="currentColor" transform="translate(0 -3.999)">
        <circle
          cx={549.879}
          cy={296.402}
          r={2.651}
          style={{
            transformOrigin: '0 0',
          }}
        />
        <circle
          cx={253.29}
          cy={229.24}
          r={2.651}
          style={{
            transformOrigin: '0 0',
          }}
        />
        <circle
          cx={434.824}
          cy={263.931}
          r={2.651}
          style={{
            transformOrigin: '0 0',
          }}
        />
        <circle
          cx={183.708}
          cy={544.176}
          r={2.651}
          style={{
            transformOrigin: '0 0',
          }}
        />
        <circle
          cx={382.515}
          cy={530.923}
          r={2.651}
          style={{
            transformOrigin: '0 0',
          }}
        />
        <circle
          cx={130.693}
          cy={305.608}
          r={2.651}
          style={{
            transformOrigin: '0 0',
          }}
        />
        <circle
          cx={480.296}
          cy={477.014}
          r={2.651}
          style={{
            transformOrigin: '0 0',
          }}
        />
      </g>
      <g
        clipPath="url(cordClip)"
        style={{
          transformOrigin: '0 0',
        }}
        transform="rotate(.997 -81.593 221.095)"
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit={10}
          strokeWidth={3}
          d="M273.813 410.969s-54.527 39.501-115.34 38.218c-2.28-.048-4.926-.241-7.841-.548-68.038-7.178-134.288-43.963-167.33-103.87-.908-1.646-1.793-3.3-2.654-4.964-18.395-35.511-37.259-83.385-32.075-118.817"
        />
        <path
          fill="oklch(var(--b1)/var(--tw-bg-opacity,1))"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit={10}
          strokeWidth={3}
          d="m338.164 454.689-64.726-17.353c-11.086-2.972-17.664-14.369-14.692-25.455l15.694-58.537c3.889-14.504 18.799-23.11 33.303-19.221l52.349 14.035c14.504 3.889 23.11 18.799 19.221 33.303l-15.694 58.537c-2.972 11.085-14.368 17.663-25.455 14.691z"
        />
        <g
          fill="oklch(var(--b1)/var(--tw-bg-opacity,1))"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit={10}
          strokeWidth={3}
        >
          <path d="m323.396 236.625-28.111 117.128" />
          <circle cx={323.666} cy={235.617} r={6.375} />
        </g>
        <g
          fill="oklch(var(--b1)/var(--tw-bg-opacity,1))"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit={10}
          strokeWidth={3}
        >
          <path d="M360.633 363.039c1.352 1.061 4.91 5.056 5.824 6.634l27.874 47.634c3.855 6.649 1.59 15.164-5.059 19.02h0c-6.649 3.855-15.164 1.59-19.02-5.059l-5.603-9.663" />
          <path d="M388.762 434.677c5.234-3.039 7.731-8.966 6.678-14.594a15.804 15.804 0 0 1 5.837 5.793c4.411 7.596 1.829 17.33-5.767 21.741-7.596 4.411-17.33 1.829-21.741-5.767-1.754-3.021-2.817-5.818-2.484-9.046 4.34 4.551 11.802 5.169 17.477 1.873z" />
        </g>
        <g
          fill="oklch(var(--b1)/var(--tw-bg-opacity,1))"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit={10}
          strokeWidth={3}
        >
          <path d="M301.301 347.66c-1.702.242-5.91 1.627-7.492 2.536l-47.965 27.301c-6.664 3.829-8.963 12.335-5.134 18.999h0c3.829 6.664 12.335 8.963 18.999 5.134l9.685-5.564" />
          <path d="M241.978 395.324c-3.012-5.25-2.209-11.631 1.518-15.977a15.821 15.821 0 0 0-7.952 2.096c-7.619 4.371-10.253 14.09-5.883 21.71 4.371 7.619 14.09 10.253 21.709 5.883 3.03-1.738 5.35-3.628 6.676-6.59-6.033 1.768-12.803-1.429-16.068-7.122z" />
        </g>
        <g
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit={10}
          strokeWidth={3}
        >
          <path
            fill="oklch(var(--b1)/var(--tw-bg-opacity,1))"
            d="M353.351 365.387a58.685 58.685 0 0 1-24.48-1.278 58.678 58.678 0 0 1-21.836-11.14c-17.004 4.207-31.269 17.289-36.128 35.411l-1.374 5.123c-7.112 26.525 8.617 53.791 35.13 60.899h0c26.513 7.108 53.771-8.632 60.883-35.158l1.374-5.123c4.858-18.122-.949-36.585-13.569-48.734z"
          />
          <path
            fill="none"
            d="M269.678 394.912h0c26.3 20.643 59.654 29.585 93.106 25.724l2.419-.114"
          />
        </g>
        <g
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit={10}
          strokeWidth={3}
        >
          <path
            fill="oklch(var(--b1)/var(--tw-bg-opacity,1))"
            d="m312.957 456.734-14.315 53.395c-1.896 7.07 2.299 14.338 9.37 16.234h0c7.07 1.896 14.338-2.299 16.234-9.37l17.838-66.534c-8.633 5.427-18.558 6.928-29.127 6.275z"
          />
          <path fill="none" d="m304.883 486.849 25.604 6.864" />
          <path
            fill="oklch(var(--b1)/var(--tw-bg-opacity,1))"
            d="M296.315 452.273 282 505.667c-1.896 7.07-9.164 11.265-16.234 9.37h0c-7.07-1.896-11.265-9.164-9.37-16.234l17.838-66.534c4.759 9.017 12.602 15.281 22.081 20.004z"
          />
          <path fill="none" d="m262.638 475.522 25.603 6.865" />
        </g>
        <ellipse
          cx={341.295}
          cy={315.211}
          fill="oklch(var(--b1)/var(--tw-bg-opacity,1))"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit={10}
          strokeWidth={3}
          rx={61.961}
          ry={60.305}
          transform="rotate(-74.989 341.31 315.204)"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit={10}
          strokeWidth={3}
          d="M330.868 261.338c-7.929 1.72-15.381 5.246-21.799 10.246"
          style={{
            transformOrigin: '0 0',
          }}
          transform="rotate(.997 279.669 262.457)"
        />
        <path
          fill="oklch(var(--b1)/var(--tw-bg-opacity,1))"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit={10}
          strokeWidth={3}
          d="M380.857 346.164c-1.247 4.651-4.668 8.421-9.196 10.06-9.332 3.377-26.2 7.817-42.301 3.5s-28.485-16.599-34.877-24.192c-3.101-3.684-4.177-8.66-2.93-13.311l7.453-27.798a6.948 6.948 0 0 1 6.088-5.13c6.755-.61 20.546-.608 41.785 5.087s33.181 12.591 38.725 16.498a6.948 6.948 0 0 1 2.705 7.488l-7.452 27.798z"
        />
        <g clipPath="url(#a)">
          <path
            fill="none"
            stroke="currentColor"
            strokeMiterlimit={10}
            strokeWidth={3}
            d="m278.436 375.599 104.567-111.523-18.61-12.458-99.586 113.31z"
            style={{
              transformOrigin: '0 0',
            }}
            transform="rotate(-30 363.911 164.33)"
          />
        </g>
      </g>
    </svg>
  )
}
