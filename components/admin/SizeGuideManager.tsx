'use client'

import { useState } from 'react'
import { saveSizeGuides, deleteSizeGuide, SizeGuidePayload } from '@/lib/actions/admin-products'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, Plus, Save } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function SizeGuideManager({ productId, sizeGuides }: { productId: string, sizeGuides: any[] }) {
  const [localGuides, setLocalGuides] = useState<SizeGuidePayload[]>(() => {
    return sizeGuides.map(g => ({
      id: g.id,
      size_name: g.size_name || '',
      chest: g.chest || '',
      length: g.length || '',
      shoulder: g.shoulder || '',
      sleeve: g.sleeve || '',
      waist: g.waist || ''
    }))
  })
  
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAddRow = () => {
    setLocalGuides(prev => [...prev, {
      size_name: '',
      chest: '',
      length: '',
      shoulder: '',
      sleeve: '',
      waist: ''
    }])
  }

  const updateGuide = (index: number, field: keyof SizeGuidePayload, value: string) => {
    const updated = [...localGuides]
    updated[index] = { ...updated[index], [field]: value }
    setLocalGuides(updated)
  }

  const handleDelete = async (index: number, id?: string) => {
    if (confirm('Delete this size row?')) {
      if (id) {
        await deleteSizeGuide(id, productId)
      }
      const updated = [...localGuides]
      updated.splice(index, 1)
      setLocalGuides(updated)
    }
  }

  const handleSaveAll = async () => {
    // Validate
    const invalid = localGuides.some(g => !g.size_name.trim())
    if (invalid) {
      setError("All rows must have a Size Name (e.g., S, M, L)")
      return
    }

    setSaving(true)
    setError(null)
    const res = await saveSizeGuides(productId, localGuides)
    if (res.error) {
      setError(res.error)
    } else {
      alert("Size guide saved successfully!")
    }
    setSaving(false)
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-4 overflow-x-auto">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-lg font-medium text-gray-900">Size Guide (Measurements in Inches/cm)</h3>
          <Button onClick={handleSaveAll} disabled={saving} size="sm">
            <Save className="h-4 w-4 mr-2" /> {saving ? 'Saving...' : 'Save Size Guide'}
          </Button>
        </div>
        
        {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded">{error}</p>}

        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Size (e.g. S, M)</th>
              <th className="px-4 py-3">Chest</th>
              <th className="px-4 py-3">Length</th>
              <th className="px-4 py-3">Shoulder</th>
              <th className="px-4 py-3">Sleeve</th>
              <th className="px-4 py-3">Waist</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {localGuides.map((g, idx) => (
              <tr key={idx} className="border-b">
                <td className="px-4 py-2">
                  <Input value={g.size_name} onChange={e => updateGuide(idx, 'size_name', e.target.value)} className="w-20 h-8" placeholder="M" />
                </td>
                <td className="px-4 py-2">
                  <Input value={g.chest || ''} onChange={e => updateGuide(idx, 'chest', e.target.value)} className="w-20 h-8" placeholder="e.g. 40" />
                </td>
                <td className="px-4 py-2">
                  <Input value={g.length || ''} onChange={e => updateGuide(idx, 'length', e.target.value)} className="w-20 h-8" placeholder="e.g. 29" />
                </td>
                <td className="px-4 py-2">
                  <Input value={g.shoulder || ''} onChange={e => updateGuide(idx, 'shoulder', e.target.value)} className="w-20 h-8" />
                </td>
                <td className="px-4 py-2">
                  <Input value={g.sleeve || ''} onChange={e => updateGuide(idx, 'sleeve', e.target.value)} className="w-20 h-8" />
                </td>
                <td className="px-4 py-2">
                  <Input value={g.waist || ''} onChange={e => updateGuide(idx, 'waist', e.target.value)} className="w-20 h-8" />
                </td>
                <td className="px-4 py-2">
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(idx, g.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <Button variant="outline" className="w-full mt-4" onClick={handleAddRow}>
          <Plus className="h-4 w-4 mr-2" /> Add Size Row
        </Button>
      </CardContent>
    </Card>
  )
}
