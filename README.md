<a href="https://radar7.app">
  <h1 align="left">Radar7</h1>
</a>

<p align="left">
  An event discovery platform that aggregates events from multiple sources (Meetup, Eventbrite, LinkedIn Events, Luma) and provides superior discovery through map-based interface, intelligent filtering, and modern UX.
</p>

<p align="left">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#development">Development</a> •
  <a href="#deployment">Deployment</a>
</p>

## Features

- **Multi-Source Event Aggregation** (Planned)
  - Integrates with Meetup, Eventbrite, LinkedIn Events, and Luma
  - Unified event discovery across platforms
  - Real-time event data synchronization

- **Map-Based Discovery** (Planned)
  - Interactive map interface for location-based event browsing
  - Geospatial search and filtering
  - Venue visualization and navigation

- **Intelligent Filtering** (Planned)
  - Advanced search capabilities
  - Category and interest-based filtering
  - Date range and time-based filters
  - Distance and location-based search

- **Progressive Web App (PWA)**
  - Installable on mobile and desktop devices
  - Offline support with service workers
  - App-like experience with standalone mode
  - Optimized caching strategies

- **Modern Tech Stack**
  - [Next.js 16](https://nextjs.org) with App Router and Turbopack
  - Server Components and Actions for optimal performance
  - [Vercel AI SDK](https://sdk.vercel.ai/docs) for AI-powered features
  - TypeScript with strict mode for type safety
  - Tailwind CSS v4 with shadcn/ui components

## Tech Stack

- **Framework**: Next.js 16, React 19
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Database**: Vercel Postgres (Neon) with Drizzle ORM
- **Authentication**: NextAuth.js 5 (beta)
- **PWA**: Serwist (service workers)
- **AI Integration**: Vercel AI SDK, OpenAI
- **Storage**: Vercel Blob
- **Deployment**: Vercel
- **Code Quality**: ESLint 9, Stylelint, Prettier
- **Git Hooks**: Husky + lint-staged

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (or Vercel Postgres)
- OpenAI API key
- Vercel account (for Blob storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/radar7.git
   cd radar7
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

   Fill in the required environment variables:
   - `OPENAI_API_KEY` - Your OpenAI API key
   - `AUTH_SECRET` - Generate with `openssl rand -base64 32`
   - `POSTGRES_URL` - Your PostgreSQL connection string
   - `DATABASE_URL` - Same as POSTGRES_URL
   - `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage token
   - `ALLOWED_ORIGIN` - (Optional) CORS origin for production

4. **Run database migrations**
   ```bash
   npm run db:migrate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### PWA Setup

To enable full PWA functionality:

1. **Create PWA icons** (see `PWA_ICONS.md` for details)
   - `public/icon-192.png` (192x192px)
   - `public/icon-512.png` (512x512px)
   - `public/favicon.ico` (optional)

2. **Build for production**
   ```bash
   npm run build
   npm start
   ```

   The service worker only runs in production mode.

## Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production (runs migrations first)
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run lint:styles` - Run Stylelint on CSS
- `npm run lint:styles:fix` - Auto-fix CSS issues
- `npm run typecheck` - Run TypeScript type checking
- `npm run typecheck:watch` - Watch mode for type checking
- `npm run validate` - Run all checks (typecheck + lint + styles + build)

### Database Commands

- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate migration files from schema
- `npm run db:studio` - Open Drizzle Studio (database GUI)
- `npm run db:push` - Push schema changes to database
- `npm run db:check` - Check for schema inconsistencies

### Code Quality

This project uses **Husky + lint-staged** for pre-commit hooks:

- **JavaScript/TypeScript**: ESLint with auto-fix + TypeScript type checking
- **CSS/SCSS**: Stylelint with auto-fix
- **Git hooks**: Automatically run on `git commit`

The hooks will:
1. Lint and auto-fix staged files
2. Run TypeScript type checking on the entire codebase
3. Prevent commits with unfixable errors

### Project Structure

```
radar7/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (chat)/            # Main app routes (legacy)
│   ├── globals.css        # Global styles (Tailwind v4)
│   ├── layout.tsx         # Root layout
│   ├── manifest.ts        # PWA manifest
│   └── sw.ts              # Service worker
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utilities and configuration
│   ├── ai/              # AI integration (OpenAI)
│   └── db/              # Database (Drizzle ORM)
├── public/              # Static assets
├── .husky/              # Git hooks
├── CLAUDE.md            # AI assistant instructions
├── PWA_ICONS.md         # PWA icon requirements
└── README.md            # This file
```

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your repository
   - Add environment variables
   - Deploy

3. **Set up Vercel Postgres and Blob**
   - Create a Postgres database in Vercel dashboard
   - Create a Blob store in Vercel dashboard
   - Environment variables will be auto-populated

4. **Configure PWA**
   - Set `ALLOWED_ORIGIN` to your production domain
   - Ensure PWA icons are in `public/` directory

### Environment Variables

Required for production:
- `OPENAI_API_KEY`
- `AUTH_SECRET`
- `POSTGRES_URL` (auto-set by Vercel)
- `DATABASE_URL` (auto-set by Vercel)
- `BLOB_READ_WRITE_TOKEN` (auto-set by Vercel)
- `ALLOWED_ORIGIN` (your production domain)

## Contributing

This project is in early development. Contributions are welcome once the core features are stabilized.

## License

[Your License Here]
