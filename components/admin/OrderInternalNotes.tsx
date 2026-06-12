'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { saveStaffNotes } from '@/lib/actions/admin-orders'

export function OrderInternalNotes({ orderId, initialNotes, initialTags }: { orderId: string, initialNotes?: string, initialTags?: string[] }) {
  const [notes, setNotes] = useState(initialNotes || '')
  const [tags, setTags] = useState<string[]>(initialTags || [])
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)

  const handleAddTag = () => {
    const t = tagInput.trim().toUpperCase()
    if (t && !tags.includes(t)) {
      setTags([...tags, t])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
  }

  const handleSave = async () => {
    setSaving(true)
    const result = await saveStaffNotes(orderId, notes, tags)
    setSaving(false)
    if (result.error) {
      alert(`Error: ${result.error}`)
    } else {
      alert('Internal notes and tags saved successfully!')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold tracking-tight text-gray-900 uppercase">Internal Notes & Tags</h3>
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF7A00] bg-[#FF7A00]/10 px-3 py-1 rounded-full">Staff Only</span>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Order Tags</label>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <span key={tag} className="bg-gray-100 text-gray-900 text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full flex items-center gap-2">
                {tag}
                <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-red-500 text-gray-400 focus:outline-none">&times;</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 pt-1">
            <Input 
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddTag()}
              placeholder="e.g. VIP, FRAUD RISK"
              className="h-10 text-sm focus-visible:ring-black"
            />
            <Button type="button" onClick={handleAddTag} className="bg-gray-100 text-gray-900 hover:bg-gray-200 border-none h-10 font-bold text-xs uppercase tracking-widest px-6">Add</Button>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Staff Notes</label>
          <Textarea 
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Add internal comments here..."
            rows={3}
            className="focus-visible:ring-black resize-none"
          />
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full bg-black hover:bg-gray-800 text-white font-bold uppercase tracking-widest text-xs h-10">
          {saving ? 'Saving...' : 'Save Notes'}
        </Button>
      </div>
    </div>
  )
}
