# Twinder Hackathon MVP UX + Product Spec — v0.3

Date: 2026-06-06

## Status
This version shifts from a broad “design system” into a practical UX/product handoff for building the mobile web MVP.

## 1. Core MVP framing

Twinder is a hackathon/event-based social matching app where attendees create a lightweight digital twin. As people join, twins evaluate each other, run short twin-to-twin conversations, score resonance, and surface promising introductions.

The product is not a normal dating app and not a normal networking app. It is a fluid connection layer for:
- people worth talking to
- creative/professional sparks
- possible flirtation if appropriate
- serendipitous event connections

## 2. Launch context

### First use case
A hackathon event.

### Onboarding timing
Onboarding can happen:
- before the event via link/QR
- at the event via QR code
- during early event downtime

Design implication:
The UI should treat onboarding as event activation, not account setup. It should feel fast, magical, and immediately useful.

## 3. Matching lifecycle

### Matching behavior
As users join:
1. User completes onboarding.
2. System generates/updates their hidden Twin Profile.
3. System creates/updates their Matching Vector.
4. System compares them against existing attendees.
5. For promising candidates, twins run a short conversation.
6. Conversation is scored.
7. Strong matches appear in Discover / Intros.

### Timing
Matches should appear progressively as the pool grows, not all at once.

Recommended UI states:
- “Your twin is meeting the room…”
- “3 new people joined. Rechecking resonance.”
- “Your twin found someone worth talking to.”
- “New intro potential detected.”

## 4. Photos and identity

### Photo decision
No human photos in MVP. Photos are deferred until V3.

### Before mutual intro, visible information can include:
- first name, if public
- public role/company/school, if provided
- public project/interests
- intent chips
- resonance score
- suggested conversation topic
- twin-generated summary
- public event-visible information

### Hidden until later versions:
- photos
- contact info
- sensitive details
- private profile/YAML data

### Reveal principle
Only reveal what is already public or what the user explicitly chooses to share.

## 5. Matching score

Numeric resonance scores are allowed and should be visible.

### Recommended format
Use the score as a headline, but always pair it with reasoning.

Example:
> 87% resonance  
> Your twins found strong intro potential.  
> You both seem interested in AI, entrepreneurship, and emotionally intelligent conversation.

### Score categories
- 90–100: Unusually strong resonance
- 80–89: High resonance
- 65–79: Worth a conversation
- 50–64: Possible but uncertain
- Below 50: Usually hidden unless there is a special reason

## 6. Twin conversation style

The twin should act like a wingman.

### Theatricality setting
Default: between B and C.
- B: lightly theatrical, like a charming wingman
- C: character dialogue between twins

Optional event-vibe mode:
- D: more absurd/funny/performative, only when the event culture supports it

### Default tone
- clever
- warm
- socially intelligent
- playful
- lightly flirty if appropriate
- never sexually explicit
- never creepy

### Example
Their twin:
> “I think they’d have a lot to say about building weird things quickly.”

Your twin:
> “Good. Mine likes people who are ambitious, emotionally curious, and not boring.”

System summary:
> This looks like high intro potential: builder energy, curiosity, and a similar appetite for unusual conversations.

## 7. Safety and content boundaries

### Default guardrails
- No sexual content in first contact.
- Flirty is allowed if user intent and match context support it.
- No explicit sexual suggestions.
- No anonymous harassment.
- No repeated intro requests after someone declines.
- Block/report required.
- Users should control romantic availability or flirt openness.
- Contact info stays hidden until mutual intro/reveal.
- The product should not pressure users into dating framing.

### Suggested microcopy
- “Keep it human. No pressure, no spam.”
- “Your intro should be warm, not weird.”
- “Flirty is okay. Explicit is not.”
- “You control what gets revealed.”

## 8. Main dashboard

The dashboard can carry most of the MVP.

### Dashboard goals
- show the user that their twin is active
- show live event/matching status
- show best current matches
- show intro requests
- let user tune or correct their twin

### Dashboard sections

#### A. Twin status card
Content:
- “Your twin is live”
- event name
- profile completeness
- number of people scanned
- number of promising matches found

#### B. Live room activity
Content:
- “24 people have joined”
- “6 new profiles since your last check”
- “Your twin is rechecking resonance”

#### C. Best matches
Each match card:
- first name or public handle
- public role/project
- resonance score
- shared signals
- conversation starter
- CTA: “View twin talk” or “Request intro”

#### D. Twin talks
Show short generated conversations or summaries.

#### E. Intros
Show:
- incoming intro requests
- outgoing intro requests
- mutual intros
- declined/expired requests

#### F. Tune my twin
Lightweight controls:
- “This sounds like me”
- “Not quite”
- “Less flirty”
- “More professional”
- “More weird”
- “Ask me a follow-up”

## 9. Core screens for MVP

### 1. Event Entry / QR Landing
Primary CTA:
- Create my twin

Secondary:
- I already have a twin

Copy:
> Let your digital twin meet the room first.  
> Find people worth talking to — builders, friends, collaborators, sparks.

### 2. Onboarding
One question per screen.
Required if no imported profile.

Questions:
1. If you could have an animal follow you around, what would it be and why?
2. What’s your favorite color, why, and how does it make you feel?
3. What do you want from this event/profile, and what should people know about you?

Intent chips:
- build together
- meet interesting people
- career/opportunities
- flirt if chemistry
- make friends
- learn from unusual people
- find cofounder energy

### 3. Twin Generated
Content:
- top traits
- connection intent
- conversation style
- what will be public vs private

CTA:
- Enter the room

### 4. Dashboard / Discover
Combined for MVP if needed.

Content:
- live twin status
- match cards
- intros
- twin talks

### 5. Twin Talk Detail
Content:
- short dialogue or summary
- why this person is interesting
- suggested opener
- intro CTA

### 6. Intro Request
Content:
- public name/details
- suggested reason for intro
- optional message
- send/request CTA

### 7. Mutual Intro
Content:
- public info
- suggested opener
- where/how to find them at event, if enabled
- no photo in MVP

## 10. Component specs

### ResonanceScoreBadge
Props:
- score: number
- label: string
- confidence?: low | medium | high

Behavior:
- Score visible on match cards.
- Score must be accompanied by explanation.

### MatchCard
Props:
- publicName
- publicRoleOrProject
- resonanceScore
- resonanceLabel
- sharedSignals[]
- suggestedTopic
- ctaState

No photo prop in MVP.

### TwinTalkCard
Props:
- theirTwinLine
- yourTwinLine
- summary
- tone: practical | wingman | theatrical | event-chaotic

### IntroRequestCard
Props:
- targetPublicName
- reason
- suggestedMessage
- status: draft | sent | accepted | declined | expired

### TuneTwinControls
Actions:
- approve insight
- reject insight
- less flirty
- more professional
- more weird
- ask follow-up
- regenerate

## 11. Copy system

### Button labels
- Create my twin
- Enter the room
- Let our twins talk
- View twin talk
- Request intro
- Send intro
- Tune my twin
- Recheck the room

### Loading states
- Your twin is meeting the room…
- Checking for resonance…
- Talking to other twins…
- Scoring intro potential…
- New people joined. Rechecking matches…

### Match language
Use:
- resonance
- intro potential
- spark
- shared signal
- productive friction
- worth a conversation

Avoid:
- hotness
- rank
- marketplace
- explicit sexual language
- soulmate
- perfect match

## 12. Visual direction

Keep the existing direction:
- Apple-like pearlescent calm
- Hinge-like human warmth
- hackathon/networking credibility
- no photo-first dating interface

### UI style
- rounded glass cards
- pearlescent backgrounds
- subtle glow states
- abstract twin avatars/silhouettes
- no heavy cyberpunk
- no overuse of sparkles

## 13. Developer stack

Confirmed or likely stack:
- Claude Code
- Cursor
- Supabase
- Vercel
- Weights & Biases Weave
- Redis
- CopilotKit

Use W&B Weave for:
- tracing onboarding synthesis
- tracing twin-to-twin conversations
- evaluating match explanations
- debugging why matches were scored highly/lowly
- monitoring safety/tone violations

Use Redis for:
- event room state
- match queue
- live “people joined” updates
- short-lived twin conversation jobs
- rate limits for intro requests

Use CopilotKit for:
- in-app twin/wingman conversational UI
- “Tune my twin”
- explanation surfaces
- guided onboarding follow-ups

## 14. MVP acceptance criteria

A working MVP should allow:
1. User enters event via link/QR.
2. User creates a twin through short onboarding.
3. User sees dashboard with live matching status.
4. As attendees join, matches are generated.
5. User sees numeric resonance scores and explanations.
6. User can view twin talk summaries.
7. User can request or accept intro.
8. No photos are shown.
9. No contact info is revealed before mutual intro.
10. User can correct/tune the twin.
11. System prevents explicit sexual first-contact content.
12. Developer can inspect match/twin reasoning via traces.
