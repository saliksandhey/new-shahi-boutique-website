'use client'

import { useState } from 'react'
import { updateEmail, updatePassword } from '@/lib/actions/settings'

export function SecuritySettingsForm({ currentEmail }: { currentEmail: string }) {
  const [emailLoading, setEmailLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [emailMsg, setEmailMsg] = useState({ type: '', text: '' })
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' })

  async function handleEmailSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setEmailLoading(true)
    setEmailMsg({ type: '', text: '' })

    const formData = new FormData(e.currentTarget)
    const res = await updateEmail(formData)
    
    if (res?.error) {
      setEmailMsg({ type: 'error', text: res.error })
    } else {
      setEmailMsg({ type: 'success', text: 'Email updated! Check your new inbox to confirm.' })
    }
    setEmailLoading(false)
  }

  async function handlePasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPasswordLoading(true)
    setPasswordMsg({ type: '', text: '' })

    const formData = new FormData(e.currentTarget)
    const res = await updatePassword(formData)
    
    if (res?.error) {
      setPasswordMsg({ type: 'error', text: res.error })
    } else {
      setPasswordMsg({ type: 'success', text: 'Password changed successfully.' })
      e.currentTarget.reset()
    }
    setPasswordLoading(false)
  }

  return (
    <div className="space-y-8">
      {/* Update Email Form */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Login Email</h3>
        <p className="text-sm text-gray-500 mb-4">Change the email address used to log into the admin portal.</p>
        
        <form onSubmit={handleEmailSubmit} className="max-w-md space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">New Email Address</label>
            <input 
              name="email" 
              type="email" 
              defaultValue={currentEmail}
              required 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          {emailMsg.text && (
            <p className={`text-sm ${emailMsg.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
              {emailMsg.text}
            </p>
          )}
          <button type="submit" disabled={emailLoading} className="px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition disabled:bg-gray-400">
            {emailLoading ? 'Updating...' : 'Update Email'}
          </button>
        </form>
      </div>

      <hr className="border-gray-200" />

      {/* Update Password Form */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Administrator Password</h3>
        <p className="text-sm text-gray-500 mb-4">Ensure your account is using a long, random password to stay secure.</p>
        
        <form onSubmit={handlePasswordSubmit} className="max-w-md space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">New Password</label>
            <input 
              name="password" 
              type="password" 
              required 
              minLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          {passwordMsg.text && (
            <p className={`text-sm ${passwordMsg.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
              {passwordMsg.text}
            </p>
          )}
          <button type="submit" disabled={passwordLoading} className="px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition disabled:bg-gray-400">
            {passwordLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
