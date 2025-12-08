import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Delete token is required' },
        { status: 400 }
      );
    }

    // Find goal by delete token
    const goal = await prisma.goal.findFirst({
      where: {
        deleteToken: token,
        isDeleted: false,
      },
    });

    if (!goal) {
      return NextResponse.json(
        { error: 'Goal not found or already deleted' },
        { status: 404 }
      );
    }

    // Soft delete the goal
    await prisma.goal.update({
      where: { id: goal.id },
      data: { isDeleted: true },
    });

    // Return HTML response
    return new Response(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Goal Deleted - FutureNote</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
          <style>
            * {
              box-sizing: border-box;
            }
            body {
              font-family: 'Poppins', sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              background-color: #FAFAFA;
              color: #333;
              padding: 20px;
            }
            .container {
              text-align: center;
              width: 100%;
              max-width: 480px;
              padding: 48px 32px;
              background: white;
              border-radius: 24px;
              box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
              animation: slideUp 0.5s ease-out;
            }
            .icon-circle {
              width: 80px;
              height: 80px;
              background-color: #F0FDF4;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 24px auto;
              color: #16A34A;
              font-size: 32px;
              border: 4px solid #DCFCE7;
            }
            h1 { 
              font-size: 28px; 
              font-weight: 600; 
              margin: 0 0 16px 0;
              color: #1F2937;
            }
            p { 
              color: #6B7280; 
              line-height: 1.6; 
              margin: 0 0 32px 0;
              font-size: 16px;
            }
            .btn {
              display: inline-block;
              background-color: #333;
              color: white;
              text-decoration: none;
              padding: 16px 32px;
              border-radius: 12px;
              font-weight: 500;
              transition: all 0.2s ease;
              width: 100%;
            }
            .btn:hover {
              background-color: #000;
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon-circle">
              &#10003;
            </div>
            <h1>Goal Deleted</h1>
            <p>Your goal has been successfully deleted from our system.<br>It's okay to change direction.</p>
            <a href="/" class="btn">Return to FutureNote</a>
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
    console.error('Error deleting goal:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to delete goal' },
      { status: 500 }
    );
  }
}
