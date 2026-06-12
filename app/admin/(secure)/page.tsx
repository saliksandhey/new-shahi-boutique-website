import { createAdminClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Users, Package, ShoppingCart } from 'lucide-react'
import { RecentOrdersTable } from '@/components/admin/RecentOrdersTable'

export default async function AdminDashboard() {
  const supabase = createAdminClient()

  // Fetch counts
  const { count: customersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'CUSTOMER')
  const { count: productsCount } = await supabase.from('products').select('*', { count: 'exact', head: true })
  const { count: ordersCount } = await supabase.from('orders').select('*', { count: 'exact', head: true })
  
  // Calculate total revenue
  const { data: revenueData } = await supabase.from('orders').select('total_amount').in('payment_status', ['paid', 'PAID', 'Paid'])
  const totalRevenue = revenueData?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0

  // Fetch top products (by quantity sold)
  const { data: topProductsData } = await supabase.rpc('get_top_products', { limit_num: 5 })


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-5xl font-heading font-black tracking-widest text-gray-900 uppercase">DASHBOARD</h1>
          <p className="mt-1 md:mt-2 text-xs md:text-sm text-gray-500 font-bold uppercase tracking-widest">
            Overview of your store's performance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-[#1C1C1C] to-black border-0 rounded-2xl md:rounded-[2rem] shadow-xl hover:-translate-y-1 transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6">
            <CardTitle className="text-[9px] md:text-xs font-black uppercase tracking-widest text-gray-400">Total Revenue</CardTitle>
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/10 flex items-center justify-center">
              <DollarSign className="h-3 w-3 md:h-4 md:w-4 text-[#FF7A00]" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
            <div className="text-xl md:text-3xl font-black text-white">₹{totalRevenue.toFixed(0)}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-gray-100 rounded-2xl md:rounded-[2rem] shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6">
            <CardTitle className="text-[9px] md:text-xs font-black uppercase tracking-widest text-gray-500">Total Orders</CardTitle>
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-orange-50 flex items-center justify-center">
              <ShoppingCart className="h-3 w-3 md:h-4 md:w-4 text-[#FF7A00]" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
            <div className="text-xl md:text-3xl font-black text-gray-900">{ordersCount || 0}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-gray-100 rounded-2xl md:rounded-[2rem] shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6">
            <CardTitle className="text-[9px] md:text-xs font-black uppercase tracking-widest text-gray-500">Total Customers</CardTitle>
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-blue-50 flex items-center justify-center">
              <Users className="h-3 w-3 md:h-4 md:w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
            <div className="text-xl md:text-3xl font-black text-gray-900">{customersCount || 0}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-gray-100 rounded-2xl md:rounded-[2rem] shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6">
            <CardTitle className="text-[9px] md:text-xs font-black uppercase tracking-widest text-gray-500">Total Products</CardTitle>
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-emerald-50 flex items-center justify-center">
              <Package className="h-3 w-3 md:h-4 md:w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
            <div className="text-xl md:text-3xl font-black text-gray-900">{productsCount || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2 pb-24 md:pb-0">
        <div className="flex flex-col space-y-4">
          <h2 className="text-sm md:text-lg font-black uppercase tracking-widest text-gray-900 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Recent Orders
          </h2>
          <RecentOrdersTable />
        </div>
        <div className="flex flex-col space-y-4">
          <h2 className="text-sm md:text-lg font-black uppercase tracking-widest text-gray-900 flex items-center gap-2">
            <div className="w-2 h-2 bg-[#FF7A00] rounded-full"></div>
            Top Selling Products
          </h2>
          <Card className="bg-white border-gray-100 rounded-2xl md:rounded-[2rem] shadow-sm overflow-hidden">
            <CardContent className="p-0">
               <ul className="divide-y divide-gray-100">
                 {topProductsData && topProductsData.length > 0 ? (
                   topProductsData.map((prod: any, i: number) => (
                     <li key={i} className="flex gap-4 items-center p-4 md:p-5 hover:bg-gray-50 transition-colors group">
                       <div className={`w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full flex items-center justify-center font-black text-sm md:text-base ${i === 0 ? 'bg-[#FF7A00] text-white shadow-lg shadow-orange-500/30' : i === 1 ? 'bg-gray-800 text-white' : i === 2 ? 'bg-gray-400 text-white' : 'bg-gray-100 text-gray-400'}`}>
                         #{i + 1}
                       </div>
                       <div className="flex-1 min-w-0">
                         <p className="font-bold text-gray-900 uppercase tracking-widest text-xs md:text-sm truncate group-hover:text-[#FF7A00] transition-colors">{prod.product_name}</p>
                       </div>
                       <div className="shrink-0">
                         <span className="text-[10px] md:text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-orange-50 text-[#FF7A00]">{prod.total_sold} sold</span>
                       </div>
                     </li>
                   ))
                 ) : (
                   <li className="p-8 text-center text-sm font-bold uppercase tracking-widest text-gray-400">Not enough data available.</li>
                 )}
               </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
