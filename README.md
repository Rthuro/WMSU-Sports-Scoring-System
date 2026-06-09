<p align="center">
  <img src="frontend/src/assets/WMSU.png" alt="WMSU Logo" width="120" />
</p>

<h1 align="center">🏆 WMSU Sports Event Scoring System</h1>

<p align="center">
  <em>A full-stack web application for managing sports events, tournaments, matches, and real-time scoring at Western Mindanao State University.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Express-5.2.1-000000?logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Neon-PostgreSQL-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Socket.IO-4.8.3-010101?logo=socket.io&logoColor=white" alt="Socket.IO" />
  <img src="https://img.shields.io/badge/Firebase-Auth-FFCA28?logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.1-06B6D4?logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white" alt="Docker" />
</p>

<p align="center">
  <a href="https://wmsu-sports-system.vercel.app/">
    <img src="https://img.shields.io/badge/🌐_Live_Demo-wmsu--sports--system.vercel.app-00C853?style=for-the-badge" alt="Live Website" />
  </a>
</p>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Smart Campus Initiative](#-smart-campus-initiative)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Database Schema](#-database-schema)
- [API Reference](#-api-reference)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)

---

## 📖 About the Project

This project was developed as part of the **Practicum / Industry Immersion (CS 141)** course at **Western Mindanao State University (WMSU)**. It was built to digitize and modernize the sports event management and scoring operations of the **University Sports Development Office (USDO)**.

The system was developed by a **team of two**, where I served as the **Full-Stack Developer** and was the **sole contributor to all coding activities** — encompassing the complete frontend, backend, database design, real-time features, authentication, cloud infrastructure, and deployment pipeline.

### Key Context

| Detail              | Description                                                    |
| ------------------- | -------------------------------------------------------------- |
| **Institution**     | Western Mindanao State University (WMSU)                       |
| **Program**         | Practicum / Industry Immersion (CS 141)                        |
| **Assigned Office** | University Sports Development Office (USDO)                    |
| **Team Size**       | 2 members                                                      |
| **My Role**         | Full-Stack Developer (sole code contributor)                   |
| **Directive**       | Presidential mandate to transform WMSU into a **Smart Campus** |

---

## 🏫 Smart Campus Initiative

This project is a direct response to a directive from the **President of Western Mindanao State University** to modernize the institution into a **Smart Campus** — equipping university offices and faculties with modern, technology-driven systems to replace manual and paper-based processes.

As part of this initiative, our team was assigned to the **University Sports Development Office** to propose and build a system that would:

- **Eliminate manual scorekeeping** — replacing paper-based tallying with a digital, real-time scoring platform.
- **Centralize sports data management** — providing a unified system for managing events, tournaments, teams, players, and match records.
- **Enable real-time broadcasting** — allowing live score updates to be pushed to spectators and stakeholders via WebSocket connections.
- **Provide public-facing transparency** — offering a public portal where students, faculty, and the community can view ongoing events, schedules, and results.
- **Support data-driven decision making** — through comprehensive statistics tracking, player analytics, and tournament reporting with PDF export capabilities.

This system serves as one of the foundational modules in WMSU's broader Smart Campus transformation.

---

## ✨ Features

### 🔐 Authentication & Authorization

- Email/password authentication with **bcrypt** hashing
- **Google OAuth** via Firebase Authentication
- **JWT**-based session management with 7-day token expiry
- Role-based access control (**Super Admin** / **Admin**)
- Protected admin routes with automatic redirect
- Admin account management (CRUD) by super admins

### 🏅 Sports Management

- Create, edit, and soft-delete sports with customizable configurations
- Define **scoring point types** per sport (e.g., goals, 3-pointers, aces)
- Configure **set/period rules** (e.g., quarters, halves, sets) with points-to-win thresholds
- Manage **player positions** per sport
- Define **penalty types** and **custom statistics** per sport
- Upload sport images via **Cloudinary** CDN

### 🏟️ Event Management

- Create and manage university-wide sporting events
- Track event status and lifecycle
- Associate tournaments and matches to events
- **Event awards** tracking system

### 🏆 Tournament Engine

- Support for three bracketing formats:
  - **Single Elimination** — automatic bracket generation with BYE handling
  - **Double Elimination** — upper bracket, lower bracket, and grand final generation
  - **Round Robin** — all-play-all match matrix generation
- Team registration and seeding (randomized)
- Tournament-level **team tally** tracking (wins, losses, draws)
- Visual **tournament bracket preview** via `react-tournament-brackets`

### ⚽ Match & Scoring System

- Create matches with team/player assignments
- **Set-based scoring** (supports multi-set matches like volleyball, tennis, etc.)
- **Real-time score updates** via Socket.IO WebSocket rooms
- Match participants management
- Per-match player statistics recording
- Per-match player penalty tracking
- Live match details view with interactive scoreboard

### 👥 Team Management

- Create and manage teams per sport, event, and department
- Roster management — add/remove players to team rosters
- Team profile pages with full roster and match history
- Department-based team organization

### 🏃 Player Management

- Player registration with profile details (name, gender, course, year)
- Player-to-team assignment tracking
- Per-match **player statistics** recording and aggregation
- Per-match **penalty tracking** with type classification
- Filterable player stats tables

### 🏢 Department Management

- Manage university departments/colleges
- Department-based team grouping and filtering

### 📊 Public Portal

- **Public-facing website** with responsive navigation
- Public home page with highlights and announcements
- Browse all sports, events, and departments
- View live and past tournament brackets and results
- Interactive **event calendar** (date picker-based)
- **Article/news management** system for USDO announcements
- **Website settings** customization by administrators

### 📄 Reporting & Export

- **PDF generation** via jsPDF with auto-table support
- **Image export** of scoreboards and brackets (html-to-image, dom-to-image-more, html2canvas-pro)
- Comprehensive data tables with filtering and sorting

### ⚡ Real-Time Features

- **Socket.IO** integration for live score broadcasting
- Room-based architecture (per-match and per-tournament rooms)
- Singleton socket connection with ref-counted lifecycle management
- Auto-reconnection with exponential backoff

### 📱 Responsive Design

- Mobile-first responsive layout with Tailwind CSS v4
- Collapsible sidebar navigation (admin panel)
- Mobile hamburger menu with **Framer Motion** animations (public site)
- Touch-friendly interactive components via **Radix UI** primitives

---

## 🛠️ Tech Stack

### Frontend

| Technology           | Version  | Purpose                                         |
| -------------------- | -------- | ----------------------------------------------- |
| **React**            | 19.1.0   | UI library with hooks and functional components |
| **Vite**             | 6.3.5    | Build tool and dev server                       |
| **Tailwind CSS**     | 4.1.10   | Utility-first CSS framework                     |
| **Zustand**          | 5.0.5    | Lightweight state management (12 stores)        |
| **React Router DOM** | 7.6.2    | Client-side routing (HashRouter)                |
| **React Hook Form**  | 7.72.1   | Form state management with Zod resolver         |
| **Zod**              | 4.3.6    | Schema validation (shared with backend)         |
| **Socket.IO Client** | 4.8.3    | Real-time WebSocket communication               |
| **Axios**            | 1.14.0   | HTTP client for API requests                    |
| **Radix UI**         | Multiple | Accessible, unstyled component primitives       |
| **Framer Motion**    | 12.38.0  | Animation library                               |
| **Recharts**         | 3.8.0    | Data visualization / charting                   |
| **Lucide React**     | 0.515.0  | Icon library                                    |
| **Tabler Icons**     | 3.41.1   | Additional icon set                             |
| **Firebase**         | 12.12.1  | Google OAuth authentication (client SDK)        |
| **jsPDF**            | 3.0.4    | PDF report generation                           |
| **date-fns**         | 4.1.0    | Date utility library                            |

### Backend

| Technology          | Version | Purpose                               |
| ------------------- | ------- | ------------------------------------- |
| **Express**         | 5.2.1   | Web framework (latest v5)             |
| **Node.js**         | 20.x    | JavaScript runtime                    |
| **Neon Serverless** | 1.0.1   | Serverless PostgreSQL driver          |
| **Socket.IO**       | 4.8.3   | Real-time WebSocket server            |
| **Firebase Admin**  | 13.8.0  | Server-side Google token verification |
| **bcrypt**          | 6.0.0   | Password hashing                      |
| **jsonwebtoken**    | 9.0.3   | JWT generation and verification       |
| **Zod**             | 4.3.6   | Request body/params validation        |
| **Cloudinary**      | 1.41.3  | Image upload and CDN                  |
| **Multer**          | 2.1.1   | Multipart form data handling          |
| **Helmet**          | 8.1.0   | HTTP security headers                 |
| **Morgan**          | 1.10.0  | HTTP request logging                  |
| **CORS**            | 2.8.5   | Cross-origin resource sharing         |

### Database & Infrastructure

| Technology            | Purpose                                      |
| --------------------- | -------------------------------------------- |
| **PostgreSQL (Neon)** | Serverless relational database               |
| **Cloudinary**        | Image storage and CDN                        |
| **Firebase**          | Authentication provider (Google OAuth)       |
| **Docker**            | Containerized deployment (multi-stage build) |
| **Vercel**            | Frontend deployment                          |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  React 19 + Vite + Tailwind CSS v4                        │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────────┐  │  │
│  │  │ Zustand   │ │ React    │ │ Socket.IO│ │ Firebase    │  │  │
│  │  │ Stores(12)│ │ Router   │ │ Client   │ │ Auth Client │  │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └─────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────────┘
                           │  HTTP (REST) + WebSocket
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                     SERVER (Express v5)                          │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Middleware: Helmet │ CORS │ Morgan │ Zod Validation     │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │  Routes (9 main + 13 sub-routes)                         │    │
│  │  ├── /api/accounts    ├── /api/sports                    │    │
│  │  ├── /api/events      ├── /api/tournaments               │    │
│  │  ├── /api/match       ├── /api/players                   │    │
│  │  ├── /api/teams       ├── /api/departments               │    │
│  │  ├── /api/upload      ├── /api/articles                  │    │
│  │  └── /api/public      └── ...sub-resources               │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │  Controllers → Repositories (Data Access Layer)          │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │  Socket.IO Server (Room-based: match:{id}, tournament:{id})│  │
│  ├─────────────────────────────────────────────────────────┤    │
│  │  Global Error Handler (AppError + operational/unknown)    │    │
│  └─────────────────────────────────────────────────────────┘    │
└──────────────────────────┬──────────────────────────────────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
     ┌──────────────┐ ┌────────┐ ┌───────────┐
     │ Neon Postgres │ │Firebase│ │Cloudinary │
     │ (Serverless)  │ │ Admin  │ │  (CDN)    │
     │ 20+ Tables    │ │ (Auth) │ │ (Images)  │
     └──────────────┘ └────────┘ └───────────┘
```

### Architectural Patterns

- **Repository Pattern** — Data access logic is encapsulated in repository modules (`*Repo.js`), decoupled from controllers.
- **Controller Pattern** — Business logic resides in controllers, which delegate data operations to repositories.
- **Middleware Pipeline** — Express middleware chain for validation (Zod), error handling, CORS, security headers, and logging.
- **Singleton Socket Manager** — Socket.IO instance is initialized once and shared via `getIO()` accessor.
- **Store-per-Domain** — Frontend uses 12 Zustand stores, each managing a distinct domain entity's state and API calls.
- **Soft Delete** — All major entities support soft delete via `is_deleted` flag rather than physical deletion.

---

## 🗄️ Database Schema

The system uses **20+ PostgreSQL tables** managed through auto-initialization on server startup. Key entities:

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   accounts   │     │  departments │     │    events     │
│──────────────│     │──────────────│     │──────────────│
│ account_id   │     │ department_id│     │ event_id     │
│ first_name   │     │ name         │     │ name         │
│ last_name    │     │ is_deleted   │     │ is_deleted   │
│ email        │     └──────────────┘     └──────┬───────┘
│ password_hash│                                  │
│ role         │     ┌──────────────┐     ┌──────┴───────┐
│ is_deleted   │     │    sports    │     │ tournaments  │
└──────────────┘     │──────────────│     │──────────────│
                     │ sport_id     │◄────│ sport_id     │
                     │ name         │     │ event_id     │
                     │ is_deleted   │     │ name         │
                     └──────┬───────┘     │ bracketing   │
                            │             │ is_deleted   │
              ┌─────────────┼──────┐      └──────┬───────┘
              ▼             ▼      ▼             │
     ┌──────────────┐ ┌────────┐ ┌────────┐     │
     │scoring_points│ │set_rules│ │penalty │     │
     │              │ │        │ │_types  │     │
     └──────────────┘ └────────┘ └────────┘     │
                                                 │
     ┌──────────────┐     ┌──────────────┐      │
     │    teams     │     │   matches    │◄─────┘
     │──────────────│     │──────────────│
     │ team_id      │◄───│ team_a_id    │
     │ sport_id     │    │ team_b_id    │
     │ event_id     │    │ sport_id     │
     │ department_id│    │ is_deleted   │
     │ is_deleted   │    └──────┬───────┘
     └──────┬───────┘           │
            │            ┌──────┴───────┐
            │            ▼              ▼
     ┌──────┴───────┐ ┌────────────┐ ┌─────────────────┐
     │   players    │ │match_points│ │match_participants│
     │──────────────│ │────────────│ │─────────────────│
     │ player_id    │ │ set_number │ │ match_id        │
     │ sport_id     │ │ a_score    │ │ team_id         │
     │ gender       │ │ b_score    │ └─────────────────┘
     │ is_deleted   │ └────────────┘
     └──────────────┘

  Additional tables: player_teams, player_stats, player_penalties,
  tournament_teams, tournament_matches, tournament_tally,
  sports_position, stats, event_awards, articles, website_settings
```

### Key Constraints

- **CHECK constraints** on roles (`super_admin`, `admin`), gender (`Male`, `Female`), bracketing types, and numeric fields (scores ≥ 0, rounds > 0)
- **Foreign key indexes** on all relationship columns for query performance
- **Soft delete** columns on all major entities

---

## 📡 API Reference

The backend exposes a RESTful API with **22 route groups**:

### Core Resources

| Method   | Endpoint               | Description                        |
| -------- | ---------------------- | ---------------------------------- |
| `POST`   | `/api/accounts/signup` | Register a new admin account       |
| `POST`   | `/api/accounts/login`  | Authenticate with email/password   |
| `POST`   | `/api/accounts/google` | Authenticate via Google (Firebase) |
| `GET`    | `/api/accounts`        | List all admin accounts            |
| `PUT`    | `/api/accounts/:id`    | Update an account                  |
| `DELETE` | `/api/accounts/:id`    | Soft-delete an account             |

### Sports

| Method           | Endpoint               | Description                    |
| ---------------- | ---------------------- | ------------------------------ |
| `GET/POST`       | `/api/sports`          | List / Create sports           |
| `GET/PUT/DELETE` | `/api/sports/:id`      | Get / Update / Delete a sport  |
| `GET/POST`       | `/api/scoring-points`  | Manage scoring point types     |
| `GET/POST`       | `/api/set-rules`       | Manage set/period rules        |
| `GET/POST`       | `/api/penalties`       | Manage penalty types           |
| `GET/POST`       | `/api/sport-positions` | Manage player positions        |
| `GET/POST`       | `/api/stats`           | Manage custom stat definitions |

### Events & Tournaments

| Method           | Endpoint                  | Description                          |
| ---------------- | ------------------------- | ------------------------------------ |
| `GET/POST`       | `/api/events`             | List / Create events                 |
| `GET/PUT/DELETE` | `/api/events/:id`         | Get / Update / Delete an event       |
| `GET/POST`       | `/api/tournaments`        | List / Create tournaments            |
| `GET/POST`       | `/api/tournament-teams`   | Manage tournament team registrations |
| `GET/POST`       | `/api/tournament-matches` | Manage tournament bracket matches    |
| `GET/POST`       | `/api/tournament-tally`   | Track tournament standings           |

### Matches & Scoring

| Method           | Endpoint                  | Description                   |
| ---------------- | ------------------------- | ----------------------------- |
| `GET/POST`       | `/api/match`              | List / Create matches         |
| `GET/PUT/DELETE` | `/api/match/:id`          | Get / Update / Delete a match |
| `GET/POST`       | `/api/match-points`       | Manage per-set scores         |
| `GET/POST`       | `/api/match-participants` | Manage match rosters          |

### Players & Teams

| Method           | Endpoint                | Description                        |
| ---------------- | ----------------------- | ---------------------------------- |
| `GET/POST`       | `/api/players`          | List / Create players              |
| `GET/PUT/DELETE` | `/api/players/:id`      | Get / Update / Delete a player     |
| `GET/POST`       | `/api/player-team`      | Manage player-team assignments     |
| `GET/POST`       | `/api/player-stats`     | Record per-match player statistics |
| `GET/POST`       | `/api/player-penalties` | Record per-match player penalties  |
| `GET/POST`       | `/api/teams`            | List / Create teams                |

### Public & CMS

| Method     | Endpoint        | Description                     |
| ---------- | --------------- | ------------------------------- |
| `GET`      | `/api/public`   | Public data endpoints (no auth) |
| `GET/POST` | `/api/articles` | Manage news articles            |
| `POST`     | `/api/upload`   | Upload images to Cloudinary     |

---

## 📁 Project Structure

```
WMSU-Sports-Event-Scoring-System/
├── backend/
│   ├── config/
│   │   ├── init/                  # Database table initialization scripts
│   │   │   ├── init.js            # Orchestrates all table creation
│   │   │   ├── migration.sql      # Migration script (indexes, constraints)
│   │   │   ├── accounts.js        # Accounts table DDL
│   │   │   ├── sports.js          # Sports + sub-tables DDL
│   │   │   ├── events.js          # Events + awards DDL
│   │   │   ├── tournaments.js     # Tournaments + matches/teams/tally DDL
│   │   │   ├── matches.js         # Matches + participants/points DDL
│   │   │   ├── players.js         # Players + teams/stats/penalties DDL
│   │   │   ├── teams.js           # Teams table DDL
│   │   │   ├── departments.js     # Departments table DDL
│   │   │   ├── stats.js           # Custom stats table DDL
│   │   │   └── public.js          # Articles + website settings DDL
│   │   ├── db.js                  # Neon PostgreSQL connection
│   │   ├── firebase.js            # Firebase Admin initialization
│   │   └── cloudinary.js          # Cloudinary + Multer storage config
│   ├── controllers/               # Request handlers (business logic)
│   │   ├── accountController.js   # Auth (signup, login, Google OAuth)
│   │   ├── sportController.js     # Sports CRUD
│   │   ├── eventController.js     # Events CRUD
│   │   ├── tournamentController.js# Tournaments + bracket generation
│   │   ├── matchController.js     # Matches CRUD
│   │   ├── playerController.js    # Players CRUD
│   │   ├── teamController.js      # Teams CRUD
│   │   ├── departmentController.js# Departments CRUD
│   │   ├── uploadController.js    # Image upload handler
│   │   ├── matches/               # Match sub-resource controllers
│   │   ├── players/               # Player sub-resource controllers
│   │   ├── sports/                # Sport sub-resource controllers
│   │   ├── tournaments/           # Tournament sub-resource controllers
│   │   └── public/                # Public/CMS controllers
│   ├── repositories/              # Data access layer (SQL queries)
│   │   ├── accountRepo.js
│   │   ├── sportRepo.js
│   │   ├── eventRepo.js
│   │   ├── tournamentRepo.js
│   │   ├── matchRepo.js
│   │   ├── playerRepo.js
│   │   ├── teamRepo.js
│   │   ├── departmentRepo.js
│   │   ├── bracketLogic.js        # Single-elimination bracket generator
│   │   ├── bracketLogic2.js       # SE + DE + Round Robin bracket generator
│   │   └── ...sub-resource repos
│   ├── routes/                    # Express route definitions
│   │   ├── accountRoutes.js
│   │   ├── sportRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── tournamentRoutes.js
│   │   ├── matchRoutes.js
│   │   ├── playerRoutes.js
│   │   ├── teamRoutes.js
│   │   ├── departmentRoutes.js
│   │   ├── uploadRoutes.js
│   │   ├── sports/                # Sport sub-resource routes
│   │   ├── players/               # Player sub-resource routes
│   │   ├── matches/               # Match sub-resource routes
│   │   ├── tournaments/           # Tournament sub-resource routes
│   │   └── public/                # Public-facing routes
│   ├── middleware/
│   │   ├── errorHandler.js        # AppError class + global error middleware
│   │   └── validate.js            # Zod schema validation middleware
│   ├── validators/                # Zod schemas for request validation
│   │   ├── sportSchema.js
│   │   ├── matchSchema.js
│   │   ├── teamSchema.js
│   │   ├── tournamentSchema.js
│   │   └── commonSchemas.js       # Shared schemas (event, account, etc.)
│   ├── server.js                  # Express app entry point
│   ├── socketManager.js           # Socket.IO initialization & room mgmt
│   ├── Dockerfile                 # Multi-stage Docker build
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                # Root component with routing
│   │   ├── Layout.jsx             # Admin layout (sidebar + header)
│   │   ├── PublicLayout.jsx       # Public layout (navbar)
│   │   ├── main.jsx               # React DOM entry point
│   │   ├── index.css              # Global styles + Tailwind directives
│   │   ├── firebase.js            # Firebase client config
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Admin dashboard
│   │   │   ├── Settings.jsx       # Admin settings
│   │   │   ├── Sport/             # Sport management pages (5 pages)
│   │   │   ├── Event/             # Event management pages (2 pages)
│   │   │   ├── Tournament/        # Tournament management pages (3 pages)
│   │   │   ├── Match/             # Match management pages (2 pages)
│   │   │   ├── Player/            # Player management pages (3 pages)
│   │   │   ├── Team/              # Team management pages (3 pages)
│   │   │   ├── Admin/             # Admin user management (1 page)
│   │   │   ├── Website/           # Website/CMS management (1 page)
│   │   │   └── Public/            # Public-facing pages (8 pages)
│   │   ├── components/
│   │   │   ├── ui/                # 61 reusable UI components (Radix-based)
│   │   │   └── custom/            # 23 domain-specific components
│   │   ├── store/                 # 12 Zustand stores
│   │   │   ├── useAuthStore.js    # Authentication state
│   │   │   ├── useSportsStore.js  # Sports data & API calls
│   │   │   ├── useMatchStore.js   # Match data & API calls
│   │   │   ├── usePlayerStore.js  # Player data & API calls
│   │   │   ├── useTeamStore.js    # Team data & API calls
│   │   │   ├── useTournamentStore2.js # Tournament data & API calls
│   │   │   ├── useEventStore.js   # Event data & API calls
│   │   │   ├── useDepartmentStore.js  # Department data
│   │   │   ├── useAdminStore.js   # Admin management
│   │   │   ├── usePublicStore.js  # Public portal data
│   │   │   ├── useImageUpload.js  # Image upload state
│   │   │   └── usePageStore.js    # Navigation state
│   │   ├── hooks/
│   │   │   ├── useSocket.js       # Singleton Socket.IO hook
│   │   │   └── use-mobile.js      # Mobile detection hook
│   │   ├── lib/
│   │   │   ├── api.js             # Axios instance configuration
│   │   │   ├── helpers.js         # Utility functions
│   │   │   └── utils.js           # Class name utilities (cn)
│   │   ├── data/                  # Static data & configuration
│   │   └── assets/                # Images, fonts, logos
│   ├── index.html                 # HTML entry point
│   ├── vite.config.js             # Vite + React + Tailwind config
│   ├── components.json            # shadcn/ui configuration
│   └── package.json
│
├── package.json                   # Root monorepo scripts
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20.x
- **npm** ≥ 9.x
- A **Neon PostgreSQL** database (or any PostgreSQL instance)
- A **Firebase** project (for Google OAuth)
- A **Cloudinary** account (for image uploads)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Rthuro/WMSU-Sports-Scoring-System.git
   cd WMSU-Sports-Scoring-System
   ```

2. **Install all dependencies:**

   ```bash
   npm run install-all
   ```

   This runs `npm install` in both the `backend/` and `frontend/` directories.

3. **Set up environment variables** (see [Environment Variables](#-environment-variables) below).

4. **Start the development servers:**

   ```bash
   npm run dev
   ```

   This uses `concurrently` to start both:
   - Backend: Express server with `nodemon` (hot reload) on `http://localhost:3000`
   - Frontend: Vite dev server on `http://localhost:5173`

5. **Database initialization** happens automatically on server startup — all tables are created if they don't exist.

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

```env
# Database (Neon PostgreSQL)
PGHOST=your-neon-host.neon.tech
PGDATABASE=your_database_name
PGUSER=your_database_user
PGPASSWORD=your_database_password

# Authentication
JWT_SECRET=your-jwt-secret-key

# Firebase (for Google OAuth verification)
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Server
PORT=3000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (`frontend/.env.local`)

```env
# API
VITE_API_URL=http://localhost:3000

# Firebase
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

---

## 🐳 Deployment

### Docker (Backend)

The backend includes a production-ready multi-stage Dockerfile:

```bash
cd backend
docker build -t wmsu-sports-backend .
docker run -p 10000:10000 --env-file .env wmsu-sports-backend
```

Key Docker features:

- **Multi-stage build** — separate builder and runtime stages for minimal image size
- **Non-root user** — runs as the `node` user for security
- **Production optimized** — only production dependencies installed

### Frontend (Vercel)

The frontend is configured for deployment on **Vercel**:

```bash
cd frontend
npm run build    # Outputs to frontend/dist/
```

---

<p align="center">
  <strong>Built for WMSU's Smart Campus Initiative</strong><br/>
  <em>University Sports Development Office — Western Mindanao State University</em>
</p>
