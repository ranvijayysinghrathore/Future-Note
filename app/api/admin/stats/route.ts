import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET() {
  try {
    await requireAdmin()

    const [
      totalGoals,
      publicGoals,
      deletedGoals,
      flaggedGoals,
      totalReports,
      unresolvedReports,
      goalsThisWeek,
    ] = await Promise.all([
      prisma.goal.count(),
      prisma.goal.count({ where: { isPublic: true, isDeleted: false } }),
      prisma.goal.count({ where: { isDeleted: true } }),
      prisma.goal.count({ where: { isFlagged: true } }),
      prisma.report.count(),
      prisma.report.count({ where: { resolved: false } }),
      prisma.goal.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ])

    return NextResponse.json({
      totalGoals,
      publicGoals,
      deletedGoals,
      flaggedGoals,
      totalReports,
      unresolvedReports,
      goalsThisWeek,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
