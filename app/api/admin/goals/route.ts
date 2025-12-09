import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const filter = searchParams.get('filter') || 'all'
    const skip = (page - 1) * limit

    let where = {}
    
    if (filter === 'flagged') {
      where = { isFlagged: true }
    } else if (filter === 'deleted') {
      where = { isDeleted: true }
    } else if (filter === 'public') {
      where = { isPublic: true, isDeleted: false }
    }

    const [goals, total] = await Promise.all([
      prisma.goal.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          goalText: true,
          createdAt: true,
          isPublic: true,
          isFlagged: true,
          isDeleted: true,
          reminderSent: true,
          achieved: true,
        },
      }),
      prisma.goal.count({ where }),
    ])

    return NextResponse.json({
      goals,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin()

    const { goalId } = await request.json()

    await prisma.goal.update({
      where: { id: goalId },
      data: { isDeleted: true },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete goal' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin()

    const { goalId, action } = await request.json()

    if (action === 'flag') {
      await prisma.goal.update({
        where: { id: goalId },
        data: { isFlagged: true },
      })
    } else if (action === 'unflag') {
      await prisma.goal.update({
        where: { id: goalId },
        data: { isFlagged: false },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update goal' }, { status: 500 })
  }
}
