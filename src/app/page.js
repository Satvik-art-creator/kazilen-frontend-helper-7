'use client'

import { useEffect, useState } from 'react'
import Header from './components/Header'
import MyProgress from './components/MyProgress'
import BookingHistory from './components/BookingHistory'
import BookingModal from './components/BookingModal'

export default function Home() {
  const [bookings, setBookings] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('bookings') || '[]')
      if (!Array.isArray(stored) || stored.length === 0) {
        const example = {
          id: Date.now(),
          service: 'Door repair',
          price: 111,
          date: '2025-09-13',
          time: '10:00',
          createdAt: new Date().toISOString()
        }
        localStorage.setItem('bookings', JSON.stringify([example]))
        setBookings([example])
      } else {
        setBookings(stored)
      }
    } catch {
      setBookings([])
    }
  }, [])

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const handleCreateBooking = (newBooking) => {
    const updated = [newBooking, ...bookings]
    setBookings(updated)
    localStorage.setItem('bookings', JSON.stringify(updated))
  }

  return (
    <main className="min-h-screen flex flex-col items-center bg-white pt-6 pb-24">
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-between">
          <div style={{ width: 32 }} />
          <div className="flex items-center">
            <Header imageSrc="/avatar.jpg" />
          </div>
          <div style={{ width: 32 }} />
        </div>

        <div className="mt-6">
          <MyProgress onOpenBookings={openModal} />
        </div>

        <div className="mt-6 w-full">
          <BookingHistory bookings={bookings} />
        </div>
      </div>

      <BookingModal isOpen={isModalOpen} onClose={closeModal} onCreate={handleCreateBooking} />
    </main>
  )
}
