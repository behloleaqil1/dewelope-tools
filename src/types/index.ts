// Core TypeScript interfaces and types for the Online Tools Hub

/**
 * Category identifier type - all valid category slugs
 */
export type CategoryId =
  | 'unit-converters'
  | 'text-tools'
  | 'math-calculators'
  | 'developer-tools'
  | 'image-color-tools'
  | 'date-time-tools';

/**
 * Tool Configuration Interface
 */
export interface ToolConfig {
  id: string;                    // Unique identifier
  name: string;                  // Display name
  description: string;           // Full description
  shortDescription: string;      // Max 120 chars for category listing
  category: CategoryId;          // Parent category
  slug: string;                  // URL-safe slug, derived from name
  metaTitle: string;             // 30-60 chars, unique
  metaDescription: string;       // 70-160 chars, unique
  keywords: string[];            // SEO keywords
  featured: boolean;             // Show on homepage
  componentPath: string;         // Dynamic import path
  inputConfig: ToolInputConfig;  // Input configuration
  outputConfig: ToolOutputConfig; // Output configuration
  howToUse?: string;             // 200-300 word SEO guide on how to use the tool
  howToSteps?: string[];         // Step-by-step instructions for HowTo schema
}

/**
 * Category Configuration
 */
export interface CategoryConfig {
  id: CategoryId;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color?: string;                // Category accent color (hex)
  seoDescription?: string;       // 100-150 word keyword-rich intro for category page
}

/**
 * Tool Engine Base Props
 */
export interface ToolEngineProps {
  toolId: string;
  toolName: string;
}

/**
 * Validation Result
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
  fieldName?: string;
}

/**
 * Tool Output
 */
export interface ToolOutput {
  value: string | number | Record<string, unknown>;
  formatted?: string;       // For display (e.g., syntax-highlighted)
  copyValue?: string;       // Plain text for clipboard
  formula?: string;         // Calculation formula (for math tools)
}

/**
 * Tool Input Configuration
 */
export interface ToolInputConfig {
  type: 'text' | 'number' | 'select' | 'file' | 'date' | 'composite';
  maxLength?: number;             // Character limit (e.g., 100000 for text tools)
  maxFileSize?: number;           // Bytes (e.g., 5MB for image tools)
  acceptedFormats?: string[];     // File types
  validRange?: { min: number; max: number };
  fields?: ToolInputField[];      // For composite inputs
}

/**
 * Tool Output Configuration
 */
export interface ToolOutputConfig {
  type: 'text' | 'number' | 'formatted' | 'multi-value' | 'visual';
  copyable: boolean;
  syntaxHighlight?: boolean;
  showFormula?: boolean;
}

/**
 * Tool Input Field - for composite inputs
 */
export interface ToolInputField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'date' | 'time';
  required: boolean;
  placeholder?: string;
  options?: SelectOption[];       // For select fields
  validation?: ValidationRule;
  ariaLabel: string;
}

/**
 * Select Option - for dropdown fields
 */
export interface SelectOption {
  value: string;
  label: string;
}

/**
 * Validation Rule
 */
export interface ValidationRule {
  type: 'numeric' | 'non-empty' | 'range' | 'pattern' | 'file-size' | 'file-type';
  params?: Record<string, unknown>;
  errorMessage: string;
}
