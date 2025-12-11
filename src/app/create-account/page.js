// app/create-account/page.js
'use client'

import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createProfessional } from '../lib/api' // adjust path if needed

export default function CreateAccountPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const phoneFromQuery = searchParams?.get('phone') || ''

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [dob, setDob] = useState('')
  const [gender, setGender] = useState('')
  const [category, setCategory] = useState('')
  const [touched, setTouched] = useState({})
  const [loading, setLoading] = useState(false)

  const [phone] = useState(phoneFromQuery)

  const canSubmit = Boolean(
    name.trim() && dob && gender && category && /^\d{10}$/.test(phone)
  )

  const CATEGORY_OPTIONS = [
    { value: 'customer', label: 'Customer' },
    { value: 'worker', label: 'Worker' },
    { value: 'shopkeeper', label: 'Shopkeeper' },
  ]

  const handleCreateAccount = async () => {
    if (!canSubmit) {
      setTouched({ name: true, dob: true, gender: true, category: true })
      alert('Please fill Name, Date of Birth, Gender, Category and ensure phone is present.')
      return
    }

    try {
      setLoading(true)
      const genderEnum = gender ? gender.toUpperCase() : null
      const payload = {
        phone,
        name: name.trim(),
        email: email || null,
        dob,
        gender: genderEnum,
        category: category || null,
      }

      const created = await createProfessional(payload)

      if (created?.id) {
        const idStr = String(created.id)
        localStorage.setItem('kazilen_professional_id', idStr)
        localStorage.setItem('professionalId', idStr)

        // keep legacy user keys for compatibility
        localStorage.setItem('kazilen_user_id', idStr)
        localStorage.setItem('userId', idStr)
      }

      if (created?.phone) {
        localStorage.setItem('kazilen_professional_phone', created.phone)
        localStorage.setItem('kazilen_user_phone', created.phone)
        localStorage.setItem('kazilen_user_phone_v2', created.phone)
      } else if (phone) {
        localStorage.setItem('kazilen_professional_phone', phone)
        localStorage.setItem('kazilen_user_phone', phone)
        localStorage.setItem('kazilen_user_phone_v2', phone)
      }

      if (category) {
        localStorage.setItem('kazilen_professional_category', category)
        localStorage.setItem('kazilen_user_category', category)
      }

      alert('Account created successfully!')
      router.replace('/')
    } catch (err) {
      alert(err?.message || 'Create failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center gap-3 p-4 shadow-sm border-b">
        <button onClick={() => router.back()} className="text-gray-700">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">Create your profile</h1>
      </div>

      <div className="px-4 mt-4">
        <fieldset className="relative border rounded-lg px-3 pt-4 pb-2">
          <legend className="text-xs px-1 text-gray-500">Phone</legend>
          <input
            type="tel"
            value={phone}
            readOnly
            className="w-full border-none bg-transparent p-0 text-sm text-gray-800 focus:outline-none"
          />
        </fieldset>
        {!/^\d{10}$/.test(phone) && (
          <p className="text-xs text-red-500 mt-1">
            Phone not found or invalid. Go back to login and enter a valid phone.
          </p>
        )}
      </div>

      <div className="px-4 mt-6">
        <fieldset className={`relative border rounded-lg px-3 pt-4 pb-2 ${touched.name && !name.trim() ? 'border-red-400' : 'border-gray-300'}`}>
          <legend className="text-xs px-1 text-gray-500">Name *</legend>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            placeholder="Enter your full name"
            className="w-full border-none bg-transparent p-0 text-sm text-gray-800 focus:outline-none"
          />
        </fieldset>
        {touched.name && !name.trim() && (
          <p className="text-xs text-red-500 mt-1">Name is required.</p>
        )}
      </div>

      <div className="px-4 mt-4">
        <fieldset className="relative border border-gray-300 rounded-lg px-3 pt-4 pb-2">
          <legend className="text-xs px-1 text-gray-500">Email (optional)</legend>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full border-none bg-transparent p-0 text-sm text-gray-800 focus:outline-none"
          />
        </fieldset>
      </div>

      <div className="px-4 mt-4">
        <fieldset className={`relative border rounded-lg px-3 pt-4 pb-2 ${touched.dob && !dob ? 'border-red-400' : 'border-gray-300'}`}>
          <legend className="text-xs px-1 text-gray-500">Date of birth *</legend>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, dob: true }))}
            className="w-full border-none bg-transparent p-0 text-sm text-gray-800 focus:outline-none"
          />
        </fieldset>
        {touched.dob && !dob && (
          <p className="text-xs text-red-500 mt-1">Date of birth is required.</p>
        )}
      </div>

      <div className="px-4 mt-4">
        <fieldset className={`relative border rounded-lg px-3 pt-4 pb-2 ${touched.gender && !gender ? 'border-red-400' : 'border-gray-300'}`}>
          <legend className="text-xs px-1 text-gray-500">Gender *</legend>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, gender: true }))}
            className="w-full border-none bg-transparent text-sm text-gray-800 focus:outline-none"
          >
            <option value="" disabled>Select gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </fieldset>
        {touched.gender && !gender && (
          <p className="text-xs text-red-500 mt-1">Gender is required.</p>
        )}
      </div>

      <div className="px-4 mt-4 mb-6">
        <fieldset className={`relative border rounded-lg px-3 pt-4 pb-2 ${touched.category && !category ? 'border-red-400' : 'border-gray-300'}`}>
          <legend className="text-xs px-1 text-gray-500">Category *</legend>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, category: true }))}
            className="w-full border-none bg-transparent text-sm text-gray-800 focus:outline-none"
          >
            <option value="" disabled>Select category</option>
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </fieldset>
        {touched.category && !category && (
          <p className="text-xs text-red-500 mt-1">Category is required.</p>
        )}
      </div>

      <div className="px-4 pb-6">
        <button
          onClick={handleCreateAccount}
          disabled={!canSubmit || loading}
          className={`w-full py-3 rounded-xl font-medium ${canSubmit ? 'bg-yellow-400 hover:bg-yellow-500 text-black' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
        >
          {loading ? 'Creating…' : 'Create Account'}
        </button>
      </div>
    </div>
  )
}
