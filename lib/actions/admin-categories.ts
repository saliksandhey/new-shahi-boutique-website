'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required")
})

export async function createCategory(formData: FormData) {
  const supabase = createAdminClient()
  
  const rawData = {
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
  }

  const validated = categorySchema.safeParse(rawData)
  if (!validated.success) return { error: (validated as any).error.errors[0].message }

  const { error } = await supabase.from('categories').insert([validated.data])
  if (error) return { error: error.message }

  revalidatePath('/admin/categories')
  redirect('/admin/categories')
}

export async function updateCategory(id: string, formData: FormData) {
  const supabase = createAdminClient()
  
  const rawData = {
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
  }

  const validated = categorySchema.safeParse(rawData)
  if (!validated.success) return { error: (validated as any).error.errors[0].message }

  const { error } = await supabase.from('categories').update(validated.data).eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin/categories')
  redirect('/admin/categories')
}

export async function deleteCategory(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/categories')
  return { success: true }
}
