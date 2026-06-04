import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions): Promise<boolean> {
  if (!resend) {
    console.warn('Email service not configured - skipping email send')
    return false
  }

  try {
    const { error } = await resend.emails.send({
      from: 'ThrottleMarket <noreply@throttlemarket.com>',
      to,
      subject,
      html,
    })

    if (error) {
      console.error('Email send error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Email service error:', error)
    return false
  }
}

export function generatePasswordResetHtml(resetLink: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset - ThrottleMarket</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #3b82f6;
          margin-bottom: 10px;
        }
        .button {
          display: inline-block;
          background: #3b82f6;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          font-size: 14px;
          color: #666;
          text-align: center;
        }
        .expiry {
          color: #666;
          font-size: 14px;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">🏍️ ThrottleMarket</div>
        <h1>Password Reset Request</h1>
      </div>
      
      <p>Hi there,</p>
      <p>We received a request to reset your password for your ThrottleMarket account. Click the button below to reset your password:</p>
      
      <div style="text-align: center;">
        <a href="${resetLink}" class="button">Reset Password</a>
      </div>
      
      <p>If you didn't request this password reset, you can safely ignore this email. The link will expire in 1 hour for security reasons.</p>
      
      <p class="expiry">This link expires in 1 hour.</p>
      
      <div class="footer">
        <p>Best regards,<br>The ThrottleMarket Team</p>
        <p style="font-size: 12px; margin-top: 10px;">
          If you're having trouble clicking the button, copy and paste this link into your browser:<br>
          <span style="word-break: break-all;">${resetLink}</span>
        </p>
      </div>
    </body>
    </html>
  `
}
