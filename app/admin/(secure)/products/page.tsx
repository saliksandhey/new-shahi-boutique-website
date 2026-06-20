import { createAdminClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { deleteProduct } from '@/lib/actions/admin-products'

export default async function AdminProductsPage() {
  const supabase = createAdminClient()
  const { data: products } = await supabase
    .from('products')
    .select('*, categories(name), product_images(url, is_primary, position)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-5xl font-heading font-black tracking-widest text-gray-900 uppercase">Products</h1>
          <p className="mt-1 md:mt-2 text-xs md:text-sm text-gray-500 font-bold uppercase tracking-widest">Manage your store's inventory.</p>
        </div>
        <Button asChild className="rounded-full bg-[#1C1C1C] text-white px-8 py-6 text-xs font-bold uppercase tracking-widest hover:bg-[#FF7A00] shadow-xl transition-all duration-300">
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Link>
        </Button>
      </div>

      <div className="rounded-[2rem] border border-gray-100 bg-white shadow-sm overflow-hidden hidden md:block">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow className="border-gray-100 hover:bg-transparent">
              <TableHead className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Name</TableHead>
              <TableHead className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Category</TableHead>
              <TableHead className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Price</TableHead>
              <TableHead className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Stock</TableHead>
              <TableHead className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Status</TableHead>
              <TableHead className="text-right text-gray-400 font-black uppercase tracking-widest text-[10px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product) => (
              <TableRow key={product.id} className="border-gray-100 hover:bg-gray-50 transition-colors">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-4">
                    {product.product_images?.length > 0 ? (
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200 shadow-sm">
                        <img 
                          src={product.product_images.sort((a: any, b: any) => (a.position || 0) - (b.position || 0))[0]?.url} 
                          alt={product.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 shadow-sm">
                        <span className="text-[9px] text-gray-400 font-bold uppercase">No Img</span>
                      </div>
                    )}
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-gray-900">{product.name}</span>
                      {product.featured && <Badge variant="outline" className="text-[9px] w-fit bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30 uppercase tracking-widest font-black shadow-sm">Featured</Badge>}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-500 font-medium text-xs uppercase tracking-wider">{(product.categories as any)?.name || '-'}</TableCell>
                <TableCell className="font-black text-gray-900">₹{product.price}</TableCell>
                <TableCell className="font-medium text-gray-900">{product.stock}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-[9px] uppercase font-bold tracking-wider ${product.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="icon" asChild className="hover:text-[#FF7A00] hover:bg-[#FF7A00]/10 rounded-full transition-colors h-8 w-8">
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Edit2 className="h-4 w-4" />
                      </Link>
                    </Button>
                    <form action={async () => {
                      'use server'
                      await deleteProduct(product.id)
                    }}>
                      <Button variant="ghost" size="icon" type="submit" className="hover:text-red-600 hover:bg-red-50 rounded-full transition-colors h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!products?.length && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {products?.map((product) => (
          <div key={product.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 relative">
            <div className="flex items-start gap-4">
               {/* Image */}
               <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-200 shadow-sm">
                 {product.product_images?.length > 0 ? (
                   <img src={product.product_images.sort((a: any, b: any) => (a.position || 0) - (b.position || 0))[0]?.url} alt={product.name} className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full bg-gray-50 flex items-center justify-center"><span className="text-[9px] text-gray-400 font-bold uppercase">No Img</span></div>
                 )}
               </div>
               {/* Details */}
               <div className="flex-1 min-w-0 pr-8">
                 <h3 className="font-bold text-gray-900 text-sm leading-tight">{product.name}</h3>
                 <div className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">{(product.categories as any)?.name || 'Uncategorized'}</div>
                 <div className="flex items-center gap-2 mt-2">
                   <span className="font-black text-gray-900">₹{product.price}</span>
                   <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">• Stock: {product.stock}</span>
                 </div>
               </div>
            </div>
            
            {/* Top Right Edit Button */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-gray-400 hover:text-[#FF7A00] hover:bg-[#FF7A00]/10 rounded-full transition-colors">
                <Link href={`/admin/products/${product.id}/edit`}>
                  <Edit2 className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Bottom Status Row */}
            <div className="flex items-center justify-between pt-3 mt-1 border-t border-gray-50">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`text-[9px] uppercase font-bold tracking-wider ${product.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                  {product.status}
                </Badge>
                {product.featured && <Badge variant="outline" className="text-[9px] bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30 uppercase tracking-widest font-black shadow-sm">Featured</Badge>}
              </div>
              <form action={async () => {
                'use server'
                await deleteProduct(product.id)
              }}>
                <Button variant="ghost" size="icon" type="submit" className="h-7 w-7 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </form>
            </div>
          </div>
        ))}
        {!products?.length && (
          <div className="p-8 text-center text-sm font-medium text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
            No products found.
          </div>
        )}
      </div>
    </div>
  )
}
