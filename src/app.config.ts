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
          text: '你好呀，我是',
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
          text: '一个独立开发者',
          class: 'font-light text-4xl',
        },
      ],
    },
    description: `一位深入研究编程领域的独立开发者，热衷于纯音乐、二次元文化和电子产品。持有强烈的创新精神，始终以用户体验为首要考虑，在技术开发中追求卓越。`,
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
