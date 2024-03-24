export const enum Routes {
  Home = '//',

  Posts = '/posts',
  Post = '/posts/',

  Notes = '/notes',
  Note = '/notes/',
  NoteTopics = '/notes/topics',
  NoteTopic = '/notes/topics/',

  Timelime = '/timeline',

  Login = '/login',

  Page = '/',

  Categories = '/categories',
  Category = '/categories/',

  Projects = '/projects',
  Project = '/projects/',

  Says = '/says',
  Friends = '/friends',
  Thinking = '/thinking',

  PageDeletd = '/common/deleted',
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
export type PostsParams = Pagination & {
  sortBy?: string
  orderBy?: 'desc' | 'asc'
}

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

type OnlySlug = {
  slug: string
}

type OnlyId = {
  id: string
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
              ? OnlySlug
              : T extends Routes.NoteTopics
                ? Noop
                : T extends Routes.Page
                  ? OnlySlug
                  : T extends Routes.Category
                    ? OnlySlug
                    : T extends Routes.Project
                      ? OnlyId
                      : {}

export function routeBuilder<T extends Routes>(
  route: T,
  params: RouteParams<typeof route>,
) {
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
    case Routes.NoteTopic:
    case Routes.Category:
    case Routes.Page: {
      const p = params as OnlySlug
      href += p.slug
      break
    }

    case Routes.Home: {
      href = '/'
      break
    }
    case Routes.Project: {
      const p = params as OnlyId
      href += p.id
      break
    }
  }
  return href
}
