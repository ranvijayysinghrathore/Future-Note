# FutureNote

A timeless "set it once, remember it later" platform where users can write meaningful 4-year goals and receive reminders exactly 4 years later.

## Features

- ✨ **Minimalist Design**: Clean platinum/off-white aesthetic
- 🎯 **4-Year Goal Tracking**: Set goals and get reminded in 4 years
- 🔒 **Privacy & Security**: Email encryption, rate limiting, profanity/PII filtering
- 📧 **Email Notifications**: Confirmation and reminder emails via Mailgun
- 🌐 **Public Inspiration**: View goals from others (text only, no personal data)
- 🛡️ **Moderation**: Report system with auto-flagging
- 👨‍💼 **Admin Dashboard**: Production-ready admin panel (coming soon)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL) with Prisma ORM
- **Styling**: TailwindCSS
- **Email**: Resend API
- **Authentication**: NextAuth.js v5 (for admin)
- **Deployment**: Vercel with Cron Jobs

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Resend account

### Installation

1. **Clone and install dependencies**:
   ```bash
   cd futurenote
   npm install
   ```

2. **Set up Supabase**:
   - Create a new project at [supabase.com](https://supabase.com)
   - Get your connection strings from Settings → Database
   - Copy both the "Connection string" (for DATABASE_URL) and "Direct connection" (for DIRECT_URL)

3. **Set up Resend**:
   - Create account at [resend.com](https://www.resend.com)
   - Get your API key from Settings → API Keys

4. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and fill in:
   ```env
   DATABASE_URL="your-supabase-connection-string?pgbouncer=true"
   DIRECT_URL="your-supabase-direct-connection-string"
   RESEND_API_KEY="your-resend-api-key"
   ENCRYPTION_KEY="generate-a-32-character-key"
   NEXTAUTH_SECRET="generate-a-random-secret"
   NEXTAUTH_URL="http://localhost:3000"
   CRON_SECRET="generate-a-random-secret"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

   **Generate secrets**:
   ```bash
   # For ENCRYPTION_KEY (exactly 32 characters)
   node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
   
   # For NEXTAUTH_SECRET and CRON_SECRET
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

5. **Set up database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

6. **Run development server**:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
futurenote/
├── app/
│   ├── api/
│   │   ├── goals/
│   │   │   ├── submit/route.ts      # Goal submission
│   │   │   ├── route.ts             # Fetch goals
│   │   │   ├── delete/route.ts      # Delete goal
│   │   │   ├── report/route.ts      # Report goal
│   │   │   └── respond/route.ts     # Achievement response
│   │   └── cron/
│   │       └── check-reminders/route.ts  # Daily cron job
│   ├── globals.css                  # Design system
│   ├── layout.tsx                   # Root layout
│   └── page.tsx                     # Landing page
├── components/
│   ├── GoalSubmissionModal.tsx      # Goal submission form
│   └── GoalsGrid.tsx                # Public goals display
├── lib/
│   ├── prisma.ts                    # Prisma client
│   ├── encryption.ts                # Email encryption
│   ├── validation.ts                # Input validation
│   ├── rate-limit.ts                # Rate limiting
│   ├── tokens.ts                    # Token generation
│   └── mailgun.ts                   # Email service
├── prisma/
│   └── schema.prisma                # Database schema
└── vercel.json                      # Vercel config with cron
```

## Deployment

### Vercel

1. **Push to GitHub**
2. **Import to Vercel**
3. **Add environment variables** in Vercel dashboard
4. **Deploy**

The cron job will automatically run daily at 10:00 AM UTC.

### Database Migration

```bash
npx prisma migrate deploy
```

## API Endpoints

- `POST /api/goals/submit` - Submit a new goal
- `GET /api/goals` - Fetch public goals (paginated)
- `GET /api/goals/delete?token=xxx` - Delete goal
- `POST /api/goals/report` - Report inappropriate goal
- `GET /api/goals/respond?token=xxx&achieved=yes|no` - Respond to reminder
- `GET /api/cron/check-reminders` - Cron job (protected)

## Security Features

- ✅ Email encryption (AES-256-CBC)
- ✅ Rate limiting (3 goals/day, 10 reports/day)
- ✅ Profanity filtering
- ✅ PII detection (phone, SSN, credit cards)
- ✅ Input sanitization (XSS protection)
- ✅ Secure tokens for all actions
- ✅ Cron job authentication

## Roadmap

- [ ] Admin dashboard with NextAuth.js
- [ ] Unsubscribe functionality
- [ ] Social sharing for achievements
- [ ] Analytics and insights
- [ ] Email template customization

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
