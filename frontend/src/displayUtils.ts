/**
 * Utility functions for displaying cricket data in the frontend
 */

export function formatNRR(nrr: number): string {
  return nrr.toFixed(3);
}

export function formatOvers(oversStr: string): string {
  // Already in correct format from backend
  return oversStr;
}

export function formatRunRate(runs: number, balls: number): string {
  if (balls === 0) return '0.00';
  const overs = balls / 6;
  const rate = runs / overs;
  return rate.toFixed(2);
}
