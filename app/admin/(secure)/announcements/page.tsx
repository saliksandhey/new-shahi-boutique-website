import { getAllAnnouncements, deleteAnnouncement } from '@/lib/actions/announcements'
import Link from 'next/link'
import { Plus, Edit, Trash } from 'lucide-react'
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

export default async function AnnouncementsPage() {
  const { announcements, error } = await getAllAnnouncements()

  return (
    <div className="space-y-6 pb-24 lg:pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 uppercase">Announcements</h1>
          <p className="mt-1 text-sm font-medium text-gray-500">Manage popups, banners, and checkout notices.</p>
        </div>
        <Button asChild className="bg-[#1C1C1C] hover:bg-[#FF7A00] text-white rounded-full px-6 shadow-md transition-colors w-full sm:w-auto">
          <Link href="/admin/announcements/new">
            <Plus className="mr-2 h-4 w-4" /> Add Announcement
          </Link>
        </Button>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-500 p-4 rounded-md">Error: {error}</div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden p-2">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="font-bold uppercase tracking-widest text-xs">Title</TableHead>
                  <TableHead className="font-bold uppercase tracking-widest text-xs">Type</TableHead>
                  <TableHead className="font-bold uppercase tracking-widest text-xs">Status</TableHead>
                  <TableHead className="font-bold uppercase tracking-widest text-xs">Dates</TableHead>
                  <TableHead className="text-right font-bold uppercase tracking-widest text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {announcements?.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-gray-900">{item.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-bold tracking-wider uppercase bg-gray-50 text-gray-600 border-gray-200">
                        {item.display_type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-[10px] font-bold tracking-wider uppercase ${item.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                        {item.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {item.start_date && <div>Start: {new Date(item.start_date).toLocaleDateString()}</div>}
                      {item.end_date && <div>End: {new Date(item.end_date).toLocaleDateString()}</div>}
                      {!item.start_date && !item.end_date && 'Always'}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/announcements/${item.id}`}>
                          <Edit className="w-4 h-4 text-gray-500" />
                        </Link>
                      </Button>
                      <form action={async () => {
                        'use server'
                        await deleteAnnouncement(item.id)
                      }} className="inline-block">
                        <Button variant="ghost" size="icon" type="submit" className="hover:text-red-600">
                          <Trash className="w-4 h-4" />
                        </Button>
                      </form>
                    </TableCell>
                  </TableRow>
                ))}
                {!announcements?.length && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-gray-500 font-bold uppercase tracking-widest text-sm">
                      No announcements found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {announcements?.map((item: any) => (
              <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="font-black text-gray-900 text-lg leading-tight">{item.title}</div>
                  <Badge variant="outline" className={`shrink-0 text-[9px] font-bold tracking-wider uppercase ${item.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                    {item.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-[9px] font-bold tracking-wider uppercase bg-gray-50 text-gray-600 border-gray-200">
                    {item.display_type.replace('_', ' ')}
                  </Badge>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 mt-2 space-y-1">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Duration</p>
                  <div className="text-sm font-medium text-gray-700">
                    {item.start_date && <div>Start: {new Date(item.start_date).toLocaleDateString()}</div>}
                    {item.end_date && <div>End: {new Date(item.end_date).toLocaleDateString()}</div>}
                    {!item.start_date && !item.end_date && 'Always active'}
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-2 border-t border-gray-50 mt-1">
                  <Button variant="outline" size="sm" asChild className="rounded-full">
                    <Link href={`/admin/announcements/${item.id}`}>
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </Link>
                  </Button>
                  <form action={async () => {
                    'use server'
                    await deleteAnnouncement(item.id)
                  }}>
                    <Button variant="destructive" size="sm" type="submit" className="rounded-full">
                      <Trash className="h-4 w-4 mr-2" /> Delete
                    </Button>
                  </form>
                </div>
              </div>
            ))}
            {!announcements?.length && (
              <div className="text-center p-8 bg-white rounded-2xl border border-gray-100 text-gray-500 font-bold uppercase tracking-widest text-sm">
                No announcements found.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
