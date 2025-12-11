// app/menu/page.js
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../components/Header'
import ItemCard from '../components/ItemCard'
import { listItems } from '../lib/api'

export default function MenuPage() {
  const router = useRouter()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)

    listItems()
      .then((data) => {
        if (!mounted) return
        // ensure array
        setItems(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        if (!mounted) return
        console.error('listItems error', err)
        setError(err?.message ?? 'Failed to load items')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  const handleAddItem = () => router.push('/add-item')

  function handleItemDeleted(id) {
    setItems((prev) => prev.filter((it) => it.id !== id))
  }

  return (
    <main className="min-h-screen flex flex-col items-center bg-white pt-6 pb-24">
      <div className="w-full max-w-3xl px-4">
        <div className="mb-6">
          <Header />
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Menu</h2>
          <button
            onClick={handleAddItem}
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition"
          >
            Add item
          </button>
        </div>

        {loading && <div className="text-center py-8">Loading items...</div>}
        {error && <div className="text-red-600 text-center mb-4">{error}</div>}

        {!loading && items.length === 0 && !error && (
          <div className="text-center text-gray-600 py-8">No items yet — add the first one.</div>
        )}

        <div className="space-y-4 mt-4">
          {items.map((it) => (
            <ItemCard
              key={it.id ?? `${it.name}-${Math.random()}`}
              item={it}
              onDeleted={() => handleItemDeleted(it.id)}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
