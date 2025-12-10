'use client'

// Badge type definitions (client-safe)
const BADGE_TYPES = {
  FIRST_GOAL: { id: 'first-goal', name: 'First Step', description: 'Set your first 4-year goal', icon: '🎯' },
  FIVE_GOALS: { id: 'five-goals', name: 'Goal Setter', description: 'Set 5 goals', icon: '⭐' },
  TEN_GOALS: { id: 'ten-goals', name: 'Visionary', description: 'Set 10 goals', icon: '🌟' },
  ACHIEVER: { id: 'achiever', name: 'Achiever', description: 'Achieve your first goal', icon: '🏆' },
  SUPER_ACHIEVER: { id: 'super-achiever', name: 'Super Achiever', description: 'Achieve 3 goals', icon: '👑' }
} as const

interface BadgeDisplayProps {
  badges: string[]
  size?: 'sm' | 'md' | 'lg'
}

export default function BadgeDisplay({ badges, size = 'md' }: BadgeDisplayProps) {
  if (!badges || badges.length === 0) return null

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  }

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badgeKey) => {
        const badge = BADGE_TYPES[badgeKey as keyof typeof BADGE_TYPES]
        if (!badge) return null
        
        return (
          <div
            key={badge.id}
            className="group relative"
            title={badge.description}
          >
            <div className={`${sizeClasses[size]} transition-transform group-hover:scale-110`}>
              {badge.icon}
            </div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-charcoal text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              <div className="font-semibold">{badge.name}</div>
              <div className="text-gray-300">{badge.description}</div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                <div className="border-4 border-transparent border-t-charcoal"></div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
