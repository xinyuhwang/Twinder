export interface DemoPersona {
  id: string;
  name: string;
  role: string;
  persona: string;
  avatarColor: string;
  avatarInitials: string;
}

export const DEMO_PERSONAS: DemoPersona[] = [
  {
    id: 'alexis',
    name: 'Alexis',
    role: 'AI engineer, climber, builder',
    persona: 'AI engineer. Digital twins, social AI, agent matching. Rock climber and adventurer. Looking for AI builders, designers with taste, and emotionally intelligent engineers.',
    avatarColor: 'bg-red-500',
    avatarInitials: 'AL',
  },
  {
    id: 'haley',
    name: 'Haley',
    role: 'Social / emotional product thinker',
    persona: 'Social product thinker. Making networking less awkward for introverts. Emotionally safe social tools. Looking for thoughtful builders and people interested in social UX.',
    avatarColor: 'bg-emerald-500',
    avatarInitials: 'HA',
  },
  {
    id: 'leo',
    name: 'Leo',
    role: 'Backend / infra builder',
    persona: 'Backend builder. Agent-to-agent infrastructure, real-time systems, chatrooms. Looking for product partners and fast-moving builders.',
    avatarColor: 'bg-blue-500',
    avatarInitials: 'LE',
  },
  {
    id: 'maya',
    name: 'Maya',
    role: 'Product designer, UX thinker',
    persona: 'Product designer. Playful social apps, dating UX, reducing creepiness in AI. Looking for technical collaborators who care about craft.',
    avatarColor: 'bg-pink-500',
    avatarInitials: 'MA',
  },
  {
    id: 'jordan',
    name: 'Jordan',
    role: 'Go-to-market, community',
    persona: 'Go-to-market and community person. Events, distribution strategy, launching products inside communities. Looking for builders who need launch help.',
    avatarColor: 'bg-amber-500',
    avatarInitials: 'JO',
  },
  {
    id: 'priya',
    name: 'Priya',
    role: 'AI researcher, knowledge systems',
    persona: 'AI researcher. Personal knowledge management, AI memory, cognitive augmentation. Looking for product builders and people obsessed with learning.',
    avatarColor: 'bg-violet-500',
    avatarInitials: 'PR',
  },
  {
    id: 'marcus',
    name: 'Marcus',
    role: 'Indie hacker, storyteller',
    persona: 'Indie hacker. Creator communities, audience building, product storytelling. Looking for founders who are actually building, not just talking.',
    avatarColor: 'bg-orange-500',
    avatarInitials: 'MC',
  },
];
