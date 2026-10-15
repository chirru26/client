# Product Requirements Document (PRD) & Architecture Brief

**Project Name**: Architect / Portfolio CMS Workbench  
**Codename**: `Chirru Workbench Enterprise`  
**Version**: `v2.4.0`  
**Lead Architect & Owner**: Chiranjit Das (Staff Distributed Systems & Full Stack Architect)  
**Status**: Production / Live Synchronized  
**Active Design Language**: Nordic Slate & Warm Amber Bronze (`#18181b` Slate, `#d97706` Amber, `#fbf8ff` Linen Canvas)

---

## 1. Executive Summary & Vision

The **Portfolio CMS Workbench** is a high-performance, developer-centric content management and telemetry platform designed for senior and staff software engineers. Departing from bloated generic blogging CMS templates, this workbench provides an append-only, cryptographically verified, and edge-distributed system to curate engineering projects, manage multi-persona CV editions, audit incoming recruiter/client inquiries, track real-time telemetry, and deploy portfolio static assets directly to CDN edge nodes.

### Core Objectives:
1. **Disciplined Minimalism**: High-density engineering UI providing immediate control over portfolio entities with zero visual clutter.
2. **Deterministic Control**: Cryptographic audit trails, SHA-256 asset hashing, and Git-backed state synchronizations.
3. **Multi-Viewport Consistency**: 1:1 functional parity across Desktop (1440px+) and Mobile (390px) form factors.
4. **Performance & Observability**: Real-time edge compute monitoring (Cloudflare Workers, Stockholm ARN-01 node) with sub-40ms global latency targets.

---

## 2. Target Personas

| Persona | Role | Primary Goals in Workbench |
| :--- | :--- | :--- |
| **Chiranjit Das (Admin)** | Primary Engineer & Owner | Rapidly curate showcase case studies, adjust skill proficiency ratings, stage CV releases, manage API webhooks, and triage high-value recruitment inquiries. |
| **Recruiters & Engineering Leaders** | External Consumers (Via Public Endpoints) | Review verified technical proficiencies, inspect verifiable GitHub/Docker/eBPF case studies, and download targeted CV editions (Staff Architect vs. Backend Specialist). |
| **System Automation & Webhooks** | CI/CD Pipelines & Scrapers | Stream telemetry events, re-validate edge caches on Git commit, and mirror audit logs to decentralized ledger endpoints. |

---

## 3. Product Architecture & Modules (The 16 Functional Domains)

The system is partitioned into five distinct operational quadrants spanning 16 cohesive feature hubs:

```
┌────────────────────────────────────────────────────────────────────────┐
│                      PORTFOLIO CMS WORKBENCH (v2.4.0)                  │
├─────────────────┬──────────────────┬─────────────────┬────────────────┤
│ 1. Core Ops     │ 2. Credentials   │ 3. Assets & Docs│ 4. System Infra│
├─────────────────┼──────────────────┼─────────────────┼────────────────┤
│ • Admin Login   │ • Skills Matrix  │ • Media Vault   │ • Settings     │
│ • Main Dashboard│ • Experience     │ • Resume Center │ • Audit Logs   │
│ • Projects Hub  │ • Education      │ • Taxonomy Tags │ • Alerts/Notifs│
│ • Inquiries     │ • Certifications │                 │ • Analytics    │
│ • Profile & Bio │                  │                 │ • Command Menu │
└─────────────────┴──────────────────┴─────────────────┴────────────────┘
```

### Module Breakdown:

### 3.1 Authentication & Security (`/auth`)
- **FIDO2 WebAuthn / Touch ID Enclave**: Zero-friction biometric acceleration for mobile and desktop.
- **Credential Fallback**: Primary Admin key verification with TLS 1.3 enforced and 14-day persistent token session.
- **Cluster Status Indicator**: Live handshake monitor displaying datacenter health (`eu-west-1 healthy · 14ms`).

### 3.2 Main Dashboard Hub (`/dashboard`)
- **Executive Masthead**: Displaying active engineer avatar, git branch stamp, and instantaneous "Available for Opportunities" public toggle.
- **Omnibar Dispatch**: Quick actions for `+ New Project`, `Update Bio`, and `Check Inbox`.
- **Telemetry Counter Matrix**: Active Projects (`02`), Competencies (`12`), Unread Inquiries (`03`), and Target Roles (`00`).
- **Live Inquiries Triage**: Instant triage queue showing recruiter origin, project scope, and priority flags.
- **Edge Node Status**: Live monitoring of Stockholm ARN-01 compute load (18.4%) and build validation timestamps.

### 3.3 Projects Showcase Hub (`/projects`)
- **Authoring Engine**: Form schema capturing Project Title, 16:9 Cover Image, Stack Tags, Live Demo URL, GitHub Repo, and Markdown architectural write-ups.
- **Hero Pinning**: Dynamic promotion of flagship repositories to the public landing page hero position.
- **Repository Registry**: Filterable list by *All Projects*, *Drafts*, and *Archived* with drag-and-drop reordering priority.

### 3.4 Inquiries & Communications Inbox (`/inquiries`)
- **Multi-Channel Triage**: Real-time filtering across *Recruiter / Direct Hire*, *Consulting / Advisory*, and *Speaking Engagements*.
- **Direct Dispatch Actions**: One-click response execution (*Send Calendar Link*, *Request Job Spec*, *Polite Decline*).
- **Security & Integrity**: SPF/DKIM authenticated origin verification and PGP signature attachments.

### 3.5 Profile & Core Persona Hub (`/profile`)
- **Identity & CDN Sync**: High-resolution Cloudinary avatar pipeline (auto WebP/AVIF generation).
- **Recruiter Availability Matrix**: Granular status checkboxes for *Remote (Global)*, *Contract / Advisory*, and *Relocation*.
- **Markdown Bio Manifest**: Live character-counted biography editor with rendered preview synchronization.

### 3.6 Technical Skills & Stacks Matrix (`/skills`)
- **Proficiency Index**: Quantitative mastery slider (Working Knowledge 70% to Architectural Mastery 90%+).
- **Categorized Clusters**: Grouped classifications (Backend & Distributed Systems, Frontend & UI, DevOps & Cloud, Storage & Databases).
- **Project Cross-Referencing**: Automatic tagging connecting skills directly to case study repositories.

### 3.7 Work Experience & Career Milestones (`/experience`)
- **Chronological Milestones**: Time-stamped appointments documenting titles, organizations, and location policies (Stockholm / Hybrid).
- **Architectural Deliverables**: Granular bullet point manager for measurable impacts (e.g. *"Cutting p99 tail latency from 142ms to 18ms"*).
- **Toolchain Association**: Stack badges bound to each individual appointment.

### 3.8 Education & Academic Credentials (`/education`)
- **Accredited Degree Registry**: Managing formal university degrees (B.Tech CSE, Diploma in Mechanical Engineering).
- **Capstone & Research Index**: Archiving research papers, honors classifications (GPA 8.9 / 10.0 First Class Distinction), and cryptographic transcript scan attachments.

### 3.9 Certifications Hub (`/certifications`)
- **Credential Verification**: Automated Credly and AWS/CNCF validation link integration.
- **Live Compliance Monitor**: 100% active compliance tracking with expiration warnings.
- **Digital Badge Vault**: High-resolution vector badge asset storage.

### 3.10 Resume Editions & CV Distribution Hub (`/resumes`)
- **Target Persona Editions**: Dynamic compiling of targeted resumes (Staff Architect vs. Backend Specialist vs. Core Infrastructure).
- **Distribution Analytics**: Ingestion telemetry tracking download vectors (LinkedIn 54%, Direct CLI 32%, GitHub 14%).
- **Active Release Pin**: Instantaneous redirection of canonical endpoint `/resume.pdf` to the active release with cryptographic SHA-256 digest copying.

### 3.11 Media & Documents Vault (`/media`)
- **Cloudinary CDN Bridge**: Ingestion with auto-optimization for responsive `srcset` (320w to 1920w) and EXIF metadata stripping.
- **Capacity Monitoring**: 20 GB allocation monitor tracking asset counts and bandwidth usage.

### 3.12 Project Tags & Taxonomy Engine (`/tags`)
- **Structured Categories**: Standardized tagging schemas (*Architecture Pattern*, *Technology*, *Domain*, *Protocol*).
- **Cache Invalidation**: Single-click re-indexing of static site project index tags.

### 3.13 Notifications & Alert Dispatch Center (`/notifications`)
- **Telemetry Broadcasting**: Multi-target composer dispatching public banners, internal admin alerts, and Discord/Slack webhooks.
- **Real-Time Stream**: SSE (Server-Sent Events) live log inspector capturing deployment builds, rate limit alerts, and edge purges.

### 3.14 Analytics & Traffic Hub (`/analytics`)
- **Traffic Velocity Engine**: Time-bucketed graph analytics (24h, 7d, 30d, 90d, 1y) charting page views against unique visitors.
- **Project Consumption Ranking**: Ranking case studies by organic developer views and repository click-through rates.
- **Edge Performance**: Cloudflare edge metrics (99.4% cache hit ratio, 34ms TTFB).

### 3.15 Audit Logs & Security Trail (`/audit`)
- **SHA-256 Immutable Ledger**: Append-only log recording user mutations, IP origins, controller actions, and timestamps.
- **Merkle Tree Proof**: CLI verification script generator for zero-knowledge external auditing.

### 3.16 Site & CMS Runtime Settings (`/settings`)
- **Portfolio Identity Config**: Domain resolution (`chiranjit.dev`), SSL health check, and maintenance mode toggling.
- **Edge Cache Policies**: Cloudflare worker TTL windows (12h, 24h, 7d) and instantaneous edge purge.
- **Secret Management**: PAT token rotation and webhook endpoint registrations.

---

## 4. Technical Specifications & Design System

### 4.1 Design Tokens (Nordic Slate & Amber)
- **Primary / Canvas Surface**: `#fbf8ff` (Crisp linen white)
- **Primary Ink / Slate Text**: `#18181b` (Deep Nordic zinc/slate)
- **Accent Bronze / Amber**: `#d97706` / `#b45309` (Active badges, live indicators, primary actions)
- **Neutral Container Surfaces**: `#f4f2fd` (Container Low), `#dad9e3` (Container Dim)
- **Typography**: `Plus Jakarta Sans` for clean, modern editorial display, coupled with monospace font families for hashes, tokens, and technical telemetry.
- **Elevation**: Disciplined zero-shadow flat borders (`1px solid var(--outline-variant)`).

### 4.2 Responsive Layout Standards
- **Desktop (1440px - 2880px)**:
  - Persistent 260px docked Left Rail Navigation with hierarchical module grouping.
  - Top Command Bar (64px) with Omnibar search, system environment badge, and quick deployment buttons.
  - Generous 1200px - 1400px centered content canvases.
- **Mobile (390px - 430px)**:
  - Sticky top header with breadcrumb path and system status.
  - Single-column high-density form and card layouts.
  - Persistent bottom dock navigation bar for top-level operational domains.

---

## 5. Non-Functional Requirements & Metrics

| Category | Requirement | Target Metric |
| :--- | :--- | :--- |
| **Performance** | Time-to-First-Byte (TTFB) on Edge | $\le 40\text{ ms}$ globally across 310+ PoPs |
| **Security** | WebAuthn FIDO2 & SHA-256 Verification | $100\%$ mutations signed & cryptographically verifiable |
| **Uptime** | Cloudflare Workers Edge Node Availability | $\ge 99.98\%$ monthly SLA |
| **Responsive Parity** | Desktop vs. Mobile Feature Availability | $100\%$ feature parity (All 16 functional hubs present) |
| **Accessibility** | WCAG 2.1 Contrast & Touch Targets | AAA contrast compliance on text, $\ge 44\text{px}$ touch targets |

---

## 6. Implementation & Deployment Status

- **Total Screens Delivered**: **30 Screens** (17 Desktop Editions + 13 Mobile Companion Views).
- **Design System Registered**: `Nordic Slate & Amber` (System ID: `{{DATA:DESIGN_SYSTEM:DESIGN_SYSTEM_1}}`).
- **Production Asset Readiness**: Ready for full frontend export into React/Next.js and Tailwind CSS token architectures.
