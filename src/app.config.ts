export const appConfig = {
  site: {
    url:
      process.env.NODE_ENV === 'production'
        ? 'https://innei.ren'
        : 'http://localhost:2323',
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
  },
}
