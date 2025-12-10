import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Get all public goals with user names
    const goals = await prisma.goal.findMany({
      where: {
        isPublic: true,
        isDeleted: false
      },
      select: {
        userName: true,
        achieved: true,
        shareCount: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Aggregate by user
    const userStats = new Map<string, {
      userName: string
      goalsCount: number
      achievedCount: number
      totalShares: number
      badges: string[]
    }>()

    goals.forEach(goal => {
      const existing = userStats.get(goal.userName) || {
        userName: goal.userName,
        goalsCount: 0,
        achievedCount: 0,
        totalShares: 0,
        badges: []
      }

      existing.goalsCount++
      if (goal.achieved) existing.achievedCount++
      existing.totalShares += goal.shareCount

      userStats.set(goal.userName, existing)
    })

    // Calculate badges for each user
    const achievers = Array.from(userStats.values()).map(user => {
      const badges: string[] = []

      // Award badges based on criteria
      if (user.goalsCount >= 1) badges.push('FIRST_GOAL')
      if (user.goalsCount >= 5) badges.push('FIVE_GOALS')
      if (user.goalsCount >= 10) badges.push('TEN_GOALS')
      if (user.achievedCount >= 1) badges.push('ACHIEVER')
      if (user.achievedCount >= 3) badges.push('SUPER_ACHIEVER')

      return {
        ...user,
        badges
      }
    })

    // Sort by badge count, then by goals count
    achievers.sort((a, b) => {
      if (b.badges.length !== a.badges.length) {
        return b.badges.length - a.badges.length
      }
      return b.goalsCount - a.goalsCount
    })

    return NextResponse.json({ achievers })
  } catch (error) {
    console.error('Error fetching achievers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch achievers' },
      { status: 500 }
    )
  }
}
