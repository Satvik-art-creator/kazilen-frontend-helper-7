'use client'

/**
 * BookingHistory
 * 
 * Props:
 *  - bookings: Array of booking objects
 *    Each booking should have:
 *      { id, service, price, date?, time?, customerName?, notes? }
 */
export default function BookingHistory({ bookings = [] }) {
  if (!bookings || bookings.length === 0) {
    return (
      <div className="mt-4 text-sm text-gray-500">
        No bookings yet.
      </div>
    )
  }

  return (
    <div className="mt-4 space-y-3">
      {bookings.map((b) => (
        <div
          key={b.id}
          className="bg-gray-100 rounded-md p-4 flex items-center justify-between"
        >
          <div className="text-sm text-gray-800">
            {b.service || b.notes || b.customerName || 'Booking'}
            {b.date && (
              <div className="text-xs text-gray-500 mt-1">
                {b.date}{b.time ? ` • ${b.time}` : ''}
              </div>
            )}
          </div>

          <div className="text-sm font-semibold text-gray-800">
            ${Number(b.price || 0).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  )
}
