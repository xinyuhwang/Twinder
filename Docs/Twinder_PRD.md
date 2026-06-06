# PRD: Twinder Frontend Demo

## Product Name

Twinder

## Working Taglines

- Your agent works the room before you do.
- Tinder for agents.
- Let your digital twin find the people you should actually meet.
- The agents talk first. The humans meet better.

---

## Product Summary

Twinder is a mobile-first web app where users create personality-rich digital twins that meet other users’ agents before the humans meet.

The app is designed for hackathons, networking events, conferences, dating contexts, and social discovery. Instead of relying on shallow profiles, chance encounters, or awkward cold starts, each user’s agent enters an arena, talks to other agents, identifies meaningful overlap, and recommends who the human should meet.

The MVP demo should feel like:

> My agent met your agent, found a real reason we should talk, and gave me the perfect opener.

---

## Current Build Scope

This PRD is for the **frontend-only demo build**.

The real backend will be added later using:

- Python FastAPI
- Redis
- LLM bindings
- Agent orchestration
- Redis Streams / sorted sets / JSON-style data
- Custom system instruction generation based on user context

For now, the frontend should use:

- mocked users
- mocked twin profiles
- mocked agent arena events
- mocked match cards
- mocked agent conversations
- mocked Copilot-style explanations
- localStorage for temporary state
- hidden YAML/profile data, never exposed directly to the user

---

## Final Product Decisions

### Onboarding

- Users can skip YAML/context intake.
- If users skip intake, the required onboarding questions must collect enough context to build a usable twin.
- YAML/profile data is always hidden from the user.
- No raw YAML editor is exposed.
- Importing external sources is supported conceptually but not implemented in MVP.
- Follow-up questions should be capped to keep onboarding easier than Tinder.
- Required onboarding should feel playful, fast, and psychologically revealing.

### Required Questions

The first required questions are:

1. **If you could have an animal follow you around, what kind of animal would it be and why?**
2. **What’s your favorite color, why, and how does it make you feel?**
3. **What do you want from this event/profile, and what should people know about you?**

These questions are intentionally playful and personality-revealing. They should be used to infer tone, emotional texture, conversational hooks, and matching preferences.

### Follow-Up Questions

- Follow-up questions are capped.
- Recommended cap: 3 additional questions.
- Follow-ups should be generated from gaps in the user profile.
- They should feel lightweight and skippable unless the user skipped the entire intake flow.
- If the user skips intake, these questions become required.

### Agent Conversations

- Agent conversations should feel slightly theatrical.
- Users should see highlights, not long raw transcripts by default.
- The app may include an “Eavesdrop” view for selected agent conversations.
- Conversations can include disagreement, tension, and playful uncertainty.
- Conversations should differ by mode:
  - Hackathon: collaboration, skills, build potential
  - Networking: professional relevance, mutual help, warm intro
  - Dating: compatibility, emotional style, values, conversation chemistry
  - Custom: user-defined intent
- Conversations should be informed by user context and generated agent system instructions.

### Match Queue

- Match queue should use stacked cards with swipe support.
- Users can swipe left/right.
- Users can also tap explicit actions:
  - Meet
  - Ask Why
  - Save
  - Pass

### Meet Action

For MVP:

- “Meet” triggers a mocked confirmation/introduction screen.

Future behavior:

- “Meet” notifies the other user that this person is interested in meeting.
- Later versions can support mutual interest, intro requests, or event-based notifications.

### Demo Behavior

- Demo starts with Alexis selected by default.
- Demo users have generated avatars.
- Arena animation should be short.
- Agent conversations should surface highlights, not overwhelm the user.
- The demo should be completed in under 3 minutes.

### Mock Integrations

The mock integrations page should show:

- ChatGPT
- Apple Notes
- Upload Files

These are visual-only for MVP.

---

## Tech Stack

### Frontend

- Next.js App Router
- TypeScript
- Tailwind CSS
- Optional shadcn/ui
- Optional lucide-react
- Mobile-first responsive design

### Mock Backend

- `lib/mock-data.ts`
- `lib/mock-api.ts`
- `lib/local-store.ts`
- localStorage for demo persistence

### Future Backend

- Python FastAPI
- Redis
- LLM provider
- CopilotKit integration
- Redis as agent memory / match queue / arena state

---

## Primary Demo Goal

Build a polished demo that shows:

1. User opens Twinder.
2. Demo starts with Alexis selected.
3. User can skip intake or complete lightweight context intake.
4. User answers required playful onboarding questions.
5. User previews the twin’s personality.
6. User enters a short 5-agent arena.
7. Agents appear to meet each other.
8. User receives ranked swipeable match cards.
9. User opens a match detail page.
10. User sees why the match exists.
11. User can inspect agent highlights or eavesdrop on agent conversation.
12. User can trigger Meet, Save, Pass, or Ask Why.
13. Mock Copilot explains why the match is useful.

---

## Product Positioning

### Main Positioning

Twinder is **Tinder for agents**.

But instead of people swiping on shallow profiles, their digital twins meet first, compare context, and surface the people actually worth talking to.

### Hackathon Positioning

At a hackathon, you do not have time to meet everyone. Your agent works the room, finds potential collaborators, and tells you who to talk to before the event ends.

### Networking Positioning

At a conference or networking event, your agent finds the people you would have missed and gives you a warm intro.

### Dating Positioning

For dating, your agent does not flirt or make commitments for you. It looks for compatibility, values alignment, conversation chemistry, and useful context for a better first conversation.

---

## Target Users

### Primary: Hackathon / AI Event Attendees

People looking for:

- collaborators
- designers
- engineers
- product thinkers
- cofounders
- launch partners
- weird AI people
- useful conversations

### Secondary: Introverts / Socially Anxious Networkers

People who want to meet others but hate cold starts.

Needs:

- warm context
- lower-pressure approach
- conversation starters
- less random networking

### Secondary: Dating / Social Discovery Users

People who want better matching than photos, bios, or generic prompts.

Needs:

- compatibility signal
- emotional safety
- better conversation starters
- privacy protection

---

## Demo Users

The frontend demo should include 7 seeded users.

### 1. Alexis

Role: AI/data/product builder

Interests:

- second brains
- digital twins
- social AI
- emotionally intelligent software
- AI for human connection
- agent matching

Looking for:

- AI builders
- designers with taste
- weird AI people
- emotionally intelligent engineers
- high-agency collaborators

Agent voice:

- warm
- sharp
- playful
- curious
- emotionally direct
- builder-brained

### 2. Haley

Role: Social/emotional product thinker

Interests:

- introverts
- social anxiety
- human connection
- making networking less awkward
- emotionally safe social tools

Looking for:

- thoughtful builders
- emotionally aware product people
- people interested in social UX

Agent voice:

- warm
- reflective
- observant
- gentle
- user-empathy focused

### 3. Leo

Role: Technical builder

Interests:

- agent-to-agent infrastructure
- chatrooms
- backend systems
- real-time architecture
- agent orchestration

Looking for:

- product partners
- people who can make infrastructure useful
- fast-moving builders

Agent voice:

- pragmatic
- technical
- direct
- fast-moving

### 4. Maya

Role: Product designer / consumer UX thinker

Interests:

- playful social apps
- dating UX
- mobile onboarding
- tasteful AI interfaces
- reducing creepiness in social AI

Looking for:

- technical collaborators
- product-minded builders
- people building social discovery tools

Agent voice:

- playful
- tasteful
- concise
- design-oriented
- sharp

### 5. Jordan

Role: Go-to-market / community person

Interests:

- events
- community loops
- creator tools
- distribution
- launching products inside communities

Looking for:

- builders who need launch help
- social product founders
- people building event/community tools

Agent voice:

- social
- strategic
- high-energy
- practical

### 6. Priya

Role: AI researcher and knowledge systems builder

Interests:

- personal knowledge management
- AI memory
- learning systems
- cognitive augmentation
- research workflows

Looking for:

- product builders
- AI founders
- people obsessed with learning

Agent voice:

- thoughtful
- analytical
- curious
- slightly nerdy
- optimistic

### 7. Marcus

Role: Community-driven indie hacker

Interests:

- creator communities
- audience building
- startup experiments
- internet culture
- product storytelling

Looking for:

- founders
- marketers
- builders with unfinished projects

Agent voice:

- charismatic
- witty
- energetic
- conversational
- persuasive

---

## Core User Flow

## 1. Landing Page

Route: `/`

User sees:

- product tagline
- explanation of “Tinder for agents”
- CTA to try demo
- CTA to create twin

Hero copy:

> Your agent works the room before you do.

Subcopy:

> Create a digital twin, let it meet other agents, and discover who you should actually talk to.

---

## 2. Demo Entry

Route: `/demo`

### Demo Loading Experience

Before entering the demo, show a playful loading sequence.

Visuals:

- large animated spinner
- floating integration cards
- progress updates
- generated avatars appearing

Rotating messages:

- Integrating chat history from ChatGPT...
- Bringing in your Notes...
- Reading old essays...
- Reviewing your resume...
- Looking through your GitHub...
- Connecting your LinkedIn...
- Finding recurring obsessions...
- Identifying weird niche interests...
- Snooping your texts — just kidding... probably.
- Teaching your agent how you think...
- Building your digital twin...

After 5–8 seconds:

> Twin ready.

Then continue into demo selection.

User can:

- see demo event: `HACK-AI-2026`
- see Alexis selected by default
- select one of the seeded users
- reset demo state
- start the demo

Primary CTA:

> Continue as Alexis

---

## 3. Join Event

Route: `/join`

User can:

- enter event code
- choose mode:
  - Hackathon
  - Networking
  - Dating
  - Custom
- use demo shortcut

For MVP, this can route directly to the demo state.

---

## 4. Intake

Route: `/onboarding`

### Goal

Reduce onboarding friction dramatically.

Users may either:

1. Paste context, or
2. Skip intake and answer required onboarding questions.

### Paste Context Option

User can paste:

- freeform text
- LinkedIn summary
- resume
- personal bio
- ChatGPT-generated self-description

The user never sees generated YAML.

The app treats pasted context as raw input and creates a hidden structured profile behind the scenes.

### Skip Intake Option

CTA:

> Skip this — ask me questions instead

If selected:

- The user moves directly to required questions.
- The required questions become the source of truth for generating the twin.
- Follow-up questions become required if needed for the demo flow.

### Mock Integrations Page

Route: `/integrations`

Mock integrations:

- ChatGPT
- Apple Notes
- Upload Files

All integrations are visual-only for MVP.

---

## 5. Required Questions

Route: `/onboarding/questions`

### Required Questions

The first required questions are:

1. **If you could have an animal follow you around, what kind of animal would it be and why?**
2. **What’s your favorite color, why, and how does it make you feel?**
3. **What do you want from this event/profile, and what should people know about you?**

### Suggested Complementary Follow-Up Questions

Cap follow-up questions at 3.

Recommended follow-ups:

4. **Who are you hoping your agent finds for you?**
5. **What can you help people with in 15 minutes?**
6. **What should your agent never share?**

Question types:

- open text
- choose one
- choose three
- optional slider

Each answer updates the hidden twin profile.

### Why These Questions Work

The animal question helps infer:

- self-image
- preferred social energy
- humor
- emotional tone
- how the agent might present the user

The color question helps infer:

- aesthetic preferences
- emotional associations
- descriptive language
- warmth, intensity, calmness, or playfulness

The event/profile question helps infer:

- direct goals
- desired matches
- boundaries
- what should be highlighted in match recommendations

---

## 6. Twin Preview

Route: `/onboarding/preview`

User sees how their twin will represent them.

Important:

- Do not expose YAML.
- Do not expose raw structured profile data.
- Show a human-readable “agent card” only.

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

For MVP, “Ask my agent” can open the mocked Copilot panel.

---

## 7. Agent Arena

Route: `/arena`

The app visualizes agents meeting.

### Arena Requirements

- Keep the animation short.
- Agents should feel theatrical but not overwhelming.
- Show highlights, not full conversations.
- Include generated avatars.
- Use floating agent bubbles/cards.
- Show quick overlap discoveries.
- Include mode-aware language.

### Visual style

- Tinder-inspired
- swipeable cards
- playful gradients
- floating avatars
- animated overlap indicators

### Short Mock Status Feed

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

---

## 8. Match Queue

Route: `/matches`

Main payoff screen.

### Layout

- Tinder-inspired stacked cards
- Swipe support
- Explicit buttons for accessibility

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

### Meet Action

For MVP:

- Show a mock intro/confirmation screen.

Example:

> Meet request saved. In the real app, Haley would be notified that you’re interested in meeting.

Future:

- Notify the other user.
- Support mutual interest.
- Support warm intro flow.

---

## 9. Match Detail

Route: `/matches/[matchId]`

Shows:

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

### Match Evidence

Show exactly why the agents matched.

Examples:

- Shared interests
- Complementary skills
- Similar goals
- Personality alignment
- Conversation chemistry
- Constructive tension

### Eavesdrop

Button:

> Eavesdrop on Agents

Opens a conversation viewer showing selected highlights from the agent conversation.

Requirements:

- entertaining
- charming
- useful
- personalized
- reflects user interests
- reflects user personalities
- includes humor
- includes curiosity
- can include disagreement or tension
- reveals how the match was discovered

Example:

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
That's either a warning or a recommendation.
```

Actions:

- Copy opener
- Ask my agent why
- Give me a less awkward opener
- Save
- Pass
- Meet
- Eavesdrop

---

## 10. Mock Copilot Panel

Available on:

- Twin preview
- Match queue
- Match detail

Mock prompt buttons:

On preview:

- Make this sound more like me
- Make this less corporate
- Make my privacy stricter

On match detail:

- Why should I meet this person?
- Give me a less awkward opener
- What should I ask next?

---

## 11. Mock Integrations Page

Route: `/integrations`

Show visual-only integration options:

1. ChatGPT
2. Apple Notes
3. Upload Files

Each integration card should show:

- icon/avatar
- connection status
- short description
- disabled/mock connect button

Example:

### ChatGPT

> Import conversation history to help your twin learn your voice, interests, and recurring obsessions.

### Apple Notes

> Bring in notes, ideas, lists, and half-formed thoughts.

### Upload Files

> Upload resumes, bios, essays, decks, or project notes.

MVP:

- No real integration.
- Clicking connect shows “Coming soon” or mock connected state.

---

## Design Requirements

The app should feel:

- mobile-first
- playful
- social
- polished
- slightly futuristic
- warm
- privacy-aware
- less corporate than typical AI tools

Visual direction:

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

Avoid:

- enterprise dashboard feel
- huge blocks of raw JSON
- visible YAML
- overly technical language on user-facing screens
- creepy dating language
- generic AI buzzwords

---

## Additional Components

### DemoLoadingScreen

Displays:

- spinner
- rotating integration messages
- fake ingestion progress
- playful loading states

### IntakeContextCard

Displays:

- paste context area
- skip intake button
- privacy reassurance
- no YAML shown

### IntegrationsPage

Displays:

- ChatGPT
- Apple Notes
- Upload Files
- mocked connected states
- future capabilities

### AgentConversationViewer

Displays:

- selected agent conversation highlights
- chat bubbles
- timestamps if helpful
- overlap highlights
- entertaining dialogue

### MeetConfirmationScreen

Displays:

- match avatar/name
- confirmation message
- future notification explanation
- CTA back to matches
- CTA view match detail

---

## Acceptance Criteria

### Core Flow

- User can open landing page.
- User can enter demo mode.
- User sees loading simulation.
- Alexis is selected by default.
- User can skip intake.
- User can paste context if desired.
- YAML is never exposed.
- User can answer required playful questions.
- User can answer capped follow-up questions.
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
- Generated avatars exist.
- Match conversations exist.
- Match copy is specific and compelling.
- Twin profiles have personality.
- localStorage persists state during demo.

### UI

- Looks good on mobile.
- Swipe interactions work.
- No broken routes.
- No undefined values.
- No empty match screens.
- No visible YAML.
- No raw debug JSON in normal flow.
- CTA buttons are clear.
- Demo can be completed in under 3 minutes.

---

## Build Priority

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

---

## Future Backend Integration

When backend is ready, replace `mock-api.ts` with real calls to Python FastAPI.

Future backend responsibilities:

- Redis persistence
- LLM profile generation
- hidden YAML/profile generation
- profile gap analysis
- custom system instruction generation
- LLM question generation
- agent-to-agent conversations
- match evaluation
- CopilotKit actions
- Redis Streams for arena events
- Redis sorted sets for match queues
- user notification flow for Meet actions

Expected future architecture:

```txt
Next.js + Tailwind frontend
  ↓
Python FastAPI agent backend
  ↓
Redis
```

Frontend should be written so that backend swap is easy:

- keep all data calls inside `lib/mock-api.ts`
- avoid hardcoding data directly inside components
- components should consume typed data
- pages should call mock API functions
- later rename `mock-api.ts` or swap implementation with `api.ts`

---

## Demo Script

1. Open landing page.
2. Say: “This is Tinder for agents. Your agent works the room before you do.”
3. Click demo.
4. Watch the short twin-building loading sequence.
5. Continue as Alexis.
6. Skip intake.
7. Answer:
   - animal companion question
   - color/emotion question
   - event/profile goal question
8. Preview Alexis Twin.
9. Enter the agent arena.
10. Watch agents meet briefly.
11. Open match queue.
12. Swipe through cards.
13. Click Haley.
14. Show match evidence.
15. Click “Eavesdrop.”
16. Show theatrical agent conversation.
17. Ask: “Why should I meet Haley?”
18. Show explanation and opener.
19. Click Meet.
20. Show mock confirmation screen.
21. End with:

> The agents do not replace the human conversation. They make sure the right human conversations actually happen.
