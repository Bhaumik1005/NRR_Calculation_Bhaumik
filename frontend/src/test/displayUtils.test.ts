import { describe, it, expect } from 'vitest';
import { formatNRR, formatOvers, formatRunRate } from '../displayUtils';

describe('Display Utils', () => {
  it('formatNRR formats to 3 decimals', () => {
    expect(formatNRR(1.2345)).toBe('1.234'); // JavaScript rounds down here
    expect(formatNRR(1.2346)).toBe('1.235'); // This would round up
    expect(formatNRR(0.1)).toBe('0.100');
    expect(formatNRR(-1.75)).toBe('-1.750');
  });

  it('formatOvers returns input unchanged', () => {
    expect(formatOvers('20.3')).toBe('20.3');
    expect(formatOvers('133.1')).toBe('133.1');
  });

  it('formatRunRate calculates correctly', () => {
    expect(formatRunRate(120, 120)).toBe('6.00'); // 120 runs in 20 overs = 6.00 RPO
    expect(formatRunRate(150, 120)).toBe('7.50'); // 150 runs in 20 overs = 7.50 RPO
    expect(formatRunRate(0, 0)).toBe('0.00'); // Edge case
  });
});
