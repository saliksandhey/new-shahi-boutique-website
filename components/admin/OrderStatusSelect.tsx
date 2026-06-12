'use client'

import { useState } from 'react'
import { updateOrderStatus } from '@/lib/actions/admin-orders'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED', 'REFUNDED']

export function OrderStatusSelect({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus?.toUpperCase() || 'PENDING')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  const handleUpdate = async () => {
    setLoading(true)
    const result = await updateOrderStatus(orderId, status, note || 'Status manually updated by admin.')
    setLoading(false)
    if (result.error) {
      alert(`Error: ${result.error}`)
    } else {
      setNote('')
      alert('Status updated successfully!')
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold tracking-tight text-gray-900 uppercase">Change Status</h3>
      <div className="space-y-3">
        <select 
          value={status} 
          onChange={e => setStatus(e.target.value)}
          className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
        >
          {STATUSES.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input 
          type="text" 
          placeholder="Optional Note for Timeline..." 
          value={note}
          onChange={e => setNote(e.target.value)}
          className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
        />
        <Button onClick={handleUpdate} disabled={loading || status === currentStatus} className="w-full bg-black hover:bg-gray-800 text-white font-bold uppercase tracking-widest text-xs h-10">
          {loading ? 'Updating...' : 'Update Status'}
        </Button>
      </div>
    </div>
  )
}
