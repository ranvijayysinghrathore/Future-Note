import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { decryptEmail } from '@/lib/encryption';
import { sendAchievementEmail } from '@/lib/resend';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const achieved = searchParams.get('achieved');

    if (!token || !achieved) {
      return NextResponse.json(
        { error: 'Token and achieved status are required' },
        { status: 400 }
      );
    }

    // Find goal by response token
    const goal = await prisma.goal.findFirst({
      where: {
        responseToken: token,
      },
    });

    if (!goal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      );
    }

    // Check if already responded
    if (goal.achieved !== null) {
      return new Response(
        `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Already Responded - FutureNote</title>
            <style>
              body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                display: flex;
                align-items: center;
                justify-center;
                min-height: 100vh;
                margin: 0;
                background: #FAFAFA;
                color: #333;
              }
              .container {
                text-align: center;
                max-width: 500px;
                padding: 40px;
                background: white;
                border: 1px solid #E5E4E2;
                border-radius: 8px;
              }
              h1 { font-size: 24px; margin-bottom: 16px; }
              p { color: #666; line-height: 1.6; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Already Responded</h1>
              <p>You have already responded to this goal reminder.</p>
            </div>
          </body>
        </html>
        `,
        {
          headers: {
            'Content-Type': 'text/html',
          },
        }
      );
    }

    const achievedBool = achieved === 'yes';

    // Update goal with achievement status
    await prisma.goal.update({
      where: { id: goal.id },
      data: {
        achieved: achievedBool,
        achievedAt: new Date(),
      },
    });

    // Decrypt email and send thank you email
    const email = decryptEmail(goal.email);
    const emailResult = await sendAchievementEmail(email, achievedBool, goal.goalText);

    // Log email
    await prisma.emailLog.create({
      data: {
        goalId: goal.id,
        emailType: 'ACHIEVEMENT',
        status: emailResult.success ? 'SENT' : 'FAILED',
        mailgunMessageId: emailResult.messageId,
        errorMessage: emailResult.error,
      },
    });

    // Return HTML response
    const message = achievedBool
      ? "Congratulations on achieving your goal! 🎉"
      : "Keep working towards your dreams. Every step counts! 💪";

    return new Response(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${achievedBool ? 'Congratulations!' : 'Keep Going!'} - FutureNote</title>
          <style>
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
              display: flex;
              align-items: center;
              justify-center;
              min-height: 100vh;
              margin: 0;
              background: #FAFAFA;
              color: #333;
            }
            .container {
              text-align: center;
              max-width: 500px;
              padding: 40px;
              background: white;
              border: 1px solid #E5E4E2;
              border-radius: 8px;
            }
            h1 { font-size: 32px; margin-bottom: 16px; }
            p { color: #666; line-height: 1.6; }
            .goal { 
              background: #FAFAFA; 
              border-left: 3px solid #C0C0C0; 
              padding: 15px; 
              margin: 20px 0; 
              font-style: italic; 
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>${achievedBool ? '🎉' : '💪'}</h1>
            <h2>${message}</h2>
            <div class="goal">"${goal.goalText}"</div>
            <p>Thank you for being part of FutureNote.</p>
          </div>
        </body>
      </html>
      `,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error responding to goal:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to process response' },
      { status: 500 }
    );
  }
}
