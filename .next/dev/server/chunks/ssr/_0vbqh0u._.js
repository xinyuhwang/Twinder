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
"[project]/app/demo/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Demo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mock-api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$local$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/local-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.mjs [app-ssr] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.mjs [app-ssr] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.mjs [app-ssr] (ecmascript) <export default as ArrowRight>");
'use client';
;
;
;
;
;
;
const LOADING_MESSAGES = [
    'Loading twin profiles...',
    'Connecting to event room...',
    'Twins ready.'
];
function AvatarCircle({ user, size = 'md' }) {
    const sizes = {
        sm: 'w-10 h-10 text-sm',
        md: 'w-14 h-14 text-base'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `${sizes[size]} ${user.avatarColor} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0`,
        children: user.avatarInitials
    }, void 0, false, {
        fileName: "[project]/app/demo/page.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, this);
}
function Demo() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [phase, setPhase] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('loading');
    const [msgIndex, setMsgIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [selectedId, setSelectedId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('alexis');
    const [joining, setJoining] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const users = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAllUsers"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let i = 0;
        const interval = setInterval(()=>{
            i++;
            setMsgIndex(i);
            if (i >= LOADING_MESSAGES.length - 1) {
                clearInterval(interval);
                setTimeout(()=>setPhase('select'), 600);
            }
        }, 500);
        return ()=>clearInterval(interval);
    }, []);
    async function handleContinue() {
        setJoining(true);
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$local$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["localStore"].setSelectedUser(selectedId);
        const user = users.find((u)=>u.id === selectedId);
        // Register presence so other LAN participants see this user in the room
        try {
            await fetch('/api/presence', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: selectedId,
                    name: user.name,
                    role: user.role,
                    avatarColor: user.avatarColor,
                    avatarInitials: user.avatarInitials,
                    tagline: user.tagline,
                    twinProfile: user.twinProfile
                })
            });
        } catch  {
        // offline — fine, demo still works with mock data
        }
        router.push('/arena');
    }
    if (phase === 'loading') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col items-center justify-center min-h-screen px-6 gap-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative w-16 h-16",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute inset-0 rounded-full border-4 border-violet-500/20"
                        }, void 0, false, {
                            fileName: "[project]/app/demo/page.tsx",
                            lineNumber: 76,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute inset-0 rounded-full border-4 border-transparent border-t-violet-500 animate-spin"
                        }, void 0, false, {
                            fileName: "[project]/app/demo/page.tsx",
                            lineNumber: 77,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute inset-2 rounded-full border-2 border-transparent border-t-pink-400 animate-spin",
                            style: {
                                animationDirection: 'reverse',
                                animationDuration: '1.2s'
                            }
                        }, void 0, false, {
                            fileName: "[project]/app/demo/page.tsx",
                            lineNumber: 78,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/demo/page.tsx",
                    lineNumber: 75,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-2 flex-wrap justify-center",
                    children: [
                        'Alexis',
                        'Haley',
                        'Leo',
                        'Maya',
                        'Jordan',
                        'Priya',
                        'Marcus'
                    ].map((name, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-xs px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 animate-pulse",
                            style: {
                                animationDelay: `${i * 0.1}s`
                            },
                            children: name
                        }, name, false, {
                            fileName: "[project]/app/demo/page.tsx",
                            lineNumber: 84,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/app/demo/page.tsx",
                    lineNumber: 82,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-zinc-400 text-sm min-h-5 transition-all duration-300",
                    children: LOADING_MESSAGES[Math.min(msgIndex, LOADING_MESSAGES.length - 1)]
                }, void 0, false, {
                    fileName: "[project]/app/demo/page.tsx",
                    lineNumber: 94,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/demo/page.tsx",
            lineNumber: 74,
            columnNumber: 7
        }, this);
    }
    const selectedUser = users.find((u)=>u.id === selectedId);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col min-h-screen px-6 py-10 gap-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 text-emerald-400 text-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/app/demo/page.tsx",
                                lineNumber: 107,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "7 twins ready · HACK-AI-2026"
                            }, void 0, false, {
                                fileName: "[project]/app/demo/page.tsx",
                                lineNumber: 108,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/demo/page.tsx",
                        lineNumber: 106,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-bold text-white",
                        children: "Who are you today?"
                    }, void 0, false, {
                        fileName: "[project]/app/demo/page.tsx",
                        lineNumber: 110,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-zinc-500 text-sm",
                        children: "Select a pre-built twin to enter the arena."
                    }, void 0, false, {
                        fileName: "[project]/app/demo/page.tsx",
                        lineNumber: 111,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/demo/page.tsx",
                lineNumber: 105,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2 flex-1",
                children: users.map((user)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setSelectedId(user.id),
                        className: `w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${selectedId === user.id ? 'border-violet-500 bg-violet-500/10' : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AvatarCircle, {
                                user: user,
                                size: "sm"
                            }, void 0, false, {
                                fileName: "[project]/app/demo/page.tsx",
                                lineNumber: 126,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 min-w-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 flex-wrap",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-semibold text-white",
                                                children: user.name
                                            }, void 0, false, {
                                                fileName: "[project]/app/demo/page.tsx",
                                                lineNumber: 129,
                                                columnNumber: 17
                                            }, this),
                                            selectedId === user.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs text-violet-400 bg-violet-500/20 px-2 py-0.5 rounded-full",
                                                children: "You"
                                            }, void 0, false, {
                                                fileName: "[project]/app/demo/page.tsx",
                                                lineNumber: 131,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/demo/page.tsx",
                                        lineNumber: 128,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-zinc-500 truncate",
                                        children: user.role
                                    }, void 0, false, {
                                        fileName: "[project]/app/demo/page.tsx",
                                        lineNumber: 134,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/demo/page.tsx",
                                lineNumber: 127,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-shrink-0 text-right",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs text-zinc-600",
                                    children: [
                                        user.twinProfile.completenessScore,
                                        "%"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/demo/page.tsx",
                                    lineNumber: 138,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/demo/page.tsx",
                                lineNumber: 137,
                                columnNumber: 13
                            }, this)
                        ]
                    }, user.id, true, {
                        fileName: "[project]/app/demo/page.tsx",
                        lineNumber: 117,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/demo/page.tsx",
                lineNumber: 115,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleContinue,
                        disabled: joining,
                        className: "w-full py-4 rounded-2xl bg-violet-600 text-white font-semibold text-lg hover:bg-violet-500 disabled:opacity-60 transition-colors flex items-center justify-center gap-2",
                        children: [
                            joining ? 'Entering arena...' : `Enter as ${selectedUser.name}`,
                            !joining && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                className: "w-5 h-5"
                            }, void 0, false, {
                                fileName: "[project]/app/demo/page.tsx",
                                lineNumber: 151,
                                columnNumber: 24
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/demo/page.tsx",
                        lineNumber: 145,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 h-px bg-zinc-800"
                            }, void 0, false, {
                                fileName: "[project]/app/demo/page.tsx",
                                lineNumber: 155,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-zinc-600",
                                children: "or"
                            }, void 0, false, {
                                fileName: "[project]/app/demo/page.tsx",
                                lineNumber: 156,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 h-px bg-zinc-800"
                            }, void 0, false, {
                                fileName: "[project]/app/demo/page.tsx",
                                lineNumber: 157,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/demo/page.tsx",
                        lineNumber: 154,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$local$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["localStore"].setSelectedUser(selectedId);
                            router.push('/onboarding');
                        },
                        className: "w-full py-3 rounded-2xl bg-zinc-900 text-zinc-400 text-sm font-medium hover:bg-zinc-800 border border-zinc-800 transition-colors",
                        children: "Build my own twin →"
                    }, void 0, false, {
                        fileName: "[project]/app/demo/page.tsx",
                        lineNumber: 160,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$local$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["localStore"].reset();
                            setPhase('loading');
                            setMsgIndex(0);
                        },
                        className: "w-full flex items-center justify-center gap-2 py-2 text-zinc-600 text-xs hover:text-zinc-400 transition-colors",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                className: "w-3 h-3"
                            }, void 0, false, {
                                fileName: "[project]/app/demo/page.tsx",
                                lineNumber: 171,
                                columnNumber: 11
                            }, this),
                            "Reset demo"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/demo/page.tsx",
                        lineNumber: 167,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/demo/page.tsx",
                lineNumber: 144,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/demo/page.tsx",
        lineNumber: 104,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=_0vbqh0u._.js.map