import { env } from "../config/env.js";

export function getEnv(key) {
  return env[key];
}

export async function cacheGet(key) {
  return getEnv(key);
}

export async function cacheSet(key, value) {
  console.log(`Set ${key} = ${value} (no Redis used)`);
}

export async function cacheDel(key) {
  console.log(`Deleted ${key} (no Redis used)`);
}
