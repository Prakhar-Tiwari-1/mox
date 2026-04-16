# MoX Website

A production-ready association website built with React, TypeScript, Tailwind CSS, Supabase, and Razorpay.

## Features

- **Home Page**: Showcases mission, featured events, and call-to-action buttons
- **About Us**: Organization story, values, leadership team, and contact information
- **Events**: Browse upcoming and past events with detailed information
- **Calendar**: Visual calendar view of all events
- **Payment Portal**: Secure payments for memberships, events, and donations via Razorpay
- **Partnership Program**: Partnership tiers and brochure download/upload
- **Contact Form**: Submit inquiries that are saved to Supabase
- **Membership Application**: Apply for membership with multiple tier options
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Accessibility**: Proper contrast ratios and semantic HTML

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS v4
- **Routing**: React Router v7 (Data mode)
- **Backend**: Supabase Edge Functions (Hono framework)
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage
- **Payment**: Razorpay
- **UI Components**: Radix UI primitives with custom styling

## Documentation

- [Setup Guide](./SETUP.md) - Complete installation and configuration instructions
- [Environment Variables](./ENVIRONMENT.md) - Required environment variables
- [Razorpay Integration](./RAZORPAY.md) - Payment setup and testing
- [Supabase Setup](./SUPABASE.md) - Database and storage configuration
- [Content Updates](./CONTENT.md) - How to update website content
- [Deployment](./DEPLOYMENT.md) - Deployment instructions

## Quick Start

1. **Set up environment variables** (see [ENVIRONMENT.md](./ENVIRONMENT.md))
2. **Configure Supabase** (see [SUPABASE.md](./SUPABASE.md))
3. **Configure Razorpay** (see [RAZORPAY.md](./RAZORPAY.md))
4. **Run the development server**
5. **Access the application** at the provided URL

## Project Structure

```
/
├── src/
│   ├── app/
│   │   ├── components/      # Reusable React components
│   │   │   ├── ui/          # UI component library
│   │   │   ├── Header.tsx   # Navigation header
│   │   │   ├── Footer.tsx   # Site footer
│   │   │   └── Layout.tsx   # Page layout wrapper
│   │   ├── pages/           # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Events.tsx
│   │   │   ├── EventDetail.tsx
│   │   │   ├── Calendar.tsx
│   │   │   ├── Payment.tsx
│   │   │   ├── Partnership.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── Membership.tsx
│   │   │   └── NotFound.tsx
│   │   ├── App.tsx          # Main app component
│   │   └── routes.tsx       # Route configuration
│   ├── lib/
│   │   ├── supabase.ts      # Supabase client
│   │   └── api.ts           # API client for backend
│   └── styles/              # Global styles
├── supabase/
│   └── functions/
│       └── server/
│           └── index.tsx    # Backend API routes
├── docs/                    # Documentation
└── sql/                     # Database schemas

```

## Brand Guidelines

- **Primary Color**: #0c1c3b (Deep blue)
- **Currency**: Euro (€)
- **Design**: Professional, trustworthy, modern

## Support

For questions or issues, please contact mox@polytechnique.fr

## License

Copyright © 2026 moX. All rights reserved.
