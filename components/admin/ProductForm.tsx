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

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}
      
      {/* General Information */}
      <Card>
        <CardContent className="pt-6 space-y-6">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2">General Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...form.register('name')} onChange={handleNameChange} />
              {form.formState.errors.name && <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" {...form.register('slug')} />
              {form.formState.errors.slug && <p className="text-xs text-red-500">{form.formState.errors.slug.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category_id">Category</Label>
              <select 
                id="category_id" 
                {...form.register('category_id')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select a category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select 
                id="status" 
                {...form.register('status')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="ACTIVE">Published</option>
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Archived</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
              </select>
            </div>

            <div className="space-y-2 flex items-center pt-8 space-x-2">
              <input type="checkbox" id="featured" {...form.register('featured')} className="h-4 w-4" />
              <Label htmlFor="featured">Featured Product</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="short_description">Short Description</Label>
            <Textarea id="short_description" {...form.register('short_description')} rows={2} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Full Description</Label>
            <Textarea id="description" {...form.register('description')} rows={6} />
          </div>
        </CardContent>
      </Card>

      {/* Product Images (Only for new products) */}
      {!product && (
        <Card>
          <CardContent className="pt-6 space-y-6">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Product Images</h3>
            <p className="text-sm text-gray-500">Upload images for this product. You can reorder and set the main image later.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {selectedImages.map((img, idx) => (
                <div key={idx} className="relative aspect-square border rounded-md overflow-hidden bg-gray-50">
                  <img src={img.preview} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeSelectedImage(idx)} className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-gray-100">
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              ))}
              <label className="border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center aspect-square text-gray-500 hover:text-black hover:border-black transition-colors cursor-pointer bg-gray-50/50">
                <Upload className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium text-center px-4">Upload Images</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageSelection} disabled={uploadingImages} />
              </label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pricing & Inventory Base */}
      <Card>
        <CardContent className="pt-6 space-y-6">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Base Pricing & Inventory</h3>
          <p className="text-sm text-gray-500">This is the default pricing if no variant overrides exist.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input id="price" type="number" step="0.01" {...form.register('price')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sale_price">Sale Price</Label>
              <Input id="sale_price" type="number" step="0.01" {...form.register('sale_price')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Base Stock</Label>
              <Input id="stock" type="number" {...form.register('stock')} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Details */}
      <Card>
        <CardContent className="pt-6 space-y-6">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Product Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fabric">Fabric</Label>
              <Input id="fabric" {...form.register('fabric')} placeholder="e.g. 100% Cotton" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="material">Material</Label>
              <Input id="material" {...form.register('material')} placeholder="e.g. Denim" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country_of_origin">Country of Origin</Label>
              <Input id="country_of_origin" {...form.register('country_of_origin')} placeholder="e.g. India" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (grams)</Label>
              <Input id="weight" type="number" {...form.register('weight')} placeholder="e.g. 250" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="dimensions">Dimensions (L x W x H)</Label>
              <Input id="dimensions" {...form.register('dimensions')} placeholder="e.g. 10x10x5 cm" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="care_instructions">Care Instructions</Label>
              <Textarea id="care_instructions" {...form.register('care_instructions')} rows={3} placeholder="Machine wash cold..." />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO */}
      <Card>
        <CardContent className="pt-6 space-y-6">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Search Engine Optimization</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="meta_title">Meta Title</Label>
              <Input id="meta_title" {...form.register('meta_title')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meta_description">Meta Description</Label>
              <Textarea id="meta_description" {...form.register('meta_description')} rows={2} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords</Label>
              <Input id="keywords" {...form.register('keywords')} placeholder="dress, summer, cotton" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="canonical_url">Canonical URL</Label>
              <Input id="canonical_url" {...form.register('canonical_url')} placeholder="https://example.com/product/..." />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={form.formState.isSubmitting || uploadingImages} size="lg" className="px-8">
          {form.formState.isSubmitting || uploadingImages ? 'Saving...' : (product ? 'Update Details' : 'Create Product')}
        </Button>
      </div>
    </form>
  )
}
