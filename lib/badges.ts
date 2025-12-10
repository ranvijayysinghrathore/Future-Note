export const BADGE_TYPES = {
  FIRST_GOAL: {
    id: 'first-goal',
    name: 'First Step',
    description: 'Set your first 4-year goal',
    icon: '🎯',
    criteria: 'goals_count >= 1'
  },
  FIVE_GOALS: {
    id: 'five-goals',
    name: 'Goal Setter',
    description: 'Set 5 goals',
    icon: '⭐',
    criteria: 'goals_count >= 5'
  },
  TEN_GOALS: {
    id: 'ten-goals',
    name: 'Visionary',
    description: 'Set 10 goals',
    icon: '🌟',
    criteria: 'goals_count >= 10'
  },
  ACHIEVER: {
    id: 'achiever',
    name: 'Achiever',
    description: 'Achieve your first goal',
    icon: '🏆',
    criteria: 'achieved_count >= 1'
  },
  SUPER_ACHIEVER: {
    id: 'super-achiever',
    name: 'Super Achiever',
    description: 'Achieve 3 goals',
    icon: '👑',
    criteria: 'achieved_count >= 3'
  }
} as const

export type BadgeType = keyof typeof BADGE_TYPES

export async function checkAndAwardBadges(goalId: string, ipAddress: string) {
  const { prisma } = await import('@/lib/prisma')
  
  // Get all goals for this IP (as a proxy for user)
  const goals = await prisma.goal.findMany({
    where: { ipAddress },
    include: { 
      badges: {
        include: {
          badge: true
        }
      }
    }
  })

  const goalsCount = goals.length
  const achievedCount = goals.filter(g => g.achieved === true).length

  const badgesToAward: BadgeType[] = []

  // Check each badge criteria
  if (goalsCount >= 1 && !goals.some(g => g.badges.some(b => b.badge.name === BADGE_TYPES.FIRST_GOAL.name))) {
    badgesToAward.push('FIRST_GOAL')
  }
  if (goalsCount >= 5 && !goals.some(g => g.badges.some(b => b.badge.name === BADGE_TYPES.FIVE_GOALS.name))) {
    badgesToAward.push('FIVE_GOALS')
  }
  if (goalsCount >= 10 && !goals.some(g => g.badges.some(b => b.badge.name === BADGE_TYPES.TEN_GOALS.name))) {
    badgesToAward.push('TEN_GOALS')
  }
  if (achievedCount >= 1 && !goals.some(g => g.badges.some(b => b.badge.name === BADGE_TYPES.ACHIEVER.name))) {
    badgesToAward.push('ACHIEVER')
  }
  if (achievedCount >= 3 && !goals.some(g => g.badges.some(b => b.badge.name === BADGE_TYPES.SUPER_ACHIEVER.name))) {
    badgesToAward.push('SUPER_ACHIEVER')
  }

  // Award new badges
  for (const badgeType of badgesToAward) {
    const badgeInfo = BADGE_TYPES[badgeType]
    
    // Get or create badge
    let badge = await prisma.badge.findUnique({
      where: { name: badgeInfo.name }
    })

    if (!badge) {
      badge = await prisma.badge.create({
        data: {
          name: badgeInfo.name,
          description: badgeInfo.description,
          icon: badgeInfo.icon,
          criteria: badgeInfo.criteria
        }
      })
    }

    // Award badge to goal
    await prisma.userBadge.create({
      data: {
        goalId,
        badgeId: badge.id
      }
    })
  }

  return badgesToAward.map(type => BADGE_TYPES[type])
}
