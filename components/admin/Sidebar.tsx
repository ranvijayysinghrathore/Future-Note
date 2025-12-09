'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { LayoutDashboard, Flag, Target, LogOut } from 'lucide-react'

export default function AdminSidebar() {
  const pathname = usePathname()

  const links = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/goals', label: 'Goals', icon: Target },
    { href: '/admin/reports', label: 'Reports', icon: Flag },
  ]

  return (
    <aside className="w-64 bg-white border-r border-platinum p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-charcoal">FutureNote</h1>
        <p className="text-sm text-charcoal-light">Admin Panel</p>
      </div>

      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-charcoal text-white'
                  : 'text-charcoal-light hover:bg-off-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{link.label}</span>
            </Link>
          )
        })}
      </nav>

      <button
        onClick={() => signOut({ callbackUrl: '/login-admin' })}
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full mt-8"
      >
        <LogOut size={20} />
        <span className="font-medium">Logout</span>
      </button>
    </aside>
  )
}
