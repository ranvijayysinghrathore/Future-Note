import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    // Fetch public goals (not deleted, not flagged)
    const goals = await prisma.goal.findMany({
      where: {
        isPublic: true,
        isDeleted: false,
        isFlagged: false,
      },
      select: {
        id: true,
        goalText: true,
        createdAt: true,
        userName: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit + 1, // Fetch one extra to check if there are more
    });

    const hasMore = goals.length > limit;
    const goalsToReturn = hasMore ? goals.slice(0, limit) : goals;

    return NextResponse.json({
      goals: goalsToReturn,
      hasMore,
      page,
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching goals:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to fetch goals' },
      { status: 500 }
    );
  }
}
