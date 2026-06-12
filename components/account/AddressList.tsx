'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { addAddress, updateAddress, deleteAddress, setDefaultAddress } from '@/lib/actions/addresses'
import { MapPin, Plus, Trash2, Edit2, Star } from 'lucide-react'

const addressSchema = z.object({
  full_name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  address_line1: z.string().min(1, "Address Line 1 is required"),
  address_line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postal_code: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  is_default: z.boolean().optional(),
})

type AddressFormValues = z.infer<typeof addressSchema>

type Address = {
  id: string
  full_name: string
  phone: string
  address_line1: string
  address_line2: string | null
  city: string
  state: string
  postal_code: string
  country: string
  is_default: boolean
}

function AddressForm({ address, onSubmit, onCancel }: { address?: Address, onSubmit: (formData: FormData) => void, onCancel: () => void }) {
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: address ? {
      full_name: address.full_name,
      phone: address.phone,
      address_line1: address.address_line1,
      address_line2: address.address_line2 || '',
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country,
      is_default: address.is_default
    } : {
      full_name: '', phone: '', address_line1: '', address_line2: '', city: '', state: '', postal_code: '', country: '', is_default: false
    }
  })

  const handleSubmit = (data: AddressFormValues) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, typeof value === 'boolean' ? value.toString() : (value || ''))
    })
    onSubmit(formData)
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 rounded-lg border border-gray-200 p-4 bg-gray-50/50">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name</Label>
          <Input id="full_name" {...form.register('full_name')} />
          {form.formState.errors.full_name && <p className="text-xs text-red-500">{form.formState.errors.full_name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" {...form.register('phone')} />
          {form.formState.errors.phone && <p className="text-xs text-red-500">{form.formState.errors.phone.message}</p>}
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="address_line1">Address Line 1</Label>
          <Input id="address_line1" {...form.register('address_line1')} />
          {form.formState.errors.address_line1 && <p className="text-xs text-red-500">{form.formState.errors.address_line1.message}</p>}
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="address_line2">Address Line 2 (Optional)</Label>
          <Input id="address_line2" {...form.register('address_line2')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" {...form.register('city')} />
          {form.formState.errors.city && <p className="text-xs text-red-500">{form.formState.errors.city.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input id="state" {...form.register('state')} />
          {form.formState.errors.state && <p className="text-xs text-red-500">{form.formState.errors.state.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="postal_code">Postal Code</Label>
          <Input id="postal_code" {...form.register('postal_code')} />
          {form.formState.errors.postal_code && <p className="text-xs text-red-500">{form.formState.errors.postal_code.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input id="country" {...form.register('country')} />
          {form.formState.errors.country && <p className="text-xs text-red-500">{form.formState.errors.country.message}</p>}
        </div>
        <div className="flex items-center space-x-2 sm:col-span-2 mt-2">
          <input
            type="checkbox"
            id="is_default"
            {...form.register('is_default')}
            className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
          />
          <Label htmlFor="is_default">Set as default address</Label>
        </div>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Saving...' : 'Save Address'}
        </Button>
      </div>
    </form>
  )
}

export function AddressList({ initialAddresses }: { initialAddresses: Address[] }) {
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleAdd(formData: FormData) {
    setError(null)
    const res = await addAddress(formData)
    if (res.error) setError(res.error)
    else setIsAdding(false)
  }

  async function handleUpdate(id: string, formData: FormData) {
    setError(null)
    const res = await updateAddress(id, formData)
    if (res.error) setError(res.error)
    else setIsEditing(null)
  }

  async function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this address?')) {
      await deleteAddress(id)
    }
  }

  async function handleSetDefault(id: string) {
    await setDefaultAddress(id)
  }

  return (
    <div className="space-y-4">
      {error && <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>}

      {!isAdding && (
        <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add New Address
        </Button>
      )}

      {isAdding && (
        <AddressForm onSubmit={handleAdd} onCancel={() => setIsAdding(false)} />
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {initialAddresses.map((address) => (
          isEditing === address.id ? (
            <AddressForm
              key={address.id}
              address={address}
              onSubmit={(formData) => handleUpdate(address.id, formData)}
              onCancel={() => setIsEditing(null)}
            />
          ) : (
            <Card key={address.id} className={address.is_default ? 'border-black shadow-sm' : ''}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  {address.full_name}
                  {address.is_default && (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                      Default
                    </span>
                  )}
                </CardTitle>
                <div className="flex space-x-1">
                  {!address.is_default && (
                    <Button variant="ghost" size="icon" onClick={() => handleSetDefault(address.id)} title="Set Default">
                      <Star className="h-4 w-4 text-gray-400 hover:text-yellow-500" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => setIsEditing(address.id)}>
                    <Edit2 className="h-4 w-4 text-gray-500" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(address.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>{address.phone}</p>
                  <p>{address.address_line1}</p>
                  {address.address_line2 && <p>{address.address_line2}</p>}
                  <p>{address.city}, {address.state} {address.postal_code}</p>
                  <p>{address.country}</p>
                </div>
              </CardContent>
            </Card>
          )
        ))}
      </div>
      
      {initialAddresses.length === 0 && !isAdding && (
        <div className="rounded-md border border-gray-200 bg-white p-8 text-center">
          <MapPin className="mx-auto h-8 w-8 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No addresses</h3>
          <p className="mt-1 text-sm text-gray-500">You haven't saved any addresses yet.</p>
        </div>
      )}
    </div>
  )
}
