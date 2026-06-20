'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, Save } from 'lucide-react'
import { saveVariants, deleteVariant, VariantPayload } from '@/lib/actions/admin-products'

export function ProductVariantsManager({ productId, variants = [] }: { productId: string, variants: any[] }) {
  const [items, setItems] = useState<VariantPayload[]>(
    variants.length > 0 ? variants : []
  )
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addItem = () => {
    setItems([...items, { color: '', size: '', stock: 0, sku: '', price_override: null }])
  }

  const updateItem = (index: number, field: keyof VariantPayload, value: string | number | null) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value } as any
    setItems(newItems)
  }

  const handleSave = async () => {
    setError(null)
    setIsSaving(true)
    
    // Filter out completely empty rows
    const validItems = items.filter(item => item.color?.trim() || item.size?.trim() || item.sku?.trim())
    
    const res = await saveVariants(productId, validItems)
    setIsSaving(false)
    if (res.error) {
      setError(res.error)
    } else {
      // Refresh logic or toast
    }
  }

  const handleRemove = async (index: number) => {
    const item = items[index]
    if (item.id) {
      if (confirm('Are you sure you want to delete this variant?')) {
        await deleteVariant(item.id, productId)
        setItems(items.filter((_, i) => i !== index))
      }
    } else {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const cardClass = "border border-gray-200 shadow-none rounded-none bg-white"
  const labelClass = "text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-2 block"
  const inputClass = "rounded-none border-gray-200 shadow-none focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] bg-gray-50/50 hover:bg-white transition-colors h-9 text-sm"

  return (
    <Card className={cardClass}>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1C1C1C]">Product Variants (Colors & Sizes)</h3>
          <Button onClick={addItem} type="button" variant="outline" className="h-8 rounded-none border-gray-200 text-[10px] uppercase tracking-widest font-bold">
            <Plus className="w-3 h-3 mr-2" /> Add Variant
          </Button>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-4 border border-red-100 text-sm tracking-wide uppercase font-medium mb-6">{error}</div>}

        <div className="space-y-4">
          {items.map((item, idx) => (
            <div key={item.id || idx} className="grid grid-cols-12 gap-4 items-end bg-gray-50/30 p-4 border border-gray-100">
              <div className="col-span-3">
                <Label className={labelClass}>Color</Label>
                <Input value={item.color || ''} onChange={(e) => updateItem(idx, 'color', e.target.value)} className={inputClass} placeholder="e.g. Royal Blue" />
              </div>
              <div className="col-span-2">
                <Label className={labelClass}>Size</Label>
                <Input value={item.size || ''} onChange={(e) => updateItem(idx, 'size', e.target.value)} className={inputClass} placeholder="e.g. L" />
              </div>
              <div className="col-span-2">
                <Label className={labelClass}>SKU</Label>
                <Input value={item.sku || ''} onChange={(e) => updateItem(idx, 'sku', e.target.value)} className={inputClass} placeholder="SKU-123" />
              </div>
              <div className="col-span-2">
                <Label className={labelClass}>Stock</Label>
                <Input type="number" value={item.stock || 0} onChange={(e) => updateItem(idx, 'stock', parseInt(e.target.value) || 0)} className={inputClass} />
              </div>
              <div className="col-span-2">
                <Label className={labelClass}>Price Override (₹)</Label>
                <Input type="number" step="0.01" value={item.price_override || ''} onChange={(e) => updateItem(idx, 'price_override', e.target.value ? parseFloat(e.target.value) : null)} className={inputClass} placeholder="0.00" />
              </div>
              <div className="col-span-1 flex justify-end">
                <Button onClick={() => handleRemove(idx)} type="button" variant="ghost" className="h-9 w-9 p-0 rounded-none text-red-500 hover:text-red-700 hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm italic">
              No variants added yet. If left empty, the product acts as a single-variant item.
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="mt-6 flex justify-end">
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="bg-[#1C1C1C] hover:bg-[#D4AF37] text-white rounded-none uppercase tracking-[0.2em] text-[10px] font-bold px-8 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Variants'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
