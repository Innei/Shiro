export const CommentUrlRender = ({
  url,
  author,
}: {
  url: string | null | undefined
  author: string
}) => {
  return url ? (
    <a className="truncate text-sm text-accent" href={url}>
      {author}
    </a>
  ) : (
    <span>{author}</span>
  )
}
