'use client'

import { useState } from 'react'
import Image, { type ImageProps } from 'next/image'

type Props = ImageProps & { alt: string; skeleton?: boolean }

export function UIImage({ alt, skeleton = true, className, ...props }: Props) {
  const [loaded, setLoaded] = useState(false)

  return (
    <Image
      {...props}
      alt={alt}
      onLoad={() => setLoaded(true)}
      className={`${skeleton && !loaded ? 'skeleton-pulse' : ''} transition-opacity duration-200 ease-in ${loaded ? 'opacity-100' : 'opacity-0'} ${className ?? ''}`}
    />
  )
}
