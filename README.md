# Rondel — Portfolio

Personal portfolio built with Next.js 15, TypeScript, and CSS Modules.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  layout.tsx          # Root layout, nav, theme provider
  page.tsx            # Home — hero, stack, featured projects
  globals.css         # Design tokens, fonts, base styles
  /projects
    page.tsx          # All projects listing
    /[slug]
      page.tsx        # Individual project detail
  /about
    page.tsx          # About + experience + skills
  /contact
    page.tsx          # Contact channels

components/
  Nav.tsx             # Sticky nav with dark mode toggle
  ProjectCard.tsx     # Reusable project card
  ThemeProvider.tsx   # Dark/light mode context

lib/
  projects.ts         # All project data — edit this!
```

## Customising

### Add or edit projects
Edit `lib/projects.ts`. Each project has:
- `slug` — URL path (`/projects/your-slug`)
- `title`, `description`, `longDescription`
- `tags` — tech stack tags
- `category` — `"magento" | "nextjs" | "react" | "node"`
- `highlights` — bullet points shown on detail page
- `liveUrl`, `repoUrl` — optional links
- `featured` — shows on homepage if `true`

### Update personal info
- **Contact links** → `app/contact/page.tsx`
- **Bio text** → `app/about/page.tsx`
- **Meta/SEO** → `app/layout.tsx` and each page's `metadata` export
- **Name / tagline** → `app/page.tsx` (hero section)

### Colors & fonts
Design tokens are in `app/globals.css` under `:root` and `[data-theme="dark"]`.

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (follow prompts)
vercel

# Or push to GitHub and connect at vercel.com — auto-deploys on every push
```

Vercel detects Next.js automatically. No extra config needed.
