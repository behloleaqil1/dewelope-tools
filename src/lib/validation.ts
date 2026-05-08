import { ValidationResult } from '@/types';

/**
 * Validates that a string represents a valid number.
 * Accepts integers, decimals, negative numbers, and leading/trailing whitespace (trimmed).
 */
export function validateNumeric(
  value: string,
  fieldName?: string
): ValidationResult {
  const trimmed = value.trim();

  if (trimmed === '') {
    return {
      valid: false,
      error: 'Please enter a valid number',
      fieldName,
    };
  }

  // Check if the trimmed value is a valid numeric representation
  // Accepts: integers, decimals, negative numbers
  // A valid number matches: optional negative sign, digits, optional single decimal point with digits
  const numericPattern = /^-?(\d+\.?\d*|\d*\.?\d+)$/;

  if (!numericPattern.test(trimmed)) {
    return {
      valid: false,
      error: 'Please enter a valid number',
      fieldName,
    };
  }

  // Also verify with parseFloat to catch edge cases
  const parsed = Number(trimmed);
  if (isNaN(parsed)) {
    return {
      valid: false,
      error: 'Please enter a valid number',
      fieldName,
    };
  }

  return { valid: true, fieldName };
}

/**
 * Validates a number is within a specified range [min, max].
 * Error message includes both min and max values.
 */
export function validateRange(
  value: number,
  min: number,
  max: number,
  fieldName?: string
): ValidationResult {
  if (value < min || value > max) {
    return {
      valid: false,
      error: `Value must be between ${min} and ${max}`,
      fieldName,
    };
  }

  return { valid: true, fieldName };
}

/**
 * Validates that a string is not empty or whitespace-only.
 */
export function validateNonEmpty(
  value: string,
  fieldName?: string
): ValidationResult {
  if (value.trim() === '') {
    return {
      valid: false,
      error: 'This field is required',
      fieldName,
    };
  }

  return { valid: true, fieldName };
}

/**
 * Validates that text doesn't exceed a maximum length.
 */
export function validateTextLength(
  value: string,
  maxLength: number,
  fieldName?: string
): ValidationResult {
  if (value.length > maxLength) {
    return {
      valid: false,
      error: `Input exceeds maximum length of ${maxLength.toLocaleString()} characters`,
      fieldName,
    };
  }

  return { valid: true, fieldName };
}

/**
 * Validates that a file size doesn't exceed the maximum allowed size.
 */
export function validateFileSize(
  sizeInBytes: number,
  maxSizeInBytes: number,
  fieldName?: string
): ValidationResult {
  if (sizeInBytes > maxSizeInBytes) {
    const maxSizeMB = maxSizeInBytes / (1024 * 1024);
    return {
      valid: false,
      error: `File must be smaller than ${maxSizeMB} MB`,
      fieldName,
    };
  }

  return { valid: true, fieldName };
}

/**
 * Validates that a file type is in the list of accepted types.
 */
export function validateFileType(
  fileType: string,
  acceptedTypes: string[],
  fieldName?: string
): ValidationResult {
  const normalizedFileType = fileType.toLowerCase();
  const normalizedAccepted = acceptedTypes.map((t) => t.toLowerCase());

  if (!normalizedAccepted.includes(normalizedFileType)) {
    return {
      valid: false,
      error: `Supported formats: ${acceptedTypes.join(', ')}`,
      fieldName,
    };
  }

  return { valid: true, fieldName };
}
