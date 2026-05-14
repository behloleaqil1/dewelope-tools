import type { ToolConfig } from '@/types';

/**
 * Represents a validation error found in a tool registry entry.
 */
export interface ValidationError {
  /** The ID of the tool that has the validation error */
  toolId: string;
  /** The field name that failed validation */
  field: string;
  /** A human-readable description of the validation failure */
  message: string;
}

/**
 * Validate the entire tool registry for uniqueness and schema compliance.
 * Checks for duplicate IDs/slugs, id===slug identity, slug URL-safety,
 * category validity, field length constraints, metaTitle/metaDescription
 * uniqueness, and componentPath correctness.
 *
 * Used in tests and can be run as a pre-build check.
 *
 * @param tools - The array of tool configurations to validate
 * @returns An array of validation errors (empty if all tools are valid)
 */
export function validateRegistry(tools: ToolConfig[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();
  const seenMetaTitles = new Set<string>();
  const seenMetaDescriptions = new Set<string>();
  const validCategories = new Set([
    'unit-converters', 'text-tools', 'math-calculators',
    'developer-tools', 'image-color-tools', 'date-time-tools'
  ]);
  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  for (const tool of tools) {
    // ID uniqueness
    if (seenIds.has(tool.id)) {
      errors.push({ toolId: tool.id, field: 'id', message: 'Duplicate id' });
    }
    seenIds.add(tool.id);

    // Slug uniqueness and format
    if (seenSlugs.has(tool.slug)) {
      errors.push({ toolId: tool.id, field: 'slug', message: 'Duplicate slug' });
    }
    if (!slugPattern.test(tool.slug)) {
      errors.push({ toolId: tool.id, field: 'slug', message: 'Slug is not URL-safe' });
    }
    seenSlugs.add(tool.slug);

    // ID === slug identity
    if (tool.id !== tool.slug) {
      errors.push({ toolId: tool.id, field: 'slug', message: 'id and slug must be identical' });
    }

    // Category validity
    if (!validCategories.has(tool.category)) {
      errors.push({ toolId: tool.id, field: 'category', message: `Invalid category: ${tool.category}` });
    }

    // Field length constraints
    if (tool.shortDescription.length > 120) {
      errors.push({ toolId: tool.id, field: 'shortDescription', message: 'Exceeds 120 characters' });
    }
    if (tool.metaTitle.length < 30 || tool.metaTitle.length > 60) {
      errors.push({ toolId: tool.id, field: 'metaTitle', message: 'Must be 30-60 characters' });
    }
    if (tool.metaDescription.length < 70 || tool.metaDescription.length > 160) {
      errors.push({ toolId: tool.id, field: 'metaDescription', message: 'Must be 70-160 characters' });
    }

    // MetaTitle uniqueness
    if (seenMetaTitles.has(tool.metaTitle)) {
      errors.push({ toolId: tool.id, field: 'metaTitle', message: 'Duplicate metaTitle' });
    }
    seenMetaTitles.add(tool.metaTitle);

    // MetaDescription uniqueness
    if (seenMetaDescriptions.has(tool.metaDescription)) {
      errors.push({ toolId: tool.id, field: 'metaDescription', message: 'Duplicate metaDescription' });
    }
    seenMetaDescriptions.add(tool.metaDescription);

    // ComponentPath must contain category slug
    if (!tool.componentPath.includes(tool.category)) {
      errors.push({ toolId: tool.id, field: 'componentPath', message: 'componentPath must contain category slug' });
    }
  }

  return errors;
}
