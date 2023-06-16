import type { ImageProps } from 'next/image'

type TImageProps = {
  className?: string
  src?: string
  width?: number | string
  height?: number | string
  'original-src'?: string
  imageRef?: React.MutableRefObject<HTMLImageElement>
  zoom?: boolean
  accentColor?: string
} & React.HTMLAttributes<HTMLImageElement> &
  ImageProps

export const Image: React.FC<TImageProps> = ({ alt, src }) => {
  return null
}

export const ZoomedImage: React.FC<TImageProps> = (props) => {
  console.log(props)
  return (
    <span className="block text-center">
      <Image {...props} zoom />
    </span>
  )
}
