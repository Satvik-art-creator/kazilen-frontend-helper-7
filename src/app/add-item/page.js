// app/add-item/page.js
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../components/Header' // adjust path if Header is elsewhere
import { createItem } from '../lib/api' // updated api helper

export default function AddItemPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    category: 'Category',
    name: '',
    description: '',
    price: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function onChange(e) {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    // basic validation
    if (!form.name || !form.price) {
      setError('Name and price are required')
      return
    }

    setLoading(true)
    try {
      // read professional id from localStorage (if present)
      const profId = (typeof window !== 'undefined') && (localStorage.getItem('kazilen_professional_id') || localStorage.getItem('professionalId') || null)
      await createItem({
        category: form.category === 'Category' ? null : form.category,
        name: form.name,
        description: form.description,
        price: Number(form.price),
      }, profId)
      router.push('/menu')
    } catch (err) {
      console.error('Create item error', err)
      setError(err?.message || 'Failed to create item')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center bg-white pt-6 pb-24">
      <div className="w-full max-w-md px-4">
        <div className="mb-6">
          <Header />
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-200 p-4 rounded-lg shadow-sm">
          <label className="block mb-3 text-lg font-medium">Category</label>

          <div>
            <input
              name="category"
              value={form.category}
              onChange={onChange}
              placeholder="Category"
              className="w-full mb-3 p-2 border border-gray-300 rounded"
            />

            <input
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Sub-Category / Item name"
              className="w-full mb-3 p-2 border border-gray-300 rounded"
            />

            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              placeholder="description"
              rows={3}
              className="w-full mb-3 p-2 border border-gray-300 rounded"
            />

            <input
              name="price"
              value={form.price}
              onChange={onChange}
              placeholder="Price"
              type="number"
              step="0.01"
              className="w-1/2 mb-6 p-2 border border-gray-300 rounded"
            />
          </div>

          {error && <div className="text-red-600 mb-3">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className={`mt-6 w-full bg-yellow-200 text-black py-3 rounded-md text-center font-medium ${ loading ? 'opacity-60' : '' }`}
          >
            {loading ? 'Adding...' : 'Add item'}
          </button>
        </form>
      </div>
    </main>
  )
}
