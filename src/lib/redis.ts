import "server-only";
import Redis from "ioredis";

let client: Redis | null = null;
let disabled = true;

export function redis(): Redis | null {
  return null;
}

export async function redisGetJSON<T>(key: string): Promise<T | null> {
  return null;
}

export async function redisSetJSON(key: string, value: unknown, ttlSeconds: number): Promise<void> {
  return;
}

