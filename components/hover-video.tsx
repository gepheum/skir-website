'use client'

import { useRef, useState } from 'react'

interface HoverVideoProps {
  src: string
}

export function HoverVideo({ src }: HoverVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const handleMouseEnter = () => {
    if (videoRef.current) {
      const playPromise = videoRef.current.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((e) => {
            if (e.name !== 'AbortError') {
              console.error('Failed to play video', e)
            }
            // If play failed, or was aborted, ensure state is correct
            // But usually mouseLeave handles the state reset
          })
      }
    }
  }

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
      setIsPlaying(false)
    }
  }

  return (
    <div
      className="max-w-[760px] mx-auto rounded-xl overflow-hidden border border-border shadow-2xl relative bg-black"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        controls={isPlaying}
        controlsList="nofullscreen nodownload noremoteplayback"
        disablePictureInPicture
        className="w-full h-auto block"
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  )
}
