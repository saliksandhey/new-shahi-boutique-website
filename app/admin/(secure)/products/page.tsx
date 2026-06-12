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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 uppercase">Products</h1>
          <p className="mt-1 text-sm font-medium text-gray-500">Manage your store's inventory.</p>
        </div>
        <Button asChild className="bg-[#1C1C1C] hover:bg-[#FF7A00] text-white rounded-full px-6 shadow-md transition-colors">
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Link>
        </Button>
      </div>

      <div className="rounded-md border bg-white shadow-sm overflow-hidden hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-4">
                    {product.product_images?.length > 0 ? (
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                        <img 
                          src={product.product_images.sort((a: any, b: any) => (a.position || 0) - (b.position || 0))[0]?.url} 
                          alt={product.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                        <span className="text-[9px] text-gray-400 font-bold uppercase">No Img</span>
                      </div>
                    )}
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-gray-900">{product.name}</span>
                      {product.featured && <Badge variant="outline" className="text-[9px] w-fit bg-amber-50 text-amber-700 border-amber-200 uppercase tracking-widest font-bold">Featured</Badge>}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-500">{(product.categories as any)?.name || '-'}</TableCell>
                <TableCell>₹{product.price}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-[10px] uppercase font-bold tracking-wider ${product.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Edit2 className="h-4 w-4 text-gray-500" />
                      </Link>
                    </Button>
                    <form action={async () => {
                      'use server'
                      await deleteProduct(product.id)
                    }}>
                      <Button variant="ghost" size="icon" type="submit" className="hover:text-red-600">
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
          <div key={product.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3 relative">
            <div className="flex items-start gap-4">
               {/* Image */}
               <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                 {product.product_images?.length > 0 ? (
                   <img src={product.product_images.sort((a: any, b: any) => (a.position || 0) - (b.position || 0))[0]?.url} alt={product.name} className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full bg-gray-50 flex items-center justify-center"><span className="text-[9px] text-gray-400 font-bold uppercase">No Img</span></div>
                 )}
               </div>
               {/* Details */}
               <div className="flex-1 min-w-0 pr-8">
                 <h3 className="font-bold text-gray-900 text-sm leading-tight">{product.name}</h3>
                 <div className="text-xs text-gray-500 mt-1">{(product.categories as any)?.name || 'Uncategorized'}</div>
                 <div className="flex items-center gap-2 mt-2">
                   <span className="font-black text-gray-900">₹{product.price}</span>
                   <span className="text-xs text-gray-400">• Stock: {product.stock}</span>
                 </div>
               </div>
            </div>
            
            {/* Top Right Edit Button */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-gray-400 hover:text-[#FF7A00] hover:bg-orange-50 rounded-full transition-colors">
                <Link href={`/admin/products/${product.id}/edit`}>
                  <Edit2 className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Bottom Status Row */}
            <div className="flex items-center gap-2 pt-3 mt-1 border-t border-gray-50">
              <Badge variant="outline" className={`text-[9px] uppercase font-bold tracking-wider ${product.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                {product.status}
              </Badge>
              {product.featured && <Badge variant="outline" className="text-[9px] bg-amber-50 text-amber-700 border-amber-200 uppercase tracking-widest font-bold">Featured</Badge>}
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
