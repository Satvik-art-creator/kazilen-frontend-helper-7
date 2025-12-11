// app/components/ItemCard.js
'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useState } from 'react'
import { deleteItem } from '../lib/api'

export default function ItemCard({ item = {}, onDeleted } = {}) {
  const router = useRouter()
  const [loadingDelete, setLoadingDelete] = useState(false)
  const [error, setError] = useState(null)

  const priceNumber = item.price != null ? Number(item.price) : null
  const priceText =
    priceNumber == null || Number.isNaN(priceNumber) ? '—' : priceNumber.toFixed(2)

  const handleEdit = () => {
    if (item?.id) router.push(`/edit/${item.id}`)
    else router.push('/edit')
  }

  const handleDelete = async () => {
    const ok = window.confirm('Delete this item? This action cannot be undone.')
    if (!ok) return
    setError(null)
    setLoadingDelete(true)
    try {
      await deleteItem(item.id)
      if (typeof onDeleted === 'function') onDeleted(item.id)
      else window.location.reload()
    } catch (err) {
      console.error('delete error', err)
      setError(err?.message || 'Failed to delete')
    } finally {
      setLoadingDelete(false)
    }
  }

  const imageSrc = item.imageUrl || item.image || '/door-repair.jpg'
  const shortDesc = item.description
    ? item.description.length > 120
      ? item.description.slice(0, 120) + '…'
      : item.description
    : ''

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-sm flex justify-between items-center">
      <div className="flex-1 pr-4">
        <p className="text-sm text-gray-500">{item.category ?? 'Uncategorized'}</p>
        <p className="font-semibold text-lg">{item.name ?? 'Unnamed item'}</p>
        {shortDesc && <p className="text-gray-700 mt-1 text-sm">{shortDesc}</p>}
        <p className="text-gray-800 font-bold mt-3">₹{priceText}</p>
        {item.createdAt && (
          <p className="text-xs text-gray-500 mt-1">
            Added: {new Date(item.createdAt).toLocaleString()}
          </p>
        )}
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      </div>

      <div className="flex flex-col items-end">
        <div className="w-[100px] h-[80px] relative rounded-md overflow-hidden">
          <Image
            src={imageSrc}
            alt={item.name ?? 'item image'}
            fill
            style={{ objectFit: 'cover' }}
            sizes="100px"
          />
        </div>

        <div className="mt-3 flex gap-3">
          <button
            onClick={handleEdit}
            className="text-black font-semibold hover:underline"
          >
            Edit
          </button>

          <button
            onClick={handleDelete}
            disabled={loadingDelete}
            className={`text-sm px-3 py-1 rounded ${loadingDelete ? 'opacity-60' : 'text-red-600 hover:underline'}`}
          >
            {loadingDelete ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
