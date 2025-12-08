import nodemailer from 'nodemailer';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const GMAIL_EMAIL = process.env.GMAIL_EMAIL;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_EMAIL,
    pass: GMAIL_APP_PASSWORD,
  },
});

export async function sendConfirmationEmail(
  email: string,
  goalText: string,
  deleteToken: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const deleteUrl = `${APP_URL}/api/goals/delete?token=${deleteToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .container { background: #FAFAFA; border: 1px solid #E5E4E2; border-radius: 8px; padding: 40px; }
            h1 { color: #333; font-size: 24px; margin-bottom: 20px; }
            .goal { background: white; border-left: 3px solid #C0C0C0; padding: 15px; margin: 20px 0; font-style: italic; }
            .button { display: inline-block; background: #333; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
            .footer { margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>✨ Your 4-Year Goal Has Been Saved</h1>
            <p>Thank you for setting your 4-year goal with FutureNote!</p>
            
            <div class="goal">"${goalText}"</div>
            
            <p>We'll send you a reminder in exactly 4 years to see if you achieved it.</p>
            
            <p>If you'd like to delete your goal, click the button below:</p>
            <a href="${deleteUrl}" class="button">Delete My Goal</a>
            
            <div class="footer">
              <p>This is an automated message from FutureNote. Your email is encrypted and secure.</p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    const result = await transporter.sendMail({
      from: `"FutureNote" <${GMAIL_EMAIL}>`,
      to: email,
      subject: 'Your 4-Year Goal Has Been Saved ✨',
      html,
    });
    
    return {
      success: true,
      messageId: result.messageId,
    };
  } catch (error: unknown) {
    console.error('Error sending confirmation email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function sendReminderEmail(
  email: string,
  goalText: string,
  responseToken: string,
  unsubscribeToken: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const yesUrl = `${APP_URL}/api/goals/respond?token=${responseToken}&achieved=yes`;
    const noUrl = `${APP_URL}/api/goals/respond?token=${responseToken}&achieved=no`;
    const unsubscribeUrl = `${APP_URL}/api/goals/unsubscribe?token=${unsubscribeToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .container { background: #FAFAFA; border: 1px solid #E5E4E2; border-radius: 8px; padding: 40px; }
            h1 { color: #333; font-size: 24px; margin-bottom: 20px; }
            .goal { background: white; border-left: 3px solid #C0C0C0; padding: 15px; margin: 20px 0; font-style: italic; font-size: 18px; }
            .buttons { margin: 30px 0; }
            .button { display: inline-block; padding: 12px 32px; text-decoration: none; border-radius: 4px; margin: 10px 10px 10px 0; font-weight: 600; }
            .button-yes { background: #4CAF50; color: white; }
            .button-no { background: #666; color: white; }
            .footer { margin-top: 30px; font-size: 12px; color: #666; border-top: 1px solid #E5E4E2; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🎯 It's Been 4 Years!</h1>
            <p>Four years ago, you set this goal:</p>
            
            <div class="goal">"${goalText}"</div>
            
            <p><strong>Did you achieve it?</strong></p>
            
            <div class="buttons">
              <a href="${yesUrl}" class="button button-yes">Yes, I Did! 🎉</a>
              <a href="${noUrl}" class="button button-no">Not Yet</a>
            </div>
            
            <p>Thank you for trusting FutureNote with your goals. We hope this reminder inspires you!</p>
            
            <div class="footer">
              <p><a href="${unsubscribeUrl}">Unsubscribe</a> from future emails</p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    const result = await transporter.sendMail({
      from: `"FutureNote" <${GMAIL_EMAIL}>`,
      to: email,
      subject: '🎯 Your 4-Year Goal Reminder',
      html,
    });
    
    return {
      success: true,
      messageId: result.messageId,
    };
  } catch (error: unknown) {
    console.error('Error sending reminder email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function sendAchievementEmail(
  email: string,
  achieved: boolean,
  goalText: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const message = achieved
      ? "Congratulations on achieving your goal! 🎉"
      : "Keep working towards your dreams. Every step counts! 💪";
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .container { background: #FAFAFA; border: 1px solid #E5E4E2; border-radius: 8px; padding: 40px; text-align: center; }
            h1 { color: #333; font-size: 24px; margin-bottom: 20px; }
            .goal { background: white; border-left: 3px solid #C0C0C0; padding: 15px; margin: 20px 0; font-style: italic; }
            .footer { margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>${achieved ? '🎉' : '💪'} Thank You for Sharing!</h1>
            <p>${message}</p>
            
            <div class="goal">"${goalText}"</div>
            
            <p>Thank you for being part of FutureNote.</p>
            
            <div class="footer">
              <p>Set it once. Remember it later.</p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    const result = await transporter.sendMail({
      from: `"FutureNote" <${GMAIL_EMAIL}>`,
      to: email,
      subject: achieved ? '🎉 Congratulations!' : '💪 Keep Going!',
      html,
    });
    
    return {
      success: true,
      messageId: result.messageId,
    };
  } catch (error: unknown) {
    console.error('Error sending achievement email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
