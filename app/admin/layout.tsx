import { requireAdmin } from "@/lib/admin-auth"
import AdminSidebar from "@/components/admin/Sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdmin()

  return (
    <div className="min-h-screen bg-off-white flex">
      <AdminSidebar />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
