'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Menu, Info } from 'lucide-react'

export default function BottomNav() {
  const pathname = usePathname()

  // Only show nav on home and menu and details pages
  const allowedPaths = ['/', '/menu', '/details']
  if (!allowedPaths.includes(pathname)) {
    return null
  }

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Menu', href: '/menu', icon: Menu },
    { name: 'Details', href: '/details', icon: Info }, 
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-sm"
      style={{ zIndex: 50 }}
      aria-label="Bottom navigation"
    >
      <div className="max-w-3xl mx-auto">
        {/* Instead of justify-between, use justify-center with a divider */}
        <div className="h-16 flex items-center">
          {/* Home */}
          <div className="flex-1 flex items-center justify-center">
            <NavLink item={navItems[0]} pathname={pathname} />
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-300" />

          {/* Menu */}
          <div className="flex-1 flex items-center justify-center">
            <NavLink item={navItems[1]} pathname={pathname} />
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-300" />

          {/* Details */}
          <div className="flex-1 flex items-center justify-center">
            <NavLink item={navItems[2]} pathname={pathname} />
          </div>
        </div>
      </div>
    </nav>
  )
}

// Small helper so we don't repeat
function NavLink({ item, pathname }) {
  const isActive = pathname === item.href
  const Icon = item.icon

  return (
    <Link href={item.href} className="flex flex-col items-center">
      <Icon size={20} className={isActive ? 'text-pink-500' : 'text-gray-400'} />
      <span
        className={`text-sm ${
          isActive ? 'text-pink-500 font-semibold' : 'text-gray-500'
        }`}
      >
        {item.name}
      </span>
    </Link>
  )
}
