export type EventMode = 'HACKATHON' | 'NETWORKING' | 'DATING' | 'GENERAL';

export interface DemoUser {
  id: string;
  name: string;
  role: string;
  avatarColor: string; // tailwind bg color class
  avatarInitials: string;
  tagline: string;
  interests: string[];
  lookingFor: string[];
  agentVoice: string[];
  twinProfile: TwinProfile;
}

export interface TwinProfile {
  vibe: string;
  lookingFor: string[];
  conversationBait: string[];
  canHelpWith: string[];
  wantsHelpWith: string[];
  agentVoice: string;
  completenessScore: number;
}

export interface Match {
  id: string;
  userId: string; // the matched user
  score: number; // 0-100
  matchType: string; // e.g. "Complementary builders"
  headline: string;
  summary: string;
  suggestedOpener: string;
  whyMeet: string[];
  strongestOverlap: string;
  nonObviousOverlap: string;
  complementaryDynamic: string;
  followUpQuestions: string[];
  canHelpThem: string;
  theyCanHelpYou: string;
  possibleMismatch: string;
  privacyNote: string;
  conversation: ConversationTurn[];
  conversationHighlights: string[];
}

export interface ConversationTurn {
  speaker: 'A' | 'B';
  speakerName: string;
  content: string;
}

export interface ArenaEvent {
  id: number;
  type: 'enter' | 'meeting' | 'highlight' | 'complete';
  text: string;
  matchedUserId?: string;
}

export interface OnboardingAnswers {
  animal?: string;
  color?: string;
  eventGoal?: string;
  lookingFor?: string;
  canHelp?: string;
  neverShare?: string;
  pastedContext?: string;
}
