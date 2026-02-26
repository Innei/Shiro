export const defaultThemeConfig: AppThemeConfig = {
  config: {
    site: {
      favicon: '/favicon.ico',
      faviconDark: '/favicon.ico',
    },
    hero: {
      title: {
        template: [],
      },
      description: '',
    },
    module: {
      subscription: {},
      og: {},
      donate: {
        enable: false,
        link: '',
        qrcode: [],
      },
      bilibili: {
        liveId: 0,
      },
      activity: {
        enable: false,
        endpoint: '',
      },
      openpanel: {
        enable: false,
        id: '',
        url: '',
      },
      rss: {
        custom_elements: [],
        noRSS: false,
      },
      signature: {
        svg: '',
        animated: true,
      },
      posts: {
        mode: 'loose',
      },
    },
  },
  footer: {
    linkSections: [],
    otherInfo: {
      date: '',
    },
  },
}
