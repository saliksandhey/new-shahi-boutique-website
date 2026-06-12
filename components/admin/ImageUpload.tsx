'use client'

import { useState } from 'react'
import { uploadProductImages, deleteProductImage, setPrimaryImage, updateImagePosition } from '@/lib/actions/admin-products'
import { Button } from '@/components/ui/button'
import { Trash2, Upload, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function ImageUpload({ productId, images }: { productId: string, images: any[] }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    
    setUploading(true)
    setError(null)
    
    try {
      const formData = new FormData()
      
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i]
        formData.append('images', file, file.name)
      }
      
      const res = await uploadProductImages(productId, formData)
      if (res.error) {
        setError(res.error)
      }
    } catch (err: any) {
      setError(err.message || 'Compression failed')
    }
    
    setUploading(false)
    e.target.value = ''
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this image?')) {
      await deleteProductImage(id, productId)
    }
  }

  const handleSetPrimary = async (id: string) => {
    await setPrimaryImage(id, productId)
  }

  const movePosition = async (id: string, currentPos: number, direction: -1 | 1) => {
    await updateImagePosition(id, currentPos + direction)
  }

  // Sort images safely locally, although they should be sorted from DB
  const sortedImages = [...images].sort((a, b) => (a.position || 0) - (b.position || 0))

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Media Gallery</h3>
        <p className="text-sm text-gray-500">Upload multiple images. High-resolution files are uploaded directly without compression to ensure premium luxury quality.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {sortedImages.map(img => (
            <div key={img.id} className={`relative group rounded-md overflow-hidden border-2 aspect-square bg-gray-50 ${img.is_primary ? 'border-black' : 'border-gray-200'}`}>
              <img src={img.url} alt="" className="h-full w-full object-cover" />
              
              {img.is_primary && (
                <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded shadow">
                  Main
                </div>
              )}

              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                
                <div className="flex gap-2">
                  <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => handleSetPrimary(img.id)} title="Set as Main">
                    <Star className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(img.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="icon" className="h-8 w-8 bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white" onClick={() => movePosition(img.id, img.position || 0, -1)} title="Move Left">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white" onClick={() => movePosition(img.id, img.position || 0, 1)} title="Move Right">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

              </div>
            </div>
          ))}
          
          <label className="border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center aspect-square text-gray-500 hover:text-black hover:border-black transition-colors cursor-pointer bg-gray-50/50">
            <Upload className="h-6 w-6 mb-2" />
            <span className="text-sm font-medium text-center px-4">{uploading ? 'Compressing & Uploading...' : 'Upload Images'}</span>
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
        {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded">{error}</p>}
      </CardContent>
    </Card>
  )
}
