import type { TwinPreview } from '@/types';
import type { DemoPersona } from '@/lib/personas';

export interface AgentPreviewDisplay {
  agentName: string;
  summary: string;
  agentVibe: string;
  lookingFor: string[];
  interests: string[];
  conversationBait: string[];
  canHelpWith: string[];
  wantsHelpWith: string[];
  agentVoice: string;
  privacySettings: string[];
  completenessScore: number;
  avatarName: string;
  avatarInitials?: string;
  avatarColor?: string;
}

const DEFAULT_PRIVACY = [
  'Contact info hidden until you approve a meet',
  'No raw intake text shown to matches',
  'Agent summarizes, never quotes verbatim',
];

const STRICT_PRIVACY = [
  'Contact info hidden until mutual meet approval',
  'No employer, location, or social handles shared',
  'Agent shares only high-level themes, not specifics',
  'Matches see a short summary, not your full profile',
];

export function getDefaultPrivacySettings(): string[] {
  return [...DEFAULT_PRIVACY];
}

export function getStrictPrivacySettings(): string[] {
  return [...STRICT_PRIVACY];
}

function splitList(text: string): string[] {
  return text
    .split(/[,;]|\band\b/)
    .map(s => s.trim())
    .filter(s => s.length > 2)
    .slice(0, 5);
}

function unionUnique(a: string[], b: string[], max = 6): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of [...a, ...b]) {
    const key = item.toLowerCase().trim();
    if (!seen.has(key) && item.trim()) {
      seen.add(key);
      result.push(item.trim());
    }
    if (result.length >= max) break;
  }
  return result;
}

function extractLookingFor(personaText: string): string[] {
  const match = personaText.match(/looking for[:\s]+(.+)/i);
  if (match) return splitList(match[1]);
  return splitList(personaText).slice(0, 3);
}

export function buildPreviewFromPersona(
  persona: DemoPersona,
  userName?: string | null,
): AgentPreviewDisplay {
  const name = userName ?? persona.name;
  const lookingFor = extractLookingFor(persona.persona);
  const interests = splitList(persona.persona.split(/looking for/i)[0] ?? persona.persona);

  return {
    agentName: `${name}'s Twin`,
    summary: persona.persona,
    agentVibe: persona.role,
    lookingFor: lookingFor.length > 0 ? lookingFor : ['Thoughtful collaborators', 'Interesting builders'],
    interests: interests.length > 0 ? interests : [persona.role],
    conversationBait: interests.slice(0, 3),
    canHelpWith: [`${persona.role} perspective`, 'Honest feedback on ideas', 'Warm introductions when there is fit'],
    wantsHelpWith: lookingFor.slice(0, 3).length > 0
      ? lookingFor.slice(0, 3)
      : ['People outside my usual bubble', 'Collaborators with complementary skills'],
    agentVoice: 'Warm, curious, and direct. Playful when the room allows it.',
    privacySettings: getDefaultPrivacySettings(),
    completenessScore: 82,
    avatarName: name,
    avatarInitials: persona.avatarInitials,
    avatarColor: persona.avatarColor,
  };
}

export function buildPreviewFromTwinPreview(
  twin: TwinPreview,
  persona: DemoPersona | null,
  userName?: string | null,
): AgentPreviewDisplay {
  const name = userName ?? persona?.name ?? 'You';

  const base: AgentPreviewDisplay = persona
    ? buildPreviewFromPersona(persona, name)
    : {
        agentName: `${name}'s Twin`,
        summary: twin.public_safe_summary ?? '',
        agentVibe: 'Builder with range',
        lookingFor: twin.looking_for,
        interests: twin.interests,
        conversationBait: twin.interests.slice(0, 3),
        canHelpWith: ['Thoughtful conversation', 'Connecting dots between ideas'],
        wantsHelpWith: twin.looking_for.slice(0, 3),
        agentVoice: 'Warm, curious, and direct.',
        privacySettings: getDefaultPrivacySettings(),
        completenessScore: 70,
        avatarName: name,
      };

  const backendLookingFor = twin.looking_for.length > 0 ? twin.looking_for : base.lookingFor;
  const backendInterests = twin.interests.length > 0 ? twin.interests : base.interests;

  const filledFields = [
    twin.public_safe_summary,
    twin.looking_for.length > 0,
    twin.interests.length > 0,
  ].filter(Boolean).length;

  return {
    ...base,
    summary: twin.public_safe_summary ?? base.summary,
    agentVibe: twin.public_safe_summary?.split('.')[0] ?? base.agentVibe,
    lookingFor: unionUnique(backendLookingFor, base.lookingFor),
    interests: backendInterests,
    conversationBait: backendInterests.slice(0, 3),
    canHelpWith: base.canHelpWith,
    wantsHelpWith: unionUnique(backendLookingFor.slice(0, 3), base.wantsHelpWith),
    privacySettings: getDefaultPrivacySettings(),
    completenessScore: Math.min(95, 60 + filledFields * 6),
    avatarName: name,
    avatarInitials: persona?.avatarInitials,
    avatarColor: persona?.avatarColor,
  };
}

export function applyWarmerVoice(preview: AgentPreviewDisplay): AgentPreviewDisplay {
  const warmer = preview.summary
    .replace(/\bprofessional\b/gi, 'real')
    .replace(/\bcorporate\b/gi, 'human');
  return {
    ...preview,
    summary: warmer || preview.summary,
    agentVoice: 'Casual, warm, and a little weird in a good way.',
  };
}
