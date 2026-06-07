# Twinder UX Overhaul — Implementation Plan
## Date: 2026-06-06

## Overview

Six sequenced changes that redesign the Twinder demo and post-arena experience:
1. Demo skips onboarding, goes straight to arena
2. Onboarding streamlined to 3 skippable questions (for the real "Join an event" path)
3. Arena scores cached per user-pair; background task enables incremental card surfacing
4. Swipe stack fills live — first card appears as soon as it's scored
5. Tap a person → full chat replay (messages animate in one by one, score at top) → "View Summary" button → separate summary screen with actions
6. Match card schema: add `tip` + `fun_facts[3]`, move `suggested_opener` to expanded, restructure summary vs. expanded sections

## Current State

- `/demo` → `router.push('/onboarding')` at `frontend/app/demo/page.tsx:31`
- Onboarding: intake page → 7 questions (4 required + 3 follow-ups including DAT) → preview
- `POST /arena/start` blocks 30–60s, runs all conversations via `asyncio.gather`, returns all cards at once
- Match cards stored at `arena:{userId}:latest` in Redis (no per-pair caching)
- `/matches` is a swipe stack that loads all cards at once after arena completes
- Tap card → `matches/[id]` (summary/detail first, conversation collapsed at bottom)
- `MatchCard` schema: `suggested_opener` (long), no `tip`, no `fun_facts`

## Desired End State

**Demo flow:** `/demo` → `/arena` (run starts immediately, cards trickle in as they score, first card appears in swipe stack as soon as it arrives)

**Onboarding (Google auth path):** 3 questions — animal, DAT, event goals — all individually skippable. Submit directly under text box, skip below that, "Finish onboarding" at very bottom to exit early. No intake/paste-context page in this 3-question flow.

**Arena:** Background task immediately returns; frontend polls `/arena/results` every 2s; swipe stack on the same page shows cards as they arrive in sorted order. Pair scores cached in Redis so A vs B is never scored twice.

**Chat UX:** Tap any person → chat replay screen. Score badge visible at top. Messages animate in one-by-one (100ms delay between messages). "View Summary" button pinned at bottom of screen. → Separate summary screen: tip (one line) + 3 fun-fact bullets + strongest_overlap + follow_up_questions + Pass/Ask why/Save/Meet actions.

**Expanded section** (accessible from summary screen): suggested_opener + non_obvious_overlap + complementary_dynamic + common_interests + openness + full transcript.

## What We're NOT Doing

- Not adding real-time WebSocket streaming for arena (polling is sufficient)
- Not replacing the swipe stack with a scrollable leaderboard (swipe stack stays)
- Not removing the `/onboarding` route (it's the real signup path for Google auth users)
- Not adding backend persistence for pass/save/met (still localStorage)
- Not changing the "Join an event" landing flow or Google OAuth

---

## Phase 1 — Demo → Arena (routing fix)

### Overview
One-line change: demo logs in and goes directly to `/arena` instead of `/onboarding`.

### Changes Required

#### 1. `frontend/app/demo/page.tsx`
**File**: `frontend/app/demo/page.tsx:31`
**Change**: `router.push('/onboarding')` → `router.push('/arena')`

```diff
- router.push('/onboarding');
+ router.push('/arena');
```

### Success Criteria
- [ ] Selecting a persona and clicking "Continue as X" lands on `/arena`, not `/onboarding`
- [ ] Arena fires immediately without any onboarding steps
- [ ] Back button / error paths in arena still return to `/demo` (unchanged)

---

## Phase 2 — Streamlined onboarding (3 questions, all skippable)

### Overview
Replace the current 7-question flow with 3 questions: animal, DAT, event_goals. All three individually skippable. Button layout: submit directly under the text/DAT input → skip this question below that → "Finish onboarding" at the very bottom of the screen. Remove the intake (paste/upload) page from this question flow; the `/onboarding` entry point goes directly to the 3-question screen.

### Changes Required

#### 1. `frontend/components/RequiredQuestionFlow.tsx`
- Reduce `REQUIRED_QUESTIONS` to 3 items: `animal`, `dat`, `event_goals`
- Remove `FOLLOW_UP_QUESTIONS` array entirely
- Every question (including required) gets a skip button
- Layout per question:
  - Question text
  - Textarea / DivergentAssociationTask
  - **"Continue →" / "Submit" button** directly below input
  - **"Skip this question"** text link below that
  - **"Finish onboarding →"** persistent button at the very bottom of the screen (always visible, exits immediately to arena)
- Progress bar stays, but counts out of 3

```ts
export const REQUIRED_QUESTIONS: FlowQuestion[] = [
  { id: 'animal', text: 'If you could have an animal follow you around, what would it be and why?' },
  { id: 'dat', text: 'Quick creativity check: name 10 words as different from each other as possible.', kind: 'dat' },
  { id: 'event_goals', text: 'What do you want from this event, and what should people know about you?' },
];
// Remove FOLLOW_UP_QUESTIONS
```

- `handleContinue`: allow progression even with empty input (skip-on-empty is opt-in via skip button; the submit button is still disabled if empty, but skip is always enabled)
- Add `handleSkip()`: advances with empty string for current question
- Add `handleFinishEarly()`: calls `onComplete(answers)` with whatever has been filled in so far, regardless of step
- Remove `hasPastedContext`/`skippedIntake` props (no longer needed)

#### 2. `frontend/app/onboarding/questions/page.tsx`
- Remove `hasPastedContext` and `skippedIntake` props passed into `RequiredQuestionFlow`
- Update `handleComplete` to push to `/onboarding/preview` (unchanged)

#### 3. `frontend/app/onboarding/page.tsx` (the intake/paste page)
- This page is now only reached directly by Google auth users landing at `/onboarding`
- Keep the paste/upload functionality (it feeds into profile synthesis for real users)
- Add a "Skip to questions →" button that goes to `/onboarding/questions`
- The intake page itself stays intact — it's still useful for real users who have a LinkedIn/resume

### Success Criteria
- [ ] Onboarding shows exactly 3 questions, progress bar reads "1 of 3", "2 of 3", "3 of 3"
- [ ] Submitting empty text on any question is blocked (submit button disabled), but skip is always enabled
- [ ] Skipping any question advances to next
- [ ] "Finish onboarding" button is always visible at bottom and takes user directly to arena
- [ ] Demo flow (Phase 1) bypasses `/onboarding` entirely — this only affects Google auth path

---

## Phase 3 — Incremental arena: background task + per-pair score cache

### Overview
Two backend changes:
1. `POST /arena/start` returns immediately (status: "running") and runs the arena in a background task. Frontend polls `/arena/results` to pick up cards as they're scored.
2. Per-pair scores are cached in Redis. If `arena-pair:{min_id}:{max_id}` exists, the cached card is reused — no repeat LLM calls.

### Changes Required

#### 1. `app/agents/arena.py`

**a) Per-pair caching in `_arena_conversation`**

At the top of `_arena_conversation`, check Redis for an existing result:

```python
async def _arena_conversation(user_a: User, user_b: User, mode: str) -> dict:
    r = get_redis()
    pair_key = f"arena-pair:{min(user_a.id, user_b.id)}:{max(user_a.id, user_b.id)}"
    cached_raw = await r.get(pair_key)
    if cached_raw:
        card = json.loads(cached_raw)
        # Flip perspective: cached may be stored from b's POV if b ran first
        if card.get("opponent_id") != user_b.id:
            card = _flip_card_perspective(card, user_a, user_b)
        return card
    # ... rest of existing conversation + scoring logic ...
    # After building match_card, store it:
    await r.set(pair_key, json.dumps(match_card), ex=86400)  # 24h TTL
    return match_card
```

Add `_flip_card_perspective(card, user_a, user_b)` helper that swaps `opponent_id`/`opponent_name`/`opponent_avatar` and adjusts `headline`/`summary` fields to be from user_a's perspective. (Simple field swap; the score and overlap fields are symmetric enough to reuse.)

**b) Incremental write in `run_arena`**

Replace the `await asyncio.gather(*tasks)` pattern with per-task completion writes:

```python
async def run_arena(user_id: int, mode: str = "networking") -> list[dict]:
    # ... setup same as before ...
    r = get_redis()
    arena_id = str(uuid.uuid4())
    result_key = f"arena:{user_id}:latest"

    async def run_one(opponent):
        card = await _arena_conversation(user, opponent, mode)
        if not isinstance(card, dict) or "score" not in card:
            return
        # Append to running sorted list in Redis
        raw = await r.get(result_key)
        current = json.loads(raw)["match_cards"] if raw else []
        current.append(card)
        current.sort(key=lambda x: x.get("score", 0), reverse=True)
        await r.set(result_key, json.dumps({"arena_id": arena_id, "match_cards": current}), ex=3600)

    await asyncio.gather(*[run_one(opp) for opp in opponents], return_exceptions=True)
    # Final sorted result already in Redis; return it
    raw = await r.get(result_key)
    return json.loads(raw)["match_cards"] if raw else []
```

#### 2. `app/arena/router.py`

Change `POST /arena/start` to use `BackgroundTasks`:

```python
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query
from app.agents.arena import run_arena

@router.post("/start", response_model=ArenaResponse)
async def start_arena(
    background_tasks: BackgroundTasks,
    mode: str = Query(default="networking"),
    user: User = Depends(get_current_user),
):
    r = get_redis()
    arena_id = str(uuid.uuid4())
    # Seed an empty result so /results 200s immediately
    await r.set(f"arena:{user.id}:latest", json.dumps({"arena_id": arena_id, "match_cards": []}), ex=3600)
    background_tasks.add_task(run_arena, user.id, mode)
    return ArenaResponse(status="running", arena_id=arena_id, match_cards=[])
```

Add a `status` field to `ArenaResponse` schema (`app/schemas.py`): `status: str = "running" | "completed"`.

Mark `completed` when `run_arena` finishes by writing a sentinel into Redis: `arena:{user_id}:status = "completed"`.

Add a new endpoint `GET /arena/status` returning `{"status": "running"|"completed", "count": N}` — lets the frontend know when to stop polling.

#### 3. `app/schemas.py`
```python
class ArenaResponse(BaseModel):
    status: str = "running"  # "running" | "completed"
    arena_id: str | None = None
    match_cards: list[MatchCard] = []
```

### Success Criteria
- [ ] `POST /arena/start` returns in <500ms with `status: "running"` and empty `match_cards`
- [ ] Repeated `GET /arena/results` within the same run returns a growing list
- [ ] Running the arena twice with the same two users skips LLM calls for the pair (check Redis logs / reduced latency)
- [ ] `GET /arena/status` returns `completed` once all conversations finish

---

## Phase 4 — Swipe stack fills live

### Overview
The `/arena` page now runs the animation and shows a "View Matches" button that appears as soon as the first card arrives. Clicking it — or navigating to `/matches` — shows a stack that live-updates. Cards stay in score order as new ones land.

### Changes Required

#### 1. `frontend/app/arena/page.tsx`

Replace the current "wait for api.startArena to resolve then push to /matches" flow:

```ts
// On mount: POST /arena/start (now fast)
// Then poll GET /arena/results every 2s
// On each poll: update localStore.setArenaCards(cards) + update UI counters
// Show "View Matches" button as soon as cards.length > 0
// Stop polling when GET /arena/status returns "completed" or after timeout
```

- `runArena()` becomes: `POST /arena/start`, start a `pollInterval` (`setInterval` 2000ms)
- Each poll tick: `GET /arena/results` → update `cards` state → update counters
- Poll stops when status is `completed` OR 90s elapses (safety timeout)
- "View Matches" button animates in when `cards.length > 0` (not only when done)
- Button label: `View Matches (${cards.length})` — count increments live
- Button lives alongside the existing animation (doesn't replace it)

```tsx
{cards.length > 0 && (
  <motion.button
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    onClick={() => router.push('/matches')}
    className="w-full py-4 rounded-2xl bg-violet-600 ..."
  >
    View Matches ({cards.length})
    <ArrowRight />
  </motion.button>
)}
```

Also add `GET /arena/status` call to a new `api.getArenaStatus(token)` method in `frontend/lib/api.ts`.

#### 2. `frontend/app/matches/page.tsx`

Matches page should also poll while arena is still running (user may have navigated from the button while more are incoming):

```ts
// On mount: load cards from localStore
// If status !== "completed", start polling GET /arena/results every 3s
// On each tick: merge new cards into state, re-sort by score
// Cards that arrive are inserted in sorted position (not appended to end)
// AnimatePresence handles new card animations
```

The swipe stack's `currentIndex` doesn't reset as new cards arrive — new cards are added to the end of the sorted array, and since `currentIndex` points to "next unviewed", they'll appear naturally as the user swipes through.

#### 3. `frontend/lib/api.ts`

Add:
```ts
getArenaStatus: (token: string) =>
  request<{ status: string; count: number }>('/arena/status', { headers: authHeaders(token) }),
```

### Success Criteria
- [ ] Navigate to `/arena`, animation starts, first card appears in "View Matches" button within ~10s
- [ ] Clicking "View Matches (2)" opens `/matches` with 2 cards
- [ ] While on `/matches`, more cards slide into sorted position as scoring completes
- [ ] Swipe stack order is by score (highest first) even as cards arrive out of order

---

## Phase 5 — Chat replay UX

### Overview
Tapping any card in the swipe stack opens a **chat replay screen** (new route or sheet). Messages animate in sequentially (100ms between). Score badge visible at top. "View Summary" button pinned at the bottom — always visible, not scrolled off. Tapping it opens a **separate summary screen** with: tip + 3 fun facts + strongest_overlap + follow_up_questions + Pass/Ask why/Save/Meet actions. Everything else (suggested_opener, non_obvious_overlap, etc.) lives in a collapsible "More" section on the summary screen.

### Changes Required

#### 1. New page: `frontend/app/matches/[matchId]/chat/page.tsx`

Full-screen chat replay. Structure:

```
┌─────────────────────────────────┐
│ ← [opponent avatar] [name]      │
│                      [score]%   │
├─────────────────────────────────┤
│                                 │
│   [messages animate in 1-by-1]  │
│                                 │
│   [loading dots when fetching]  │
│                                 │
├─────────────────────────────────┤
│     [ View Summary → ]          │  ← pinned, always visible
└─────────────────────────────────┘
```

Message reveal logic:
```ts
const [visibleCount, setVisibleCount] = useState(0);

useEffect(() => {
  if (!messages || messages.length === 0) return;
  if (visibleCount >= messages.length) return;
  const timer = setTimeout(() => setVisibleCount(v => v + 1), 100);
  return () => clearTimeout(timer);
}, [visibleCount, messages]);
```

Fetch transcript via `api.getArenaConversation(token, card.conversation_id)` on mount.
Fall back to `card.conversation_highlights` if conversation_id is null or fetch fails.

Score badge at top of header:
```tsx
<ScoreBadge score={card.score} />
```

Pinned footer:
```tsx
<div className="fixed bottom-0 ... px-5 py-4 bg-[#0a0a0f]/95 backdrop-blur border-t ...">
  <button onClick={() => router.push(`/matches/${matchId}/summary`)}>
    View Summary
    <ArrowRight />
  </button>
</div>
```

#### 2. New page: `frontend/app/matches/[matchId]/summary/page.tsx`

Minimal summary screen. Structure:

```
┌─────────────────────────────────┐
│ ← [avatar] [name]     [score]%  │
├─────────────────────────────────┤
│                                 │
│  TIP                            │
│  "Ask Priya about spaced        │
│   repetition systems"           │
│                                 │
│  FUN FACTS                      │
│  • fact one                     │
│  • fact two                     │
│  • fact three                   │
│                                 │
│  STRONGEST OVERLAP              │
│  [text]                         │
│                                 │
│  FOLLOW-UP QUESTIONS            │
│  • q1                           │
│  • q2                           │
│  • q3                           │
│                                 │
│  ▸ More details  (collapsible)  │
│    suggested_opener             │
│    non_obvious_overlap          │
│    complementary_dynamic        │
│    common_interests             │
│    openness score               │
│                                 │
├─────────────────────────────────┤
│  [Pass] [Ask why] [Save] [Meet] │  ← pinned action bar
└─────────────────────────────────┘
```

"Ask why" opens `MockCopilotPanel` inline. "Meet" triggers `MeetConfirmationScreen`.

#### 3. `frontend/app/matches/page.tsx` — change `onOpen`

```diff
- onOpen={() => router.push(`/matches/${activeCard.opponent_id}`)}
+ onOpen={() => router.push(`/matches/${activeCard.opponent_id}/chat`)}
```

#### 4. `frontend/app/matches/[matchId]/page.tsx`

The old detail page can stay as-is (it's still navigable by direct link), but swipe stack now routes to `/chat` instead. Long-term it becomes the fallback; short-term no deletion needed.

### Success Criteria
- [ ] Tapping a card in the swipe stack opens the chat replay, not the old detail page
- [ ] Score badge visible at top of chat screen
- [ ] Messages appear one-by-one with visible timing (not all at once)
- [ ] "View Summary" button always visible (doesn't scroll off) during replay
- [ ] Summary screen shows only: tip, fun_facts, strongest_overlap, follow_up_questions
- [ ] "More details" section is collapsed by default and shows the rest
- [ ] Pass/Ask why/Save/Meet buttons work from summary screen

---

## Phase 6 — Match card schema: tip + fun_facts

### Overview
Add `tip: string` and `fun_facts: string[]` (3 items) to the backend schema and scoring prompt. Move `suggested_opener` to "expanded only". Update all frontend types and components.

### Changes Required

#### 1. `app/agents/prompts.py` — `MATCH_CARD_SCORING_PROMPT`

Replace the `suggested_opener` instruction with:

```
- "tip": one short, specific action tip for the conversation (e.g. "Ask Priya about spaced repetition systems" — reference something from the actual conversation)
- "fun_facts": exactly 3 short bullet-style facts about {user_b_name} that would intrigue {user_a_name} (drawn from the conversation and profile — be concrete, not generic)
- "suggested_opener": keep but note it's a longer backup option if the human wants a full opener
```

Keep `suggested_opener` in the prompt — it just moves to the expanded section in the UI.

#### 2. `app/schemas.py`

```python
class MatchCard(BaseModel):
    score: int
    headline: str
    match_type: str
    summary: str
    tip: str | None = None
    fun_facts: list[str] = []
    strongest_overlap: str | None = None
    non_obvious_overlap: str | None = None
    complementary_dynamic: str | None = None
    suggested_opener: str | None = None
    follow_up_questions: list[str] = []
    conversation_highlights: list[ConversationHighlight] = []
    common_interests: list[str] = []
    openness_compatibility: float | None = None
    openness_scores: dict[str, float | None] | None = None
    opponent_id: int
    opponent_name: str
    opponent_avatar: str | None = None
    conversation_id: str | None = None
```

#### 3. `frontend/types/index.ts`

```ts
export interface MatchCard {
  score: number;
  headline: string;
  match_type: string;
  summary: string;
  tip: string | null;
  fun_facts: string[];
  strongest_overlap: string | null;
  non_obvious_overlap: string | null;
  complementary_dynamic: string | null;
  suggested_opener: string | null;
  follow_up_questions: string[];
  conversation_highlights: ConversationHighlight[];
  common_interests: string[];
  openness_compatibility?: number | null;
  openness_scores?: Record<string, number | null> | null;
  opponent_id: number;
  opponent_name: string;
  opponent_avatar: string | null;
  conversation_id: string | null;
}
```

#### 4. Summary screen (`frontend/app/matches/[matchId]/summary/page.tsx`)

Use `card.tip` and `card.fun_facts` in the primary section. `card.suggested_opener` goes in the collapsible "More details" alongside the rest.

#### 5. Swipe card (`frontend/app/matches/page.tsx` `SwipeCard` component)

Replace the `suggested_opener` block in the card preview with the `tip` (shorter, fits in card):

```diff
- {card.suggested_opener && (
-   <div className="p-3 rounded-2xl bg-zinc-800/60 ...">
-     <p className="text-xs text-zinc-500 mb-1">Suggested opener</p>
-     <p className="text-sm text-zinc-300 italic">&quot;{card.suggested_opener}&quot;</p>
-   </div>
- )}
+ {card.tip && (
+   <div className="p-3 rounded-2xl bg-zinc-800/60 ...">
+     <p className="text-xs text-zinc-500 mb-1">Tip</p>
+     <p className="text-sm text-zinc-300">{card.tip}</p>
+   </div>
+ )}
```

### Success Criteria
- [ ] `POST /arena/start` produces match cards with `tip` (non-null, one line) and `fun_facts` (3 items)
- [ ] Summary screen shows tip and fun facts, not the long suggested opener
- [ ] "More details" section contains suggested_opener, non_obvious_overlap, complementary_dynamic, common_interests
- [ ] All existing arena cards in localStorage display gracefully if `tip`/`fun_facts` are missing (null-safe rendering)

---

## Testing Flow (Manual)

1. Hit `/` → "Try the demo" → pick persona → confirm lands on `/arena` directly (Phase 1)
2. Arena animation starts, first "View Matches (1)" appears within ~15s (Phase 3+4)
3. Click "View Matches (2)" → swipe stack with 2 cards, more appear as scoring continues (Phase 4)
4. Tap a card → chat replay screen: score visible at top, messages animate in (Phase 5)
5. "View Summary" button visible throughout replay → tap → summary screen with tip + 3 fun facts + strongest overlap + follow-up questions (Phase 6)
6. Tap "More details" → sees suggested opener, other fields
7. Tap "Pass"/"Save"/"Meet" from summary screen — works correctly
8. Hit `/` → "Join an event" (Google auth) → `/onboarding` → paste/upload page → "Skip to questions" → 3 questions (animal, DAT, event_goals), all skippable → preview → arena (Phase 2)

## References

- Arena background task + polling: `app/agents/arena.py`, `app/arena/router.py`
- Per-pair cache key: `arena-pair:{min_id}:{max_id}` (24h TTL, symmetric)
- Swipe stack: `frontend/app/matches/page.tsx`
- Chat replay: new `frontend/app/matches/[matchId]/chat/page.tsx`
- Summary screen: new `frontend/app/matches/[matchId]/summary/page.tsx`
- Schema changes: `app/schemas.py`, `frontend/types/index.ts`
- Prompt changes: `app/agents/prompts.py` `MATCH_CARD_SCORING_PROMPT`
