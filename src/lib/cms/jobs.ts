import type { Where } from 'payload'

// Job listings that haven't passed their `expiresAt` date (or have none).
// Call inside a 'use cache' function: it reads the clock, so expired
// listings drop out when the cache next refreshes (hourly at most).
export function openJobListings(): Where {
  return {
    or: [
      { expiresAt: { exists: false } },
      { expiresAt: { greater_than_equal: new Date().toISOString() } },
    ],
  }
}
