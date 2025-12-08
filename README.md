# FutureNote

Set your 4-year goals and get reminded when it's time to reflect.

## Features

- 📝 Submit goals with email confirmation
- 🔒 Encrypted email storage
- ⏰ Automated 4-year reminders via cron jobs
- 📊 Public goal feed
- 🎯 Achievement tracking
- � Content moderation (reporting/flagging)

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Email**: Nodemailer (Gmail SMTP)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Analytics**: Vercel Analytics

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database (Neon/Supabase recommended)
- Gmail account with App Password

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ranvijayysinghrathore/Future-Note.git
cd Future-Note
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Fill in your `.env` file with:
- `DATABASE_URL` and `DIRECT_URL` from your database provider
- `GMAIL_EMAIL` and `GMAIL_APP_PASSWORD` (see setup guide below)
- Generate secrets using `openssl rand -base64 32`
- Set `ENCRYPTION_KEY` to exactly 32 characters

4. Run database migrations:
```bash
npx prisma generate
npx prisma db push
```

5. Start development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Gmail Setup

1. Enable 2-Step Verification on your Gmail account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Create an App Password for "Mail"
4. Use the 16-character password in your `.env` as `GMAIL_APP_PASSWORD`

## Deployment

### Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables (see `.env.example`)
4. Deploy

The cron job in `vercel.json` will automatically run daily to check for reminders.

## Environment Variables

See `.env.example` for all required variables. Key ones:

- `GMAIL_EMAIL` - Your Gmail address
- `GMAIL_APP_PASSWORD` - Gmail App Password
- `DATABASE_URL` - PostgreSQL connection string (pooled)
- `DIRECT_URL` - PostgreSQL direct connection
- `ENCRYPTION_KEY` - Exactly 32 characters for email encryption
- `NEXTAUTH_SECRET` - Random secret for NextAuth
- `CRON_SECRET` - Secret for protecting cron endpoints

## Project Structure

```
├── app/
│   ├── api/          # API routes
│   ├── page.tsx      # Home page
│   └── layout.tsx    # Root layout
├── components/       # React components
├── lib/              # Utilities
│   ├── prisma.ts     # Database client
│   ├── resend.ts     # Email service (Nodemailer)
│   ├── encryption.ts # Email encryption
│   └── validation.ts # Input validation
├── prisma/
│   └── schema.prisma # Database schema
└── public/           # Static assets
```

## License

MIT

## Author

Ranvijay Singh Rathore
