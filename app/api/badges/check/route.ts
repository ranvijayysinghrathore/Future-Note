import { NextRequest, NextResponse } from 'next/server'
import { checkAndAwardBadges } from '@/lib/badges'

export async function POST(request: NextRequest) {
  try {
    const { goalId, ipAddress } = await request.json()

    if (!goalId || !ipAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const newBadges = await checkAndAwardBadges(goalId, ipAddress)

    return NextResponse.json({ 
      success: true,
      newBadges 
    })
  } catch (error) {
    console.error('Badge check error:', error)
    return NextResponse.json(
      { error: 'Failed to check badges' },
      { status: 500 }
    )
  }
}
