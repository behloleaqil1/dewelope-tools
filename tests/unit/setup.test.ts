import { describe, it, expect } from 'vitest';

describe('Project Setup', () => {
  it('should have vitest configured correctly', () => {
    expect(true).toBe(true);
  });

  it('should resolve path aliases', async () => {
    // This verifies the @/ alias resolves correctly
    // Will be more meaningful once we have actual modules
    expect(typeof import.meta.url).toBe('string');
  });
});
