import Redis from 'ioredis';

// Reuse a single connection in dev (Next.js hot-reloads the module otherwise)
declare global {
  // eslint-disable-next-line no-var
  var _redis: Redis | undefined;
}

function createClient(): Redis {
  const url = process.env.REDIS_URL || 'redis://localhost:6379';
  const client = new Redis(url, {
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
    lazyConnect: true,
  });
  client.on('error', () => {
    // Silently fail — API routes return mock data when Redis is unavailable
  });
  return client;
}

const redis: Redis = global._redis ?? createClient();
if (process.env.NODE_ENV !== 'production') global._redis = redis;

export default redis;
