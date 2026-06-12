'use server'

import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(1)
})

export async function submitContactForm(formData: FormData) {
  try {
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      message: formData.get('message')
    }

    const validated = contactSchema.safeParse(data)
    if (!validated.success) {
      return { error: 'Invalid fields' }
    }

    // In a real app, send an email or store in DB here
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    return { success: true }
  } catch (error) {
    return { error: 'Something went wrong' }
  }
}
