export default function OrderDetailPage({ searchParams }) {
  const id = searchParams?.id

  return (
    <div className="min-h-screen bg-white px-4 pt-6">
      <h1 className="text-center text-lg font-semibold text-black mb-6">
        Order Details
      </h1>

      <div className="rounded-xl border p-4">
        <p className="text-sm text-gray-500">Transaction ID</p>
        <p className="text-sm font-semibold text-black">
          {id ?? "N/A"}
        </p>

        <div className="mt-4">
          <p className="text-sm text-gray-500">Status</p>
          <p className="text-sm font-medium text-green-500">
            Completed
          </p>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-500">Amount</p>
          <p className="text-lg font-semibold text-black">
            ₹600.80
          </p>
        </div>
      </div>
    </div>
  )
}
