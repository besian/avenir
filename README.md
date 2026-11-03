# Avenir Housing — website

A Next.js 16 (App Router, TypeScript) build of the **Avenir Housing v2** design from Claude Design.
The original design bundle is kept for reference in `project/` and `chats/` (handoff notes below).

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Where things live

| Path | What |
| --- | --- |
| `src/app/globals.css` | Design tokens (forest green / sage palette, Archivo type) and all component styles |
| `src/lib/properties.ts` | Property model, helpers and the six **sample** homes (used until Firebase is set up) |
| `src/lib/firebase/` | Firebase config, server reads (public site) and browser SDK (admin) |
| `src/components/admin/`, `src/app/admin/` | The `/admin` area: sign-in, house list, add/edit/delete, photo uploads |
| `src/lib/content.ts` | Site copy: contact details, FAQs, team, approach, support areas, form options |
| `src/lib/forms.ts` | Form submission stubs (front-end only) — wire to a backend/email service here |
| `src/lib/storage.ts` | localStorage helpers (saved shortlist, apply/refer draft) |
| `src/components/` | Header, search palette (⌘K or /), footer, phone menu, wizards, forms |

Pages: `/`, `/properties`, `/properties/[id]`, `/apply` (`?for=self` or `?for=referral`), `/repair`, `/landlords`, `/support`, `/contact`, and `/admin`.

## Managing houses (`/admin`)

Houses are stored in **Firebase** (Firestore for the details, Storage for photos, Authentication for
admin logins). Until Firebase is configured the site shows the sample homes and `/admin` explains how to connect it.

### One-time setup
1. Create a project at [console.firebase.google.com](https://console.firebase.google.com) and add a **Web app**.
2. Enable **Authentication → Sign-in method → Email/Password**.
3. Create a **Firestore database** (production mode) and enable **Storage**.
4. Publish the rules in this repo: paste `firestore.rules` and `storage.rules` into the console's Rules tabs,
   or run `npx firebase-tools deploy --only firestore:rules,storage --project <your-project-id>`.
5. Copy `.env.example` to `.env.local` and fill in the web-app config; add the same variables to your host
   (e.g. Vercel → Settings → Environment Variables) and redeploy.

### Adding an admin
1. Firebase console → **Authentication → Add user** (their email + a temporary password; they can use “Forgot password?” on `/admin` to set their own).
2. Copy the user’s **UID**, then in **Firestore → Start collection** `admins` → document ID = that UID (any field, e.g. `email`).
   To remove access, delete that document (and optionally the user).

Anyone signed in without an `admins` document sees “No admin access” and the security rules block their writes.
On first sign-in, use **Import sample homes** to start from the six example listings, or add houses from scratch.
Saving a house refreshes the public pages immediately (`/api/revalidate`); otherwise they refresh every 5 minutes.

### Local testing with emulators
`npx firebase-tools emulators:start --only auth,firestore,storage --project demo-avenir`, then run
`npm run dev` with `NEXT_PUBLIC_FIREBASE_EMULATORS=1`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID=demo-avenir` and any API key.

### Still to do before launch
- Set up Firebase and add the real listings and photos via `/admin`; a real map is still a placeholder
- Connect forms in `src/lib/forms.ts` to a backend
- Privacy policy page (footer link is `#`)
- Confirm the promised response times (two working days call-back; reply within a working day)

---

# CODING AGENTS: READ THIS FIRST

This is a **handoff bundle** from Claude Design (claude.ai/design).

A user mocked up designs in HTML/CSS/JS using an AI design tool, then exported this bundle so a coding agent can implement the designs for real.

## What you should do — IMPORTANT

**Read the chat transcripts first.** There are 2 chat transcript(s) in `chats/`. The transcripts show the full back-and-forth between the user and the design assistant — they tell you **what the user actually wants** and **where they landed** after iterating. Don't skip them. The final HTML files are the output, but the chat is where the intent lives.

**Read `project/Avenir Housing v2.dc.html` in full.** The user had this file open when they triggered the handoff, so it's almost certainly the primary design they want built. Read it top to bottom — don't skim. Then **follow its imports**: open every file it pulls in (shared components, CSS, scripts) so you understand how the pieces fit together before you start implementing.

**If anything is ambiguous, ask the user to confirm before you start implementing.** It's much cheaper to clarify scope up front than to build the wrong thing.

## About the design files

The design medium is **HTML/CSS/JS** — these are prototypes, not production code. Your job is to **recreate them pixel-perfectly** in whatever technology makes sense for the target codebase (React, Vue, native, whatever fits). Match the visual output; don't copy the prototype's internal structure unless it happens to fit.

**Don't render these files in a browser or take screenshots unless the user asks you to.** Everything you need — dimensions, colors, layout rules — is spelled out in the source. Read the HTML and CSS directly; a screenshot won't tell you anything they don't.

## Bundle contents

- `README.md` — this file
- `chats/` — conversation transcripts (read these!)
- `project/` — the `Avenir Housing redesign brief` project files (HTML prototypes, assets, components)
