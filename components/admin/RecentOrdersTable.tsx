import { createAdminClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export async function RecentOrdersTable() {
  const supabase = createAdminClient()
  
  const { data: orders } = await supabase
    .from('orders')
    .select('id, order_number, total_amount, order_status, created_at, profiles(full_name, email)')
    .order('created_at', { ascending: false })
    .limit(5)

  if (!orders || orders.length === 0) {
    return <div className="text-center p-6 border border-gray-100 rounded-[2rem] text-sm text-gray-500 bg-white shadow-sm">No recent orders.</div>
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block rounded-[2rem] border border-gray-100 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow className="border-gray-100 hover:bg-transparent">
              <TableHead className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Order</TableHead>
              <TableHead className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Customer</TableHead>
              <TableHead className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Status</TableHead>
              <TableHead className="text-right text-gray-400 font-black uppercase tracking-widest text-[10px]">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className="border-gray-100 hover:bg-gray-50 transition-colors">
                <TableCell className="font-medium">
                  <Link href={`/admin/orders/${order.id}`} className="hover:text-[#FF7A00] text-gray-900 font-bold transition-colors">
                    #{order.order_number}
                  </Link>
                </TableCell>
                <TableCell className="text-gray-600 font-medium">{(order.profiles as any)?.full_name || 'Guest'}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-[9px] font-bold uppercase tracking-widest ${order.order_status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'border-gray-200 bg-gray-50 text-gray-900'}`}>
                    {order.order_status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-black text-gray-900">₹{order.total_amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {orders.map((order) => (
          <Link href={`/admin/orders/${order.id}`} key={order.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3 active:scale-[0.98] transition-transform">
            <div className="flex justify-between items-start">
              <span className="font-black text-[#FF7A00]">#{order.order_number}</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(order.created_at).toLocaleDateString()}</span>
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900">{(order.profiles as any)?.full_name || 'Guest User'}</div>
            </div>
            <div className="flex justify-between items-end pt-2 border-t border-gray-50">
              <Badge variant="outline" className={`text-[9px] font-bold uppercase tracking-widest ${order.order_status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'border-gray-200 bg-gray-50 text-gray-600'}`}>
                {order.order_status}
              </Badge>
              <div className="font-black text-gray-900">₹{order.total_amount}</div>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
