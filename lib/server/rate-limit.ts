import { createHash } from "node:crypto";
import { Redis } from "@upstash/redis";

let redis: Redis | null = null;
const localBuckets = new Map<string, { count: number; expiresAt: number }>();

function getRedis() {
  if (redis) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  redis = new Redis({ url, token });
  return redis;
}

function localLimit(key: string, limit: number, windowSeconds: number) {
  const now = Date.now();
  const current = localBuckets.get(key);
  if (!current || current.expiresAt <= now) {
    localBuckets.set(key, { count: 1, expiresAt: now + windowSeconds * 1000 });
    return { allowed: true, configured: true, remaining: limit - 1 };
  }
  current.count += 1;
  if (localBuckets.size > 10000) {
    for (const [bucketKey, bucket] of localBuckets) {
      if (bucket.expiresAt <= now) localBuckets.delete(bucketKey);
    }
  }
  return { allowed: current.count <= limit, configured: true, remaining: Math.max(0, limit - current.count) };
}

export async function checkRateLimit(namespace: string, identifier: string, limit: number, windowSeconds: number) {
  const fingerprint = createHash("sha256").update(identifier).digest("hex");
  const key = `rnt:rate:${namespace}:${fingerprint}`;
  const client = getRedis();

  if (!client) {
    if (process.env.NODE_ENV !== "production") return localLimit(key, limit, windowSeconds);
    return { allowed: false, configured: false, remaining: 0 };
  }

  const count = await client.incr(key);
  if (count === 1) await client.expire(key, windowSeconds);
  return { allowed: count <= limit, configured: true, remaining: Math.max(0, limit - count) };
}
