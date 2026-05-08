/**
 * URL Slug Generation Utility
 *
 * Generates URL-safe slugs from tool names and validates uniqueness
 * across the tool registry.
 */

/**
 * Generate a URL-safe slug from a given input string.
 *
 * Rules:
 * 1. Convert to lowercase
 * 2. Replace spaces and special characters with hyphens
 * 3. Remove characters that aren't lowercase letters, numbers, or hyphens
 * 4. Collapse multiple consecutive hyphens into one
 * 5. Trim leading/trailing hyphens
 * 6. Return a non-empty string (falls back to 'untitled' if result is empty)
 */
export function generateSlug(input: string): string {
  let slug = input
    // Convert to lowercase
    .toLowerCase()
    // Replace spaces and special characters with hyphens
    .replace(/[\s_+.,:;!?@#$%^&*()[\]{}<>|/\\~`'"=]/g, '-')
    // Remove any characters that aren't lowercase letters, numbers, or hyphens
    .replace(/[^a-z0-9-]/g, '')
    // Collapse multiple consecutive hyphens into one
    .replace(/-{2,}/g, '-')
    // Trim leading/trailing hyphens
    .replace(/^-+|-+$/g, '');

  // Ensure non-empty result
  if (slug.length === 0) {
    slug = 'untitled';
  }

  return slug;
}

/**
 * Validate that all slugs in a collection are unique.
 *
 * @param slugs - Array of slug strings to check
 * @returns true if all slugs are unique, false if any duplicates exist
 */
export function validateSlugsUnique(slugs: string[]): boolean {
  const seen = new Set<string>();
  for (const slug of slugs) {
    if (seen.has(slug)) {
      return false;
    }
    seen.add(slug);
  }
  return true;
}
