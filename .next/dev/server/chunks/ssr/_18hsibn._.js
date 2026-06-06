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
"[project]/app/arena/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Arena
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mock-api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$local$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/local-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zap.mjs [app-ssr] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wifi$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wifi.mjs [app-ssr] (ecmascript) <export default as Wifi>");
'use client';
;
;
;
;
;
;
function AvatarDot({ color, initials, size = 'md', live = false }) {
    const sizes = {
        sm: 'w-10 h-10 text-xs',
        md: 'w-14 h-14 text-sm'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `${sizes[size]} ${color} rounded-full flex items-center justify-center font-bold text-white`,
                children: initials
            }, void 0, false, {
                fileName: "[project]/app/arena/page.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, this),
            live && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0a0a0f]"
            }, void 0, false, {
                fileName: "[project]/app/arena/page.tsx",
                lineNumber: 31,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/arena/page.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
function Arena() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [visibleEvents, setVisibleEvents] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [done, setDone] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [stats, setStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        met: 0,
        matches: 0,
        topScore: 0
    });
    const [liveParticipants, setLiveParticipants] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const doneRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const events = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getArenaEvents"])();
    const userId = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$local$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["localStore"].getSelectedUser();
    const currentUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getUserById"])(userId);
    const mockOthers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAllUsers"])().filter((u)=>u.id !== userId).slice(0, 4);
    // Poll for live LAN participants every 4 seconds
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        async function fetchPresence() {
            try {
                const res = await fetch('/api/presence');
                const data = await res.json();
                const others = data.users.filter((u)=>u.userId !== userId);
                setLiveParticipants(others);
            } catch  {
            // Redis unavailable — show no live participants
            }
        }
        fetchPresence();
        const poll = setInterval(fetchPresence, 4000);
        return ()=>clearInterval(poll);
    }, [
        userId
    ]);
    // Arena event feed animation
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let i = 0;
        const interval = setInterval(()=>{
            if (i >= events.length) {
                clearInterval(interval);
                if (!doneRef.current) {
                    doneRef.current = true;
                    setDone(true);
                    setStats({
                        met: 4,
                        matches: 4,
                        topScore: 94
                    });
                }
                return;
            }
            const ev = events[i];
            i++;
            setVisibleEvents((prev)=>[
                    ...prev,
                    ev
                ]);
            if (ev.type === 'meeting') setStats((s)=>({
                    ...s,
                    met: s.met + 1
                }));
            if (ev.type === 'highlight') setStats((s)=>({
                    ...s,
                    matches: s.matches + 1,
                    topScore: Math.max(s.topScore, 76 + s.matches * 6)
                }));
        }, 800);
        return ()=>clearInterval(interval);
    }, []);
    // Decide which avatars to show in the ring
    const ringUsers = liveParticipants.length > 0 ? liveParticipants.slice(0, 6).map((p)=>({
            id: p.userId,
            color: p.avatarColor,
            initials: p.avatarInitials,
            live: true
        })) : mockOthers.map((u)=>({
            id: u.id,
            color: u.avatarColor,
            initials: u.avatarInitials,
            live: false,
            matchedId: u.id
        }));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col min-h-screen px-6 py-10 gap-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-2xl font-bold text-white",
                                children: "Agent Arena"
                            }, void 0, false, {
                                fileName: "[project]/app/arena/page.tsx",
                                lineNumber: 115,
                                columnNumber: 11
                            }, this),
                            liveParticipants.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1.5 text-emerald-400 text-xs",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wifi$3e$__["Wifi"], {
                                        className: "w-3 h-3"
                                    }, void 0, false, {
                                        fileName: "[project]/app/arena/page.tsx",
                                        lineNumber: 118,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            liveParticipants.length,
                                            " live"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/arena/page.tsx",
                                        lineNumber: 119,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/arena/page.tsx",
                                lineNumber: 117,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/arena/page.tsx",
                        lineNumber: 114,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-zinc-400 text-sm",
                        children: "HACK-AI-2026 · Your twin is working the room."
                    }, void 0, false, {
                        fileName: "[project]/app/arena/page.tsx",
                        lineNumber: 123,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/arena/page.tsx",
                lineNumber: 113,
                columnNumber: 7
            }, this),
            currentUser && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-center py-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative w-44 h-44",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute inset-0 flex items-center justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `w-20 h-20 ${currentUser.avatarColor} rounded-full flex items-center justify-center text-2xl font-bold text-white ring-4 ring-violet-500/50 ring-offset-4 ring-offset-[#0a0a0f]`,
                                children: currentUser.avatarInitials
                            }, void 0, false, {
                                fileName: "[project]/app/arena/page.tsx",
                                lineNumber: 132,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/arena/page.tsx",
                            lineNumber: 131,
                            columnNumber: 13
                        }, this),
                        ringUsers.map((u, i)=>{
                            const angle = i / ringUsers.length * 360 - 90;
                            const rad = angle * Math.PI / 180;
                            const x = 50 + 44 * Math.cos(rad);
                            const y = 50 + 44 * Math.sin(rad);
                            const isActive = visibleEvents.some((e)=>e.matchedUserId === u.id || u.live);
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700",
                                style: {
                                    left: `${x}%`,
                                    top: `${y}%`,
                                    opacity: isActive ? 1 : 0.25
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AvatarDot, {
                                    color: u.color,
                                    initials: u.initials,
                                    size: "sm",
                                    live: u.live
                                }, void 0, false, {
                                    fileName: "[project]/app/arena/page.tsx",
                                    lineNumber: 150,
                                    columnNumber: 19
                                }, this)
                            }, u.id, false, {
                                fileName: "[project]/app/arena/page.tsx",
                                lineNumber: 145,
                                columnNumber: 17
                            }, this);
                        }),
                        !done && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute inset-4 rounded-full border border-violet-500/20 animate-ping",
                            style: {
                                animationDuration: '2s'
                            }
                        }, void 0, false, {
                            fileName: "[project]/app/arena/page.tsx",
                            lineNumber: 157,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/arena/page.tsx",
                    lineNumber: 129,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/arena/page.tsx",
                lineNumber: 128,
                columnNumber: 9
            }, this),
            liveParticipants.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wifi$3e$__["Wifi"], {
                        className: "w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5"
                    }, void 0, false, {
                        fileName: "[project]/app/arena/page.tsx",
                        lineNumber: 166,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-0.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm font-semibold text-emerald-300",
                                children: [
                                    liveParticipants.length,
                                    " ",
                                    liveParticipants.length === 1 ? 'person is' : 'people are',
                                    " live in this room"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/arena/page.tsx",
                                lineNumber: 168,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-emerald-500",
                                children: liveParticipants.map((p)=>p.name).join(', ')
                            }, void 0, false, {
                                fileName: "[project]/app/arena/page.tsx",
                                lineNumber: 171,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/arena/page.tsx",
                        lineNumber: 167,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/arena/page.tsx",
                lineNumber: 165,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-3 gap-3",
                children: [
                    {
                        label: 'Agents met',
                        value: stats.met
                    },
                    {
                        label: 'Matches',
                        value: stats.matches
                    },
                    {
                        label: 'Top score',
                        value: stats.topScore > 0 ? `${stats.topScore}` : '—'
                    }
                ].map(({ label, value })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xl font-bold text-white",
                                children: value
                            }, void 0, false, {
                                fileName: "[project]/app/arena/page.tsx",
                                lineNumber: 186,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-zinc-500",
                                children: label
                            }, void 0, false, {
                                fileName: "[project]/app/arena/page.tsx",
                                lineNumber: 187,
                                columnNumber: 13
                            }, this)
                        ]
                    }, label, true, {
                        fileName: "[project]/app/arena/page.tsx",
                        lineNumber: 185,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/arena/page.tsx",
                lineNumber: 179,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 space-y-2 overflow-y-auto max-h-72",
                children: [
                    visibleEvents.map((event)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `p-3 rounded-xl text-sm transition-all ${event.type === 'highlight' ? 'bg-violet-500/10 border border-violet-500/20 text-violet-300' : event.type === 'complete' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300' : 'bg-zinc-900 border border-zinc-800 text-zinc-400'}`,
                            children: [
                                event.type === 'highlight' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                    className: "w-3 h-3 inline mr-1"
                                }, void 0, false, {
                                    fileName: "[project]/app/arena/page.tsx",
                                    lineNumber: 205,
                                    columnNumber: 44
                                }, this),
                                event.text
                            ]
                        }, event.id, true, {
                            fileName: "[project]/app/arena/page.tsx",
                            lineNumber: 195,
                            columnNumber: 11
                        }, this)),
                    !done && visibleEvents.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center text-zinc-600 text-sm py-8",
                        children: "Entering arena..."
                    }, void 0, false, {
                        fileName: "[project]/app/arena/page.tsx",
                        lineNumber: 210,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/arena/page.tsx",
                lineNumber: 193,
                columnNumber: 7
            }, this),
            done && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>router.push('/matches'),
                className: "w-full py-4 rounded-2xl bg-violet-600 text-white font-semibold text-lg hover:bg-violet-500 transition-colors",
                children: "View matches →"
            }, void 0, false, {
                fileName: "[project]/app/arena/page.tsx",
                lineNumber: 215,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/arena/page.tsx",
        lineNumber: 112,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=_18hsibn._.js.map