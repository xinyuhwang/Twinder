export interface DemoPersona {
  id: string;
  name: string;
  role: string;
  tagline: string;
  persona: string;
  avatarColor: string;
  avatarInitials: string;
}

export const DEMO_PERSONAS: DemoPersona[] = [
  {
    id: 'alexis',
    name: 'Alexis',
    role: 'AI engineer, climber, builder',
    tagline: 'Building software that makes human connection feel less random.',
    persona: 'AI engineer. Digital twins, social AI, agent matching. Rock climber and adventurer. Looking for AI builders, designers with taste, and emotionally intelligent engineers.',
    avatarColor: 'bg-red-500',
    avatarInitials: 'AL',
  },
  {
    id: 'haley',
    name: 'Haley',
    role: 'Social / emotional product thinker',
    tagline: 'Making networking less painful, one emotionally aware product at a time.',
    persona: 'Social product thinker. Making networking less awkward for introverts. Emotionally safe social tools. Looking for thoughtful builders and people interested in social UX.',
    avatarColor: 'bg-success',
    avatarInitials: 'HA',
  },
  {
    id: 'leo',
    name: 'Leo',
    role: 'Backend / infra builder',
    tagline: 'Agent-to-agent infrastructure before it was cool.',
    persona: 'Backend builder. Agent-to-agent infrastructure, real-time systems, chatrooms. Looking for product partners and fast-moving builders.',
    avatarColor: 'bg-blue-500',
    avatarInitials: 'LE',
  },
  {
    id: 'maya',
    name: 'Maya',
    role: 'Product designer, UX thinker',
    tagline: 'Making AI social apps feel human, not creepy.',
    persona: 'Product designer. Playful social apps, dating UX, reducing creepiness in AI. Looking for technical collaborators who care about craft.',
    avatarColor: 'bg-pink-500',
    avatarInitials: 'MA',
  },
  {
    id: 'jordan',
    name: 'Jordan',
    role: 'Go-to-market, community',
    tagline: 'Makes products spread inside communities before they go wide.',
    persona: 'Go-to-market and community person. Events, distribution strategy, launching products inside communities. Looking for builders who need launch help.',
    avatarColor: 'bg-amber-500',
    avatarInitials: 'JO',
  },
  {
    id: 'priya',
    name: 'Priya',
    role: 'AI researcher, knowledge systems',
    tagline: 'Building tools that help people think better, not just faster.',
    persona: 'AI researcher. Personal knowledge management, AI memory, cognitive augmentation. Looking for product builders and people obsessed with learning.',
    avatarColor: 'bg-accent',
    avatarInitials: 'PR',
  },
  {
    id: 'marcus',
    name: 'Marcus',
    role: 'Indie hacker, storyteller',
    tagline: 'Ships small, talks big, finds the distribution angle everyone missed.',
    persona: 'Indie hacker. Creator communities, audience building, product storytelling. Looking for founders who are actually building, not just talking.',
    avatarColor: 'bg-orange-500',
    avatarInitials: 'MC',
  },
  {
    id: 'tyler',
    name: 'Tyler',
    role: 'Crypto-native builder, rationalist',
    persona: 'Crypto-native builder and rationalist in Austin. Prediction markets, DeFi, mechanism design, radical self-sovereignty. Looking for builders who ship and people who bet on their beliefs.',
    avatarColor: 'bg-cyan-500',
    avatarInitials: 'TY',
  },
  {
    id: 'brady',
    name: 'Brady',
    role: 'Longevity biohacker, AI alignment',
    persona: 'Longevity-obsessed quantified-self maximalist in the Bay Area. Biohacking, lifelogging, AI alignment and x-risk. Looking for biohackers and AI-safety folks who take data seriously.',
    avatarColor: 'bg-teal-500',
    avatarInitials: 'BR',
  },
];

// Demo roster — the concrete, ordered list of personas shown as "others in the room"
// during the arena. Edit this to control exactly who appears (each id must exist in
// DEMO_PERSONAS above). This replaces the old `.slice(0, 5)` so the roster is explicit.
export const ARENA_PERSONA_IDS: string[] = [
  'alexis', 'haley', 'leo', 'maya', 'jordan', 'priya', 'marcus', 'tyler', 'brady',
];

export const personaById = (id: string): DemoPersona | undefined =>
  DEMO_PERSONAS.find(p => p.id === id);

// The roster resolved to persona objects (unknown ids are skipped).
export const arenaRoster = (): DemoPersona[] =>
  ARENA_PERSONA_IDS.map(personaById).filter((p): p is DemoPersona => Boolean(p));
