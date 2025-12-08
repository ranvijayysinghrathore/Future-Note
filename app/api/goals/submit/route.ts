import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { encryptEmail } from '@/lib/encryption';
import { 
  generateDeleteToken, 
  generateUnsubscribeToken, 
  generateResponseToken 
} from '@/lib/tokens';
import { 
  sanitizeText, 
  containsProfanity, 
  containsPII, 
  goalSubmissionSchema 
} from '@/lib/validation';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { sendConfirmationEmail } from '@/lib/resend';

export async function POST(request: NextRequest) {
  try {
    // Get IP address for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Check rate limit
    const rateLimit = checkRateLimit(`goal-submit:${ip}`, RATE_LIMITS.GOAL_SUBMISSION);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. You can only submit 3 goals per day.' },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = goalSubmissionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { goalText, email } = validation.data;

    // Sanitize goal text
    const sanitizedGoalText = sanitizeText(goalText);

    // Check for profanity
    if (containsProfanity(sanitizedGoalText)) {
      return NextResponse.json(
        { error: 'Your goal contains inappropriate language. Please revise it.' },
        { status: 400 }
      );
    }

    // Check for PII
    if (containsPII(sanitizedGoalText)) {
      return NextResponse.json(
        { error: 'Please do not include personal information (phone numbers, emails, etc.) in your goal.' },
        { status: 400 }
      );
    }

    // Encrypt email
    const encryptedEmail = encryptEmail(email);

    // Generate tokens
    const deleteToken = generateDeleteToken();
    const unsubscribeToken = generateUnsubscribeToken();
    const responseToken = generateResponseToken();

    // Calculate reminder date (4 years from now)
    const reminderDate = new Date();
    reminderDate.setFullYear(reminderDate.getFullYear() + 4);

    // Create goal in database
    const goal = await prisma.goal.create({
      data: {
        goalText: sanitizedGoalText,
        email: encryptedEmail,
        reminderDate,
        deleteToken,
        unsubscribeToken,
        responseToken,
        ipAddress: ip,
      },
    });

    // Send confirmation email
    const emailResult = await sendConfirmationEmail(email, sanitizedGoalText, deleteToken);

    // Log email status
    await prisma.emailLog.create({
      data: {
        goalId: goal.id,
        emailType: 'CONFIRMATION',
        status: emailResult.success ? 'SENT' : 'FAILED',
        mailgunMessageId: emailResult.messageId,
        errorMessage: emailResult.error,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Goal saved successfully! Check your email for confirmation.',
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error submitting goal:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to submit goal. Please try again.' },
      { status: 500 }
    );
  }
}
