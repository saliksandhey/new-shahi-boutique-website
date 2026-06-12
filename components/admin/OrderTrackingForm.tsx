'use client'

import { useState, useEffect } from 'react'
import { updateShippingDetails } from '@/lib/actions/admin-orders'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function OrderTrackingForm({ order }: { order: any }) {
  const [loading, setLoading] = useState(false)
  const [courierName, setCourierName] = useState(order?.courier_name || '')
  const [trackingNumber, setTrackingNumber] = useState(order?.tracking_number || '')
  const [trackingUrl, setTrackingUrl] = useState(order?.tracking_url || '')
  const [shipmentNotes, setShipmentNotes] = useState(order?.shipment_notes || '')

  useEffect(() => {
    setCourierName(order?.courier_name || '')
    setTrackingNumber(order?.tracking_number || '')
    setTrackingUrl(order?.tracking_url || '')
    setShipmentNotes(order?.shipment_notes || '')
  }, [order])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData()
    formData.append('courier_name', courierName)
    formData.append('tracking_number', trackingNumber)
    formData.append('tracking_url', trackingUrl)
    formData.append('shipment_notes', shipmentNotes)
    
    const result = await updateShippingDetails(order.id, formData)
    setLoading(false)
    if (result.error) {
      alert(`Error: ${result.error}`)
    } else {
      alert('Tracking details updated!')
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold tracking-tight text-gray-900 uppercase">Shipment Tracking</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="courier_name" className="text-xs uppercase tracking-widest text-gray-500 font-bold">Courier Name</Label>
          <Input id="courier_name" name="courier_name" value={courierName} onChange={e => setCourierName(e.target.value)} placeholder="e.g. FedEx, UPS" className="focus-visible:ring-black" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tracking_number" className="text-xs uppercase tracking-widest text-gray-500 font-bold">Tracking Number</Label>
          <Input id="tracking_number" name="tracking_number" value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} className="focus-visible:ring-black" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tracking_url" className="text-xs uppercase tracking-widest text-gray-500 font-bold">Tracking URL</Label>
          <Input id="tracking_url" name="tracking_url" value={trackingUrl} onChange={e => setTrackingUrl(e.target.value)} placeholder="https://..." className="focus-visible:ring-black" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="shipment_notes" className="text-xs uppercase tracking-widest text-gray-500 font-bold">Shipment Notes</Label>
          <Textarea id="shipment_notes" name="shipment_notes" value={shipmentNotes} onChange={e => setShipmentNotes(e.target.value)} rows={2} className="focus-visible:ring-black resize-none" />
        </div>
        <Button type="submit" disabled={loading} className="w-full bg-black hover:bg-gray-800 text-white font-bold uppercase tracking-widest text-xs h-10 mt-2">
          {loading ? 'Saving...' : 'Save Tracking'}
        </Button>
      </form>
    </div>
  )
}
