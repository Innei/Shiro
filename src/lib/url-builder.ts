import { appConfig } from '~/app.config'

export function urlBuilder(path = '') {
  return new URL(path, appConfig.site.url)
}
