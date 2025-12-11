// app/edit/[id]/page.js
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Header from '../components/Header'
import { getItem, updateItem, deleteItem } from '../lib/api'

export default function EditItemPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    category: '',
    name: '',
    description: '',
    price: '',
  })

  useEffect(() => {
    if (!id) return
    let mounted = true
    setLoading(true)
    setError(null)

    getItem(id)
      .then((data) => {
        if (!mounted) return
        if (!data) {
          setError('Item not found')
          return
        }
        setForm({
          category: data.category ?? '',
          name: data.name ?? '',
          description: data.description ?? '',
          price: data.price != null ? String(data.price) : '',
        })
      })
      .catch((err) => {
        console.error('getItem error', err)
        setError(err?.message ?? 'Failed to load item')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [id])

  function onChange(e) {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
  }

  async function handleSave(e) {
    e?.preventDefault()
    setError(null)

    if (!form.name?.trim()) {
      setError('Name is required')
      return
    }
    if (!form.price || Number.isNaN(Number(form.price))) {
      setError('Enter a valid price')
      return
    }

    setSaving(true)
    try {
      const payload = {
        category: form.category || null,
        name: form.name.trim(),
        description: form.description || '',
        price: Number(form.price),
      }
      await updateItem(id, payload)
      router.push('/menu')
    } catch (err) {
      console.error('updateItem error', err)
      setError(err?.message || 'Failed to update item')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this item?')) return
    setDeleting(true)
    setError(null)
    try {
      await deleteItem(id)
      router.push('/menu')
    } catch (err) {
      console.error('deleteItem error', err)
      setError(err?.message || 'Failed to delete item')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div>Loading item...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center bg-white pt-6 pb-24">
      <div className="w-full max-w-md px-4">
        <div className="mb-6">
          <Header />
        </div>

        <form onSubmit={handleSave} className="bg-gray-100 p-4 rounded-lg shadow-sm">
          <label className="block mb-2 text-sm font-medium">Category</label>
          <input
            name="category"
            value={form.category}
            onChange={onChange}
            placeholder="Category (optional)"
            className="w-full mb-3 p-2 border border-gray-300 rounded"
          />

          <label className="block mb-2 text-sm font-medium">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Item name"
            className="w-full mb-3 p-2 border border-gray-300 rounded"
            required
          />

          <label className="block mb-2 text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            placeholder="Description"
            rows={3}
            className="w-full mb-3 p-2 border border-gray-300 rounded"
          />

          <label className="block mb-2 text-sm font-medium">Price</label>
          <input
            name="price"
            value={form.price}
            onChange={onChange}
            placeholder="Price"
            type="number"
            step="0.01"
            min="0"
            className="w-full mb-4 p-2 border border-gray-300 rounded"
            required
          />

          {error && <div className="text-red-600 mb-3">{error}</div>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className={`flex-1 py-3 rounded-md font-medium ${saving ? 'bg-gray-300 text-gray-700' : 'bg-yellow-400 hover:bg-yellow-500 text-black'}`}
            >
              {saving ? 'Saving…' : 'Save'}
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className={`py-3 px-4 rounded-md font-medium ${deleting ? 'bg-gray-300 text-gray-700' : 'bg-red-500 hover:bg-red-600 text-white'}`}
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
