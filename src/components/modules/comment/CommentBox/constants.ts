import { sample } from '~/lib/lodash'

const placeholderCopywrites = [
  'Leave a line, make it memorable.',
  "What's on your mind, legend?",
  'Your thoughts, my inspiration.',
  'Write something cool.',
  'Your words matter, shoot.',
  'Drop a comment, make it count.',
  'Fuel the fire with your thoughts.',
  'Your insights are welcome here.',
  'Share your wisdom.',
  "Let's hear your take.",
  'Write a comment, leave your mark.',
]
export const getRandomPlaceholder = () => sample(placeholderCopywrites)

export const MAX_COMMENT_TEXT_LENGTH = 500
