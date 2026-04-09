# Customer Chatbot

Customer Chatbot is a full-stack Next.js 16 application for building an AI-powered customer support assistant. It lets a team create a workspace, ingest knowledge from websites and documents, define topic-based chatbot behavior, embed a support widget on an external site, and manage visitor conversations from an internal inbox.

## What This Project Does

- Authenticates users with Clerk and syncs them into an app-level workspace session.
- Stores workspace, chatbot, knowledge, section, and conversation data in Neon Postgres via Drizzle ORM.
- Ingests knowledge from website URLs, pasted text/Q&A, and CSV uploads.
- Lets admins group knowledge into sections with different tones and topic rules.
- Generates chatbot responses through OpenAI with lightweight retrieval from saved knowledge.
- Exposes a public widget flow using `public/widget.js`, `/api/widget/session`, and `/embed`.
- Gives team members a dashboard for setup, chatbot testing, team invites, and live conversation replies.

## Tech Stack

- Framework: Next.js `16.2.1`, React `19`, App Router
- Styling: Tailwind CSS `4`, custom UI components, Base UI
- Authentication: Clerk
- Database: Neon Serverless Postgres
- ORM and migrations: Drizzle ORM and Drizzle Kit
- AI: OpenAI SDK
- Token/session helpers: `jose`
- Website ingestion helper: ZenRows (optional but supported)

## Main Product Areas

- Landing page: marketing homepage in `app/page.tsx`
- Dashboard: onboarding, overview, knowledge, sections, chatbot, settings
- Public embed: iframe-based chat widget in `public/widget.js` and `app/embed/page.tsx`
- Internal inbox: live conversation view and manual replies in `app/dashboard/conversations/page.tsx`
- API routes: workspace, knowledge, chatbot, conversations, widget, team, auth, and overview endpoints

## Project Structure

```text
app/
  api/                  Route handlers for auth, chatbot, knowledge, widget, inbox, and workspace actions
  dashboard/            Authenticated product UI
  embed/                Public iframe chat experience
  page.tsx              Landing page
components/
  auth/                 Session synchronization
  dashboard/            Dashboard feature components
  landing/              Marketing site sections
  ui/                   Shared UI primitives
db/
  client.ts             Drizzle + Neon connection
  schema.ts             Database tables
lib/
  openAI.ts             OpenAI client and summarization helpers
  workspace.ts          Organization-aware workspace resolution
  isAuthorized.ts       App session reader
public/
  widget.js             External embeddable chat loader
drizzle/
  *.sql                 Generated migrations
```

## Prerequisites

- Node.js 20 or newer
- npm
- A Clerk application
- A Neon Postgres database
- An OpenAI API key

## Environment Variables

Create `.env.local` and add the variables below.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Clerk client-side key |
| `CLERK_SECRET_KEY` | Yes | Clerk server-side key |
| `DATABASE_URL` | Yes | Neon Postgres connection string |
| `OPENAI_API_KEY` | Yes | Used for chatbot replies and summarization |
| `OPENAI_BASE_URL` | No | Optional custom OpenAI-compatible base URL |
| `ZENROWS_API_KEY` | No | Improves website ingestion when crawling external pages |
| `JWT_SECRET` | Yes | Signs widget session tokens |

Notes:

- The code reads `OPENAI_BASE_URL`. If you currently use `OPENAI_BASE_URI`, rename it.
- Do not commit real secrets to source control.

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Add your environment variables to `.env.local`.

3. Create or sync the database schema:

```bash
npm run db:push
```

4. Start the development server:

```bash
npm run dev
```

5. Open `http://localhost:3000`.

6. Sign in through Clerk. The callback route will sync the user into the local `user` table and set the app session cookie.

## Available Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start local development server |
| `npm run build` | Build the production app |
| `npm run start` | Run the production build |
| `npm run db:generate` | Generate Drizzle migrations from schema changes |
| `npm run db:migrate` | Apply generated migrations |
| `npm run db:push` | Push schema directly to the database |
| `npm run db:studio` | Open Drizzle Studio |

## How The App Works

1. A user signs in with Clerk.
2. `/auth/callback` syncs the user into Postgres and stores a `user_session` cookie.
3. The dashboard onboarding flow saves workspace metadata such as business name and website.
4. Knowledge sources are added from a website, manual text, or CSV upload.
5. Admins create sections that point to selected knowledge sources and define tone/topic behavior.
6. The chatbot playground tests responses through `/api/chat/test`.
7. The public widget uses `public/widget.js` to request a short-lived token from `/api/widget/session`, then loads `/embed`.
8. Public chat requests hit `/api/chat/public`, which stores messages and creates inbox conversations.
9. Team members review and reply from `/dashboard/conversations`.

## Important Routes

### App Routes

- `/` - landing page
- `/dashboard` - workspace setup and overview
- `/dashboard/knowledge` - knowledge source management
- `/dashboard/sections` - section setup
- `/dashboard/chatbot` - chatbot appearance, test area, embed config
- `/dashboard/conversations` - support inbox
- `/dashboard/settings` - organization info, team invites, workspace deletion
- `/embed` - iframe chat UI used by the widget

### Key API Routes

- `/api/metadata/store` and `/api/metadata/fetch`
- `/api/knowledge/store` and `/api/knowledge/fetch`
- `/api/section/create`, `/api/section/fetch`, `/api/section/delete`
- `/api/chatbot/metadata/fetch` and `/api/chatbot/metadata/update`
- `/api/chat/test`
- `/api/widget/session`, `/api/widget/config`, `/api/widget/chat`
- `/api/chat/public`
- `/api/conversations`, `/api/conversations/[id]/messages`, `/api/conversations/[id]/reply`
- `/api/team/fetch`, `/api/team/add`
- `/api/workspace/delete`

## Deployment Notes

- `proxy.ts` is used for Clerk request protection in this Next.js 16 app.
- The widget loader derives its origin from the script URL, so production embeds should load the script from your deployed domain.
- The overview dashboard generates an origin-aware widget snippet. A separate dashboard component still contains a localhost example, so verify the copied embed code before sharing it externally.
- Add your production Clerk URLs, database, OpenAI key, and `JWT_SECRET` before deploying.
- If website scraping quality matters, set `ZENROWS_API_KEY` in production.

## Operational Notes

- Knowledge source types currently supported are website, text, and CSV upload.
- Conversation history is summarized when token count grows too large, helping keep prompts short.
- Team features depend on an active Clerk organization for shared workspaces.
- Workspace deletion removes metadata, knowledge, sections, chatbot settings, and related records for the current workspace scope.

## License

This repository includes an MIT license in [LICENSE](./LICENSE).
