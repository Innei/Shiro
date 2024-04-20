import config from '@innei/prettier'

export default {
  ...config,
  importOrderParserPlugins: ['importAssertions', 'typescript', 'jsx'],
}
