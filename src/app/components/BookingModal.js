'use client'

import { useEffect, useRef, useState } from 'react'

export default function BookingModal({ isOpen, onClose, onCreate }) {
  const [booking, setBooking] = useState({
    customerName: '',
    phone: '',
    service: '',
    price: '',
    date: '',
    time: '',
    notes: ''
  })
  const firstInputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => firstInputRef.current?.focus(), 10)
    } else {
      setBooking({ customerName: '', phone: '', service: '', price: '', date: '', time: '', notes: '' })
    }
  }, [isOpen])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && isOpen) onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const onChange = (e) => setBooking(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    const priceNumber = booking.price ? Number(booking.price) : 0
    const newBooking = {
      id: Date.now(),
      customerName: booking.customerName,
      phone: booking.phone,
      service: booking.service || 'Service',
      price: priceNumber,
      date: booking.date,
      time: booking.time,
      notes: booking.notes,
      createdAt: new Date().toISOString()
    }
    try {
      onCreate?.(newBooking)
      onClose()
    } catch (err) {
      console.error(err)
      alert('Failed to create booking.')
    }
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Create new booking"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative z-50 w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">New Booking</h2>
          <p className="text-sm text-gray-500 mt-1">Fill details and submit</p>
        </div>

        <form onSubmit={submit} className="p-4 space-y-3">
          <div>
            <label className="block text-sm text-gray-700">Customer name</label>
            <input
              ref={firstInputRef}
              name="customerName"
              value={booking.customerName}
              onChange={onChange}
              required
              className="mt-1 w-full p-2 border rounded"
              placeholder="e.g., John Doe"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700">Phone</label>
              <input
                name="phone"
                value={booking.phone}
                onChange={onChange}
                className="mt-1 w-full p-2 border rounded"
                placeholder="+91 99999 11111"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700">Service</label>
              <input
                name="service"
                value={booking.service}
                onChange={onChange}
                className="mt-1 w-full p-2 border rounded"
                placeholder="Cleaning / Plumbing"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm text-gray-700">Price</label>
              <input
                name="price"
                value={booking.price}
                onChange={onChange}
                type="number"
                min="0"
                step="0.01"
                className="mt-1 w-full p-2 border rounded"
                placeholder="e.g., 111"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700">Date</label>
              <input
                name="date"
                value={booking.date}
                onChange={onChange}
                type="date"
                className="mt-1 w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700">Time</label>
              <input
                name="time"
                value={booking.time}
                onChange={onChange}
                type="time"
                className="mt-1 w-full p-2 border rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700">Notes (optional)</label>
            <textarea
              name="notes"
              value={booking.notes}
              onChange={onChange}
              className="mt-1 w-full p-2 border rounded"
              rows={3}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-green-500 text-white">Create</button>
          </div>
        </form>
      </div>
    </div>
  )
}
