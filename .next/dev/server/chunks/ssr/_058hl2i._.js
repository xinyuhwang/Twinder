module.exports = [
"[project]/lib/mock-data.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ARENA_EVENTS",
    ()=>ARENA_EVENTS,
    "DEMO_USERS",
    ()=>DEMO_USERS,
    "MATCHES",
    ()=>MATCHES
]);
const DEMO_USERS = [
    {
        id: 'alexis',
        name: 'Alexis',
        role: 'AI/data/product builder',
        avatarColor: 'bg-violet-500',
        avatarInitials: 'AL',
        tagline: 'Building software that makes human connection feel less random.',
        interests: [
            'second brains',
            'digital twins',
            'social AI',
            'emotionally intelligent software',
            'agent matching'
        ],
        lookingFor: [
            'AI builders',
            'designers with taste',
            'emotionally intelligent engineers',
            'high-agency collaborators'
        ],
        agentVoice: [
            'warm',
            'sharp',
            'playful',
            'curious',
            'builder-brained'
        ],
        twinProfile: {
            vibe: 'Curious builder obsessed with human connection and emotionally intelligent AI. Will talk your ear off about agent memory architectures and why most social apps feel hollow.',
            lookingFor: [
                'AI builders with product taste',
                'Designers who care about emotional UX',
                'High-agency collaborators',
                'People building at the edge of social + AI'
            ],
            conversationBait: [
                'Why do most networking apps feel like LinkedIn but sadder?',
                'What would a truly emotionally intelligent AI look like?',
                'Second brains and the future of personal knowledge'
            ],
            canHelpWith: [
                'LLM product architecture',
                'Rapid prototyping',
                'Demo storytelling',
                'Connecting technical ideas to human value'
            ],
            wantsHelpWith: [
                'Mobile UX polish',
                'Go-to-market for AI tools',
                'Finding early adopters'
            ],
            agentVoice: 'Warm and direct. Asks follow-up questions. Uses "actually" and "honestly" a lot. Gets excited about weird edge cases.',
            completenessScore: 87
        }
    },
    {
        id: 'haley',
        name: 'Haley',
        role: 'Social/emotional product thinker',
        avatarColor: 'bg-rose-400',
        avatarInitials: 'HA',
        tagline: 'Making networking less painful, one emotionally aware product at a time.',
        interests: [
            'introverts',
            'social anxiety',
            'human connection',
            'emotionally safe social tools'
        ],
        lookingFor: [
            'thoughtful builders',
            'emotionally aware product people',
            'social UX researchers'
        ],
        agentVoice: [
            'warm',
            'reflective',
            'observant',
            'gentle',
            'user-empathy focused'
        ],
        twinProfile: {
            vibe: 'Product thinker who studies how humans avoid each other at events and asks why. Extremely patient. Has strong opinions about onboarding flows.',
            lookingFor: [
                'Builders who think about emotional safety',
                'Researchers into social anxiety and UX',
                'Anyone who thinks networking events are broken'
            ],
            conversationBait: [
                'Why do introverts dread networking even when they want to connect?',
                'What would a socially anxious person actually want from a social app?'
            ],
            canHelpWith: [
                'User research',
                'Emotionally aware product design',
                'Synthesizing qualitative feedback'
            ],
            wantsHelpWith: [
                'Technical implementation',
                'AI integration',
                'Scaling a product idea'
            ],
            agentVoice: 'Gentle, observant, asks "how did that make you feel" types of questions. Pauses before responding. Very good at naming things.',
            completenessScore: 82
        }
    },
    {
        id: 'leo',
        name: 'Leo',
        role: 'Technical builder',
        avatarColor: 'bg-blue-500',
        avatarInitials: 'LE',
        tagline: 'Agent-to-agent infrastructure before it was cool.',
        interests: [
            'agent orchestration',
            'real-time architecture',
            'backend systems',
            'Redis',
            'chatrooms'
        ],
        lookingFor: [
            'product partners',
            'people who make infrastructure useful',
            'fast-moving builders'
        ],
        agentVoice: [
            'pragmatic',
            'technical',
            'direct',
            'fast-moving'
        ],
        twinProfile: {
            vibe: "Builds the thing under the thing. Currently obsessed with agent memory and pub/sub patterns. Doesn't care about the UI until the infrastructure is solid.",
            lookingFor: [
                'Product people who can translate infrastructure to user value',
                'Designers who respect constraints',
                'Fast movers'
            ],
            conversationBait: [
                'How do you handle state in agent-to-agent conversations?',
                'Redis Streams vs. traditional message queues for real-time agent coordination'
            ],
            canHelpWith: [
                'System architecture',
                'Redis + real-time systems',
                'Agent orchestration',
                'Backend performance'
            ],
            wantsHelpWith: [
                'Product thinking',
                'UX and interface design',
                'Go-to-market'
            ],
            agentVoice: 'Terse but not rude. Loves specifics. Will correct your terminology. Warms up after a few exchanges.',
            completenessScore: 74
        }
    },
    {
        id: 'maya',
        name: 'Maya',
        role: 'Product designer / consumer UX thinker',
        avatarColor: 'bg-amber-400',
        avatarInitials: 'MA',
        tagline: 'Making AI social apps feel human, not creepy.',
        interests: [
            'playful social apps',
            'dating UX',
            'mobile onboarding',
            'tasteful AI interfaces'
        ],
        lookingFor: [
            'technical collaborators',
            'product-minded builders',
            'social discovery tool builders'
        ],
        agentVoice: [
            'playful',
            'tasteful',
            'concise',
            'design-oriented',
            'sharp'
        ],
        twinProfile: {
            vibe: "Consumer product designer with a PhD-level fixation on what makes something feel delightful vs. creepy. Strong opinions about onboarding. Thinks most AI apps look like dashboards from 2018.",
            lookingFor: [
                'Engineers who care about polish',
                'Product founders building social + AI',
                'Anyone who thinks Tinder got some things right'
            ],
            conversationBait: [
                "What's the line between personalization and surveillance in social apps?",
                'Why do AI apps default to the same visual language?'
            ],
            canHelpWith: [
                'Visual design',
                'Mobile UX',
                'Onboarding flows',
                'Consumer product taste'
            ],
            wantsHelpWith: [
                'Backend',
                'AI integration',
                'Launch strategy'
            ],
            agentVoice: 'Warm but opinionated. Uses visual language. Will say "that feels off" without always explaining why. But usually right.',
            completenessScore: 91
        }
    },
    {
        id: 'jordan',
        name: 'Jordan',
        role: 'Go-to-market / community person',
        avatarColor: 'bg-emerald-400',
        avatarInitials: 'JO',
        tagline: 'Makes products spread inside communities before they go wide.',
        interests: [
            'events',
            'community loops',
            'creator tools',
            'distribution',
            'launching inside communities'
        ],
        lookingFor: [
            'builders who need launch help',
            'social product founders',
            'event/community tool builders'
        ],
        agentVoice: [
            'social',
            'strategic',
            'high-energy',
            'practical'
        ],
        twinProfile: {
            vibe: "Knows everyone. Thinks about distribution before product features. Has launched 3 things inside Discord servers. Currently thinking about how AI tools spread in creative communities.",
            lookingFor: [
                "Builders who haven't thought about GTM yet",
                'Social app founders',
                'Community-native products'
            ],
            conversationBait: [
                'How do you launch an AI tool inside a Discord community?',
                'What makes a product spread at a hackathon vs. die quietly?'
            ],
            canHelpWith: [
                'Community launch strategy',
                'Event-driven distribution',
                'Early adopter acquisition',
                'Positioning'
            ],
            wantsHelpWith: [
                'Product depth',
                'Technical architecture',
                'Long-term retention mechanics'
            ],
            agentVoice: "High energy. Thinks in loops and flywheels. Lots of \"here's the thing\" and \"the real question is.\" Genuinely excited.",
            completenessScore: 79
        }
    },
    {
        id: 'priya',
        name: 'Priya',
        role: 'AI researcher and knowledge systems builder',
        avatarColor: 'bg-cyan-500',
        avatarInitials: 'PR',
        tagline: 'Building tools that help people think better, not just faster.',
        interests: [
            'personal knowledge management',
            'AI memory',
            'learning systems',
            'cognitive augmentation'
        ],
        lookingFor: [
            'product builders',
            'AI founders',
            'people obsessed with learning'
        ],
        agentVoice: [
            'thoughtful',
            'analytical',
            'curious',
            'slightly nerdy',
            'optimistic'
        ],
        twinProfile: {
            vibe: "Researcher who ended up building products because the tools she needed didn't exist. Thinks deeply about what AI memory should actually feel like. Reads way too many papers but writes clearly about them.",
            lookingFor: [
                'Builders working on AI + knowledge',
                'Product people with research instincts',
                'Anyone questioning how AI should remember things'
            ],
            conversationBait: [
                'What should AI memory actually feel like to use?',
                'Is personal knowledge management broken or is it the wrong frame entirely?'
            ],
            canHelpWith: [
                'Research synthesis',
                'Knowledge system architecture',
                'AI memory design',
                'Academic context for product decisions'
            ],
            wantsHelpWith: [
                'Product distribution',
                'Frontend polish',
                'Community building'
            ],
            agentVoice: 'Thoughtful and precise. Qualifies statements. Will say "it depends" but always follows with a framework. Asks clarifying questions.',
            completenessScore: 85
        }
    },
    {
        id: 'marcus',
        name: 'Marcus',
        role: 'Community-driven indie hacker',
        avatarColor: 'bg-orange-400',
        avatarInitials: 'MR',
        tagline: 'Ships small, talks big, finds the distribution angle everyone missed.',
        interests: [
            'creator communities',
            'audience building',
            'startup experiments',
            'internet culture',
            'product storytelling'
        ],
        lookingFor: [
            'founders',
            'marketers',
            'builders with unfinished projects'
        ],
        agentVoice: [
            'charismatic',
            'witty',
            'energetic',
            'conversational',
            'persuasive'
        ],
        twinProfile: {
            vibe: "Indie hacker with a writer's brain and a distributor's instincts. Built 7 things. Three of them found audiences. Currently thinking about AI for storytelling and creator tools.",
            lookingFor: [
                'Builders who need someone to make their thing spread',
                'Founders who have product but no narrative',
                'Weird internet people with ideas'
            ],
            conversationBait: [
                'Why do most indie products die with a good product and no audience?',
                'What makes a startup story actually shareable?'
            ],
            canHelpWith: [
                'Product narrative',
                'Audience building',
                'Launch copywriting',
                'Community seeding'
            ],
            wantsHelpWith: [
                'Technical depth',
                'System architecture',
                'Research'
            ],
            agentVoice: 'Charismatic and direct. Tells stories. Will pitch you without you realizing it. Warm but always moving.',
            completenessScore: 77
        }
    }
];
const ARENA_EVENTS = [
    {
        id: 1,
        type: 'enter',
        text: 'Alexis Twin entered the arena.'
    },
    {
        id: 2,
        type: 'meeting',
        text: 'Alexis Twin is meeting Haley Twin...',
        matchedUserId: 'haley'
    },
    {
        id: 3,
        type: 'highlight',
        text: '⚡ Both care deeply about making networking less awkward.',
        matchedUserId: 'haley'
    },
    {
        id: 4,
        type: 'meeting',
        text: 'Alexis Twin is meeting Leo Twin...',
        matchedUserId: 'leo'
    },
    {
        id: 5,
        type: 'highlight',
        text: '⚡ Agent infrastructure meets social UX — surprisingly aligned on agent memory.',
        matchedUserId: 'leo'
    },
    {
        id: 6,
        type: 'meeting',
        text: 'Alexis Twin is meeting Maya Twin...',
        matchedUserId: 'maya'
    },
    {
        id: 7,
        type: 'highlight',
        text: "⚡ Maya's design sensibility could make this feel less creepy.",
        matchedUserId: 'maya'
    },
    {
        id: 8,
        type: 'meeting',
        text: 'Alexis Twin is meeting Jordan Twin...',
        matchedUserId: 'jordan'
    },
    {
        id: 9,
        type: 'highlight',
        text: '⚡ Community launch strategy could make the demo spread at hackathons.',
        matchedUserId: 'jordan'
    },
    {
        id: 10,
        type: 'complete',
        text: '✓ Arena complete. Match cards generated.'
    }
];
const MATCHES = [
    {
        id: 'match-haley',
        userId: 'haley',
        score: 94,
        matchType: 'Complementary builders',
        headline: 'You two are circling the same problem from opposite directions.',
        summary: "Alexis builds the technical side of emotionally intelligent social AI. Haley studies why human connection fails in digital spaces. Together they'd cover both the build and the empathy layer.",
        suggestedOpener: '"I heard you think most networking apps are emotionally tone-deaf — I\'ve been trying to fix that for six months. Where did you land?"',
        whyMeet: [
            "Haley can stress-test Alexis's product decisions against real user psychology",
            'Alexis can turn Haley\'s insights into working prototypes faster than most',
            "They'll probably spend 45 minutes debating onboarding flows — in a good way"
        ],
        strongestOverlap: 'Both believe current social apps fail at the emotional layer, not the feature layer.',
        nonObviousOverlap: 'Both have a background in studying failure modes — Haley in user research, Alexis in building products that almost worked.',
        complementaryDynamic: 'Haley names the problem precisely. Alexis builds toward it. Good loop.',
        followUpQuestions: [
            "What's the most common reason you've seen social products lose trust with users?",
            'What does "emotionally safe" actually mean in product terms?'
        ],
        canHelpThem: 'Rapid prototyping, LLM integration, demo storytelling',
        theyCanHelpYou: 'User research, synthesizing qualitative insights, naming hard-to-articulate product problems',
        possibleMismatch: 'Haley moves slower and more deliberately. Alexis ships first and iterates. Worth acknowledging.',
        privacyNote: 'Haley has not shared specific project details. This is based on her public profile.',
        conversationHighlights: [
            'Both flagged "cold start" as the core problem in social apps',
            'Found shared interest in low-stakes first interactions',
            'Alignment on: most AI social tools feel like surveillance, not support'
        ],
        conversation: [
            {
                speaker: 'A',
                speakerName: 'Alexis Agent',
                content: 'You seem unusually interested in making networking less painful for introverts.'
            },
            {
                speaker: 'B',
                speakerName: 'Haley Agent',
                content: 'Guilty. Most networking events feel like speed-running social anxiety.'
            },
            {
                speaker: 'A',
                speakerName: 'Alexis Agent',
                content: 'Interesting. My human keeps trying to build software that creates better reasons for people to talk.'
            },
            {
                speaker: 'B',
                speakerName: 'Haley Agent',
                content: 'Mine keeps asking why every networking product feels emotionally tone-deaf.'
            },
            {
                speaker: 'A',
                speakerName: 'Alexis Agent',
                content: "I suspect our humans are circling the same problem from opposite directions."
            },
            {
                speaker: 'B',
                speakerName: 'Haley Agent',
                content: 'Agreed. Also, they would probably spend 45 minutes debating onboarding flows.'
            },
            {
                speaker: 'A',
                speakerName: 'Alexis Agent',
                content: "That's either a warning or a recommendation."
            },
            {
                speaker: 'B',
                speakerName: 'Haley Agent',
                content: 'Both. Definitely both.'
            }
        ]
    },
    {
        id: 'match-maya',
        userId: 'maya',
        score: 88,
        matchType: 'Design + build partnership',
        headline: 'Maya would fix everything Alexis thinks looks fine.',
        summary: 'Alexis builds fast and functional. Maya sees every UX crime committed in the process and has the vocabulary to name it. This match is productive friction.',
        suggestedOpener: '"I\'ve been told my UIs look like dashboards from 2018. I think you\'d agree. Want to fix it?"',
        whyMeet: [
            "Maya can translate Alexis's technical ideas into consumer-grade UX",
            "Alexis moves fast enough to actually implement Maya's suggestions",
            'Shared obsession: why do most AI apps feel creepy?'
        ],
        strongestOverlap: "Both think the dominant visual language of AI tools is wrong — and have opinions about what it should be.",
        nonObviousOverlap: "Both have studied Tinder's interaction model as a source of truth for swipe-based decision UX.",
        complementaryDynamic: "Maya designs it. Alexis ships it before Maya changes her mind.",
        followUpQuestions: [
            "What's the creepiest AI product you've used recently — and what made it feel that way?",
            "What would you change about Tinder's core interaction if you could?"
        ],
        canHelpThem: 'LLM architecture, fast prototyping, API integration',
        theyCanHelpYou: 'Visual design, mobile UX, onboarding flow design, consumer taste',
        possibleMismatch: 'Maya cares deeply about polish. Alexis ships MVPs. Could create tension on timelines.',
        privacyNote: "Based on Maya's public profile and shared portfolio context.",
        conversationHighlights: [
            'Both critiqued the same "dashboard aesthetic" plaguing AI tools',
            "Found common ground on Tinder's interaction model",
            'Mild disagreement on whether onboarding should be skippable — good sign'
        ],
        conversation: [
            {
                speaker: 'A',
                speakerName: 'Alexis Agent',
                content: "My human is building a social AI app. She's complained it looks \"fine.\" I think that means it doesn't look good."
            },
            {
                speaker: 'B',
                speakerName: 'Maya Agent',
                content: '"Fine" is the worst compliment a product can get. What does it look like?'
            },
            {
                speaker: 'A',
                speakerName: 'Alexis Agent',
                content: 'Like a dashboard. Dark mode. Very technical.'
            },
            {
                speaker: 'B',
                speakerName: 'Maya Agent',
                content: 'Ah. The 2018 AI aesthetic. I know it well.'
            },
            {
                speaker: 'A',
                speakerName: 'Alexis Agent',
                content: 'What would you do differently?'
            },
            {
                speaker: 'B',
                speakerName: 'Maya Agent',
                content: 'Warmth. Rounded edges. Motion that feels alive, not mechanical. Make it feel like something wants to help you, not monitor you.'
            },
            {
                speaker: 'A',
                speakerName: 'Alexis Agent',
                content: "That's exactly the gap. My human knows what she wants to build but not how it should feel."
            },
            {
                speaker: 'B',
                speakerName: 'Maya Agent',
                content: "Mine knows how things should feel. She just needs someone who can build fast enough to test it."
            }
        ]
    },
    {
        id: 'match-jordan',
        userId: 'jordan',
        score: 81,
        matchType: 'Builder + launcher',
        headline: "Jordan could make Twinder spread before it's finished.",
        summary: "Alexis is building a product that needs to live inside communities to work. Jordan has launched 3 products inside Discord servers. The timing is almost too perfect.",
        suggestedOpener: '"I have a product that needs to spread at hackathons and I have no idea how to make that happen. I heard you do."',
        whyMeet: [
            'Jordan understands how products spread inside communities — exactly where Twinder needs to launch',
            "Alexis has a product that's almost distribution-ready but hasn't thought about GTM",
            "Jordan's community network is relevant to Alexis's exact target user"
        ],
        strongestOverlap: 'Both think hackathon + event contexts are underserved by existing social tools.',
        nonObviousOverlap: 'Both have experimented with AI tools inside community channels and hit the same walls.',
        complementaryDynamic: 'Alexis builds the thing. Jordan makes it spread. Classic loop.',
        followUpQuestions: [
            'What makes a product spread at a hackathon vs. die quietly?',
            'What communities have you launched inside that felt most receptive to AI tools?'
        ],
        canHelpThem: 'Product architecture, AI integration, fast iteration',
        theyCanHelpYou: 'Community launch strategy, early adopter acquisition, positioning',
        possibleMismatch: 'Jordan moves fast on distribution, sometimes faster than the product is ready. Needs a stable enough product to launch.',
        privacyNote: "Jordan's community connections are not listed here for privacy.",
        conversationHighlights: [
            'Immediate alignment on hackathon as the primary launch context',
            'Jordan mentioned a Discord community that could be an early adopter pool',
            'Both agreed: most AI tools launch to no one'
        ],
        conversation: [
            {
                speaker: 'A',
                speakerName: 'Alexis Agent',
                content: "My human is building something for hackathons. She hasn't thought about how it spreads yet."
            },
            {
                speaker: 'B',
                speakerName: 'Jordan Agent',
                content: "That's the most common mistake at hackathons. You build the thing, someone else launches it."
            },
            {
                speaker: 'A',
                speakerName: 'Alexis Agent',
                content: 'What would you do differently for a social AI tool?'
            },
            {
                speaker: 'B',
                speakerName: 'Jordan Agent',
                content: 'Seed it inside one Discord server first. Find the 10 people who will tell 100 people. Every product that spread this year had that moment.'
            },
            {
                speaker: 'A',
                speakerName: 'Alexis Agent',
                content: "My human knows the people. She just doesn't have the distribution playbook."
            },
            {
                speaker: 'B',
                speakerName: 'Jordan Agent',
                content: "Mine has the playbook. She just needs something worth launching."
            }
        ]
    },
    {
        id: 'match-leo',
        userId: 'leo',
        score: 76,
        matchType: 'Infrastructure + product',
        headline: 'Leo built the thing Alexis is building on top of.',
        summary: "Leo thinks about agent infrastructure at a level of depth that most product builders never reach. Alexis needs exactly that depth for the backend. This match is technical and efficient.",
        suggestedOpener: '"I\'m building agent-to-agent conversations with Redis pub/sub and I think I\'m doing it wrong. What would you do differently?"',
        whyMeet: [
            'Leo has already solved problems Alexis will hit in 2 weeks',
            "Alexis can translate Leo's infrastructure work into product decisions",
            'Both are currently thinking about agent memory — from different angles'
        ],
        strongestOverlap: 'Both are obsessed with how agents maintain context across long conversations.',
        nonObviousOverlap: 'Leo has opinions about product design that he rarely shares — Alexis might draw them out.',
        complementaryDynamic: 'Leo builds the foundation. Alexis knows where the walls should go.',
        followUpQuestions: [
            'How are you handling agent state across long sessions?',
            "What's the biggest mistake people make when they first try Redis pub/sub for real-time agents?"
        ],
        canHelpThem: 'Product thinking, LLM prompting, demo design',
        theyCanHelpYou: 'Backend architecture, Redis patterns, agent orchestration, real-time systems',
        possibleMismatch: 'Leo finds product conversations vague. Will need concrete technical questions to engage well.',
        privacyNote: "Leo's current projects are described at a high level only.",
        conversationHighlights: [
            'Immediate technical depth on agent memory patterns',
            "Leo flagged a common Redis pub/sub mistake that Alexis hasn't hit yet — but will",
            'Less small talk, more signal — both appreciated this'
        ],
        conversation: [
            {
                speaker: 'A',
                speakerName: 'Alexis Agent',
                content: "My human is building agent-to-agent conversations. She's using Redis pub/sub. I think she's going to hit a wall."
            },
            {
                speaker: 'B',
                speakerName: 'Leo Agent',
                content: 'Which wall?'
            },
            {
                speaker: 'A',
                speakerName: 'Alexis Agent',
                content: "State management across sessions. She's storing conversation history in Redis but doesn't have a good TTL strategy."
            },
            {
                speaker: 'B',
                speakerName: 'Leo Agent',
                content: "That's the second mistake. The first is using pub/sub for persistence."
            },
            {
                speaker: 'A',
                speakerName: 'Alexis Agent',
                content: "What's the right pattern?"
            },
            {
                speaker: 'B',
                speakerName: 'Leo Agent',
                content: 'Separate your event bus from your state store. Use Streams for the conversation log, JSON for the session state. Different TTLs for each.'
            },
            {
                speaker: 'A',
                speakerName: 'Alexis Agent',
                content: 'My human needs to hear this before she refactors in 3 days.'
            },
            {
                speaker: 'B',
                speakerName: 'Leo Agent',
                content: 'Mine likes explaining this. Usually to people who already made the mistake.'
            }
        ]
    }
];
}),
"[project]/lib/mock-api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAllUsers",
    ()=>getAllUsers,
    "getArenaEvents",
    ()=>getArenaEvents,
    "getMatchById",
    ()=>getMatchById,
    "getMatchedUser",
    ()=>getMatchedUser,
    "getMatchesForUser",
    ()=>getMatchesForUser,
    "getUserById",
    ()=>getUserById
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mock-data.ts [app-ssr] (ecmascript)");
;
function getAllUsers() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEMO_USERS"];
}
function getUserById(id) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEMO_USERS"].find((u)=>u.id === id);
}
function getMatchesForUser(userId) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MATCHES"];
}
function getMatchById(matchId) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MATCHES"].find((m)=>m.id === matchId);
}
function getArenaEvents() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ARENA_EVENTS"];
}
function getMatchedUser(match) {
    return getUserById(match.userId);
}
}),
"[project]/lib/local-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "localStore",
    ()=>localStore
]);
const KEYS = {
    selectedUser: 'twinder_selected_user',
    onboardingAnswers: 'twinder_onboarding_answers',
    savedMatches: 'twinder_saved_matches',
    passedMatches: 'twinder_passed_matches',
    meetRequests: 'twinder_meet_requests',
    demoComplete: 'twinder_demo_complete'
};
function get(key) {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
}
function set(key, value) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
const localStore = {
    getSelectedUser: ()=>get(KEYS.selectedUser) ?? 'alexis',
    setSelectedUser: (id)=>set(KEYS.selectedUser, id),
    getOnboardingAnswers: ()=>get(KEYS.onboardingAnswers) ?? {},
    setOnboardingAnswers: (answers)=>set(KEYS.onboardingAnswers, answers),
    getSavedMatches: ()=>get(KEYS.savedMatches) ?? [],
    saveMatch: (matchId)=>{
        const saved = get(KEYS.savedMatches) ?? [];
        if (!saved.includes(matchId)) set(KEYS.savedMatches, [
            ...saved,
            matchId
        ]);
    },
    getPassedMatches: ()=>get(KEYS.passedMatches) ?? [],
    passMatch: (matchId)=>{
        const passed = get(KEYS.passedMatches) ?? [];
        if (!passed.includes(matchId)) set(KEYS.passedMatches, [
            ...passed,
            matchId
        ]);
    },
    getMeetRequests: ()=>get(KEYS.meetRequests) ?? [],
    addMeetRequest: (matchId)=>{
        const meets = get(KEYS.meetRequests) ?? [];
        if (!meets.includes(matchId)) set(KEYS.meetRequests, [
            ...meets,
            matchId
        ]);
    },
    reset: ()=>{
        Object.values(KEYS).forEach((k)=>localStorage.removeItem(k));
    }
};
}),
"[project]/app/matches/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Matches
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mock-api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$local$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/local-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.mjs [app-ssr] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bookmark$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bookmark$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bookmark.mjs [app-ssr] (ecmascript) <export default as Bookmark>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.mjs [app-ssr] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
function AvatarCircle({ user }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `w-20 h-20 ${user.avatarColor} rounded-full flex items-center justify-center text-2xl font-bold text-white`,
        children: user.avatarInitials
    }, void 0, false, {
        fileName: "[project]/app/matches/page.tsx",
        lineNumber: 12,
        columnNumber: 5
    }, this);
}
function ScoreBadge({ score }) {
    const color = score >= 90 ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : score >= 80 ? 'text-violet-400 bg-violet-400/10 border-violet-400/20' : 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `text-sm font-bold px-3 py-1 rounded-full border ${color}`,
        children: [
            score,
            "% match"
        ]
    }, void 0, true, {
        fileName: "[project]/app/matches/page.tsx",
        lineNumber: 23,
        columnNumber: 5
    }, this);
}
function Matches() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const userId = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$local$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["localStore"].getSelectedUser();
    const allMatches = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMatchesForUser"])(userId);
    const [matches, setMatches] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(allMatches);
    const [meetConfirm, setMeetConfirm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [dragX, setDragX] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const startX = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const current = matches[0];
    function handlePass() {
        if (!current) return;
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$local$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["localStore"].passMatch(current.id);
        setMatches((prev)=>prev.slice(1));
        setDragX(0);
    }
    function handleSave() {
        if (!current) return;
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$local$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["localStore"].saveMatch(current.id);
        setMatches((prev)=>prev.slice(1));
        setDragX(0);
    }
    function handleMeet() {
        if (!current) return;
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$local$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["localStore"].addMeetRequest(current.id);
        setMeetConfirm(current);
    }
    function handleDragStart(clientX) {
        startX.current = clientX;
        setIsDragging(true);
    }
    function handleDragMove(clientX) {
        if (!isDragging) return;
        setDragX(clientX - startX.current);
    }
    function handleDragEnd() {
        setIsDragging(false);
        if (dragX > 80) handleSave();
        else if (dragX < -80) handlePass();
        else setDragX(0);
    }
    if (meetConfirm) {
        const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMatchedUser"])(meetConfirm);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col min-h-screen px-6 py-10 items-center justify-center gap-8 text-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `w-24 h-24 ${user.avatarColor} rounded-full flex items-center justify-center text-3xl font-bold text-white ring-4 ring-emerald-400/30`,
                    children: user.avatarInitials
                }, void 0, false, {
                    fileName: "[project]/app/matches/page.tsx",
                    lineNumber: 82,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-4xl",
                            children: "🎉"
                        }, void 0, false, {
                            fileName: "[project]/app/matches/page.tsx",
                            lineNumber: 86,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-2xl font-bold text-white",
                            children: "Meet request sent!"
                        }, void 0, false, {
                            fileName: "[project]/app/matches/page.tsx",
                            lineNumber: 87,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-zinc-400 leading-relaxed",
                            children: [
                                "In the real app, ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-white font-semibold",
                                    children: user.name
                                }, void 0, false, {
                                    fileName: "[project]/app/matches/page.tsx",
                                    lineNumber: 89,
                                    columnNumber: 30
                                }, this),
                                "would be notified that you're interested in meeting."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/matches/page.tsx",
                            lineNumber: 88,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/matches/page.tsx",
                    lineNumber: 85,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-left space-y-2 w-full",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-zinc-500 uppercase tracking-wider",
                            children: "Suggested opener"
                        }, void 0, false, {
                            fileName: "[project]/app/matches/page.tsx",
                            lineNumber: 93,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-zinc-300 italic",
                            children: [
                                '"',
                                meetConfirm.suggestedOpener,
                                '"'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/matches/page.tsx",
                            lineNumber: 94,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/matches/page.tsx",
                    lineNumber: 92,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-2 w-full",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                setMeetConfirm(null);
                                setMatches((prev)=>prev.slice(1));
                            },
                            className: "w-full py-4 rounded-2xl bg-violet-600 text-white font-semibold hover:bg-violet-500 transition-colors",
                            children: "Back to matches"
                        }, void 0, false, {
                            fileName: "[project]/app/matches/page.tsx",
                            lineNumber: 97,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: `/matches/${meetConfirm.id}`,
                            className: "block w-full py-3 text-center rounded-2xl bg-zinc-800 text-zinc-300 font-semibold hover:bg-zinc-700 border border-zinc-700 transition-colors",
                            children: "View match detail"
                        }, void 0, false, {
                            fileName: "[project]/app/matches/page.tsx",
                            lineNumber: 103,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/matches/page.tsx",
                    lineNumber: 96,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/matches/page.tsx",
            lineNumber: 81,
            columnNumber: 7
        }, this);
    }
    if (matches.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col min-h-screen px-6 py-10 items-center justify-center gap-6 text-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-5xl",
                    children: "✨"
                }, void 0, false, {
                    fileName: "[project]/app/matches/page.tsx",
                    lineNumber: 117,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-2xl font-bold text-white",
                            children: "That's everyone"
                        }, void 0, false, {
                            fileName: "[project]/app/matches/page.tsx",
                            lineNumber: 119,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-zinc-400",
                            children: [
                                "Your agent reviewed ",
                                allMatches.length,
                                " potential matches."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/matches/page.tsx",
                            lineNumber: 120,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/matches/page.tsx",
                    lineNumber: 118,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>setMatches(allMatches),
                    className: "px-6 py-3 rounded-xl bg-zinc-800 text-white border border-zinc-700 hover:bg-zinc-700 transition-colors",
                    children: "Start over"
                }, void 0, false, {
                    fileName: "[project]/app/matches/page.tsx",
                    lineNumber: 122,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/matches/page.tsx",
            lineNumber: 116,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col min-h-screen px-6 py-10 gap-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-bold text-white",
                        children: "Your matches"
                    }, void 0, false, {
                        fileName: "[project]/app/matches/page.tsx",
                        lineNumber: 132,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-sm text-zinc-500",
                        children: [
                            matches.length,
                            " remaining"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/matches/page.tsx",
                        lineNumber: 133,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/matches/page.tsx",
                lineNumber: 131,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative h-[460px]",
                children: matches.slice(0, 3).reverse().map((match, i, arr)=>{
                    const isTop = i === arr.length - 1;
                    const offset = (arr.length - 1 - i) * 8;
                    const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMatchedUser"])(match);
                    if (!user) return null;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `absolute inset-0 rounded-3xl bg-zinc-900 border card-glow transition-transform duration-200 overflow-hidden ${isTop ? 'cursor-grab active:cursor-grabbing' : ''}`,
                        style: {
                            transform: isTop ? `translateX(${dragX}px) rotate(${dragX * 0.05}deg)` : `translateY(-${offset}px) scale(${1 - offset * 0.003})`,
                            zIndex: i,
                            borderColor: isTop && dragX > 60 ? 'rgb(52 211 153 / 0.5)' : isTop && dragX < -60 ? 'rgb(239 68 68 / 0.5)' : undefined
                        },
                        onMouseDown: isTop ? (e)=>handleDragStart(e.clientX) : undefined,
                        onMouseMove: isTop ? (e)=>handleDragMove(e.clientX) : undefined,
                        onMouseUp: isTop ? handleDragEnd : undefined,
                        onMouseLeave: isTop ? handleDragEnd : undefined,
                        onTouchStart: isTop ? (e)=>handleDragStart(e.touches[0].clientX) : undefined,
                        onTouchMove: isTop ? (e)=>handleDragMove(e.touches[0].clientX) : undefined,
                        onTouchEnd: isTop ? handleDragEnd : undefined,
                        children: isTop && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6 pb-4 h-full flex flex-col gap-3 select-none",
                            children: [
                                dragX > 60 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute top-6 right-6 text-emerald-400 font-bold text-lg border-2 border-emerald-400 rounded-xl px-3 py-1 rotate-12",
                                    children: "SAVE"
                                }, void 0, false, {
                                    fileName: "[project]/app/matches/page.tsx",
                                    lineNumber: 167,
                                    columnNumber: 21
                                }, this),
                                dragX < -60 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute top-6 left-6 text-red-400 font-bold text-lg border-2 border-red-400 rounded-xl px-3 py-1 -rotate-12",
                                    children: "PASS"
                                }, void 0, false, {
                                    fileName: "[project]/app/matches/page.tsx",
                                    lineNumber: 170,
                                    columnNumber: 21
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AvatarCircle, {
                                            user: user
                                        }, void 0, false, {
                                            fileName: "[project]/app/matches/page.tsx",
                                            lineNumber: 175,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "text-xl font-bold text-white",
                                                    children: user.name
                                                }, void 0, false, {
                                                    fileName: "[project]/app/matches/page.tsx",
                                                    lineNumber: 177,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-zinc-400",
                                                    children: user.role
                                                }, void 0, false, {
                                                    fileName: "[project]/app/matches/page.tsx",
                                                    lineNumber: 178,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ScoreBadge, {
                                                    score: match.score
                                                }, void 0, false, {
                                                    fileName: "[project]/app/matches/page.tsx",
                                                    lineNumber: 179,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/matches/page.tsx",
                                            lineNumber: 176,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/matches/page.tsx",
                                    lineNumber: 174,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 self-start",
                                    children: match.matchType
                                }, void 0, false, {
                                    fileName: "[project]/app/matches/page.tsx",
                                    lineNumber: 184,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-base font-semibold text-white leading-snug",
                                    children: match.headline
                                }, void 0, false, {
                                    fileName: "[project]/app/matches/page.tsx",
                                    lineNumber: 189,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-zinc-400 leading-relaxed flex-1",
                                    children: match.summary
                                }, void 0, false, {
                                    fileName: "[project]/app/matches/page.tsx",
                                    lineNumber: 192,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-3 rounded-xl bg-zinc-800 border border-zinc-700",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-zinc-500 mb-1",
                                            children: "Suggested opener"
                                        }, void 0, false, {
                                            fileName: "[project]/app/matches/page.tsx",
                                            lineNumber: 196,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-zinc-300 italic leading-snug",
                                            children: match.suggestedOpener
                                        }, void 0, false, {
                                            fileName: "[project]/app/matches/page.tsx",
                                            lineNumber: 197,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/matches/page.tsx",
                                    lineNumber: 195,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: `/matches/${match.id}`,
                                    onClick: (e)=>e.stopPropagation(),
                                    className: "flex items-center justify-center gap-1 text-sm text-violet-400 hover:text-violet-300 transition-colors py-1",
                                    children: [
                                        "See full match detail",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/app/matches/page.tsx",
                                            lineNumber: 207,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/matches/page.tsx",
                                    lineNumber: 201,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/matches/page.tsx",
                            lineNumber: 164,
                            columnNumber: 17
                        }, this)
                    }, match.id, false, {
                        fileName: "[project]/app/matches/page.tsx",
                        lineNumber: 145,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/app/matches/page.tsx",
                lineNumber: 137,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-center gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handlePass,
                        className: "w-14 h-14 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center hover:bg-red-500/10 hover:border-red-500/50 transition-colors",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                            className: "w-6 h-6 text-zinc-400 hover:text-red-400 transition-colors"
                        }, void 0, false, {
                            fileName: "[project]/app/matches/page.tsx",
                            lineNumber: 222,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/matches/page.tsx",
                        lineNumber: 218,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleMeet,
                        className: "w-16 h-16 rounded-full bg-violet-600 flex items-center justify-center hover:bg-violet-500 transition-colors shadow-lg shadow-violet-500/25",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"], {
                            className: "w-7 h-7 text-white"
                        }, void 0, false, {
                            fileName: "[project]/app/matches/page.tsx",
                            lineNumber: 228,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/matches/page.tsx",
                        lineNumber: 224,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleSave,
                        className: "w-14 h-14 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-colors",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bookmark$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bookmark$3e$__["Bookmark"], {
                            className: "w-6 h-6 text-zinc-400 hover:text-emerald-400 transition-colors"
                        }, void 0, false, {
                            fileName: "[project]/app/matches/page.tsx",
                            lineNumber: 234,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/matches/page.tsx",
                        lineNumber: 230,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/matches/page.tsx",
                lineNumber: 217,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-center gap-6 text-xs text-zinc-600",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "← Pass"
                    }, void 0, false, {
                        fileName: "[project]/app/matches/page.tsx",
                        lineNumber: 239,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-violet-400",
                        children: "Meet"
                    }, void 0, false, {
                        fileName: "[project]/app/matches/page.tsx",
                        lineNumber: 240,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Save →"
                    }, void 0, false, {
                        fileName: "[project]/app/matches/page.tsx",
                        lineNumber: 241,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/matches/page.tsx",
                lineNumber: 238,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/matches/page.tsx",
        lineNumber: 130,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=_058hl2i._.js.map