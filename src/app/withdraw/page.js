"use client"

import { useRouter } from "next/navigation"

export default function WithdrawPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white px-4 pt-6">
      {/* Header */}
      <div className="relative mb-6">
        <h1 className="text-center text-lg font-semibold text-black">
          Withdraw Money
        </h1>

        {/* Cancel Button */}
        <button
          onClick={() => router.push("/wallet")}
          className="absolute right-0 top-0 text-sm font-medium text-gray-500"
        >
          Cancel
        </button>
      </div>

      {/* Available Balance */}
      <div className="rounded-xl bg-gray-100 p-4 mb-4 text-center">
        <p className="text-xs text-gray-500">Available Balance</p>
        <p className="text-xl font-semibold text-black">₹837.97</p>
      </div>

      {/* Withdraw Amount */}
      <label className="text-sm text-gray-600">Enter amount</label>
      <input
        type="number"
        defaultValue={837.97}
        className="mt-2 w-full rounded-lg border px-3 py-2
                   text-black focus:outline-none mb-6"
      />

      {/* Withdraw Button */}
      <button
        className="w-full rounded-lg bg-teal-500 py-3
                   text-white font-semibold"
      >
        Withdraw
      </button>

      {/* Info Text */}
      <p className="mt-3 text-xs text-gray-500 text-center">
        Withdrawals are processed within 24 hours
      </p>
    </div>
  )
}
