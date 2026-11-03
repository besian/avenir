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
| `src/lib/properties.ts` | **Placeholder** property listings — replace with real homes |
| `src/lib/content.ts` | Site copy: contact details, FAQs, team, approach, support areas, form options |
| `src/lib/forms.ts` | Form submission stubs (front-end only) — wire to a backend/email service here |
| `src/lib/storage.ts` | localStorage helpers (saved shortlist, apply/refer draft) |
| `src/components/` | Header, search palette (⌘K or /), footer, phone menu, wizards, forms |

Pages: `/`, `/properties`, `/properties/[id]`, `/apply` (`?for=self` or `?for=referral`), `/repair`, `/landlords`, `/support`, `/contact`.

### Still to do before launch
- Real property listings, photos (`<Photo src=…>`) and a real map
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
