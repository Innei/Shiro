export enum Routes {
  Home = '/home',
  Posts = '/posts',
  Post = '/posts/',
  Notes = '/notes',
  Note = '/notes/',
  Timelime = '/timeline',
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
  : never

export const routeBuilder = <T extends Routes>(
  route: T,
  params: RouteParams<typeof route>,
) => {
  const href = route
  switch (route) {
    case Routes.Note: {
      route
      params
      // ^?
      break
    }
    case Routes.Home: {
    }
  }
}
