import { requireAuth } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
  const user = await requireAuth()
  const supabase = createAdminClient()

  // First we need to await params.id in Next.js 15 before using it
  const id = await params.id;

  const { data: order } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id, quantity, price,
        products (id, name, slug)
      )
    `)
    .eq('id', id)
    .eq('customer_email', user.email)
    .single()

  if (!order) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/account/orders" className="rounded-full p-2 hover:bg-gray-100 transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Order #{order.order_number}</h1>
          <p className="mt-1 text-sm text-gray-500">
            Placed on {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
              <h3 className="text-base font-semibold leading-6 text-gray-900">Items</h3>
            </div>
            <ul role="list" className="divide-y divide-gray-200">
              {order.order_items.map((item: any) => {
                const product = item.products
                // Fallback image if images are not joined correctly
                const image = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200&auto=format&fit=crop'
                
                return (
                  <li key={item.id} className="flex p-4 sm:p-6">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img src={image} alt={product?.name} className="h-full w-full object-cover object-center" />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>
                            <Link href={`/product/${product?.slug}`}>{product?.name}</Link>
                          </h3>
                          <p className="ml-4">${item.price}</p>
                        </div>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <p className="text-gray-500">Qty {item.quantity}</p>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
              <h3 className="text-base font-semibold leading-6 text-gray-900">Order Summary</h3>
            </div>
            <div className="px-4 py-4 sm:px-6">
              <dl className="space-y-4 text-sm text-gray-600">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd className="text-gray-900">${order.subtotal}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Discount</dt>
                  <dd className="text-gray-900">-${order.discount_amount || 0}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Shipping</dt>
                  <dd className="text-gray-900">${order.shipping_cost || 0}</dd>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-4 font-semibold text-gray-900 text-base">
                  <dt>Total</dt>
                  <dd>${order.total_amount}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
              <h3 className="text-base font-semibold leading-6 text-gray-900">Shipping Details</h3>
            </div>
            <div className="px-4 py-4 sm:px-6 text-sm text-gray-600 space-y-1">
              <p className="font-medium text-gray-900">{order.customer_name}</p>
              <p>{order.shipping_address}</p>
              <p>{order.city}, {order.state} {order.postal_code}</p>
              <p>{order.country}</p>
              <p className="pt-2 text-gray-500">Phone: {order.customer_phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
