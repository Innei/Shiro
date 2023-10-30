import Image from 'next/image'
import type { TwitterComponents } from 'react-tweet'

const components: TwitterComponents = {
  AvatarImg: (props) => <Image {...props} alt="avatar" className="!m-0" />,
  MediaImg: (props) => (
    <Image
      {...props}
      fill
      unoptimized
      alt="tweet-media"
      className="!m-0 object-cover"
    />
  ),
}

export default async function Tweet({ id }: { id: string }) {
  const { Tweet: ReactTweet } = await import('react-tweet')

  return (
    <span className="flex justify-center">
      <ReactTweet id={id} components={components} />
    </span>
  )
}
