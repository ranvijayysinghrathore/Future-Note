import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Get IP address for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Check rate limit
    const rateLimit = checkRateLimit(`goal-report:${ip}`, RATE_LIMITS.GOAL_REPORT);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { goalId, reason } = body;

    if (!goalId) {
      return NextResponse.json(
        { error: 'Goal ID is required' },
        { status: 400 }
      );
    }

    // Check if goal exists
    const goal = await prisma.goal.findUnique({
      where: { id: goalId },
      include: {
        reports: true,
      },
    });

    if (!goal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      );
    }

    // Create report
    await prisma.report.create({
      data: {
        goalId,
        reason: reason || 'User reported',
        ipAddress: ip,
      },
    });

    // Auto-flag if threshold reached (3 reports)
    const reportCount = goal.reports.length + 1;
    if (reportCount >= 3 && !goal.isFlagged) {
      await prisma.goal.update({
        where: { id: goalId },
        data: { isFlagged: true },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Report submitted successfully',
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error reporting goal:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to submit report' },
      { status: 500 }
    );
  }
}
