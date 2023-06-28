import { sample } from '~/lib/_'

const placeholderCopywrites = [
  '在这里说点什么呢。',
  '小可爱，你想说点什么呢？',
  '或许此地可以留下足迹',
  '你的留言是我前进的动力！',
  '说点什么吧，我会好好听的。',
  '来一发评论，送你一个小星星！',
  '你的评论会让我更加努力哦！',
  '留下你的足迹，让我知道你来过。',
  '我在这里等你的留言呢！',
  '你的评论是我最大的动力！',
  '来一发评论，让我知道你的想法吧！',
]
export const getRandomPlaceholder = () => sample(placeholderCopywrites)

export const MAX_COMMENT_TEXT_LENGTH = 500
