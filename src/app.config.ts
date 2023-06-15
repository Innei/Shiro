export const appConfig = {
  site: {
    url:
      process.env.NODE_ENV === 'production'
        ? 'https://innei.ren'
        : 'http://localhost:2323',
  },
}
