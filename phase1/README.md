# LIQIFY - Solana Trading Competition Platform

## Overview

LIQIFY is a gamified Solana-connected trading competition platform where users stake 10 USDC to join trading challenges. The application features a dark-themed, RPG-inspired interface for competitive trading experiences using existing Drift accounts. The platform is built as a full-stack web application with a React frontend and Express backend, utilizing PostgreSQL for data persistence.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with custom dark theme and gaming aesthetics
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: TanStack React Query for server state
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Session Management**: In-memory storage with planned PostgreSQL integration
- **Development**: TSX for TypeScript execution in development

### Key Components

#### Frontend Components
1. **Hero Section**: Countdown timer, challenge stats, and call-to-action
2. **Join Challenge**: Wallet connection, username validation, and payment processing
3. **Rules & Rewards**: Challenge specifications and winning criteria
4. **Leaderboard**: Real-time player rankings and performance metrics
5. **Navigation**: Responsive navigation with wallet integration
6. **Wallet Provider**: Mock Solana wallet integration with connection state

#### Backend Components
1. **Storage Interface**: Abstracted CRUD operations for user management
2. **Memory Storage**: In-memory implementation for development
3. **Route Registration**: Express route setup with HTTP server creation
4. **Vite Integration**: Development server with HMR support

## Data Flow

### User Registration Flow
1. User connects Solana wallet (currently mocked)
2. User enters unique username
3. System validates username uniqueness
4. User pays 10 USDC entry fee (simulated)
5. Registration confirmation and success state

### Challenge Participation
1. Challenge countdown timer displays time until start
2. Users can join before challenge begins
3. Live leaderboard tracks player performance
4. Real-time updates of pool size and participant count

## External Dependencies

### Core Dependencies
- **Blockchain**: Solana network integration (currently mocked)
- **Database**: Neon PostgreSQL for production data
- **UI Framework**: Radix UI for accessible component primitives
- **Styling**: Tailwind CSS for utility-first styling
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React for consistent iconography

### Development Dependencies
- **TypeScript**: Full type safety across frontend and backend
- **Vite**: Fast development server and build tool
- **Drizzle Kit**: Database migrations and schema management
- **ESBuild**: Production backend bundling

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds React application to `dist/public`
2. **Backend**: ESBuild bundles Express server to `dist/index.js`
3. **Database**: Drizzle migrations applied via `drizzle-kit push`

### Environment Configuration
- **Development**: TSX runs TypeScript directly with Vite dev server
- **Production**: Node.js serves bundled JavaScript with static file serving
- **Database**: PostgreSQL connection via `DATABASE_URL` environment variable

### Deployment Architecture
The application follows a monorepo structure with:
- Shared TypeScript types and schemas
- Client-side React application
- Server-side Express API
- Database schema and migrations