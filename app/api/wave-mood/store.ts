import { Redis } from "@upstash/redis";

// The little shared memory behind the route's cost protection: a cache of answers and the visitors' counters.
// On Vercel every request may land on a different serverless instance, so plain variables would not be seen by the
// next one; Redis (Upstash, added from the Vercel Marketplace) is the shared place. It puts `KV_REST_API_URL` and
// `KV_REST_API_TOKEN` in the environment, which `Redis.fromEnv()` reads. Without them (local `pnpm dev`) the same
// operations run on a Map, so nothing extra is needed to work on the site.
export type Store = {
  get: <T>(key: string) => Promise<T | null>;
  set: (key: string, value: unknown, seconds: number) => Promise<void>;
  /** Claims the key for `seconds` if it is free. False means someone already holds it. */
  claim: (key: string, seconds: number) => Promise<boolean>;
  /** Adds one to a counter that expires `seconds` after its first count, and returns the new total. */
  count: (key: string, seconds: number) => Promise<number>;
};

const hasRedis = () =>
  Boolean((process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL) && (process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN));

const redisStore = (): Store => {
  const redis = Redis.fromEnv();
  return {
    get: (key) => redis.get(key),
    set: async (key, value, seconds) => {
      await redis.set(key, value, { ex: seconds });
    },
    claim: async (key, seconds) => (await redis.set(key, 1, { ex: seconds, nx: true })) === "OK",
    count: async (key, seconds) => {
      const total = await redis.incr(key);
      if (total === 1) await redis.expire(key, seconds);
      return total;
    },
  };
};

// Keeps the Map from growing for good: past this many entries it starts over (fine for a dev server).
const MAX_MEMORY_ENTRIES = 500;

const memoryStore = (): Store => {
  const entries = new Map<string, { value: unknown; expires: number }>();
  const read = (key: string) => {
    const entry = entries.get(key);
    if (entry && entry.expires > Date.now()) return entry;
    entries.delete(key);
    return undefined;
  };
  const write = (key: string, value: unknown, seconds: number, keepExpiry?: number) => {
    if (entries.size >= MAX_MEMORY_ENTRIES) entries.clear();
    entries.set(key, { value, expires: keepExpiry ?? Date.now() + seconds * 1000 });
  };
  return {
    get: async <T>(key: string) => (read(key)?.value as T | undefined) ?? null,
    set: async (key, value, seconds) => write(key, value, seconds),
    claim: async (key, seconds) => {
      if (read(key)) return false;
      write(key, 1, seconds);
      return true;
    },
    count: async (key, seconds) => {
      const entry = read(key);
      const total = ((entry?.value as number | undefined) ?? 0) + 1;
      write(key, total, seconds, entry?.expires);
      return total;
    },
  };
};

// One store per server instance; in dev the module can reload, so it is kept on `globalThis` to keep the Map.
const globalForStore = globalThis as { waveMoodStore?: Store };

export const getStore = (): Store => (globalForStore.waveMoodStore ??= hasRedis() ? redisStore() : memoryStore());
