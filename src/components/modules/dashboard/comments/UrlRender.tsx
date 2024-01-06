export const CommentUrlRender = ({
  url,
  author,
}: {
  url: string | null | undefined
  author: string
}) => {
  return url ? (
    <a className="text-sm text-primary" href={url}>
      {author}
    </a>
  ) : (
    <span>{author}</span>
  )
}
