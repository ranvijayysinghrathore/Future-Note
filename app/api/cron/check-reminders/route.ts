import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { decryptEmail } from '@/lib/encryption';
import { sendReminderEmail } from '@/lib/resend';

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const now = new Date();

    // Find goals that need reminders
    const goalsToRemind = await prisma.goal.findMany({
      where: {
        reminderDate: {
          lte: now,
        },
        reminderSent: false,
        isDeleted: false,
      },
      take: 50, // Process 50 at a time to avoid timeouts
    });

    let successCount = 0;
    let failureCount = 0;

    // Process each goal
    for (const goal of goalsToRemind) {
      try {
        // Decrypt email
        const email = decryptEmail(goal.email);

        // Send reminder email
        const emailResult = await sendReminderEmail(
          email,
          goal.goalText,
          goal.responseToken,
          goal.unsubscribeToken
        );

        // Update goal status
        await prisma.goal.update({
          where: { id: goal.id },
          data: { reminderSent: true },
        });

        // Log email
        await prisma.emailLog.create({
          data: {
            goalId: goal.id,
            emailType: 'REMINDER',
            status: emailResult.success ? 'SENT' : 'FAILED',
            mailgunMessageId: emailResult.messageId,
            errorMessage: emailResult.error,
          },
        });

        if (emailResult.success) {
          successCount++;
        } else {
          failureCount++;
        }

      } catch (error: unknown) {
        console.error(`Error processing goal ${goal.id}:`, error);
        failureCount++;

        // Log failure
        await prisma.emailLog.create({
          data: {
            goalId: goal.id,
            emailType: 'REMINDER',
            status: 'FAILED',
            errorMessage: error instanceof Error ? error.message : 'Unknown error',
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      processed: goalsToRemind.length,
      successCount,
      failureCount,
      timestamp: now.toISOString(),
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in cron job:', errorMessage);
    return NextResponse.json(
      { error: 'Cron job failed', details: errorMessage },
      { status: 500 }
    );
  }
}
