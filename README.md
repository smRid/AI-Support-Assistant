<div align="center">

<img src="./public/chatbot_profile.png" alt="SupportAI assistant" width="92" />

# SupportAI

### AI-Powered Customer Support for Any Product or Service

SupportAI helps teams build, train, test, and deploy an intelligent customer
support assistant for physical items, digital products, software, and services.
Add knowledge from websites, CSV files, FAQs, policies, and internal notes;
organize it into topic-aware sections; customize the assistant; embed it on any
website; and manage customer conversations from one focused workspace.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_SupportAI-2ea44f?style=for-the-badge)](https://aws-chat-bot.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16.4-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Clerk](https://img.shields.io/badge/Clerk-Authentication-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com/)
[![Neon](https://img.shields.io/badge/Neon-PostgreSQL-00E599?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-AI_Responses-6467F2?style=for-the-badge)](https://openrouter.ai/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://aws-chat-bot.vercel.app/)

</div>

---

## Preview

<p align="center">
  <img src="./public/preview1.png" alt="SupportAI dashboard overview" width="1000" />
</p>

<p align="center">
  <img src="./public/preview2.png" alt="SupportAI chatbot playground and appearance settings" width="1000" />
</p>

<p align="center">
  <img src="./public/preview3.png" alt="SupportAI knowledge base management" width="1000" />
</p>

> **Live site:** [https://aws-chat-bot.vercel.app/](https://aws-chat-bot.vercel.app/)

---

## Features

| Feature | Description |
| :-- | :-- |
| **Clerk Authentication** | Hosted sign-up and sign-in, protected application routes, user synchronization, and secure server-side session handling |
| **Organization Workspaces** | Personal and shared workspaces with organization-aware data access and owner/member resolution |
| **Guided Workspace Setup** | Collect a business name, primary website, and supporting links through a focused onboarding flow |
| **Website Knowledge Ingestion** | Store website sources and optionally crawl rendered pages through ZenRows before cleaning and summarizing their content |
| **CSV & Manual Knowledge** | Upload CSV datasets or add FAQs, product details, policies, documentation, and internal notes manually |
| **AI Knowledge Summaries** | Compress imported content into dense support context through OpenRouter while retaining a clean fallback when summarization fails |
| **Topic-Based Sections** | Group selected knowledge sources by topic with strict, neutral, friendly, or empathetic response tones |
| **Chatbot Playground** | Test section-aware responses before deployment and reset the simulated conversation at any time |
| **Appearance Customization** | Configure the assistant's primary color and welcome message from the dashboard |
| **Embeddable Support Widget** | Add the assistant to an external website with a lightweight script and dynamically resized iframe |
| **Short-Lived Widget Sessions** | Issue signed two-hour JWT sessions for public widget configuration and chat requests |
| **Conversation Inbox** | Review visitor conversations, load full message history, search threads, and send human replies |
| **Conversation Persistence** | Save visitor and assistant messages in Neon PostgreSQL and summarize older context when conversations grow large |
| **Team Management** | View active organization members and invite new teammates through Clerk Organizations |
| **Dashboard Overview** | Track setup progress, knowledge totals, configured sections, widget installation, and recent chats |
| **Workspace Controls** | View organization details and allow authorized administrators to delete workspace data |

---

## How It Works

1. **Authentication:** A user signs in with Clerk. The callback synchronizes the Clerk profile to Neon and creates an HTTP-only application session.
2. **Workspace Setup:** The user adds business details, a website, and optional documentation links.
3. **Knowledge Ingestion:** Support content is added from website URLs, CSV uploads, or manual text. Website and CSV content can be summarized through OpenRouter.
4. **Section Configuration:** Knowledge sources are grouped into sections with a response tone plus optional allowed and blocked topics.
5. **Assistant Testing:** The chatbot playground sends section-scoped knowledge and recent conversation context to the configured OpenRouter model.
6. **Widget Deployment:** A generated script tag requests a short-lived widget token and injects the SupportAI iframe into an external website.
7. **Customer Conversations:** Public messages are stored in Neon, answered from the selected knowledge sources, and surfaced in the team's conversation inbox.
8. **Human Follow-Up:** Team members can review complete threads and reply directly when a customer needs personal assistance.

---

## Tech Stack

<div align="center">

| Technology | Purpose |
| :--: | :-- |
| **Next.js 16.4** | Full-stack App Router application, React Server Components, route handlers, and production builds with Turbopack |
| **React 19** | Interactive landing page, onboarding, dashboard, chatbot playground, inbox, and widget interfaces |
| **TypeScript 5** | Static typing across UI components, API handlers, database access, and shared utilities |
| **Tailwind CSS 4** | Responsive dark interface, design tokens, utility styling, and embedded widget presentation |
| **Base UI + shadcn** | Accessible component foundations and reusable application UI primitives |
| **Clerk** | Authentication, user profiles, organization membership, roles, and team invitations |
| **Neon PostgreSQL** | Serverless persistence for users, workspace metadata, knowledge, sections, chatbot settings, and conversations |
| **Drizzle ORM** | Typed PostgreSQL queries, schema definitions, migrations, and database tooling |
| **OpenRouter** | Model-agnostic chat completions, support replies, knowledge summarization, and conversation summaries |
| **ZenRows** | Optional JavaScript-rendered website crawling with Markdown and HTML fallback modes |
| **JOSE** | Signed and verified JWT sessions for the public support widget |
| **js-tiktoken** | Conversation token measurement before older messages are summarized |
| **Lucide React** | Consistent iconography throughout the landing page and dashboard |
| **Vercel** | Production hosting for the Next.js application and route handlers |

</div>

---

## Project Structure

```text
AI-Support-Assistant/
|-- app/
|   |-- api/
|   |   |-- auth/                       # Clerk entry, callback, and session routes
|   |   |-- chat/                       # Authenticated test and public chat completion routes
|   |   |-- chatbot/metadata/           # Chatbot appearance configuration APIs
|   |   |-- conversations/              # Inbox threads, messages, and human replies
|   |   |-- knowledge/                  # Website, CSV, and manual knowledge APIs
|   |   |-- metadata/                   # Workspace onboarding metadata APIs
|   |   |-- organization/               # Active organization details
|   |   |-- overview/                   # Dashboard metrics and setup progress
|   |   |-- section/                    # Section creation, listing, and deletion
|   |   |-- team/                       # Clerk organization members and invitations
|   |   |-- widget/                     # Public widget session, configuration, and chat
|   |   `-- workspace/                  # Authorized workspace deletion
|   |-- auth/callback/                  # Clerk user synchronization callback
|   |-- dashboard/
|   |   |-- chatbot/                    # Playground, appearance, and embed configuration
|   |   |-- conversations/              # Customer conversation inbox
|   |   |-- knowledge/                  # Knowledge source management
|   |   |-- sections/                   # Topic and behavior configuration
|   |   `-- settings/                   # Organization, team, and workspace settings
|   |-- embed/                          # Public iframe-based assistant interface
|   |-- globals.css                     # Tailwind theme and global styles
|   |-- layout.tsx                      # Root providers and metadata
|   `-- page.tsx                        # Public marketing landing page
|-- components/
|   |-- auth/                           # Session synchronization
|   |-- dashboard/                      # Dashboard, knowledge, section, and team UI
|   |-- landing/                        # Hero, features, integrations, pricing, and footer
|   `-- ui/                             # Shared application UI primitives
|-- db/
|   |-- client.ts                       # Neon + Drizzle connection
|   |-- schema.ts                       # PostgreSQL tables
|   `-- users.ts                        # Clerk user synchronization
|-- drizzle/                            # Generated SQL migrations and snapshots
|-- hooks/                              # Shared React hooks
|-- lib/
|   |-- openRouter.ts                   # Chat completion and summarization helpers
|   |-- workspace.ts                    # Personal and organization workspace resolution
|   |-- isAuthorized.ts                 # Application session reader
|   `-- countConversationTokens.ts      # Token counting utility
|-- public/
|   |-- chatbot_profile.png             # Assistant profile image
|   |-- preview1.png                    # Dashboard preview
|   |-- preview2.png                    # Chatbot playground preview
|   |-- preview3.png                    # Knowledge base preview
|   `-- widget.js                       # External widget loader
|-- types/                              # Shared TypeScript declarations
|-- drizzle.config.ts                   # Drizzle Kit configuration
|-- proxy.ts                            # Clerk request middleware
|-- next.config.ts                      # Next.js configuration
|-- package.json                        # Scripts and dependencies
`-- README.md                           # Project documentation
```

---

## API Overview

### Authentication & Workspace

| Endpoint | Method | Access | Purpose |
| :-- | :--: | :-- | :-- |
| `/api/auth` | `GET` | Public | Start Clerk sign-in or sign-up and return through the application callback |
| `/api/auth/callback` | `GET` | Clerk session | Synchronize the current user and establish the application session cookie |
| `/api/auth/session` | `GET` | App session | Return the synchronized application user |
| `/api/metadata/fetch` | `GET` | App session | Fetch onboarding and business metadata for the active workspace |
| `/api/metadata/store` | `POST` | App session | Create or update business name, website, and supporting links |
| `/api/organization/fetch` | `GET` | App session | Return active organization information |
| `/api/overview` | `GET` | App session | Return dashboard metrics, setup state, sections, and recent chats |
| `/api/workspace/delete` | `DELETE` | Owner/admin | Delete knowledge, metadata, sections, and chatbot configuration for the workspace |

### Knowledge, Sections & Chatbot

| Endpoint | Method | Access | Purpose |
| :-- | :--: | :-- | :-- |
| `/api/knowledge/fetch` | `GET` | App session | List knowledge sources available to the workspace |
| `/api/knowledge/store` | `POST` | App session | Add a website, manual text source, or CSV upload |
| `/api/section/fetch` | `GET` | App session | List configured support sections |
| `/api/section/create` | `POST` | App session | Create a section with sources, tone, and topic rules |
| `/api/section/delete` | `DELETE` | App session | Delete a section owned by the active workspace |
| `/api/chat/test` | `POST` | App session | Test an AI response using selected knowledge sources |
| `/api/chatbot/metadata/fetch` | `GET` | App session | Load or initialize chatbot appearance metadata |
| `/api/chatbot/metadata/update` | `PUT` | App session | Update color and welcome message |

### Public Widget & Conversations

| Endpoint | Method | Access | Purpose |
| :-- | :--: | :-- | :-- |
| `/api/widget/session` | `POST` | Public | Validate a widget ID and issue a signed two-hour session token |
| `/api/widget/config` | `GET` | Widget JWT | Return chatbot appearance and available sections |
| `/api/widget/chat` | `POST` | Widget JWT | Generate a widget response from section knowledge |
| `/api/chat/public` | `POST` | Widget JWT | Persist a visitor conversation and generate an AI reply |
| `/api/conversations` | `GET` | App session | List conversations associated with workspace chatbots |
| `/api/conversations/:id/messages` | `GET` | App session | Load the complete ordered message history for a conversation |
| `/api/conversations/:id/reply` | `POST` | App session | Save a human support reply to a conversation |

### Team Management

| Endpoint | Method | Access | Purpose |
| :-- | :--: | :-- | :-- |
| `/api/team/fetch` | `GET` | Clerk organization | List active members and pending invitations |
| `/api/team/add` | `POST` | Organization admin | Invite a new organization member by email |

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Clerk authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
CLERK_SECRET_KEY=sk_test_your_secret_key

# Neon PostgreSQL
DATABASE_URL=postgresql://user:password@endpoint.neon.tech/neondb?sslmode=require

# OpenRouter
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=meta-llama/llama-3-8b-instruct
OPENROUTER_HTTP_REFERER=http://localhost:3000
OPENROUTER_APP_NAME=SupportAI

# Public widget session signing
JWT_SECRET=replace_with_a_long_random_secret

# Application URL used as an OpenRouter fallback referer
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional JavaScript-rendered website ingestion
ZENROWS_API_KEY=your_zenrows_api_key
```

| Variable | Required | Purpose |
| :-- | :--: | :-- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Initializes Clerk in the browser |
| `CLERK_SECRET_KEY` | Yes | Enables Clerk server APIs, user sync, organizations, and invitations |
| `DATABASE_URL` | Yes | Connects Neon PostgreSQL through Drizzle |
| `OPENROUTER_API_KEY` | Yes | Generates support responses and summaries |
| `JWT_SECRET` | Yes | Signs and verifies public widget sessions |
| `OPENROUTER_MODEL` | No | Overrides the default `meta-llama/llama-3-8b-instruct` model |
| `OPENROUTER_HTTP_REFERER` | No | Sends the deployment URL to OpenRouter |
| `OPENROUTER_APP_NAME` | No | Sets the OpenRouter application title |
| `NEXT_PUBLIC_APP_URL` | No | Provides a fallback application/referer URL |
| `ZENROWS_API_KEY` | No | Enables rendered website crawling; sources can still be stored without it |

### Key Integrations Setup

1. **Clerk:** Create an application in the [Clerk Dashboard](https://dashboard.clerk.com), add the publishable and secret keys, and enable Organizations if shared workspaces and team invitations are required.
2. **Neon:** Create a database in the [Neon Console](https://console.neon.tech), copy its pooled PostgreSQL URL, and set `DATABASE_URL`.
3. **OpenRouter:** Create an API key in [OpenRouter](https://openrouter.ai/keys), set `OPENROUTER_API_KEY`, and optionally select another compatible model through `OPENROUTER_MODEL`.
4. **Widget JWT:** Generate a long random value for `JWT_SECRET`. Use the same secret across all production instances.
5. **ZenRows (optional):** Add a [ZenRows](https://www.zenrows.com/) key when JavaScript-rendered website ingestion is needed.

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/smRid/AI-Support-Assistant.git
cd AI-Support-Assistant
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create `.env.local` and add the variables described in the [Environment Variables](#environment-variables) section.

### 4. Initialize the database

For local development, push the current Drizzle schema:

```bash
npm run db:push
```

Alternatively, apply the generated migrations:

```bash
npm run db:migrate
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), sign in with Clerk, and complete the workspace onboarding flow.

---

## Available Scripts

| Command | Description |
| :-- | :-- |
| `npm run dev` | Start the Next.js development server with Turbopack |
| `npm run build` | Create an optimized production build |
| `npm run start` | Run the previously generated production build |
| `npm run db:generate` | Generate Drizzle SQL migrations from `db/schema.ts` |
| `npm run db:migrate` | Apply generated migrations to the configured database |
| `npm run db:push` | Push the current schema directly to the configured database |
| `npm run db:studio` | Open Drizzle Studio for the configured database |

---

## Deployment

**Production site:** [https://aws-chat-bot.vercel.app/](https://aws-chat-bot.vercel.app/)

### Deploy on Vercel

1. Import `https://github.com/smRid/AI-Support-Assistant` into Vercel.
2. Keep the framework preset set to **Next.js** and the root directory set to the repository root.
3. Add all required production environment variables from the table above.
4. Set `NEXT_PUBLIC_APP_URL` and `OPENROUTER_HTTP_REFERER` to the production URL.
5. Apply the Drizzle migrations to the production Neon database.
6. Add the production domain and callback URLs to the Clerk application settings.
7. Deploy, then copy the widget snippet from the SupportAI dashboard into the target website.

The widget loader derives its API and iframe origin from the hosted `widget.js` URL, so the production embed should load the script from the deployed SupportAI domain.

---

## Security & Access Notes

- Clerk middleware covers application and API routes, while protected handlers also verify the synchronized application session.
- The callback only accepts same-origin redirect targets and stores the application session in an HTTP-only, `SameSite=Lax` cookie.
- Organization workspace queries resolve the owner and member email scope before reading or modifying shared data.
- Team invitations and shared-workspace deletion require the active Clerk organization; destructive organization actions require the `org:admin` role.
- Public widget sessions are signed with HS256, expire after two hours, and carry the widget ID, owner email, and generated conversation session ID.
- Sensitive keys remain server-side. Only explicitly public Clerk and application URL values use the `NEXT_PUBLIC_` prefix.
- Production deployments should use a strong `JWT_SECRET`, HTTPS, restricted Clerk redirect URLs, and separate development and production credentials.

---

## License

This project is licensed under the [MIT License](./LICENSE).

---

<div align="center">

Built with Next.js 16, React 19, TypeScript, Tailwind CSS, Clerk, Neon PostgreSQL, Drizzle ORM, and OpenRouter.

</div>
