'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Header({ size = 40 }) {
  const router = useRouter()
  const [online, setOnline] = useState(true)
  const [initial, setInitial] = useState('•')

  // Load online state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('isOnline')
    if (saved !== null) setOnline(saved === 'true')
  }, [])

  // Persist online state
  useEffect(() => {
    localStorage.setItem('isOnline', online ? 'true' : 'false')
  }, [online])

  // Load professional name and extract first letter
  useEffect(() => {
    try {
      const name =
        localStorage.getItem('kazilen_professional_name') ||
        localStorage.getItem('professionalName') ||
        ''
      if (name) {
        setInitial(name.trim().charAt(0).toUpperCase())
      }
    } catch (e) {
      setInitial('•')
    }
  }, [])

  const toggle = () => setOnline((prev) => !prev)
  const openProfile = () => router.push('/profile')

  // Toggle switch sizing
  const pillWidth = 96
  const pillHeight = 28
  const knobSize = 22
  const knobLeft = 3
  const knobTranslate = pillWidth - knobSize - knobLeft * 2

  return (
    <div className="flex items-center gap-4 relative">
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
            transform: online ? `translateX(${knobTranslate}px)` : 'translateX(0px)',
            transition: 'transform 240ms cubic-bezier(.2,.9,.2,1)',
          }}
        />

        {/* text */}
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
              fontWeight: 600,
              color: online ? '#ffffff' : '#111827',
              userSelect: 'none',
            }}
          >
            {online ? 'Online' : 'Offline'}
          </span>
        </div>
      </button>

      {/* Avatar (first letter of professional name) */}
      <button
        onClick={openProfile}
        className="relative rounded-full flex items-center justify-center font-semibold text-orange-600 bg-orange-100"
        style={{ width: size, height: size, fontSize: size / 2 }}
        title="Open profile"
        aria-label="Open profile"
      >
        {initial}
        {/* status dot */}
        <span
          style={{
            position: 'absolute',
            right: 2,
            bottom: 2,
            width: 10,
            height: 10,
            borderRadius: 9999,
            border: '2px solid white',
            background: online ? '#10B981' : '#9CA3AF',
          }}
        />
      </button>
    </div>
  )
}
