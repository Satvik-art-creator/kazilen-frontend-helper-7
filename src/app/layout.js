// src/app/layout.js
import './globals.css'
import BottomNav from './components/BottomNav'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        {children}
        <BottomNav /> {/* Always included, but self-hides on other pages */}
      </body>
    </html>
  )
}
