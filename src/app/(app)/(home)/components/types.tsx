import type {
  RecentComment,
  RecentLike,
  RecentNote,
  RecentPost,
  RecentRecent,
} from '@mx-space/api-client'

export type ReactActivityType =
  | ({
      bizType: 'comment'
    } & RecentComment)
  | ({
      bizType: 'note'
    } & RecentNote)
  | ({
      bizType: 'post'
    } & RecentPost)
  | ({
      bizType: 'recent'
    } & RecentRecent)
  | ({
      bizType: 'like'
    } & RecentLike)
