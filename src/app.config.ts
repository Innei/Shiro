export const appConfig = {
  site: {
    url:
      process.env.NODE_ENV === 'production'
        ? 'https://innei.ren'
        : 'http://localhost:2323',

    favicon: '/innei.svg',
  },

  hero: {
    title: {
      template: [
        {
          type: 'h1',
          text: "Hi, I'm ",
          class: 'font-light text-4xl',
        },
        {
          type: 'h1',
          text: 'Innei',
          class: 'font-medium mx-2 text-4xl',
        },
        {
          type: 'h1',
          text: '👋。',
          class: 'font-light text-4xl',
        },
        {
          type: 'br',
        },
        {
          type: 'h1',
          text: 'A NodeJS Full Stack ',
          class: 'font-light text-4xl',
        },
        {
          type: 'code',
          text: '<Developer />',
          class:
            'font-medium mx-2 text-3xl rounded p-1 bg-gray-200 dark:bg-gray-800/0 hover:dark:bg-gray-800/100 bg-opacity-0 hover:bg-opacity-100 transition-background duration-200',
        },
        {
          type: 'span',
          // cursor
          class:
            'inline-block w-[1px] h-8 -bottom-2 relative bg-gray-800/80 dark:bg-gray-200/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 group-hover:animation-blink',
        },
      ],
    },
    description: `An independent developer coding with love.`,
  },
  module: {
    donate: {
      enable: true,
      link: 'https://afdian.net/@Innei',
      qrcode: [
        'https://cdn.jsdelivr.net/gh/Innei/img-bed@master/20191211132347.png',
        'https://cdn.innei.ren/bed/2023/0424213144.png',
      ],
    },

    bilibili: { liveId: 1434499 },
  },
}
