const ERROR_PATTERNS = [
  /error/i,
  /exception/i,
  /litellm/i,
  /rate.?limit/i,
  /traceback/i,
  /^\s*\(/,          // starts with parenthesized reason like "(400, ...)"
];

export function sanitizeSummary(summary: string | undefined, opponentName: string): string {
  if (!summary) return `Your twin met ${opponentName}. Score is still being calculated.`;
  if (ERROR_PATTERNS.some(re => re.test(summary))) {
    return `Your twin met ${opponentName}, but we're still finishing the score. Check back in a moment.`;
  }
  return summary;
}
