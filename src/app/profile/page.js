// app/profile/page.js
'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getProfessional, updateProfessional, checkPhone } from '../lib/api'

export default function ProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const profIdQuery = searchParams?.get('professionalId') || ''

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const [id, setId] = useState(null)
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [dob, setDob] = useState('') // yyyy-mm-dd
  const [gender, setGender] = useState('') // display value like "Male" / "Female" / "Other"
  const [touched, setTouched] = useState({})

  const CATEGORY_OPTIONS = [
    { value: 'customer', label: 'Customer' },
    { value: 'worker', label: 'Worker' },
    { value: 'shopkeeper', label: 'Shopkeeper' },
  ]

  const normalizeDob = (val) => {
    if (!val) return ''
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val
    try {
      const d = new Date(val)
      if (isNaN(d.getTime())) return ''
      return d.toISOString().slice(0, 10)
    } catch {
      return ''
    }
  }

  const displayGender = (g) => {
    if (!g) return ''
    const lower = String(g).toLowerCase()
    return lower.charAt(0).toUpperCase() + lower.slice(1)
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        // Get professional id from query or localStorage
        let professionalId = profIdQuery || ''
        if (!professionalId) {
          try {
            professionalId =
              localStorage.getItem('kazilen_professional_id') ||
              localStorage.getItem('professionalId') ||
              ''
          } catch (e) {
            professionalId = ''
          }
        }

        // Try phone from localStorage (display-only) early
        try {
          const phoneStored =
            localStorage.getItem('kazilen_professional_phone') ||
            localStorage.getItem('kazilen_user_phone') ||
            ''
          if (phoneStored) setPhone(phoneStored)
        } catch (e) {}

        if (!professionalId) {
          // If no id but phone exists, try checkPhone to resolve id
          try {
            const savedPhone =
              localStorage.getItem('kazilen_professional_phone') ||
              localStorage.getItem('kazilen_user_phone') ||
              ''
            if (savedPhone && /^\d{10}$/.test(savedPhone)) {
              const resp = await checkPhone(savedPhone)
              if (resp?.exists && (resp.professionalId || resp.userId)) {
                const resolvedId = resp.professionalId ?? resp.userId
                try {
                  localStorage.setItem('kazilen_professional_id', String(resolvedId))
                  localStorage.setItem('professionalId', String(resolvedId))
                } catch (e) {}
                professionalId = String(resolvedId)
              } else {
                // No account for this phone — go to create-account
                router.push(`/create-account?phone=${encodeURIComponent(savedPhone)}`)
                setLoading(false)
                return
              }
            } else {
              // No phone or invalid — redirect to login
              router.push('/login')
              setLoading(false)
              return
            }
          } catch (err) {
            console.error('Phone resolution failed', err)
            // if phone check failed, redirect to login
            router.push('/login')
            setLoading(false)
            return
          }
        }

        // Fetch profile
        const prof = await getProfessional(professionalId)
        if (!prof) {
          setError('Profile not found')
          setLoading(false)
          return
        }

        setId(prof.id ?? professionalId)
        setPhone(prof.phone ?? '')
        setName(prof.name ?? '')
        setEmail(prof.email ?? '')
        setDob(normalizeDob(prof.dob ?? ''))
        setGender(displayGender(prof.gender ?? ''))
      } catch (err) {
        console.error('Failed to load profile', err)
        setError(err?.message ? String(err.message) : 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const canSave = Boolean(name.trim() && dob && gender)

  const handleSave = async () => {
    if (!canSave) {
      setTouched({ name: true, dob: true, gender: true })
      alert('Please fill Name, Date of Birth and Gender.')
      return
    }
    if (!id) {
      alert("No profile id found. Please login or create account.")
      router.push('/login')
      return
    }

    setSaving(true)
    setError(null)
    try {
      const payload = {
        phone,
        name: name.trim(),
        email: email || null,
        dob,
        gender: gender ? gender.toUpperCase() : null,
        // we leave category out here; add if you have local category state
      }

      const updated = await updateProfessional(id, payload)

      // persist updated info locally
      if (updated?.id) {
        try {
          localStorage.setItem('kazilen_professional_id', String(updated.id))
          localStorage.setItem('professionalId', String(updated.id))
        } catch (e) {}
        setId(updated.id)
      }
      if (updated?.phone) {
        try {
          localStorage.setItem('kazilen_professional_phone', updated.phone)
          localStorage.setItem('kazilen_user_phone', updated.phone)
          localStorage.setItem('kazilen_user_phone_v2', updated.phone)
        } catch (e) {}
        setPhone(updated.phone)
      } else if (phone) {
        try {
          localStorage.setItem('kazilen_professional_phone', phone)
        } catch (e) {}
      }

      // update local UI from response
      setName(updated?.name ?? name)
      setEmail(updated?.email ?? email)
      setDob(normalizeDob(updated?.dob ?? dob))
      setGender(displayGender(updated?.gender ?? gender))

      alert('Profile updated successfully.')
      router.replace('/')
    } catch (err) {
      console.error('Save error', err)
      const msg = err?.message ? String(err.message) : 'Update failed'
      setError(msg)
      alert(msg)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading profile…</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header with back button */}
      <div className="flex items-center gap-3 p-4 shadow-sm border-b">
        <button onClick={() => router.back()} className="text-gray-700">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">Your profile</h1>
      </div>

      <div className="p-4 space-y-4">
        {error && <div className="text-sm text-red-500">Error: {error}</div>}

        {/* Phone (readonly) */}
        <div>
          <label className="text-xs text-gray-500">Phone</label>
          <input
            type="tel"
            value={phone}
            readOnly
            className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-50 text-sm"
          />
        </div>

        {/* Name */}
        <div>
          <label className="text-xs text-gray-500">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
            placeholder="Your full name"
          />
          {touched.name && !name.trim() && (
            <p className="text-xs text-red-500 mt-1">Name is required.</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="text-xs text-gray-500">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
            placeholder="you@example.com (optional)"
          />
        </div>

        {/* DOB */}
        <div>
          <label className="text-xs text-gray-500">Date of birth</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, dob: true }))}
            className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
          />
          {touched.dob && !dob && (
            <p className="text-xs text-red-500 mt-1">Date of birth is required.</p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="text-xs text-gray-500">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, gender: true }))}
            className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          {touched.gender && !gender && (
            <p className="text-xs text-red-500 mt-1">Gender is required.</p>
          )}
        </div>

        <div className="pt-2">
          <button
            onClick={handleSave}
            disabled={saving || !canSave}
            className={`w-full py-3 rounded-xl font-medium ${
              saving ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500 text-black'
            }`}
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
