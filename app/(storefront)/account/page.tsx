import { requireAuth } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Heart, Clock } from 'lucide-react'
import Link from 'next/link'

export default async function AccountDashboard() {
  const user = await requireAuth()
  const supabase = createAdminClient()

  const { data: customerProfile } = await supabase
    .from('customer_profiles')
    .select('name')
    .eq('email', user.email)
    .single()

  // Fetch counts
  const { count: ordersCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('customer_email', user.email)

  const { count: wishlistCount } = await supabase
    .from('wishlist')
    .select('*', { count: 'exact', head: true })
    .eq('user_email', user.email)

  // Fetch recent orders
  const { data: recentOrders } = await supabase
    .from('orders')
    .select('id, order_number, created_at, total_amount, order_status')
    .eq('customer_email', user.email)
    .order('created_at', { ascending: false })
    .limit(3)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Welcome back, {customerProfile?.name || user.email}!
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your orders and account settings from your personal dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ordersCount || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wishlist Items</CardTitle>
            <Heart className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wishlistCount || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
          <Link href="/account/orders" className="text-sm font-medium text-black hover:underline">
            View all
          </Link>
        </div>
        
        <div className="mt-4">
          {recentOrders && recentOrders.length > 0 ? (
            <div className="overflow-hidden rounded-md border border-gray-200 bg-white">
              <ul role="list" className="divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <li key={order.id} className="p-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-gray-900">Order #{order.order_number}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm font-medium text-gray-900">₹{order.total_amount}</div>
                        <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                          {order.order_status}
                        </span>
                        <Link href={`/account/orders/${order.id}`} className="text-sm font-medium text-black hover:underline">
                          Details
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="rounded-md border border-gray-200 bg-white p-8 text-center">
              <Clock className="mx-auto h-8 w-8 text-gray-400" />
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
    </div>
  )
}
