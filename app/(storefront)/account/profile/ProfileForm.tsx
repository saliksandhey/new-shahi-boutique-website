'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { updateProfile } from '@/lib/actions/profile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export function ProfileForm({ initialName, initialPhone, email }: { initialName: string, initialPhone: string, email: string }) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: initialName,
      phone: initialPhone,
    },
  })

  async function onSubmit(data: ProfileFormValues) {
    setSaving(true)
    setError(null)
    setSuccess(null)
    
    const formData = new FormData()
    formData.append('full_name', data.full_name)
    if (data.phone) formData.append('phone', data.phone)

    const result = await updateProfile(formData)
    
    if (result.error) {
      setError(result.error)
    } else {
      setSuccess('Profile updated successfully.')
    }
    setSaving(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your personal details.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input id="full_name" {...form.register('full_name')} />
            {form.formState.errors.full_name && (
              <p className="text-sm text-red-500">{form.formState.errors.full_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} disabled />
            <p className="text-xs text-gray-500">Your email cannot be changed here.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" {...form.register('phone')} />
            {form.formState.errors.phone && (
              <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
            )}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
