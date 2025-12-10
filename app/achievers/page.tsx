'use client'

import { useEffect, useState } from 'react'
import { Trophy, Target, Award } from 'lucide-react'
import BadgeDisplay from '@/components/BadgeDisplay'
import Link from 'next/link'

interface Achiever {
  userName: string
  goalsCount: number
  achievedCount: number
  totalShares: number
  badges: string[]
}

export default function AchieversPage() {
  const [achievers, setAchievers] = useState<Achiever[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAchievers = async () => {
      try {
        const response = await fetch('/api/achievers')
        const data = await response.json()
        setAchievers(data.achievers || [])
      } catch (error) {
        console.error('Error fetching achievers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAchievers()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-off-white to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-charcoal"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-off-white to-white">
      {/* Header */}
      <div className="bg-white border-b border-platinum">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-charcoal flex items-center gap-3">
                <Trophy className="text-yellow-500" size={32} />
                Achievers Leaderboard
              </h1>
              <p className="text-charcoal-light mt-1">Top goal setters and achievers</p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-charcoal text-white rounded-lg hover:bg-black transition-all font-semibold"
            >
              Back to Goals
            </Link>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {achievers.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-charcoal-light">
              No achievers yet. Be the first to set a goal with your name!
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {achievers.map((achiever, index) => (
              <div
                key={achiever.userName}
                className="bg-white rounded-xl p-6 shadow-sm border border-platinum hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  {/* Left: Rank & Name */}
                  <div className="flex items-center gap-4">
                    <div className={`text-3xl font-bold ${
                      index === 0 ? 'text-yellow-500' :
                      index === 1 ? 'text-gray-400' :
                      index === 2 ? 'text-orange-600' :
                      'text-charcoal-light'
                    }`}>
                      #{index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-charcoal">{achiever.userName}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-charcoal-light">
                        <span className="flex items-center gap-1">
                          <Target size={14} />
                          {achiever.goalsCount} {achiever.goalsCount === 1 ? 'goal' : 'goals'}
                        </span>
                        {achiever.achievedCount > 0 && (
                          <span className="flex items-center gap-1 text-green-600">
                            <Award size={14} />
                            {achiever.achievedCount} achieved
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Badges */}
                  <div>
                    {achiever.badges.length > 0 ? (
                      <BadgeDisplay badges={achiever.badges} size="md" />
                    ) : (
                      <p className="text-xs text-charcoal-light">No badges yet</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
