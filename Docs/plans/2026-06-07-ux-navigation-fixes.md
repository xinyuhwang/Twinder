# Twinder UX Navigation and Flow Fixes - Implementation Plan
## Date: 2026-06-07

## Overview

This plan addresses the navigation dead-ends, discoverability gaps, and
demo-friction issues found in the UX assessment. It is the companion to
`2026-06-06-ux-overhaul.md` (which covers arena trickle-in, chat replay, and
match-card schema). Where the two overlap, this plan defers to that one and
notes it inline.

The seven changes below are ordered by impact-to-effort. Phases 1-3 are the
highest leverage for a hackathon demo and can ship independently.

## Current State

- Root `frontend/app/layout.tsx` already constrains all pages to `max-w-md`;
  `MobileShell` adds a second identical constraint. There is no persistent
  navigation anywhere in the app.
- `/demo` -> `/onboarding` -> `/onboarding/questions` -> `/onboarding/preview`
  -> `/arena` -> `/matches` -> `/matches/[matchId]`. Five screens before the
  arena, the demo's "money shot."
- `/live` (real-time matchmaking) is only reachable by typing the URL. The
  landing "Join an event" button routes to `/join`, not `/live`, and nothing
  in the demo flow links to it.
- Saving a match in `/matches` removes it from the swipe stack with no way to
  view saved matches afterward. The empty state reports "N saved" but offers
  no path to them.
- Arena failure renders a small red text box with a text-link retry
  (`frontend/app/arena/page.tsx:236-249`).
- `/onboarding` presents the YAML/prompt path as primary ("Recommended") and
  the in-app question flow as a demoted secondary button
  (`frontend/app/onboarding/page.tsx:222-239`).
- `/live` does not use `MobileShell`, has no back-nav header, and renders a raw
  `!` glyph as its error icon (`frontend/app/live/page.tsx:97-111`).

## Desired End State

- A persistent bottom tab bar appears on the core post-login surfaces
  (Matches, Arena, Saved, Profile/Live) and is hidden on landing, demo, and
  onboarding.
- Demo users go straight from persona pick to arena (shared with the overhaul
  plan's Phase 1).
- Saved matches are viewable from a dedicated route.
- Arena errors and the swipe-gesture affordance are clearly surfaced.
- Live chat is discoverable from the UI.

## What We're NOT Doing

- Not changing the arena scoring backend (covered by the overhaul plan).
- Not changing the match-card schema (covered by the overhaul plan).
- Not adding backend persistence for saved/passed/met (stays in localStorage).
- Not removing onboarding routes (still the real Google-auth signup path).

---

## Phase 1 - Persistent bottom navigation

### Overview
Add a bottom tab bar that fixes most navigation dead-ends in one component.

### Changes Required

#### 1. New component `frontend/components/BottomNav.tsx`
- Client component using `usePathname()` from `next/navigation`.
- Tabs: Matches (`/matches`), Arena (`/arena`), Saved (`/saved`),
  Live (`/live`). Icons from lucide (`Layers`, `Zap`, `Bookmark`, `Radio`).
- Fixed to bottom, `max-w-md mx-auto`, matches the existing dark theme
  (`bg-[#0a0a0f]/95 backdrop-blur border-t border-zinc-800/50`).
- Highlights the active tab via `pathname.startsWith(tab.href)`.
- Renders `null` when there is no token (logged-out) so it never shows on
  landing.

#### 2. New component `frontend/components/AppChrome.tsx`
- Client wrapper that reads `usePathname()` and decides whether to render
  `BottomNav`. Hide on `/`, `/demo`, `/onboarding*`, `/auth*`, `/join`.
- Renders `{children}` plus conditional `<BottomNav />`.

#### 3. `frontend/app/layout.tsx`
- Wrap `{children}` in `<AppChrome>`.
- Add bottom padding (`pb-20`) to the inner container so fixed nav does not
  cover content. Pages with their own fixed action bar (match detail) get
  `pb-36` via a per-page class instead.

### Notes
- The match-detail page already has a fixed bottom action bar
  (`frontend/app/matches/[matchId]/page.tsx:311-353`). BottomNav must be
  hidden there, or stacked above it. Simplest: hide BottomNav on
  `/matches/[matchId]` (detail is a focused sub-view).

### Success Criteria
- From any core screen the user can reach Matches, Arena, Saved, and Live in
  one tap.
- Nav never appears on landing, demo, or onboarding.

---

## Phase 2 - Saved matches view

### Overview
Give saved matches a home so the Save action is not a dead end.

### Changes Required

#### 1. New route `frontend/app/saved/page.tsx`
- Reads `localStore.getArenaCards()` and `localStore.getSavedMatchIds()`.
- Renders saved cards as a vertical scrollable list (not a swipe stack):
  avatar, name, score badge, headline, and a tap target to
  `/matches/[matchId]`.
- Empty state: "No saved matches yet. Swipe right in the arena to save."
  with a button to `/matches`.

#### 2. `frontend/app/matches/page.tsx`
- In the all-cards-seen empty state (lines 314-337), add a secondary button
  "View saved (N)" -> `/saved` when `savedIds.length > 0`.

### Success Criteria
- Saving a match then finishing the stack lets the user review saved matches.
- `/saved` reachable from BottomNav and from the matches empty state.

---

## Phase 3 - Arena error and swipe affordance

### Overview
Make failure obvious and teach the swipe gesture.

### Changes Required

#### 1. `frontend/app/arena/page.tsx`
- Replace the text-link retry (lines 236-249) with a full-width retry button
  styled like the primary CTA, plus a "Back to demo" secondary.
- When `error` is set, hide the in-progress feed so the failure is the focus.

#### 2. `frontend/app/matches/page.tsx`
- Add a one-time dismissible swipe hint overlay shown before the first card:
  "Swipe right to save, left to pass." Persist dismissal under a new
  `localStore` key `seenSwipeHint`.

#### 3. `frontend/lib/local-store.ts`
- Add `getSeenSwipeHint()/setSeenSwipeHint()` plus the `seenSwipeHint` key.

### Success Criteria
- A backend-down arena run shows a prominent, obvious retry.
- First-time users see the swipe instructions once.

---

## Phase 4 - Onboarding as an explicit two-path choice

### Overview
Our audience (technical, hackathon, LLM-native) is comfortable with the
import/YAML path, so we keep it as a first-class option rather than demoting
it. Instead of a primary/secondary hierarchy, present a clear fork up front:

- **Import data** (recommended for our audience): the Twinder prompt plus a
  simple drag-and-drop zone that recommends dropping a resume, a YAML from the
  prompt, files, or pasting links to a personal site, LinkedIn, or GitHub.
- **Answer questions**: the in-app `RequiredQuestionFlow`.

Both paths converge on `/onboarding/preview`.

### Changes Required

#### 1. New step: path chooser on `frontend/app/onboarding/page.tsx`
- Add a top-level choice screen with two large cards:
  - "Import data - Drop your resume, links, or YAML. Recommended."
  - "Answer questions - A few quick prompts instead."
- Selecting "Answer questions" routes to `/onboarding/questions` with
  `localStore.setSkippedIntake(true)` and `clearRawContext()` (mirrors the
  current `proceedToQuestions(false)` behavior).
- Selecting "Import data" reveals the import UI (below) inline, or routes to a
  dedicated import sub-step. Inline keeps it to one route.

#### 2. Import-data UI (refactor of current `/onboarding` body)
- Keep the existing Twinder prompt accordion (download prompt, steps).
- Upgrade the dropzone copy to recommend concrete inputs:
  "Drop a resume, YAML, or any file - or paste links to your site, LinkedIn,
  or GitHub below."
- Keep the file dropzone (`.yaml .yml .md .txt`, plus `.pdf .docx` accepted
  even if parsed loosely / passed as filename context for now).
- Add a dedicated links textarea (separate from freeform paste) with
  placeholders for personal site / LinkedIn / GitHub URLs. Links are appended
  to `rawContext` as labeled lines before submit.
- Keep the freeform paste textarea and the privacy note.
- Primary CTA "Build my twin" stays, enabled when any input is present.

#### 3. `frontend/lib/local-store.ts`
- No new keys required; reuse `rawContext`, `skippedIntake`. Optionally store
  the chosen path under a new `onboardingPath` key ('import' | 'questions')
  for analytics/resume-state, but not required.

### Notes
- This is now independent of the overhaul plan's 3-question rework: that plan
  governs the *questions* path content; this phase governs the *fork* and the
  *import* path. If the overhaul questions rework ships, the "Answer questions"
  card simply routes into that flow.

### Open question for implementation
- Link inputs: parse/fetch URL contents server-side, or just pass the raw URLs
  as context text to the intake LLM? Recommend the latter for the hackathon
  (no fetching/scraping); revisit if richer enrichment is wanted.

### Success Criteria
- Onboarding opens with a clear Import vs Answer choice.
- Import path supports dropping resume/files/YAML and pasting site/LinkedIn/
  GitHub links, all feeding the twin preview.

---

## Phase 5 - Reduce swipe-card action density

### Overview
Four equal buttons (Pass, Ask why, Save, Meet) read as one ambiguous row.
Reduce to two primary gestures on the card; move secondary actions to detail.

### Changes Required

#### 1. `frontend/app/matches/page.tsx`
- On the swipe card, keep only Pass (X) and Meet (heart) as buttons; Save is
  handled by the right-swipe gesture (with the hint from Phase 3).
- Move "Ask why" into the detail view's existing copilot section
  (`/matches/[matchId]` already has it, lines 230-254).
- Keep "View full match detail" tap target.

### Notes
- This overlaps conceptually with the overhaul plan's chat-replay redesign of
  the detail screen. Coordinate so the two action models do not conflict.

### Success Criteria
- Swipe card shows two clear actions plus the gesture; detail holds the rest.

---

## Phase 6 - Live chat discoverability and consistency

### Changes Required

#### 1. `frontend/app/live/page.tsx`
- Wrap content in `MobileShell` for layout consistency.
- Add a sticky back header (arrow -> `/demo` or previous) matching other pages.
- Replace the raw `!` error glyph (line 100) with a lucide icon
  (`AlertTriangle`) consistent with the rest of the app.

#### 2. Entry point
- Add a "Try a live conversation" link from the matches empty state and from
  the BottomNav Live tab, with one line explaining live vs arena.

### Success Criteria
- Live chat is reachable from the UI and visually consistent.

---

## Phase 7 - Demo flow shortening (defer to overhaul plan)

The assessment recommended skipping onboarding for demo users
(`/demo` -> `/arena`). This is already Phase 1 of `2026-06-06-ux-overhaul.md`
(`frontend/app/demo/page.tsx:31`). No separate work here; tracked there to
avoid a conflicting edit.

---

## Testing Strategy

- Manual walkthrough at `http://localhost:3000` for each phase:
  demo -> arena -> matches -> save -> saved -> detail -> meet.
- Verify BottomNav visibility rules on every route.
- Verify nav and content do not overlap (padding) on short and tall screens.
- Backend-down check: stop `uvicorn`, confirm arena and live error states.
- `cd frontend && npm run build` to catch type errors after each phase.

## Rollout Order

1. Phase 1 (nav) - unblocks everything else.
2. Phase 2 (saved) - depends on nav route.
3. Phase 3 (arena error + swipe hint) - independent.
4. Phases 4-6 - independent polish.
5. Phase 7 - already owned by the overhaul plan.
