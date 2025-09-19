# VISION - Smart Attendance & Analytics System

## Overview

VISION is a comprehensive smart attendance tracking and analytics system designed for educational institutions. The application provides role-based dashboards for Students, Faculty, Admin, and Kiosk users, each with specialized functionality for attendance management, analytics, and system administration. The system features real-time attendance monitoring, comprehensive reporting, and interactive data visualizations using modern web technologies.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Build System**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing with role-based navigation
- **State Management**: Component-level state with React hooks, TanStack Query for server state management
- **UI Framework**: Radix UI primitives with shadcn/ui component system for accessible, customizable components
- **Styling**: Tailwind CSS with custom design system based on Material Design principles

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for end-to-end type safety
- **API Design**: RESTful endpoints with role-specific routes for student, faculty, and admin operations
- **Database Integration**: Drizzle ORM for type-safe database operations and schema management
- **Session Management**: Express sessions with PostgreSQL session store

### Data Storage Solutions
- **Primary Database**: PostgreSQL with Neon serverless hosting
- **Schema Management**: Drizzle Kit for migrations and schema synchronization
- **Database Design**: Normalized schema with tables for students, faculty, subjects, sessions, attendance records, and system logs
- **Data Relationships**: Foreign key constraints ensuring referential integrity across entities

### Authentication and Authorization
- **Session-based Authentication**: Server-side sessions with role-based access control
- **Role Management**: Four distinct user roles (Student, Faculty, Admin, Kiosk) with specific permissions
- **Route Protection**: Role-based component rendering without traditional authentication gates (prototype mode)

### Design System
- **Color Palette**: Role-based accent colors (Student: Green, Faculty: Orange, Admin: Purple, Kiosk: Cyan)
- **Typography**: Inter font family with consistent weight hierarchy
- **Component Library**: Comprehensive shadcn/ui components with custom styling
- **Responsive Design**: Mobile-first approach with Tailwind's responsive utilities
- **Data Visualization**: Recharts library for interactive charts, graphs, and analytics displays

### Development Environment
- **Module System**: ES modules throughout the codebase
- **Path Mapping**: TypeScript path aliases for clean imports (@/, @shared/, @assets/)
- **Development Tools**: Runtime error overlay, Replit integration, and hot module replacement
- **Code Quality**: TypeScript strict mode, organized file structure, and component-based architecture

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM for UI rendering
- **TypeScript**: Full TypeScript support across client and server
- **Vite**: Modern build tool with plugin ecosystem
- **Express.js**: Node.js web application framework

### Database and ORM
- **Neon Database**: Serverless PostgreSQL hosting (@neondatabase/serverless)
- **Drizzle ORM**: Type-safe database operations (drizzle-orm, drizzle-zod)
- **Session Storage**: PostgreSQL session store (connect-pg-simple)

### UI and Styling
- **Radix UI**: Comprehensive primitive component library (@radix-ui/react-*)
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing
- **Recharts**: React charting library for data visualizations
- **Lucide React**: Icon library with consistent design
- **Class Variance Authority**: Component variant management

### Data Management
- **TanStack Query**: Server state management and caching (@tanstack/react-query)
- **React Hook Form**: Form handling with validation (@hookform/resolvers)
- **Date-fns**: Date manipulation and formatting utilities
- **Zod**: Schema validation and type inference

### Development Tools
- **Wouter**: Lightweight routing library for React
- **ESBuild**: Fast JavaScript bundler for production builds
- **Replit Integration**: Development environment optimizations (@replit/vite-plugin-*)

### Additional Libraries
- **Embla Carousel**: Carousel/slider component functionality (embla-carousel-react)
- **CMDK**: Command menu and search interface (cmdk)
- **clsx/tailwind-merge**: Conditional className utilities
- **Nanoid**: Unique ID generation for components and data