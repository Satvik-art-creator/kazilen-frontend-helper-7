'use client'

import { useState } from 'react'

export default function MyProgress({
  data = {
    today: { earnings: 0, hours: '0:00hrs', orders: 0 },
    week: { earnings: 248.5, hours: '12:45hrs', orders: 18 }
  },
  onOpenBookings // function provided by parent to open bookings modal
}) {
  const [period, setPeriod] = useState('today')
  const current = period === 'today' ? data.today : data.week

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {/* Progress Card */}
      <div className="bg-white rounded-md shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-700">My Progress</h3>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPeriod('today')}
              aria-pressed={period === 'today'}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold focus:outline-none transition-all
                ${period === 'today' ? 'bg-yellow-500 text-white shadow' : 'bg-yellow-100 text-yellow-800'}`}
              style={{ minWidth: 92 }}
            >
              Today
            </button>

            <button
              onClick={() => setPeriod('week')}
              aria-pressed={period === 'week'}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold focus:outline-none transition-all
                ${period === 'week' ? 'bg-sky-500 text-white shadow' : 'bg-sky-100 text-sky-800'}`}
              style={{ minWidth: 92 }}
            >
              This Week
            </button>
          </div>
        </div>

        <div className="bg-gray-100 rounded-md p-4">
          <div className="flex gap-4 items-stretch">
            <div className="flex-1 flex flex-col items-center justify-center py-3">
              <div className="text-2xl font-bold text-gray-800">
                ${Number(current.earnings).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
              </div>
              <div className="text-sm text-gray-600 mt-2">Earnings</div>
            </div>

            <div className="w-px bg-gray-300" />

            <div className="flex-1 flex flex-col items-center justify-center py-3">
              <div className="text-2xl font-bold text-gray-800">{current.hours}</div>
              <div className="text-sm text-gray-600 mt-2">Time</div>
            </div>

            <div className="w-px bg-gray-300" />

            <div className="flex-1 flex flex-col items-center justify-center py-3">
              <div className="text-2xl font-bold text-gray-800">{current.orders}</div>
              <div className="text-sm text-gray-600 mt-2">Orders</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings button (calls parent handler to open modal) */}
      <div className="mt-4">
        <button
          onClick={onOpenBookings}
          className="w-full bg-green-200 hover:bg-green-300 rounded-lg px-6 py-6 text-2xl font-semibold text-gray-800 shadow"
          aria-haspopup="dialog"
        >
          Bookings
        </button>
      </div>
    </div>
  )
}
