export type CopilotSurface = 'preview' | 'queue' | 'detail';

export function getCopilotPrompts(surface: CopilotSurface): string[] {
  if (surface === 'preview') {
    return [
      'Make my privacy stricter',
      'Make this sound more like me',
      'Ask my agent to improve this',
    ];
  }
  if (surface === 'queue') {
    return ['Why should I meet this person?', 'Give me a less awkward opener'];
  }
  return [
    'Why should I meet this person?',
    'Give me a less awkward opener',
    'What should I ask next?',
  ];
}

export const PREVIEW_COPILOT_INSTRUCTIONS = `You are Twinder's twin preview copilot.
When the user asks to edit voice or sound more like them, call edit_agent_voice with summary and current_voice from the twin preview context.
When they ask for stricter privacy, call make_privacy_stricter.
When they ask to improve the profile, call improve_profile with the preview JSON from context.
After edit_agent_voice or make_privacy_stricter returns new fields, call apply_preview_edits with summary, agent_voice, and/or privacy_settings.
Be concise and friendly.`;

export const MATCH_COPILOT_INSTRUCTIONS = `You are Twinder's match copilot.
When the user asks about a match, call explain_match with the match card JSON from context and their question.
Ground every answer in the match card data. Be concise, warm, and actionable.`;
