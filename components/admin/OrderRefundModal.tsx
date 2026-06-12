'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { processRefund } from '@/lib/actions/admin-orders'

export function OrderRefundModal({ orderId, items, orderStatus }: { orderId: string, items: any[], orderStatus: string }) {
  const [refundItems, setRefundItems] = useState<{[id: string]: number}>({})
  const [restock, setRestock] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [showForm, setShowForm] = useState(false)

  if (orderStatus === 'REFUNDED') return null

  const handleQtyChange = (id: string, qty: number, max: number) => {
    if (qty < 0) qty = 0
    if (qty > max) qty = max
    setRefundItems(prev => ({ ...prev, [id]: qty }))
  }

  const handleRefund = async () => {
    setProcessing(true)
    const payload = items.map(i => ({
      id: i.id,
      product_id: i.products?.id || null,
      qty: refundItems[i.id] || 0
    }))
    
    // calc refund amount based on qty * price
    let amount = 0
    for (const item of items) {
      if (refundItems[item.id] && refundItems[item.id] > 0) {
        amount += (item.price * refundItems[item.id])
      }
    }

    if (amount > 0) {
      await processRefund(orderId, payload, amount, restock)
    }
    setProcessing(false)
    setShowForm(false)
  }

  return (
    <Card className="border-orange-200 bg-orange-50/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-orange-800 flex justify-between items-center text-lg">
          Returns & Refunds
          {!showForm && (
            <Button size="sm" variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-100" onClick={() => setShowForm(true)}>
              Process Refund
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      
      {showForm && (
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-700">Select items to refund:</div>
          <div className="space-y-2 border-y border-orange-100 py-3">
            {items.map(item => {
              const maxRefundable = item.quantity - (item.refunded_quantity || 0)
              if (maxRefundable <= 0) return null
              return (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div>
                    <p className="text-sm font-medium">{item.products?.name}</p>
                    <p className="text-xs text-gray-500">₹{item.price} x {maxRefundable} available</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      min="0" 
                      max={maxRefundable} 
                      className="w-16 border rounded p-1 text-center"
                      value={refundItems[item.id] || 0}
                      onChange={e => handleQtyChange(item.id, parseInt(e.target.value) || 0, maxRefundable)}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="restock" 
              checked={restock} 
              onChange={e => setRestock(e.target.checked)} 
              className="rounded border-gray-300"
            />
            <label htmlFor="restock" className="text-sm text-gray-700">Restock refunded items in inventory</label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button size="sm" onClick={handleRefund} disabled={processing} className="bg-orange-600 hover:bg-orange-700 text-white">
              {processing ? 'Processing...' : 'Confirm Refund'}
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
