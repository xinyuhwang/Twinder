import { NextRequest, NextResponse } from 'next/server';
import redis from '@/lib/redis';

const EVENT_ID = process.env.NEXT_PUBLIC_EVENT_ID ?? 'HACK-AI-2026';
const TTL = parseInt(process.env.PRESENCE_TTL ?? '1800', 10);

function key(userId: string) {
  return `presence:${EVENT_ID}:${userId}`;
}

// GET /api/presence — list everyone currently in the room
export async function GET() {
  try {
    await redis.connect().catch(() => {});
    const keys = await redis.keys(`presence:${EVENT_ID}:*`);
    if (keys.length === 0) return NextResponse.json({ users: [] });

    const values = await redis.mget(...keys);
    const users = values
      .filter(Boolean)
      .map(v => { try { return JSON.parse(v!); } catch { return null; } })
      .filter(Boolean);

    return NextResponse.json({ users });
  } catch {
    return NextResponse.json({ users: [] });
  }
}

// POST /api/presence — register yourself (or refresh TTL)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, name, role, avatarColor, avatarInitials, twinProfile, tagline } = body;
    if (!userId || !name) {
      return NextResponse.json({ error: 'userId and name required' }, { status: 400 });
    }

    await redis.connect().catch(() => {});
    await redis.set(
      key(userId),
      JSON.stringify({ userId, name, role, avatarColor, avatarInitials, twinProfile, tagline, joinedAt: Date.now() }),
      'EX',
      TTL,
    );

    return NextResponse.json({ ok: true });
  } catch {
    // Redis unavailable — silently succeed so the demo still works offline
    return NextResponse.json({ ok: true });
  }
}

// DELETE /api/presence — leave the room
export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await req.json();
    if (userId) {
      await redis.connect().catch(() => {});
      await redis.del(key(userId));
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
