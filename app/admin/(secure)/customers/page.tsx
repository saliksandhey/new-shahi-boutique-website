import { createAdminClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Eye, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default async function AdminCustomersPage() {
  const supabase = createAdminClient()
  const { data: customers } = await supabase
    .from('customer_profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 uppercase">Customers</h1>
          <p className="mt-1 text-sm font-medium text-gray-500">Manage registered and guest customers.</p>
        </div>
      </div>

      <div className="rounded-md border bg-white shadow-sm overflow-hidden hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers?.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">
                  {customer.name || 'No Name'}
                </TableCell>
                <TableCell className="text-gray-500">{customer.email}</TableCell>
                <TableCell className="text-gray-500">{customer.phone || '-'}</TableCell>
                <TableCell className="text-gray-500">
                  {new Date(customer.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/customers/${customer.id}`}>
                      <Eye className="h-4 w-4 text-gray-500" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!customers?.length && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                  No customers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {customers?.map((customer) => (
          <div key={customer.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3 relative">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <div className="flex-1 min-w-0 pr-8">
                <h3 className="font-bold text-gray-900 text-sm leading-tight truncate">{customer.name || 'No Name'}</h3>
                <div className="text-xs text-gray-500 mt-1 truncate">{customer.email}</div>
                {customer.phone && <div className="text-xs text-gray-500 mt-0.5">{customer.phone}</div>}
              </div>
            </div>
            
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                <Link href={`/admin/customers/${customer.id}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-2 pt-3 mt-1 border-t border-gray-50 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Joined {new Date(customer.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
        {!customers?.length && (
          <div className="p-8 text-center text-sm font-medium text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
            No customers found.
          </div>
        )}
      </div>
    </div>
  )
}
