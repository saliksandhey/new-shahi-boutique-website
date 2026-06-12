'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createCategory, updateCategory } from '@/lib/actions/admin-categories'
import { Card, CardContent } from '@/components/ui/card'

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens")
})

type CategoryFormValues = z.infer<typeof categorySchema>

export function CategoryForm({ category }: { category?: any }) {
  const [error, setError] = useState<string | null>(null)
  
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: category ? {
      name: category.name,
      slug: category.slug
    } : {
      name: '', slug: ''
    }
  })

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue('name', e.target.value)
    if (!category && !form.getValues('slug')) {
      form.setValue('slug', e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))
    }
  }

  const onSubmit = async (data: CategoryFormValues) => {
    setError(null)
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('slug', data.slug)

    let res;
    if (category) {
      res = await updateCategory(category.id, formData)
    } else {
      res = await createCategory(formData)
    }

    if (res?.error) {
      setError(res.error)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Saving...' : (category ? 'Update Category' : 'Create Category')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
