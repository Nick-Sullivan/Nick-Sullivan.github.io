# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

This is Nick Sullivan's personal website (nickdavesullivan.com), split into three main directories:

- `browser/` — Astro 5 frontend (the main website)
- `server/rust-chat-room/` — Rust backend for the real-time chat room feature, deployed as an AWS Lambda with WebSocket support via API Gateway
- `terraform/` — Infrastructure as code (split into `website/` and `rust-chat-room/` subdirectories)

## Browser (Astro Frontend)

All frontend commands run from `browser/`:

```sh
npm install        # Install dependencies
npm run dev        # Dev server at localhost:4321
npm run build      # Build to ./dist/
npm run preview    # Preview production build
```

### Content Architecture

Content is managed via Astro's Content Collections (`src/content.config.ts`):

- **Blog posts**: `src/data/blog/*.md` or `.mdx` — frontmatter requires `title`, `date`, `description`, `published`
- **Projects**: `src/data/projects/*.mdx` — same frontmatter schema
- Files with `published: false` are included in the build but hidden from listings (check page logic to confirm filtering)

Static routes for individual entries are generated in `src/pages/blog/[id].astro` and `src/pages/projects/[id].astro` via `getStaticPaths`.

### Layout System

- `BaseLayout.astro` — standard two-column layout (nav sidebar + content), used by most pages
- `BaseLayoutMinimal.astro` — minimal variant
- `BlogPostLayout.astro` — wraps blog content with post metadata

### Interactive Components (React Islands)

React components are embedded as Astro islands for interactivity:

- `ChatRoom/` — connects to the Rust WebSocket backend; uses `src/services/chatRoom/websocket.ts` for the WebSocket client
- `DebtRecyclingCalculator/` — standalone financial calculator (`.tsx` + `.css`)
- `ArtSmuggler/ColourCalculator/` — colour tool for the Art Smuggler project
- `RockPaperScissorsDice/` — game component

### Analytics

Umami analytics is configured in `astro.config.mjs` with a hardcoded site ID.

## Server (Rust Chat Room)

The chat room backend is a Rust Axum server deployable both locally (`ws_handler_local.rs`) and on AWS Lambda (`ws_handler_cloud.rs`). It uses DynamoDB for persistence and API Gateway for WebSocket connection management.

Source layout under `server/rust-chat-room/src/`:
- `domain/` — core business logic
- `database/` — DynamoDB access
- `notifier/` — sends messages back to connected clients via API Gateway
- `service/` — orchestration layer

## Adding Content

- **New blog post**: add a numbered `.md` or `.mdx` file to `browser/src/data/blog/` with the required frontmatter
- **New project**: add a `.mdx` file to `browser/src/data/projects/` with the required frontmatter; MDX files can import Astro assets and use the `<Image>` component
