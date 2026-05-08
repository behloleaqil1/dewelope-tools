import { CategoryConfig } from '@/types';

/**
 * Category configurations for the Online Tools Hub.
 * 6 categories organizing all 41 tools.
 */
export const categories: CategoryConfig[] = [
  {
    id: 'unit-converters',
    name: 'Unit Converters',
    slug: 'unit-converters',
    description: 'Convert between different measurement units including temperature, length, weight, speed, volume, area, data storage, and pressure.',
    icon: '⚖️',
  },
  {
    id: 'text-tools',
    name: 'Text Tools',
    slug: 'text-tools',
    description: 'Transform and analyze text with word counting, case conversion, Lorem Ipsum generation, text reversal, and more.',
    icon: '📝',
  },
  {
    id: 'math-calculators',
    name: 'Math and Calculators',
    slug: 'math-calculators',
    description: 'Perform common calculations including percentages, BMI, loans, tips, discounts, age, and number base conversions.',
    icon: '🧮',
  },
  {
    id: 'developer-tools',
    name: 'Developer Tools',
    slug: 'developer-tools',
    description: 'Format, encode, decode, and validate data with JSON, Base64, URL, HTML, regex, UUID, hash, and color tools.',
    icon: '💻',
  },
  {
    id: 'image-color-tools',
    name: 'Image and Color Tools',
    slug: 'image-color-tools',
    description: 'Work with colors and images using a color picker, gradient generator, palette creator, Base64 converter, and aspect ratio calculator.',
    icon: '🎨',
  },
  {
    id: 'date-time-tools',
    name: 'Date and Time Tools',
    slug: 'date-time-tools',
    description: 'Convert timezones, work with Unix timestamps, calculate date differences, and use countdown timers and stopwatches.',
    icon: '🕐',
  },
];

/**
 * Get a category configuration by its slug.
 */
export function getCategoryBySlug(slug: string): CategoryConfig | undefined {
  return categories.find((cat) => cat.slug === slug);
}
