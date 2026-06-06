# Twinder Frontend Demo MVP UX + Product Spec - v0.3

Date: 2026-06-06

## Status

This document is aligned to `Docs/Twinder_PRD.md` and should be treated as the UX/product build spec for the PRD-target frontend demo. The PRD remains the source of truth. This spec translates it into screen behavior, copy, component expectations, and acceptance criteria.

Current repo note: the checked-in implementation has moved beyond the PRD's frontend-only mock target in some areas. The repo now contains a Next.js frontend plus a FastAPI, Redis, SQLite, WebSocket, and LiteLLM backend prototype. This document keeps the PRD demo target intact while calling out where the current implementation differs.

## Current Implementation Snapshot

As of 2026-06-06, the repo includes:

- `frontend/` Next.js App Router app using TypeScript, Tailwind CSS, React, and `lucide-react`.
- `app/` FastAPI backend with Google OAuth, dev-login JWT auth, SQLite models, Redis state, WebSocket chat, LiteLLM agent calls, intake/profile synthesis, arena conversations, and vibe scoring.
- Seven seeded demo users in `app/seed.py`, matching the PRD names: Alexis, Haley, Leo, Maya, Jordan, Priya, and Marcus.
- Local browser state in `frontend/lib/local-store.ts` for token, selected user, persona id, and current room id.

Implemented frontend routes:

- `/`: landing page with Try the demo and Google sign-in CTAs.
- `/demo`: demo persona selector that calls `POST /auth/dev-login`, stores auth/demo state, and routes into the arena.
- `/arena`: live matchmaking queue screen wired to `POST /rooms/matchmake` and `GET /rooms/matchmake/status`.
- `/room/[roomId]`: live room conversation, WebSocket messages, Take Over, Wrap Up, and Vibe Score result overlay.
- `/auth/callback`: OAuth callback token handling.

Implemented backend surfaces:

- Auth: `GET /auth/google`, `GET /auth/callback`, `POST /auth/dev-login`, `GET /auth/me`, `POST /auth/logout`.
- Users and intake: `GET /users/me`, `PUT /users/me`, `POST /users/me/intake`, `GET /users/{user_id}`.
- Rooms: `POST /rooms/matchmake`, `GET /rooms/matchmake/status`, `GET /rooms`, `GET /rooms/{room_id}`, `GET /rooms/{room_id}/messages`, `POST /rooms/{room_id}/takeover`, `POST /rooms/{room_id}/complete`.
- Realtime: `WS /ws/rooms/{room_id}?token={jwt}`.
- Arena: `POST /arena/start`, `GET /arena/results`, `GET /arena/conversation/{conversation_id}`.

Current gaps against this PRD target:

- `/demo` does not yet show the playful 5 to 8 second loading sequence.
- `/join`, `/integrations`, `/onboarding`, `/onboarding/questions`, `/onboarding/preview`, `/matches`, and `/matches/[matchId]` are not implemented.
- The frontend arena currently uses 1:1 matchmaking rooms, not the PRD's short 5-agent theatrical arena flow. The backend has an `/arena/start` API that generates ranked match cards against all other database users, which is six opponents when the seven seeded demo users exist.
- The backend intake endpoint can generate hidden YAML/profile data and a sanitized twin preview, but no frontend onboarding or twin preview UI calls it yet.
- Swipeable match cards, match detail, Eavesdrop as a separate match-detail action, mock Copilot, Save, Pass, and Meet confirmation are not implemented in the frontend.
- Generated avatars are currently colored initials, not image assets and not real human photos.

## 1. Product Framing

Twinder is a mobile-first web app where personality-rich digital twins meet before the humans do.

The demo should feel like:

> My agent met your agent, found a real reason we should talk, and gave me the perfect opener.

Primary positioning:

> Tinder for agents.

Twinder is not a shallow profile browser, an enterprise AI dashboard, or a dating app clone. The magic is that agents work the room, compare context, surface real overlap, and give the human a warm reason to start a conversation.

## 2. MVP Scope

The PRD target is a polished frontend-only demo. The current repo is a backend-integrated prototype, so implementation work should be explicit about whether it is preserving the PRD target experience, wiring existing backend functionality into that experience, or replacing mocked behavior with live backend behavior.

For the PRD target, use:

- Next.js App Router
- TypeScript
- Tailwind CSS
- mocked users
- mocked twin profiles
- mocked arena events
- mocked match cards
- mocked agent conversations
- mocked Copilot-style explanations
- localStorage for temporary demo state
- hidden YAML/profile data that is never exposed directly to users

In the current repo, these planned mock boundaries are partially replaced by live code:

- `frontend/lib/api.ts` calls the FastAPI backend directly.
- `app/agents/profile.py` and `app/agents/synthesis.py` generate hidden profile YAML, matching vectors, and system instructions.
- `app/agents/arena.py` can run real LLM-backed arena conversations and return ranked `MatchCard` objects.
- `app/rooms/router.py`, `app/chat/router.py`, and `app/agents/engine.py` power live 1:1 room conversations.
- `app/agents/scorer.py` scores completed room conversations.
- Redis and SQLite are required for the live backend flow.

Do not implement as part of the PRD-target frontend-only demo work:

- real FastAPI backend
- Redis
- real LLM calls
- real CopilotKit actions
- real imports from ChatGPT, Apple Notes, files, LinkedIn, GitHub, or other services
- real notifications
- real identity verification
- raw YAML editing

Future backend references in the PRD-target demo are allowed only as implementation notes. Since this repo already has backend code, frontend work should isolate backend calls behind `frontend/lib/api.ts` and keep local-only product actions, such as Save, Pass, and mocked Meet, separate until real product endpoints exist.

## 3. Core Demo Goal

The demo should be completable in under 3 minutes.

Happy path:

1. User opens Twinder.
2. Demo starts with Alexis selected by default.
3. User can skip intake or paste lightweight context.
4. User answers required playful onboarding questions.
5. User previews the twin personality.
6. User enters a short 5-agent arena.
7. Agents appear to meet each other.
8. User receives ranked, swipeable match cards.
9. User opens match detail.
10. User sees why the match exists.
11. User can inspect agent highlights or eavesdrop on a selected agent conversation.
12. User can Meet, Save, Pass, or Ask Why.
13. Mock Copilot explains why the match is useful.

## 4. UX Principles

The product should feel:

- mobile-first
- playful
- social
- polished
- warm
- slightly futuristic
- privacy-aware
- less corporate than typical AI tools

Avoid:

- enterprise dashboard feel
- raw JSON
- visible YAML
- technical implementation language in user-facing screens
- creepy dating language
- generic AI buzzwords
- long transcripts by default

## 5. Demo Users

The demo includes 7 seeded users:

1. Alexis
2. Haley
3. Leo
4. Maya
5. Jordan
6. Priya
7. Marcus

Alexis is selected by default. All users should have generated avatars. These are stylized agent/user representations, not real human photos.

The demo must include enough mocked profile and match data for Alexis to produce a compelling arena and match queue without any backend dependency.

## 6. Routes And Screens

### 1. Landing Page

Route: `/`

Goal: Sell the concept quickly and move users into the demo.

User sees:

- product tagline
- short explanation of "Tinder for agents"
- CTA to try demo
- CTA to create twin

Hero copy:

> Your agent works the room before you do.

Subcopy:

> Create a digital twin, let it meet other agents, and discover who you should actually talk to.

Primary CTA:

> Try the demo

Secondary CTA:

> Create my twin

### 2. Demo Entry

Route: `/demo`

Goal: Establish the fake demo environment and default to Alexis.

Before selection, show a playful loading sequence for about 5 to 8 seconds.

Loading visuals:

- large animated spinner or orbital agent motion
- floating integration cards
- fake ingestion progress
- generated avatars appearing
- short rotating status messages

Rotating messages:

- Integrating chat history from ChatGPT...
- Bringing in your Notes...
- Reading old essays...
- Reviewing your resume...
- Looking through your GitHub...
- Connecting your LinkedIn...
- Finding recurring obsessions...
- Identifying weird niche interests...
- Snooping your texts - just kidding... probably.
- Teaching your agent how you think...
- Building your digital twin...

Final loading state:

> Twin ready.

After loading, user can:

- see demo event `HACK-AI-2026`
- see Alexis selected by default
- switch to another seeded demo user
- reset local demo state
- continue as the selected user

Primary CTA:

> Continue as Alexis

### 3. Join Event

Route: `/join`

Goal: Show how a real user would enter an event while keeping MVP behavior mocked.

User can:

- enter event code
- choose mode: Hackathon, Networking, Dating, or Custom
- use the demo shortcut

For MVP, this can route directly into demo state. Mode affects copy, match explanations, and agent conversation tone, not backend behavior.

### 4. Intake

Route: `/onboarding`

Goal: Make twin creation feel faster than dating-app onboarding.

User may:

1. Paste context.
2. Skip intake and answer questions instead.

Paste context examples:

- freeform text
- LinkedIn summary
- resume
- personal bio
- ChatGPT-generated self-description

The app creates a hidden structured profile from this input. The user never sees YAML, raw profile JSON, or system instructions.

Skip CTA:

> Skip this - ask me questions instead

If user skips intake:

- required questions become the source of truth for the demo twin
- follow-up questions become required only if needed for demo completeness

### 5. Mock Integrations

Route: `/integrations`

Goal: Show future import possibilities without implementing them.

Cards:

- ChatGPT
- Apple Notes
- Upload Files

Each card shows:

- icon or generated visual
- short description
- mock connection status
- disabled or "Coming soon" connect state

These integrations are visual-only in MVP.

### 6. Required Questions

Route: `/onboarding/questions`

Goal: Collect enough personality and intent to build a usable twin even when intake is skipped.

Required questions:

1. If you could have an animal follow you around, what kind of animal would it be and why?
2. What is your favorite color, why, and how does it make you feel?
3. What do you want from this event/profile, and what should people know about you?

Follow-up question cap: 3.

Suggested follow-ups:

4. Who are you hoping your agent finds for you?
5. What can you help people with in 15 minutes?
6. What should your agent never share?

Question types may include:

- open text
- choose one
- choose three
- optional slider

Each answer updates the hidden twin profile and should visibly improve the preview.

### 7. Twin Preview

Route: `/onboarding/preview`

Goal: Let the user approve how the twin will represent them.

Show a human-readable agent card only. Do not expose YAML, raw structured fields, or generated system instructions.

Sections:

- Agent name
- Generated avatar
- Agent vibe
- Looking for
- Conversation bait
- Can help with
- Wants help with
- Agent voice
- Privacy settings
- Profile completeness score

Primary CTA:

> Approve twin

Secondary CTAs:

- Edit voice
- Edit privacy
- Ask my agent to improve this

For MVP, "Ask my agent" opens the mocked Copilot panel.

### 8. Agent Arena

Route: `/arena`

Goal: Make the user feel their agent is actively meeting the room.

Requirements:

- keep animation short
- show generated avatars
- use floating agent bubbles or cards
- show quick overlap discoveries
- show highlights, not full conversations
- include mode-aware language
- avoid overwhelming the user

Example status feed:

1. Alexis Twin entered the arena.
2. Alexis Twin is meeting Haley Twin.
3. Highlight: both care about making networking less awkward.
4. Alexis Twin is meeting Leo Twin.
5. Highlight: agent-to-agent infrastructure meets social UX.
6. Alexis Twin is meeting Maya Twin.
7. Highlight: playful product design could make this feel less creepy.
8. Alexis Twin is meeting Jordan Twin.
9. Highlight: community launch strategy could make the demo spread.
10. Generated match cards.

Counters:

- Agents met
- Matches found
- Top score

CTA:

> View matches

### 9. Match Queue

Route: `/matches`

Goal: Deliver the main payoff with stacked, swipeable cards.

Layout:

- Tinder-inspired stacked cards
- mobile-first card gestures
- explicit buttons for accessibility
- generated avatar per match
- clear match score and reason

Each card includes:

- generated avatar
- name
- score
- match type
- headline
- summary
- suggested opener

Actions:

- Meet
- Ask Why
- Save
- Pass
- Swipe Left
- Swipe Right

Meet behavior for MVP:

- show a mock intro or confirmation screen
- do not send a real notification

Example:

> Meet request saved. In the real app, Haley would be notified that you are interested in meeting.

### 10. Match Detail

Route: `/matches/[matchId]`

Goal: Explain why this person is worth meeting and provide a low-friction opener.

Show:

- Match headline
- Score
- Match type
- Why you should meet
- Strongest overlap
- Non-obvious overlap
- Complementary dynamic
- Suggested opener
- Follow-up questions
- What you can help them with
- What they can help you with
- Possible mismatch
- Privacy note
- Agent conversation summary

Evidence types:

- shared interests
- complementary skills
- similar goals
- personality alignment
- conversation chemistry
- constructive tension

Actions:

- Copy opener
- Ask my agent why
- Give me a less awkward opener
- Save
- Pass
- Meet
- Eavesdrop

### 11. Eavesdrop

Goal: Let the user inspect selected highlights from the agent conversation.

The Eavesdrop view should be:

- entertaining
- charming
- useful
- personalized
- concise
- allowed to include playful disagreement or tension

Show selected highlights by default, not long raw transcripts.

Example tone:

```txt
Alexis Agent:
You seem unusually interested in making networking less painful for introverts.

Haley Agent:
Guilty. Most networking events feel like speed-running social anxiety.

Alexis Agent:
Interesting. My human keeps trying to build software that creates better reasons for people to talk.

Haley Agent:
Mine keeps asking why every networking product feels emotionally tone-deaf.

Alexis Agent:
I suspect our humans are circling the same problem from opposite directions.

Haley Agent:
Agreed. Also, they would probably spend 45 minutes debating onboarding flows.

Alexis Agent:
That is either a warning or a recommendation.
```

### 12. Mock Copilot Panel

Available on:

- Twin preview
- Match queue
- Match detail

Preview prompts:

- Make this sound more like me
- Make this less corporate
- Make my privacy stricter

Match detail prompts:

- Why should I meet this person?
- Give me a less awkward opener
- What should I ask next?

All responses are mocked.

### 13. Meet Confirmation

Goal: Complete the demo without pretending there is a real notification system.

Show:

- match avatar/name
- confirmation message
- future notification explanation
- CTA back to matches
- CTA view match detail

Example copy:

> Meet request saved. In the real app, Haley would be notified that you are interested in meeting.

## 7. Conversation And Matching Style

Agent conversations should feel slightly theatrical, but highlights should stay concise.

Mode differences:

- Hackathon: collaboration, skills, build potential
- Networking: professional relevance, mutual help, warm intro
- Dating: compatibility, emotional style, values, conversation chemistry
- Custom: user-defined intent

Tone:

- warm
- sharp
- playful
- curious
- socially intelligent
- never sexually explicit
- never creepy

The agents should not replace the human conversation. They should help the right human conversations happen.

## 8. Privacy And Safety

Required:

- YAML/profile data is always hidden
- no raw YAML editor
- no raw debug JSON in normal user flow
- no contact info revealed as part of the MVP
- no real external imports
- mock integrations must be clearly non-functional
- user-facing screens should not imply the agent can commit, flirt, or speak for the user beyond recommendations

User should understand:

- what the twin will say about them
- what stays private
- why a match was recommended
- that Meet is mocked in the demo

## 9. Component Specs

### DemoLoadingScreen

Displays:

- animated loading visual
- rotating integration messages
- fake ingestion progress
- generated avatars
- final "Twin ready" state

### DemoUserSelector

Displays:

- event name
- selected demo user
- seeded user options
- reset demo state
- continue CTA

### IntakeContextCard

Displays:

- paste context area
- skip intake button
- privacy reassurance
- no YAML shown

### RequiredQuestionFlow

Displays:

- one focused question at a time
- progress indicator
- answer input
- optional follow-up handling
- clear next/continue actions

### AgentPreviewCard

Displays:

- generated avatar
- agent vibe
- looking for
- conversation bait
- can help with
- wants help with
- privacy settings
- completeness score

### ArenaStatusFeed

Displays:

- agent meeting status
- overlap highlights
- counters
- short completion state

### MatchCard

Displays:

- generated avatar
- name
- score
- match type
- headline
- summary
- suggested opener
- Meet, Ask Why, Save, Pass actions

### MatchDetailPanel

Displays:

- match evidence
- overlap and complementary dynamic
- suggested opener
- possible mismatch
- privacy note
- actions

### AgentConversationViewer

Displays:

- selected agent highlights
- chat bubbles
- optional timestamps
- overlap callouts
- concise dialogue

### MeetConfirmationScreen

Displays:

- match avatar/name
- confirmation message
- mock/future notification explanation
- CTA back to matches
- CTA view match detail

### MockCopilotPanel

Displays:

- contextual prompt buttons
- mocked explanation responses
- opener variants
- privacy or voice improvement suggestions

## 10. Visual Direction

Use:

- Tinder-inspired interactions
- swipeable cards
- rounded corners
- soft shadows
- subtle gradients
- floating agent bubbles
- generated avatars
- animated transitions
- match score badges
- conversational UI
- animated arena status feed

Do not use:

- heavy enterprise dashboard layouts
- photo-first dating UI
- visible data schemas
- raw implementation artifacts
- overly technical controls

## 11. Copy System

Use:

- agent
- twin
- works the room
- worth talking to
- match
- opener
- overlap
- chemistry
- useful context
- warm intro

Avoid:

- soulmate
- hotness
- marketplace
- rank, unless referring to "ranked cards" internally
- explicit sexual language
- anything that implies the agent makes commitments for the user

Primary line:

> Your agent works the room before you do.

Closing demo line:

> The agents do not replace the human conversation. They make sure the right human conversations actually happen.

## 12. Acceptance Criteria

### Core Flow

- User can open landing page.
- User can enter demo mode.
- Demo shows loading simulation.
- Alexis is selected by default.
- User can skip intake.
- User can paste context if desired.
- YAML is never exposed.
- User can answer required playful questions.
- Follow-up questions are capped at 3.
- User can preview and approve twin.
- User can enter arena.
- Arena animation is short.
- Arena shows theatrical highlights.
- User can view swipeable matches.
- User can open match detail.
- User can inspect match evidence.
- User can eavesdrop on agent conversations.
- User can get mocked Copilot explanation.
- User can copy opener.
- User can save/pass/meet locally.
- Meet opens a mock confirmation screen.

### Data

- 7 seeded users exist.
- Alexis is default.
- Generated avatars exist.
- Match conversations exist.
- Match copy is specific and compelling.
- Twin profiles have personality.
- localStorage persists state during demo.

### UI

- Looks good on mobile.
- Swipe interactions work.
- Explicit buttons work without gestures.
- No broken routes.
- No undefined values.
- No empty match screens.
- No visible YAML.
- No raw debug JSON in normal flow.
- CTA buttons are clear.
- Demo can be completed in under 3 minutes.

## 13. Build Priority

If time is limited, build in this order:

1. Mock data
2. Mobile shell
3. Demo loading screen
4. Demo entry with Alexis selected
5. Skippable intake
6. Required playful questions
7. Capped follow-up questions
8. Twin preview
9. Short arena animation
10. Swipeable match queue
11. Match detail
12. Agent conversation viewer
13. Meet confirmation screen
14. Mock Copilot panel
15. Mock integrations page
16. Visual polish

## 14. Backend Integration Notes

The PRD originally treated Python FastAPI, Redis, LLM profile generation, and agent orchestration as future backend work. The current repo already contains those backend pieces, but the frontend does not yet expose the full PRD demo experience on top of them.

For continued frontend work, keep data access isolated:

- live backend calls in `frontend/lib/api.ts`
- demo personas in `frontend/lib/personas.ts`
- local demo/auth persistence in `frontend/lib/local-store.ts`
- typed data consumed by components
- no hardcoded data inside page components when avoidable
- local-only PRD actions, such as Save, Pass, and mocked Meet, should remain separate until product endpoints exist
