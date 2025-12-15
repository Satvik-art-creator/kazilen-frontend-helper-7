"use client"

import { useRouter } from "next/navigation"
import { ChevronRight } from "lucide-react"

export default function WalletPage() {
  const router = useRouter()

  const withdrawableAmount = 837.97

  const transactions = [
    {
      id: "order_101",
      title: "Order earning",
      time: "01 Apr 2024 09:35 PM",
      amount: 600.8,
      type: "credit",
    },
    {
      id: "sub_201",
      title: "Subscription purchase",
      time: "01 Apr 2024 09:35 AM",
      amount: 33.8,
      type: "debit",
    },
  ]

  return (
    <div className="min-h-screen bg-white px-4 pt-6">
      {/* Page Title */}
      <h1 className="text-center text-lg font-semibold text-black mb-6">
        Wallet Money
      </h1>

      {/* Withdrawable Amount */}
      <button
        onClick={() => router.push("/withdraw")}
        className="w-full flex items-center justify-between
                   rounded-xl border border-teal-200
                   px-4 py-3 mb-6
                   bg-white
                   active:scale-[0.98]
                   transition"
      >
        <span className="text-sm font-medium text-teal-500">
          Withdrawable Amount
        </span>

        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-black">
            ₹{withdrawableAmount.toFixed(2)}
          </span>
          <ChevronRight className="w-5 h-5 text-teal-500" />
        </div>
      </button>

      {/* Transaction History */}
      <h2 className="text-sm font-semibold text-black mb-3">
        Transaction History
      </h2>

      <div className="flex flex-col gap-3">
        {transactions.map((txn) => (
          <button
            key={txn.id}
            onClick={() => router.push(`/order?id=${txn.id}`)}
            className="w-full flex items-center justify-between
                       rounded-xl border border-gray-200
                       px-4 py-3
                       bg-gray-50
                       text-left
                       active:scale-[0.98]
                       transition"
          >
            <div>
              <p className="text-sm font-medium text-teal-600">
                {txn.title}
              </p>
              <p className="text-xs text-gray-400">
                {txn.time}
              </p>
            </div>

            <span
              className={`text-sm font-semibold ${
                txn.type === "credit"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {txn.type === "credit" ? "+" : "-"}₹
              {txn.amount.toFixed(2)}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
