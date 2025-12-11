'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function OnlineProfile({ imageSrc = '/avatar.jpg', alt = 'Profile', size = 56 }) {
  const [online, setOnline] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('isOnline')
    if (saved !== null) setOnline(saved === 'true')
  }, [])

  useEffect(() => {
    localStorage.setItem('isOnline', online ? 'true' : 'false')
  }, [online])

  const toggle = () => setOnline(prev => !prev)

  // Pill / knob sizing
  const pillWidth = 96 // px
  const pillHeight = 28 // px
  const knobSize = 22 // px
  const knobLeft = 3 // px
  const knobFinalLeft = pillWidth - knobSize - knobLeft // px
  const knobTranslate = knobFinalLeft - knobLeft // px

  return (
    <div className="flex items-center gap-4">
      {/* Toggle */}
      <button
        onClick={toggle}
        aria-pressed={online}
        className="relative flex items-center rounded-full focus:outline-none select-none"
        style={{
          width: pillWidth,
          height: pillHeight,
          background: online ? '#34D399' : '#E5E7EB',
        }}
      >
        {/* knob */}
        <span
          aria-hidden
          style={{
            position: 'absolute',
            top: 3,
            left: knobLeft,
            width: knobSize,
            height: knobSize,
            borderRadius: 9999,
            background: '#fff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            transform: online ? 'translateX(0px)' : `translateX(${knobTranslate}px)`,
            transition: 'transform 240ms cubic-bezier(.2,.9,.2,1)',
            zIndex: 10,
          }}
        />

        {/* text area (reserve left for knob) */}
        <div
          style={{
            paddingLeft: knobLeft + knobSize + 8,
            paddingRight: 10,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontSize: 12,
              lineHeight: '14px',
              fontWeight: 600,
              color: online ? '#ffffff' : '#111827',
              userSelect: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {online ? 'Online' : 'Offline'}
          </span>
        </div>
      </button>

      {/* Profile image (clickable -> /profile) */}
      <Link href="/profile" className="block" aria-label="Open profile">
        <div
          className="relative rounded-full overflow-hidden"
          style={{
            width: size,
            height: size,
            boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
          }}
        >
          <Image
            src={imageSrc}
            alt={alt}
            fill
            sizes={`${size}px`}
            style={{ objectFit: 'cover' }}
          />
          {/* small status dot bottom-right */}
          <span
            style={{
              position: 'absolute',
              right: 3,
              bottom: 3,
              width: 10,
              height: 10,
              borderRadius: 9999,
              border: '2px solid white',
              background: online ? '#10B981' : '#9CA3AF'
            }}
          />
        </div>
      </Link>
    </div>
  )
}
