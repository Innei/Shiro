import Image from 'next/image'
import { use } from 'react'
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

const reactTweet = import('react-tweet')

export default function Tweet({ id }: { id: string }) {
  const { Tweet: ReactTweet } = use(reactTweet)

  return (
    <span className="flex justify-center">
      <ReactTweet id={id} components={components} />
    </span>
  )
}
