import { sample } from '~/lib/lodash'

export const getRandomPlaceholder = (
  t: (key: string) => string[] | string,
): string => {
  const placeholders = t('comment_placeholders')
  if (Array.isArray(placeholders)) {
    return sample(placeholders) || placeholders[0]
  }
  return placeholders
}

export const MAX_COMMENT_TEXT_LENGTH = 500
