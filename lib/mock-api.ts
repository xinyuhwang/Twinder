import { DemoUser, Match, ArenaEvent } from '@/types';
import { DEMO_USERS, MATCHES, ARENA_EVENTS } from './mock-data';

export function getAllUsers(): DemoUser[] {
  return DEMO_USERS;
}

export function getUserById(id: string): DemoUser | undefined {
  return DEMO_USERS.find(u => u.id === id);
}

export function getMatchesForUser(userId: string): Match[] {
  return MATCHES;
}

export function getMatchById(matchId: string): Match | undefined {
  return MATCHES.find(m => m.id === matchId);
}

export function getArenaEvents(): ArenaEvent[] {
  return ARENA_EVENTS;
}

export function getMatchedUser(match: Match): DemoUser | undefined {
  return getUserById(match.userId);
}
