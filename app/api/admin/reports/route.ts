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
    
    if (filter === 'unresolved') {
      where = { resolved: false }
    } else if (filter === 'resolved') {
      where = { resolved: true }
    }

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        orderBy: { reportedAt: 'desc' },
        skip,
        take: limit,
        include: {
          goal: {
            select: {
              id: true,
              goalText: true,
              isFlagged: true,
              isDeleted: true,
            },
          },
        },
      }),
      prisma.report.count({ where }),
    ])

    return NextResponse.json({
      reports,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin()

    const { reportId, action } = await request.json()

    if (action === 'resolve') {
      await prisma.report.update({
        where: { id: reportId },
        data: { resolved: true },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update report' }, { status: 500 })
  }
}
