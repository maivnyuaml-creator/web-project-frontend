# Velora Live — Frontend Platform

**Velora Live** is a modern, high-performance, dark-luxury interactive live-streaming frontend built with Next.js 16 (App Router), React 19, TypeScript strict mode, Tailwind CSS v4, and TanStack React Query.

Designed with an original premium aesthetic featuring near-black and charcoal backgrounds (`#08080C`, `#0F0F18`), glowing purple/fuchsia accents, real-time WebSockets chat, HLS video player, interactive tipping, 1-on-1 private video lounges, 18 U.S.C. § 2257 compliance workflows, and complete Viewer, Creator, and Admin control centers.

---

## 1. Technology Stack

- **Framework**: Next.js 16.4.2 (App Router with Partial Prerendering & Turbopack)
- **Library**: React 19.3.0
- **Language**: TypeScript 5 with strict mode
- **Styling**: Tailwind CSS v4 with custom dark luxury glassmorphism tokens
- **Data Fetching & Caching**: TanStack Query (`@tanstack/react-query` v5)
- **Forms & Validation**: React Hook Form with Zod schemas (`@hookform/resolvers`)
- **Real-Time WebSockets**: Socket.IO Client (`socket.io-client` v4)
- **Video Playback**: HLS.js with low-latency manifest parsing and native fallback
- **Icons**: Lucide React
- **Notifications**: Custom multi-tone toast notification system

---

## 2. Project Architecture

```text
src/
├── app/                                 # Next.js App Router (47 routes)
│   ├── layout.tsx                       # Root layout with providers & 18+ Age Gate
│   ├── page.tsx                         # Homepage with hero showcase & live grid
│   ├── browse/page.tsx                  # Discovery with category/language filters
│   ├── categories/[slug]/page.tsx       # Category-specific streams
│   ├── creators/[username]/page.tsx     # Creator profile, media vault & schedule
│   ├── rooms/[roomId]/page.tsx          # Live room with player, chat & tip dialogs
│   ├── login/page.tsx                   # Authentication login
│   ├── register/page.tsx                # 18+ verified registration
│   ├── verify-email/page.tsx            # Email verification status & resend
│   ├── forgot-password/page.tsx         # Password recovery
│   ├── reset-password/page.tsx          # Password reset with token
│   ├── age-gate/page.tsx                # Strict 18+ eligibility & access notice
│   ├── terms/page.tsx                   # Terms of Service
│   ├── privacy/page.tsx                 # Privacy & discreet billing policy
│   ├── safety/page.tsx                  # 18 U.S.C. 2257 compliance & trust
│   ├── cookies/page.tsx                 # Cookie policy
│   ├── report/page.tsx                  # 24/7 moderation report portal
│   ├── account/                         # Viewer Control Center
│   │   ├── page.tsx                     # Profile overview
│   │   ├── wallet/page.tsx              # Token packages & checkout dialog
│   │   ├── favorites/page.tsx           # Followed creators & live indicators
│   │   ├── shows/page.tsx               # Private 1-on-1 & group show sessions
│   │   ├── transactions/page.tsx        # Token & purchase ledger
│   │   ├── security/page.tsx            # Password change, sessions & 2FA
│   │   └── notifications/page.tsx       # Notification preferences
│   ├── creator/                         # Performer Studio
│   │   ├── apply/page.tsx               # Creator application & 2257 consent
│   │   ├── verification/page.tsx        # Sumsub KYC & biometric liveness status
│   │   ├── dashboard/page.tsx           # Earnings summary & stream status
│   │   ├── stream/page.tsx              # RTMP server, stream key rotation & OBS guide
│   │   ├── tip-menu/page.tsx            # Interactive tip menu & room goal editor
│   │   ├── profile/page.tsx             # Stage name, bio & private rates
│   │   ├── earnings/page.tsx            # Channel breakdown & analytics charts
│   │   ├── payouts/page.tsx             # Paxum, SEPA, Crypto withdrawal requests
│   │   ├── schedule/page.tsx            # Weekly streaming calendar manager
│   │   ├── media/page.tsx               # Pay-per-view vault media manager
│   │   └── fans/page.tsx                # VIP top tippers & blocked users list
│   └── admin/                           # Staff Administration Center
│       ├── page.tsx                     # KPI metrics, gross revenue & stream health
│       ├── creators/page.tsx            # Creator application review & approval
│       ├── verification/page.tsx        # KYC webhook audits & 2257 repository
│       ├── reports/page.tsx             # Emergency moderation queue & actions
│       ├── users/page.tsx               # User directory, roles & suspension
│       ├── rooms/page.tsx               # Ingest monitor & force termination
│       ├── payments/page.tsx            # Payment processing & dispute logs
│       ├── payouts/page.tsx             # Creator payout authorizations
│       ├── settings/page.tsx            # Token exchange rates & commission %
│       └── audit-logs/page.tsx          # Immutable staff audit trail
├── components/
│   ├── chat/ChatSidebar.tsx             # Live chat with tips, emojis & role badges
│   ├── layout/                          # AccountLayout, CreatorLayout, AdminLayout, AgeGateModal
│   ├── navigation/Navbar.tsx            # Brand header, search, tokens & role switcher
│   ├── navigation/Footer.tsx            # 2257 compliance statement & policy links
│   ├── player/VideoPlayer.tsx           # HLS.js video player with playback controls
│   ├── providers/QueryProvider.tsx      # TanStack Query client provider
│   ├── rooms/RoomCard.tsx               # Responsive live stream card
│   └── ui/                              # Button, Badge, Card, Input, Dialog, Toast, Skeleton
├── lib/
│   ├── api/                             # Centralized typed API client & endpoints
│   ├── auth/AuthContext.tsx             # Session state & quick dev role switcher
│   ├── socket/client.ts                 # Socket.IO connection manager
│   └── utils.ts                         # Tailwind merge (cn), currency & token formatters
└── types/index.ts                       # Complete domain TypeScript models
```

---

## 3. Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
# Clone the repository and navigate to the directory
cd d:/web-project/frontend

# Install dependencies
npm install --legacy-peer-deps
```

### Environment Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Default variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
NEXT_PUBLIC_HLS_PLAYER_TYPE=native_or_hlsjs
NEXT_PUBLIC_SITE_NAME="Velora Live"
NEXT_PUBLIC_VERIFICATION_PROVIDER=sumsub
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 4. Testing Viewer, Creator, and Admin Roles

In the top navigation bar, a **Development Role Switcher** is provided:
- **Viewer**: Browse live streams, join chat, send tips, book private shows, and purchase tokens.
- **Creator**: Access the **Creator Studio** (`/creator/dashboard`), manage RTMP keys, configure tip menus, set private rates, view earnings charts, and request payouts.
- **Admin**: Access the **Admin & Compliance Center** (`/admin`), review creator KYC applications, inspect 2257 compliance records, moderate streams, review payments, and approve payouts.

---

## 5. API Endpoints Reference

The centralized API client in `src/lib/api/` connects to the following NestJS backend endpoints:

| Endpoint Group | Description |
|---|---|
| `/api/v1/auth` | Login, register, logout, session check (`/me`), password recovery, email verification |
| `/api/v1/users` | User profile management, security settings, active sessions revocation |
| `/api/v1/rooms` | Discovery, categories, live room details, active viewer counts |
| `/api/v1/creators` | Creator profile, stream settings, key rotation, tip menu, fans |
| `/api/v1/creator-applications` | Creator onboarding submission & status tracking |
| `/api/v1/verification` | Sumsub KYC status, WebSDK session initiation |
| `/api/v1/wallet` | Token balances, transaction history, withdrawal requests |
| `/api/v1/token-packages` | Available token bundles and pricing |
| `/api/v1/payments` | Discreet checkout session initiation |
| `/api/v1/tips` | Interactive live stream tip processing |
| `/api/v1/shows` | 1-on-1 private video requests & group show admissions |
| `/api/v1/reports` | Moderation violation reporting |
| `/api/v1/notifications` | User notification preferences |
| `/api/v1/admin` | Platform statistics, application review, reports queue, user moderation, payouts |

---

## 6. Build & Production Validation

Run full TypeScript compilation and static page prerendering:

```bash
# Type check and production build
npm run build

# Code style and hook linting
npm run lint
```
