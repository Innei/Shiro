export enum Routes {
  Home = '/',
  Posts = '/posts',
  Post = '/posts/',
  Notes = '/notes',
  Note = '/notes/',
  NoteTopics = '/topics',
  NoteTopic = '/topics/',
  Timelime = '/timeline',
  Login = '/login',
}

type Noop = never
type Pagination = {
  size?: number
  page?: number
}

type WithId = {
  id: string | number
}
type HomeParams = Noop
type PostsParams = Pagination
type PostParams = {
  category: string
  slug: string
}
type NotesParams = Noop
type NoteParams = WithId & {
  password?: string
}
type TimelineParams = {
  type: 'note' | 'post' | 'all'
  selectId?: string
}
type NoteTopicParams = {
  slug: string
}
export type RouteParams<T extends Routes> = T extends Routes.Home
  ? HomeParams
  : T extends Routes.Note
  ? NoteParams
  : T extends Routes.Notes
  ? NotesParams
  : T extends Routes.Posts
  ? PostsParams
  : T extends Routes.Post
  ? PostParams
  : T extends Routes.Timelime
  ? TimelineParams
  : T extends Routes.NoteTopic
  ? NoteTopicParams
  : T extends Routes.NoteTopics
  ? Noop
  : never

export const routeBuilder = <T extends Routes>(
  route: T,
  params: RouteParams<typeof route>,
) => {
  let href: string = route
  switch (route) {
    case Routes.Note: {
      href += (params as NoteParams).id

      if ((params as NoteParams).password) {
        href += `?password=${(params as NoteParams).password}`
      }
      break
    }
    case Routes.Post: {
      const p = params as PostParams
      href += `${p.category}/${p.slug}`
      break
    }
    case Routes.Posts: {
      const p = params as PostsParams
      href += `?${new URLSearchParams(p as any).toString()}`
      break
    }
    case Routes.Timelime: {
      const p = params as TimelineParams
      href += `?${new URLSearchParams(p as any).toString()}`
      break
    }
    case Routes.NoteTopic: {
      const p = params as NoteTopicParams
      href += p.slug
      break
    }
    case Routes.NoteTopics:
    case Routes.Notes:
    case Routes.Login:
    case Routes.Home: {
      break
    }
  }
  return href
}
