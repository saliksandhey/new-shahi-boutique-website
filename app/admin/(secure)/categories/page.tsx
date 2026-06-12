import { createAdminClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { deleteCategory } from '@/lib/actions/admin-categories'

export default async function AdminCategoriesPage() {
  const supabase = createAdminClient()
  const { data: categories } = await supabase.from('categories').select('*').order('created_at', { ascending: false })

  return (
    <div className="space-y-6 pb-24 lg:pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 uppercase">Categories</h1>
          <p className="mt-1 text-sm font-medium text-gray-500">Manage product categories.</p>
        </div>
        <Button asChild className="bg-[#1C1C1C] hover:bg-[#FF7A00] text-white rounded-full px-6 shadow-md transition-colors w-full sm:w-auto">
          <Link href="/admin/categories/new">
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Link>
        </Button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block rounded-[2rem] border border-gray-100 bg-white shadow-sm overflow-hidden p-2">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="font-bold uppercase tracking-widest text-xs">Name</TableHead>
              <TableHead className="font-bold uppercase tracking-widest text-xs">Slug</TableHead>
              <TableHead className="text-right font-bold uppercase tracking-widest text-xs">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories?.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="text-gray-500">{category.slug}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/categories/${category.id}/edit`}>
                        <Edit2 className="h-4 w-4 text-gray-500" />
                      </Link>
                    </Button>
                    <form action={async () => {
                      'use server'
                      await deleteCategory(category.id)
                    }}>
                      <Button variant="ghost" size="icon" type="submit" className="hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!categories?.length && (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center text-gray-500">
                  No categories found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {categories?.map((category) => (
          <div key={category.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
            <div>
              <div className="font-black text-gray-900 text-lg">{category.name}</div>
              <div className="text-xs text-gray-500 font-medium">/{category.slug}</div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-gray-50">
              <Button variant="outline" size="sm" asChild className="rounded-full">
                <Link href={`/admin/categories/${category.id}/edit`}>
                  <Edit2 className="h-4 w-4 mr-2" /> Edit
                </Link>
              </Button>
              <form action={async () => {
                'use server'
                await deleteCategory(category.id)
              }}>
                <Button variant="destructive" size="sm" type="submit" className="rounded-full">
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              </form>
            </div>
          </div>
        ))}
        {!categories?.length && (
          <div className="text-center p-8 bg-white rounded-2xl border border-gray-100 text-gray-500 text-sm">
            No categories found.
          </div>
        )}
      </div>
    </div>
  )
}
