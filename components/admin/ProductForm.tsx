'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { saveProductDetails, ProductPayload, uploadProductImages } from '@/lib/actions/admin-products'
import { Upload, X } from 'lucide-react'

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  category_id: z.string().optional().nullable(),
  short_description: z.string().optional(),
  description: z.string().optional(),
  price: z.any(),
  sale_price: z.any(),
  stock: z.any(),
  featured: z.boolean().optional(),
  status: z.enum(['ACTIVE', 'DRAFT', 'ARCHIVED', 'OUT_OF_STOCK']).optional(),
  fabric: z.string().optional(),
  material: z.string().optional(),
  care_instructions: z.string().optional(),
  country_of_origin: z.string().optional(),
  weight: z.any(),
  dimensions: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  og_image: z.string().optional(),
  keywords: z.string().optional(),
  canonical_url: z.string().optional()
})

type ProductFormValues = z.infer<typeof productSchema>

export function ProductForm({ product, categories }: { product?: any, categories: any[] }) {
  const [error, setError] = useState<string | null>(null)
  const [selectedImages, setSelectedImages] = useState<{file: File, preview: string}[]>([])
  const [uploadingImages, setUploadingImages] = useState(false)
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      name: product.name || '',
      slug: product.slug || '',
      category_id: product.category_id || '',
      short_description: product.short_description || '',
      description: product.description || '',
      price: product.price || 0,
      sale_price: product.sale_price || null,
      stock: product.stock || 0,
      featured: product.featured || false,
      status: product.status || 'DRAFT',
      fabric: product.fabric || '',
      material: product.material || '',
      care_instructions: product.care_instructions || '',
      country_of_origin: product.country_of_origin || '',
      weight: product.weight || null,
      dimensions: product.dimensions || '',
      meta_title: product.meta_title || '',
      meta_description: product.meta_description || '',
      og_image: product.og_image || '',
      keywords: product.keywords || '',
      canonical_url: product.canonical_url || ''
    } : {
      name: '', slug: '', category_id: '', short_description: '', description: '', price: 0, sale_price: null, stock: 0, featured: false, status: 'DRAFT'
    }
  })

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue('name', e.target.value)
    if (!product && !form.getValues('slug')) {
      form.setValue('slug', e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))
    }
  }

  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const files = Array.from(e.target.files)
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }))
    setSelectedImages(prev => [...prev, ...newImages])
    e.target.value = '' 
  }

  const removeSelectedImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: ProductFormValues) => {
    setError(null)
    const payload = {
      id: product?.id,
      ...data,
      category_id: data.category_id || null,
      price: data.price === "" || data.price == null ? 0 : Number(data.price),
      sale_price: data.sale_price === "" || data.sale_price == null ? null : Number(data.sale_price),
      stock: data.stock === "" || data.stock == null ? 0 : Number(data.stock),
      weight: data.weight === "" || data.weight == null ? null : Number(data.weight),
    }

    const res = await saveProductDetails(payload as any)

    if (res?.error) {
      setError(res.error)
    } else if (res.id) {
      if (selectedImages.length > 0) {
        setUploadingImages(true)
        try {
          const formData = new FormData()
          for (let i = 0; i < selectedImages.length; i++) {
             formData.append('images', selectedImages[i].file, selectedImages[i].file.name)
          }
          await uploadProductImages(res.id, formData)
        } catch (err: any) {
          setError('Product saved, but image upload failed: ' + err.message)
          setUploadingImages(false)
          return
        }
      }

      if (!product) {
        window.location.href = `/admin/products/${res.id}/edit`
      } else {
        setSelectedImages([])
        setUploadingImages(false)
      }
    }
  }

  // Luxury UI Class Names
  const cardClass = "border border-gray-200 shadow-none rounded-none bg-white"
  const headerClass = "text-[11px] font-bold uppercase tracking-[0.2em] text-[#1C1C1C] border-b border-gray-100 pb-4 mb-6"
  const labelClass = "text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-2 block"
  const inputClass = "rounded-none border-gray-200 shadow-none focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] bg-gray-50/50 hover:bg-white transition-colors"

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-12">
      {error && <div className="bg-red-50 text-red-600 p-4 border border-red-100 text-sm tracking-wide uppercase font-medium">{error}</div>}
      
      {/* General Information */}
      <Card className={cardClass}>
        <CardContent className="pt-6">
          <h3 className={headerClass}>General Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Label htmlFor="name" className={labelClass}>Product Name</Label>
              <Input id="name" {...form.register('name')} onChange={handleNameChange} className={inputClass} placeholder="e.g. Silk Embroidered Kurta" />
              {form.formState.errors.name && <p className="text-[10px] uppercase text-red-500 mt-2">{form.formState.errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="slug" className={labelClass}>URL Slug</Label>
              <Input id="slug" {...form.register('slug')} className={inputClass} placeholder="silk-embroidered-kurta" />
              {form.formState.errors.slug && <p className="text-[10px] uppercase text-red-500 mt-2">{form.formState.errors.slug.message}</p>}
            </div>

            <div>
              <Label htmlFor="category_id" className={labelClass}>Category</Label>
              <select 
                id="category_id" 
                {...form.register('category_id')}
                className={`flex h-10 w-full px-3 py-2 text-sm outline-none ${inputClass}`}
              >
                <option value="">Select a category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="status" className={labelClass}>Status</Label>
              <select 
                id="status" 
                {...form.register('status')}
                className={`flex h-10 w-full px-3 py-2 text-sm outline-none ${inputClass}`}
              >
                <option value="ACTIVE">Published</option>
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Archived</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
              </select>
            </div>

            <div className="flex items-center space-x-3 pt-6">
              <input type="checkbox" id="featured" {...form.register('featured')} className="h-4 w-4 rounded-none border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]" />
              <Label htmlFor="featured" className={`${labelClass} !mb-0 cursor-pointer`}>Highlight as Featured</Label>
            </div>
          </div>

          <div className="mt-8">
            <Label htmlFor="short_description" className={labelClass}>Short Description (Excerpt)</Label>
            <Textarea id="short_description" {...form.register('short_description')} rows={2} className={inputClass} placeholder="A brief summary for product cards..." />
          </div>

          <div className="mt-8">
            <Label htmlFor="description" className={labelClass}>Full Description</Label>
            <Textarea id="description" {...form.register('description')} rows={6} className={inputClass} placeholder="Detailed product story, craftsmanship details..." />
          </div>
        </CardContent>
      </Card>

      {/* Product Images (Only for new products) */}
      {!product && (
        <Card className={cardClass}>
          <CardContent className="pt-6">
            <h3 className={headerClass}>Product Gallery</h3>
            <p className="text-[11px] text-gray-500 mb-6 font-medium tracking-wide">Upload high-resolution images. The first image will be used as the primary display.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {selectedImages.map((img, idx) => (
                <div key={idx} className="relative aspect-[3/4] border border-gray-200 overflow-hidden bg-gray-50 group">
                  <img src={img.preview} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <button type="button" onClick={() => removeSelectedImage(idx)} className="absolute top-2 right-2 bg-black/50 hover:bg-black text-white p-1.5 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <label className="border hover:border-[#D4AF37] border-gray-200 flex flex-col items-center justify-center aspect-[3/4] text-gray-400 hover:text-[#D4AF37] transition-colors cursor-pointer bg-gray-50/30">
                <Upload className="h-6 w-6 mb-3" strokeWidth={1.5} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-center px-4">Add Media</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageSelection} disabled={uploadingImages} />
              </label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pricing & Inventory */}
      <Card className={cardClass}>
        <CardContent className="pt-6">
          <h3 className={headerClass}>Pricing & Inventory</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Label htmlFor="price" className={labelClass}>Regular Price (₹)</Label>
              <Input id="price" type="number" step="0.01" {...form.register('price')} className={inputClass} placeholder="0.00" />
            </div>

            <div>
              <Label htmlFor="sale_price" className={labelClass}>Sale Price (₹)</Label>
              <Input id="sale_price" type="number" step="0.01" {...form.register('sale_price')} className={inputClass} placeholder="0.00 (Optional)" />
            </div>

            <div>
              <Label htmlFor="stock" className={labelClass}>Available Stock</Label>
              <Input id="stock" type="number" {...form.register('stock')} className={inputClass} placeholder="0" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Details */}
      <Card className={cardClass}>
        <CardContent className="pt-6">
          <h3 className={headerClass}>Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Label htmlFor="fabric" className={labelClass}>Fabric</Label>
              <Input id="fabric" {...form.register('fabric')} className={inputClass} placeholder="e.g. Pure Silk" />
            </div>
            <div>
              <Label htmlFor="material" className={labelClass}>Material / Embellishments</Label>
              <Input id="material" {...form.register('material')} className={inputClass} placeholder="e.g. Zari Embroidery" />
            </div>
            <div>
              <Label htmlFor="country_of_origin" className={labelClass}>Origin</Label>
              <Input id="country_of_origin" {...form.register('country_of_origin')} className={inputClass} placeholder="e.g. Made in India" />
            </div>
            <div>
              <Label htmlFor="weight" className={labelClass}>Weight (grams)</Label>
              <Input id="weight" type="number" {...form.register('weight')} className={inputClass} placeholder="e.g. 450" />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="dimensions" className={labelClass}>Dimensions</Label>
              <Input id="dimensions" {...form.register('dimensions')} className={inputClass} placeholder="e.g. 10 x 10 x 5 cm" />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="care_instructions" className={labelClass}>Care Instructions</Label>
              <Textarea id="care_instructions" {...form.register('care_instructions')} rows={3} className={inputClass} placeholder="e.g. Dry clean only. Keep away from direct sunlight..." />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO */}
      <Card className={cardClass}>
        <CardContent className="pt-6">
          <h3 className={headerClass}>Search Optimization</h3>
          <div className="space-y-6">
            <div>
              <Label htmlFor="meta_title" className={labelClass}>Meta Title</Label>
              <Input id="meta_title" {...form.register('meta_title')} className={inputClass} />
            </div>
            <div>
              <Label htmlFor="meta_description" className={labelClass}>Meta Description</Label>
              <Textarea id="meta_description" {...form.register('meta_description')} rows={2} className={inputClass} />
            </div>
            <div>
              <Label htmlFor="keywords" className={labelClass}>Keywords</Label>
              <Input id="keywords" {...form.register('keywords')} className={inputClass} placeholder="luxury, boutique, designer..." />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Bar */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <Button 
          type="submit" 
          disabled={form.formState.isSubmitting || uploadingImages} 
          className="bg-[#1C1C1C] hover:bg-[#D4AF37] text-white rounded-none uppercase tracking-[0.2em] text-[11px] font-bold px-12 py-7 transition-colors shadow-none"
        >
          {form.formState.isSubmitting || uploadingImages ? 'Processing...' : (product ? 'Update Collection' : 'Add to Collection')}
        </Button>
      </div>
    </form>
  )
}
