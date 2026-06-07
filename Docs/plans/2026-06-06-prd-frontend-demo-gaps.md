# PRD Frontend Demo Gaps Implementation Plan

## Overview

Build the missing PRD demo screens in the Next.js frontend and wire them to the **existing live FastAPI backend**, completing the PRD happy path: landing -> demo loading -> (join/mode) -> onboarding (skip or paste) -> twin preview -> theatrical arena -> swipeable match queue -> match detail -> eavesdrop / mock Copilot -> Meet confirmation.

This plan is **frontend-first**. The backend already implements everything the match flow needs:
- `POST /arena/start?mode=...` runs the user's twin against the other seeded twins and returns ranked, PRD-shaped match cards (`app/arena/router.py:14`, `app/schemas.py:50`).
- `GET /arena/results` returns the last ranked cards (`app/arena/router.py:38`).
- `GET /arena/conversation/{conversation_id}` returns the full transcript for Eavesdrop (`app/arena/router.py:54`).
- `POST /users/me/intake` generates the hidden profile YAML and returns a sanitized `TwinPreview` (`app/users/router.py:42`).

The existing live 1:1 flow (matchmake queue + `/room/[roomId]` WebSocket chat + takeover + vibe score) is **kept functional**. It is moved off the `/arena` route name (so `/arena` can be the PRD theatrical screen) to `/live`, with no logic changes. This complements the in-progress backend [Weave LLM integration plan](2026-06-06-weave-llm-integration.md) ("No frontend work. Backend + API only.") rather than duplicating it.

## Current State Analysis

**Implemented frontend routes** (`frontend/app/`): `/` (landing), `/demo` (persona select + dev-login), `/arena` (live matchmake queue), `/room/[roomId]` (live WS chat), `/auth/callback`.

**Implemented client modules**: `frontend/lib/api.ts` (calls FastAPI), `frontend/lib/local-store.ts` (token/user/persona/roomId), `frontend/lib/personas.ts` (7 demo personas as colored initials), `frontend/types/index.ts`.

**Missing PRD routes**: `/join`, `/integrations`, `/onboarding`, `/onboarding/questions`, `/onboarding/preview`, `/matches`, `/matches/[matchId]`, plus the demo loading sequence on `/demo`, the theatrical arena, Eavesdrop, mock Copilot, and Meet confirmation.

**Backend endpoints available to consume** (no backend changes required by this plan):
- `POST /auth/dev-login?name=&persona=` -> `{ token, user }` (already used by `/demo`).
- `POST /users/me/intake` (body `IntakeRequest{ raw_context, answers }`) -> `TwinPreview{ public_safe_summary, looking_for[], interests[] }`.
- `POST /arena/start?mode=networking|hackathon|dating|custom` -> `ArenaResponse{ status, arena_id, match_cards[] }`. Runs LLM calls; can take ~30-60s.
- `GET /arena/results` -> `ArenaResponse` (cached last run, 1h TTL).
- `GET /arena/conversation/{conversation_id}` -> `MessageRead[]`.

**`MatchCard` shape returned by the backend** (`app/schemas.py:50`) maps directly to PRD match queue + detail: `score`, `headline`, `match_type`, `summary`, `strongest_overlap`, `non_obvious_overlap`, `complementary_dynamic`, `suggested_opener`, `follow_up_questions[]`, `conversation_highlights[{speaker,text}]`, `common_interests[]`, `opponent_id`, `opponent_name`, `opponent_avatar`, `conversation_id`.

### Key Discoveries:
- `MATCH_CARD_SCORING_PROMPT` already produces every PRD match-detail field (`app/agents/prompts.py:73`), so Copilot can be assembled programmatically from a card with **no new LLM call**.
- `MODE_GUIDELINES` supports `hackathon|networking|dating|custom` (`app/agents/prompts.py:1`); `/join` mode selection flows straight into `/arena/start?mode=`.
- `frontend/lib/api.ts` is the single data seam; all new screens import from it.
- `framer-motion@12` is already a dependency (`frontend/package.json:13`) for swipe + arena animation. `lucide-react` is available for icons.
- The arena run is a long blocking POST; the theatrical animation is used to fill that wait, then route to `/matches`.
- `/demo` already performs `dev-login` and stores `token`, `userId`, `personaId`, so onboarding/arena/matches all have an auth token (`frontend/app/demo/page.tsx:32`).
- The 7 seeded backend personas are rich (`app/seed.py:6`), so "skip intake" can use the seeded persona directly and still produce a compelling arena.
- `/arena/start` runs against all other DB users (6 opponents with 7 seeded). PRD says "short 5-agent". We cap the **visible** arena status feed and match queue client-side; no backend change.

## Desired End State

A user can complete the full PRD happy path end to end against the live backend in under ~3 minutes (excluding the one-time arena LLM wait, which is masked by the theatrical animation):

1. `/` -> Try the demo.
2. `/demo` shows the playful loading sequence (5-8s, rotating ingestion messages, "Twin ready"), then the persona selector with `HACK-AI-2026` and Alexis preselected.
3. `/join` (optional) sets event mode; `/integrations` is visual-only.
4. `/onboarding` lets the user paste context or skip; `/onboarding/questions` asks the 3 required playful questions (+ up to 3 capped follow-ups); `/onboarding/preview` shows a human-readable twin card (real `TwinPreview` when intake ran, persona-derived otherwise). No YAML/JSON is ever shown.
5. `/arena` plays a short theatrical highlight feed with counters while `/arena/start` runs, then routes to `/matches`.
6. `/matches` shows stacked swipeable cards with Meet / Ask Why / Save / Pass and swipe gestures.
7. `/matches/[matchId]` shows full match evidence, suggested opener (Copy), programmatic Copilot, and Eavesdrop (real transcript).
8. Meet shows a mock confirmation; Save/Pass/Meet persist in localStorage.

**Verification:** `npm run lint`, `npx tsc --noEmit`, and `npm run build` pass in `frontend/`; with the backend running, the full path works and no route 404s, no undefined values, and no YAML/raw JSON appears in the UI.

## What We're NOT Doing

- **No backend changes.** We consume existing endpoints only. (Save/Pass/Meet and event code/mode are localStorage-only per PRD; the Weave plan separately owns `POST /rooms/{id}/feedback`.)
- **No new LLM endpoints.** Copilot is programmatic from match-card fields; privacy/voice tweaks on preview are deterministic.
- **No rewrite of the live flow.** The matchmake queue + `/room` WS chat are preserved as-is, relocated to `/live`.
- **No real integrations, notifications, identity verification, or contact exchange.**
- **No image-generation avatars.** "Generated avatars" remain deterministic colored/gradient initials (existing style), upgraded to a shared component.
- **No mode-driven backend behavior changes** beyond passing `mode` to `/arena/start` (which already supports it).
- **No auth/matchmaking changes.**

## Implementation Approach

Build in PRD build-priority order, each phase shippable and verifiable on its own. Extend the single data seam (`frontend/lib/api.ts`) and `frontend/lib/local-store.ts` first, then build screens outward. Reusable presentational components live in a new `frontend/components/` directory. All new screens are mobile-first and use the existing dark/violet visual language already in `frontend/app/globals.css` and current pages.

Route mapping decision (honoring "keep what is implemented"):
- Existing live matchmake queue page `frontend/app/arena/page.tsx` -> moved to `frontend/app/live/page.tsx` (verbatim; only internal `router.push('/demo')` / `/room` targets unchanged). `/room/[roomId]` stays put and its "back" target updates to `/live`.
- `/arena` is rebuilt as the PRD theatrical arena.
- `/demo` "continue" routes into the PRD path (`/onboarding`), not directly to the live queue. The live flow remains reachable (kept link), so nothing implemented is lost.

---

## Phase 1: Foundation (data seam, demo loading, shared components)

### Overview
Add the typed client methods, localStorage keys, shared components (avatar, loading screen, mobile shell), and the demo loading sequence. No new full screens yet beyond upgrading `/demo`.

### Changes Required:

#### 1. Types
**File**: `frontend/types/index.ts`
**Changes**: Add backend-aligned types.
```ts
export type EventMode = 'hackathon' | 'networking' | 'dating' | 'custom';

export interface ConversationHighlight { speaker: string; text: string; }

export interface MatchCard {
  score: number;
  headline: string;
  match_type: string;
  summary: string;
  strongest_overlap: string | null;
  non_obvious_overlap: string | null;
  complementary_dynamic: string | null;
  suggested_opener: string | null;
  follow_up_questions: string[];
  conversation_highlights: ConversationHighlight[];
  common_interests: string[];
  opponent_id: number;
  opponent_name: string;
  opponent_avatar: string | null;
  conversation_id: string | null;
}

export interface ArenaResponse { status: string; arena_id: string | null; match_cards: MatchCard[]; }
export interface TwinPreview { public_safe_summary: string | null; looking_for: string[]; interests: string[]; }
```

#### 2. API client methods
**File**: `frontend/lib/api.ts`
**Changes**: Add `intake`, `startArena`, `getArenaResults`, `getArenaConversation`.
```ts
intake: (token: string, body: { raw_context: string; answers?: Record<string, string> | null }) =>
  request<TwinPreview>('/users/me/intake', { method: 'POST', headers: authHeaders(token), body: JSON.stringify(body) }),

startArena: (token: string, mode: string) =>
  request<ArenaResponse>(`/arena/start?mode=${encodeURIComponent(mode)}`, { method: 'POST', headers: authHeaders(token) }),

getArenaResults: (token: string) =>
  request<ArenaResponse>('/arena/results', { headers: authHeaders(token) }),

getArenaConversation: (token: string, conversationId: string) =>
  request<MessageRead[]>(`/arena/conversation/${encodeURIComponent(conversationId)}`, { headers: authHeaders(token) }),
```

#### 3. Local store keys
**File**: `frontend/lib/local-store.ts`
**Changes**: Add demo state keys: `eventMode` (default `hackathon`), `eventCode`, `onboardingAnswers` (JSON), `twinPreview` (JSON), `arenaCards` (JSON cache of last `match_cards`), `savedMatchIds` (JSON array), `passedMatchIds` (JSON array), `metMatchIds` (JSON array). Add typed getters/setters mirroring the existing pattern, and include the new keys in `reset()`.

#### 4. Shared components
**File**: `frontend/components/Avatar.tsx` (new) - extract the colored-initials avatar (currently duplicated in `demo/page.tsx`, `arena/page.tsx`, `room/page.tsx`) into one `Avatar` component accepting `{ name?, initials?, color?, size, pulse? }`, deriving a deterministic color/initials from a name when not provided.
**File**: `frontend/components/MobileShell.tsx` (new, optional) - a max-width mobile container wrapper used by new screens for consistent layout.
**File**: `frontend/components/DemoLoadingScreen.tsx` (new) - animated spinner/orbit, rotating ingestion messages (from PRD list), fake progress bar, "Twin ready." final state; calls an `onDone` after 5-8s.

#### 5. Demo loading + event framing
**File**: `frontend/app/demo/page.tsx`
**Changes**: On mount, show `DemoLoadingScreen` for 5-8s (skippable via a small "Skip" affordance), then reveal the existing persona selector. Add the `HACK-AI-2026` event label and keep Alexis preselected. Change the continue handler to route to `/onboarding` (after `dev-login`) instead of `/arena`. Use the new `Avatar` component.

### Success Criteria:

#### Automated Verification:
- [x] Type check passes: `cd frontend && npx tsc --noEmit`
- [x] Lint passes: `cd frontend && npm run lint`
- [x] Production build succeeds: `cd frontend && npm run build`

#### Manual Verification:
- [ ] `/demo` shows the loading sequence, rotating messages, and "Twin ready", then the selector with `HACK-AI-2026` and Alexis preselected.
- [ ] Continue routes to `/onboarding` and a token is stored.
- [ ] Loading is skippable and the whole step stays short.

**Implementation Note**: Pause for confirmation the loading sequence and routing feel right before Phase 2.

---

## Phase 2: Join Event + Mock Integrations

### Overview
Add the two lightweight mocked routes: `/join` (event code + mode selection feeding `/arena/start`) and `/integrations` (visual-only cards).

### Changes Required:

#### 1. Join Event
**File**: `frontend/app/join/page.tsx` (new)
**Changes**: Event code input (free text, stored to `eventCode`), four mode cards (Hackathon/Networking/Dating/Custom) stored to `eventMode`, a "Use demo shortcut" CTA. Selecting continues to `/onboarding`. Copy adapts to the chosen mode. Reachable from `/demo` (optional step) and `/`.

#### 2. Mock Integrations
**File**: `frontend/app/integrations/page.tsx` (new)
**Changes**: Three cards (ChatGPT, Apple Notes, Upload Files) with icon, description (PRD copy), and a disabled/"Coming soon" connect button that toggles a mock "Connected" pill locally. Clearly non-functional. Linked from `/onboarding`.

### Success Criteria:

#### Automated Verification:
- [ ] `cd frontend && npx tsc --noEmit`
- [ ] `cd frontend && npm run lint`
- [ ] `cd frontend && npm run build`

#### Manual Verification:
- [ ] `/join` sets mode and code in localStorage and continues into the flow.
- [ ] `/integrations` shows three visual-only cards; connect shows "Coming soon"/mock state and imports nothing.

**Implementation Note**: Pause for confirmation before Phase 3.

---

## Phase 3: Onboarding (intake, required questions, twin preview)

### Overview
Build the skippable intake, the required playful questions with capped follow-ups, and the human-readable twin preview wired to the real `/users/me/intake` + `TwinPreview`.

### Changes Required:

#### 1. Intake entry
**File**: `frontend/app/onboarding/page.tsx` (new)
**Changes**: `IntakeContextCard` with a paste-context textarea, privacy reassurance copy, a link to `/integrations`, and two CTAs: "Build my twin" (proceeds with pasted context) and "Skip this - ask me questions instead". Both route to `/onboarding/questions`. Persist nothing sensitive; never show YAML.

#### 2. Required questions + capped follow-ups
**File**: `frontend/app/onboarding/questions/page.tsx` (new)
**File**: `frontend/components/RequiredQuestionFlow.tsx` (new)
**Changes**: One question at a time with a progress indicator. Required (PRD):
1. Animal companion + why
2. Favorite color + why + feeling
3. What you want from this event/profile + what people should know
Then up to 3 optional follow-ups (cap = 3): who you hope to find, what you can help with in 15 minutes, what your agent should never share. Answers stored in `onboardingAnswers`. "Continue" routes to `/onboarding/preview`. If the user came via "skip" they still answer required questions (PRD: required when intake skipped); if they pasted context, follow-ups are optional/skippable.

#### 3. Twin preview (wired to backend)
**File**: `frontend/app/onboarding/preview/page.tsx` (new)
**File**: `frontend/components/AgentPreviewCard.tsx` (new)
**Changes**: On load, if there is pasted context and/or answers, call `api.intake(token, { raw_context, answers })` and render the returned `TwinPreview` (public_safe_summary, looking_for, interests) plus persona-derived sections (agent vibe, conversation bait, can/wants help, agent voice, privacy settings, completeness score). If the user fully skipped with no input, compose the preview client-side from the seeded persona (`localStore.personaId` -> `DEMO_PERSONAS`) without calling intake, so skip stays instant. Show a loading state while intake runs. Render **only** human-readable fields; never YAML/raw JSON.
Primary CTA "Approve twin" -> `/arena`. Secondary CTAs: "Edit voice" / "Edit privacy" (open the mock Copilot panel, Phase 6 component) and "Ask my agent to improve this". Cache the preview to `twinPreview`.

### Success Criteria:

#### Automated Verification:
- [ ] `cd frontend && npx tsc --noEmit`
- [ ] `cd frontend && npm run lint`
- [ ] `cd frontend && npm run build`

#### Manual Verification:
- [ ] Paste-context path: posting to `/users/me/intake` returns a `TwinPreview` and the card renders it; no YAML/JSON visible.
- [ ] Skip path: required questions are enforced, follow-ups capped at 3, and the preview renders from the seeded persona without an intake call.
- [ ] "Approve twin" routes to `/arena`.

**Implementation Note**: Pause for confirmation, especially the privacy check (no YAML/raw fields), before Phase 4.

---

## Phase 4: Theatrical Arena (wired to /arena/start)

### Overview
Rebuild `/arena` as the short theatrical highlights screen that triggers `/arena/start`, masks the LLM wait with animation, caches results, and routes to `/matches`. Relocate the existing live queue to `/live`.

### Changes Required:

#### 1. Preserve the live flow
**File**: `frontend/app/live/page.tsx` (new) - move the current `frontend/app/arena/page.tsx` contents verbatim.
**File**: `frontend/app/arena/page.tsx` - replaced (see below).
**File**: `frontend/app/room/[roomId]/page.tsx` - update the header back button target from `/arena` to `/live` (`room/[roomId]/page.tsx:315`).

#### 2. Theatrical arena
**File**: `frontend/app/arena/page.tsx` (rebuilt)
**File**: `frontend/components/ArenaStatusFeed.tsx` (new)
**Changes**: On mount, fire `api.startArena(token, eventMode)` (long-running). While awaiting, run a short theatrical feed: "{me} Twin entered the arena", "{me} Twin is meeting {other} Twin", interleaved highlight lines, using the seeded personas for names and floating avatar bubbles (framer-motion). Show counters: Agents met, Matches found, Top score (populated from the response when it resolves; show animated placeholders while waiting). Cap the visible roster to ~5 opponents. On resolve, cache `match_cards` to `arenaCards`, then show a "View matches" CTA (and/or auto-route) to `/matches`. Handle slow/failed runs by falling back to `api.getArenaResults` and a retry affordance.

### Success Criteria:

#### Automated Verification:
- [ ] `cd frontend && npx tsc --noEmit`
- [ ] `cd frontend && npm run lint`
- [ ] `cd frontend && npm run build`
- [ ] `/live` renders the prior queue UI (manual route check counts as the smoke test for the move).

#### Manual Verification:
- [ ] `/arena` triggers `/arena/start`, plays a short animation, then shows real counters and a "View matches" CTA into `/matches`.
- [ ] The live 1:1 flow still works via `/live` -> `/room/[roomId]` (takeover, wrap up, vibe score) with the back button returning to `/live`.

**Implementation Note**: Pause for confirmation that the arena animation length and the live-flow preservation are acceptable before Phase 5.

---

## Phase 5: Swipeable Match Queue

### Overview
Build `/matches` as Tinder-style stacked, swipeable cards from the cached arena results, with explicit accessible buttons and local Save/Pass/Meet persistence.

### Changes Required:

#### 1. Match queue
**File**: `frontend/app/matches/page.tsx` (new)
**File**: `frontend/components/MatchCard.tsx` (new)
**Changes**: Read `arenaCards` (fallback to `api.getArenaResults` if empty; redirect to `/arena` if still empty). Render stacked cards (framer-motion drag) showing generated avatar, name, score badge, match type, headline, summary, suggested opener. Actions: Meet, Ask Why, Save, Pass, plus swipe-left (Pass) / swipe-right (Save). Save/Pass update `savedMatchIds`/`passedMatchIds` and advance the stack. "Ask Why" opens the mock Copilot panel (Phase 6). "Meet" routes to the Meet confirmation (Phase 7). Tapping a card body opens `/matches/[matchId]`. Use `opponent_id` as the match id. Show a non-empty end state ("You've seen all your matches") - never an empty screen.

### Success Criteria:

#### Automated Verification:
- [ ] `cd frontend && npx tsc --noEmit`
- [ ] `cd frontend && npm run lint`
- [ ] `cd frontend && npm run build`

#### Manual Verification:
- [ ] Cards render from real arena data with score/headline/opener; swipe and explicit buttons both work.
- [ ] Save/Pass persist across reload; the queue never shows an empty/undefined state.

**Implementation Note**: Pause for confirmation before Phase 6.

---

## Phase 6: Match Detail + Eavesdrop + Programmatic Copilot

### Overview
Build `/matches/[matchId]` with full evidence, Eavesdrop (real transcript), and the programmatic mock Copilot panel reused across preview/queue/detail.

### Changes Required:

#### 1. Match detail
**File**: `frontend/app/matches/[matchId]/page.tsx` (new)
**File**: `frontend/components/MatchDetailPanel.tsx` (new)
**Changes**: Resolve the card from `arenaCards` by `opponent_id`. Render: headline, score, match type, why-you-should-meet (`summary`), strongest overlap, non-obvious overlap, complementary dynamic, suggested opener (with Copy), follow-up questions, what you can help them with / they can help you with (from `complementary_dynamic` + persona help fields), possible mismatch (derived line), privacy note (static reassurance), and an agent conversation summary. Actions: Copy opener, Ask my agent why, Give me a less awkward opener, Save, Pass, Meet, Eavesdrop.

#### 2. Eavesdrop
**File**: `frontend/components/AgentConversationViewer.tsx` (new)
**Changes**: On "Eavesdrop", if `conversation_id` exists, call `api.getArenaConversation(token, conversation_id)` and render concise chat bubbles (speaker-attributed), defaulting to the highlights (`conversation_highlights`) with an option to expand to the full transcript. Keep it concise and charming per PRD; never a wall of text by default.

#### 3. Programmatic mock Copilot
**File**: `frontend/components/MockCopilotPanel.tsx` (new)
**File**: `frontend/lib/copilot.ts` (new)
**Changes**: `copilot.ts` composes responses deterministically from a `MatchCard` (no LLM):
- "Why should I meet this person?" -> `headline` + `summary` + `strongest_overlap`, with `non_obvious_overlap` as the "non-obvious part".
- "Give me a less awkward opener" -> `suggested_opener` plus a softer templated variant built from the top `common_interests` item.
- "What should I ask next?" -> `follow_up_questions`.
For preview surfaces (no card): "Make my privacy stricter" -> deterministically toggle the preview's privacy settings to a stricter state; "Make this sound more like me" / "less corporate" -> templated acknowledgement + swap to a warmer preview blurb variant. The panel renders contextual prompt buttons per surface (preview/queue/detail) and shows the composed response. Wire it into `MatchCard` (Ask Why), `MatchDetailPanel`, and `AgentPreviewCard`.

### Success Criteria:

#### Automated Verification:
- [ ] `cd frontend && npx tsc --noEmit`
- [ ] `cd frontend && npm run lint`
- [ ] `cd frontend && npm run build`

#### Manual Verification:
- [ ] Match detail shows all evidence fields with no undefined values and Copy opener works.
- [ ] Eavesdrop fetches and renders the real transcript concisely (highlights by default).
- [ ] Copilot prompts return responses clearly grounded in that specific match's data; preview privacy toggle visibly tightens settings.

**Implementation Note**: Pause for confirmation (Copilot quality + privacy) before Phase 7.

---

## Phase 7: Meet Confirmation + Local Persistence + Polish

### Overview
Add the mock Meet confirmation, finalize Save/Pass/Meet local persistence, and do a visual/acceptance polish pass against the PRD checklist.

### Changes Required:

#### 1. Meet confirmation
**File**: `frontend/components/MeetConfirmationScreen.tsx` (new) (rendered as a modal/overlay or `/matches/[matchId]` sub-state; no new route required)
**Changes**: Show match avatar/name, the PRD confirmation copy ("Meet request saved. In the real app, {name} would be notified that you are interested in meeting."), a future-notification explanation, and CTAs: back to matches and view match detail. Record the id in `metMatchIds`.

#### 2. Persistence wiring
**Files**: `frontend/app/matches/page.tsx`, `frontend/app/matches/[matchId]/page.tsx`
**Changes**: Ensure Save/Pass/Meet all read/write the localStorage arrays and reflect state (e.g. "Saved" pill) across reloads. Reset clears them via `localStore.reset()`.

#### 3. Polish + closing line
**Files**: new screens + `frontend/app/globals.css` as needed
**Changes**: Mobile spacing, rounded corners, soft shadows, gradients, score badges, animated transitions; ensure CTAs are clear and copy follows the PRD copy system. Add the closing demo line on the final screen: "The agents do not replace the human conversation. They make sure the right human conversations actually happen."

### Success Criteria:

#### Automated Verification:
- [ ] `cd frontend && npx tsc --noEmit`
- [ ] `cd frontend && npm run lint`
- [ ] `cd frontend && npm run build`

#### Manual Verification (PRD acceptance pass):
- [ ] Full happy path completes with the backend running: landing -> demo loading -> (join) -> onboarding (skip + paste) -> preview -> arena -> matches -> detail -> eavesdrop -> Copilot -> Meet confirmation.
- [ ] No broken routes, no undefined values, no empty match screen, no visible YAML or raw JSON anywhere.
- [ ] Save/Pass/Meet persist; reset clears demo state.
- [ ] Looks good on mobile; swipe and explicit buttons both work; demo completable in ~3 minutes.

**Implementation Note**: Final phase - confirm the end-to-end PRD acceptance criteria.

---

## Testing Strategy

There is no frontend test harness today, and the PRD is a demo; verification is build/lint/type plus manual walkthrough.

### Automated (per phase):
- `cd frontend && npx tsc --noEmit` (type safety across new screens/components).
- `cd frontend && npm run lint`.
- `cd frontend && npm run build` (catches route/component build errors).

### Manual end-to-end (Phase 7):
1. Start backend (`uvicorn app.main:app`) and `cd frontend && npm run dev`.
2. Run both onboarding branches (paste context, and skip -> required questions).
3. Verify privacy: inspect preview, match detail, and eavesdrop for any YAML/raw/internal fields (must be none).
4. Walk the full happy path; confirm Save/Pass/Meet persistence and reset.

## Performance Considerations

- `/arena/start` is the only slow call (~30-60s of LLM work). The theatrical arena animation masks it; results are cached to `arenaCards` so `/matches` and `/matches/[matchId]` render instantly without re-calling.
- Copilot and Meet are local/deterministic - zero network latency.
- Eavesdrop fetches a transcript on demand (small payload).

## Migration Notes

- No backend or schema changes. No data migration.
- Route move: `frontend/app/arena/page.tsx` (live queue) -> `frontend/app/live/page.tsx`; `/arena` rebuilt as theatrical. The live flow stays fully functional via `/live`. `/room/[roomId]` back target updates to `/live`.
- New localStorage keys are additive and included in `localStore.reset()`.

## References

- PRD: `Docs/Twinder_PRD.md`
- UX/product spec: `Docs/twinder_mvp_ux_product_spec_v0_3.md`
- Handoff + gap list: `Docs/twinder_developer_handoff_v0_3.json`
- In-progress backend plan (complementary, backend-only): `Docs/plans/2026-06-06-weave-llm-integration.md`
- Backend match card shape: `app/schemas.py:50`; scoring prompt fields: `app/agents/prompts.py:73`
- Arena endpoints: `app/arena/router.py:14`, `:38`, `:54`
- Intake endpoint: `app/users/router.py:42`
- Data seam: `frontend/lib/api.ts`; local store: `frontend/lib/local-store.ts`; personas: `frontend/lib/personas.ts`
- Existing live flow to preserve: `frontend/app/arena/page.tsx`, `frontend/app/room/[roomId]/page.tsx`
```