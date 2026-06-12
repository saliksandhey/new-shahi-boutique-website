'use client'

import { useState } from 'react'
import { updateOrderShippingAddress } from '@/lib/actions/admin-orders'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function OrderAddressEdit({ orderId, currentAddress, orderStatus }: { orderId: string, currentAddress: any, orderStatus: string }) {
  const [editing, setEditing] = useState(false)
  const [address, setAddress] = useState(currentAddress || {})
  const [saving, setSaving] = useState(false)

  if (orderStatus !== 'PENDING' && orderStatus !== 'CONFIRMED') {
    return null // Can't edit after packed
  }

  const handleSave = async () => {
    setSaving(true)
    await updateOrderShippingAddress(orderId, address)
    setSaving(false)
    setEditing(false)
  }

  if (!editing) {
    return (
      <Button variant="link" size="sm" onClick={() => setEditing(true)} className="h-auto p-0 text-blue-600 mt-2">
        Edit Shipping Address
      </Button>
    )
  }

  return (
    <div className="mt-4 p-4 border rounded bg-gray-50 space-y-3">
      <h5 className="text-xs font-semibold uppercase text-gray-500">Edit Address</h5>
      <Input placeholder="Full Name" value={address.customer_name || ''} onChange={e => setAddress({...address, customer_name: e.target.value})} className="h-8 text-sm" />
      <Input placeholder="Address (Street, Apt)" value={address.shipping_address || ''} onChange={e => setAddress({...address, shipping_address: e.target.value})} className="h-8 text-sm" />
      <Input placeholder="Phone Number" value={address.customer_phone || ''} onChange={e => setAddress({...address, customer_phone: e.target.value})} className="h-8 text-sm" />
      <div className="flex gap-2">
        <Input placeholder="City" value={address.city || ''} onChange={e => setAddress({...address, city: e.target.value})} className="h-8 text-sm flex-1" />
        <Input placeholder="State" value={address.state || ''} onChange={e => setAddress({...address, state: e.target.value})} className="h-8 text-sm flex-1" />
      </div>
      <div className="flex gap-2">
        <Input placeholder="Postal Code" value={address.postal_code || ''} onChange={e => setAddress({...address, postal_code: e.target.value})} className="h-8 text-sm flex-1" />
        <Input placeholder="Country" value={address.country || ''} onChange={e => setAddress({...address, country: e.target.value})} className="h-8 text-sm flex-1" />
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
        <Button size="sm" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
      </div>
    </div>
  )
}
