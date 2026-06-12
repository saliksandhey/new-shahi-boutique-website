import { createAdminClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Eye, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { OrderFilters } from '@/components/admin/OrderFilters'
import { OrderDetailsView } from '@/components/admin/OrderDetailsView'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const sp = await searchParams
  const q = typeof sp.q === 'string' ? sp.q : ''
  const statusFilter = typeof sp.status === 'string' ? sp.status : 'ALL'

  const supabase = createAdminClient()
  let query = supabase
    .from('orders')
    .select('id, order_number, total_amount, order_status, payment_status, created_at, customer_name, customer_email')
    .order('created_at', { ascending: false })

  if (statusFilter !== 'ALL') {
    if (statusFilter === 'UNFULFILLED') {
      query = query.in('order_status', ['PENDING', 'CONFIRMED', 'PACKED'])
    } else if (statusFilter === 'PAID') {
      query = query.eq('payment_status', 'PAID')
    } else if (statusFilter === 'RETURNS') {
      query = query.in('order_status', ['RETURNED', 'REFUNDED'])
    } else {
      query = query.eq('order_status', statusFilter)
    }
  } else {
    // If ALL, exclude DELIVERED
    query = query.neq('order_status', 'DELIVERED')
  }

  if (q) {
    query = query.ilike('order_number', `%${q}%`)
  }

  const { data: orders } = await query

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 uppercase">Orders</h1>
          <p className="mt-1 text-sm font-medium text-gray-500">Manage customer orders and fulfillment.</p>
        </div>
        <div className="flex gap-2">
          {/* Export to CSV would go here */}
          <Button variant="outline" className="rounded-full shadow-sm font-bold uppercase tracking-widest text-[10px]">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <OrderFilters />

      <div className="rounded-md border bg-white shadow-sm overflow-hidden hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-center">
                <input type="checkbox" className="rounded border-gray-300" disabled />
              </TableHead>
              <TableHead>Order #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="text-center">
                  <input type="checkbox" className="rounded border-gray-300" />
                </TableCell>
                <TableCell className="font-medium">
                  <Link href={`/admin/orders/${order.id}`} className="hover:underline text-blue-600">
                    {order.order_number}
                  </Link>
                </TableCell>
                <TableCell className="text-gray-500">
                  {new Date(order.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="text-sm font-medium">{order.customer_name || 'Guest'}</div>
                  <div className="text-xs text-gray-500">{order.customer_email}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-[10px] uppercase font-bold tracking-wider ${
                    order.payment_status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                    order.payment_status === 'FAILED' ? 'bg-red-50 text-red-700 border-red-200' : 
                    'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {order.payment_status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-[10px] uppercase font-bold tracking-wider ${
                    order.order_status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    order.order_status === 'CANCELLED' || order.order_status === 'RETURNED' ? 'bg-red-50 text-red-700 border-red-200' :
                    order.order_status === 'SHIPPED' || order.order_status === 'DISPATCHED' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    'bg-gray-50 text-gray-600 border-gray-200'
                  }`}>
                    {order.order_status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">₹{order.total_amount}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/orders/${order.id}`}>
                      <Eye className="h-4 w-4 text-gray-500" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!orders?.length && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-gray-500">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {orders?.map((order) => (
          <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <Link href={`/admin/orders/${order.id}`} className="font-bold text-blue-600 hover:underline">
                {order.order_number}
              </Link>
              <span className="text-xs text-gray-500 font-medium">
                {new Date(order.created_at).toLocaleDateString()}
              </span>
            </div>
            
            <div>
              <div className="text-sm font-bold text-gray-900">{order.customer_name || 'Guest'}</div>
              <div className="text-xs text-gray-500">{order.customer_email}</div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`text-[9px] uppercase font-bold tracking-wider ${
                order.payment_status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                order.payment_status === 'FAILED' ? 'bg-red-50 text-red-700 border-red-200' : 
                'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {order.payment_status}
              </Badge>
              <Badge variant="outline" className={`text-[9px] uppercase font-bold tracking-wider ${
                order.order_status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                order.order_status === 'CANCELLED' || order.order_status === 'RETURNED' ? 'bg-red-50 text-red-700 border-red-200' :
                order.order_status === 'SHIPPED' || order.order_status === 'DISPATCHED' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                'bg-gray-50 text-gray-600 border-gray-200'
              }`}>
                {order.order_status}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-50">
              <span className="font-black text-gray-900">₹{order.total_amount}</span>
              <Button variant="outline" size="sm" asChild className="rounded-full shadow-sm">
                <Link href={`/admin/orders/${order.id}`}>View Order</Link>
              </Button>
            </div>
          </div>
        ))}
        {!orders?.length && (
          <div className="p-8 text-center text-sm font-medium text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
            No orders found.
          </div>
        )}
      </div>
    </div>
  )
}
