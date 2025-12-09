import StatsCard from '@/components/admin/StatsCard'
import { Target, Eye, Trash2, Flag, AlertTriangle, TrendingUp } from 'lucide-react'

async function getStats() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/admin/stats`, {
    cache: 'no-store',
  })
  
  if (!res.ok) return null
  return res.json()
}

export default async function AdminDashboard() {
  const stats = await getStats()

  if (!stats) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-charcoal mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Total Goals"
          value={stats.totalGoals}
          icon={Target}
          color="blue"
        />
        <StatsCard
          title="Public Goals"
          value={stats.publicGoals}
          icon={Eye}
          color="green"
        />
        <StatsCard
          title="Goals This Week"
          value={stats.goalsThisWeek}
          icon={TrendingUp}
          color="purple"
        />
        <StatsCard
          title="Flagged Goals"
          value={stats.flaggedGoals}
          icon={Flag}
          color="orange"
        />
        <StatsCard
          title="Deleted Goals"
          value={stats.deletedGoals}
          icon={Trash2}
          color="red"
        />
        <StatsCard
          title="Unresolved Reports"
          value={stats.unresolvedReports}
          icon={AlertTriangle}
          color="yellow"
        />
      </div>
    </div>
  )
}
