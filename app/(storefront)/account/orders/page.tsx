import { requireAuth } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Package } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'

export default async function OrdersPage() {
  const user = await requireAuth()
  const supabase = createAdminClient()

  const { data: orders } = await supabase
    .from('orders')
    .select('id, order_number, created_at, total_amount, payment_status, order_status')
    .eq('customer_email', user.email)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Orders</h1>
        <p className="mt-1 text-sm text-gray-500">
          Check the status of recent orders, manage returns, and discover similar products.
        </p>
      </div>

      <div className="space-y-4">
        {orders && orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="rounded-lg border border-gray-200 bg-white">
              <div className="flex flex-wrap items-center justify-between border-b border-gray-200 p-4 sm:p-6 bg-gray-50/50">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 w-full sm:w-auto">
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase">Order Number</dt>
                    <dd className="mt-1 text-sm font-semibold text-gray-900">#{order.order_number}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase">Date placed</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(order.created_at).toLocaleDateString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase">Total amount</dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900">₹{order.total_amount}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase">Status</dt>
                    <dd className="mt-1">
                      <Badge variant="outline" className="uppercase text-xs">{order.order_status}</Badge>
                    </dd>
                  </div>
                </div>
                <div className="mt-4 w-full sm:mt-0 sm:w-auto flex justify-end">
                  <Link href={`/account/orders/${order.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                    View Order
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-md border border-gray-200 bg-white p-8 text-center">
            <Package className="mx-auto h-8 w-8 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
            <p className="mt-1 text-sm text-gray-500">You haven't placed any orders yet.</p>
            <div className="mt-6">
              <Link href="/" className="inline-flex items-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800">
                Start shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
