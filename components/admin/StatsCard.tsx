import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: number
  icon: LucideIcon
  color: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'orange'
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  red: 'bg-red-50 text-red-600',
  yellow: 'bg-yellow-50 text-yellow-600',
  purple: 'bg-purple-50 text-purple-600',
  orange: 'bg-orange-50 text-orange-600',
}

export default function StatsCard({ title, value, icon: Icon, color }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-platinum">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-charcoal-light">{title}</h3>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={20} />
        </div>
      </div>
      <p className="text-3xl font-bold text-charcoal">{value.toLocaleString()}</p>
    </div>
  )
}
