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
    seoDescription: 'Our free online unit converters let you instantly convert between measurement systems used worldwide. Whether you need to convert temperatures from Celsius to Fahrenheit, distances from miles to kilometers, weights from pounds to kilograms, or data sizes from megabytes to gigabytes, these tools handle it all with precision. Each converter supports multiple units, shows conversion formulas, and delivers results in real-time directly in your browser. Perfect for students, engineers, scientists, cooks, and anyone working with international measurements. No sign-up required and no data leaves your device.',
  },
  {
    id: 'text-tools',
    name: 'Text Tools',
    slug: 'text-tools',
    description: 'Transform and analyze text with word counting, case conversion, Lorem Ipsum generation, text reversal, and more.',
    icon: '📝',
    seoDescription: 'Our free online text tools help writers, developers, and content creators manipulate and analyze text efficiently. Count words and characters for social media limits, convert text between uppercase, lowercase, and title case, generate Lorem Ipsum placeholder text for designs, reverse strings, remove duplicate lines, perform find-and-replace operations with regex support, and create URL-friendly slugs. All text processing happens instantly in your browser with no character limits on most tools. Ideal for copywriters, bloggers, SEO professionals, and web developers who work with text daily.',
  },
  {
    id: 'math-calculators',
    name: 'Math and Calculators',
    slug: 'math-calculators',
    description: 'Perform common calculations including percentages, BMI, loans, tips, discounts, age, and number base conversions.',
    icon: '🧮',
    seoDescription: 'Our free online calculators solve everyday math problems instantly. Calculate percentages and percentage changes, determine your BMI with health category indicators, estimate monthly loan and mortgage payments with amortization details, split restaurant bills with tip calculations, find discounted sale prices, compute your exact age in years, months, and days, or convert numbers between binary, octal, decimal, and hexadecimal systems. Each calculator shows the formula used so you can verify results. Built for students, professionals, and anyone who needs quick, accurate calculations without installing software.',
  },
  {
    id: 'developer-tools',
    name: 'Developer Tools',
    slug: 'developer-tools',
    description: 'Format, encode, decode, and validate data with JSON, Base64, URL, HTML, regex, UUID, hash, and color tools.',
    icon: '💻',
    seoDescription: 'Our free online developer tools streamline common coding tasks. Format and validate JSON with syntax highlighting, encode and decode Base64 strings, handle URL percent-encoding, convert HTML entities, test regular expressions with real-time match highlighting, generate UUID v4 identifiers, create MD5 and SHA-256 hashes, and convert color codes between HEX, RGB, and HSL. All tools run entirely in your browser using secure Web Crypto APIs where applicable. Essential utilities for web developers, backend engineers, QA testers, and DevOps professionals working with data encoding and validation daily.',
  },
  {
    id: 'image-color-tools',
    name: 'Image and Color Tools',
    slug: 'image-color-tools',
    description: 'Work with colors and images using a color picker, gradient generator, palette creator, Base64 converter, and aspect ratio calculator.',
    icon: '🎨',
    seoDescription: 'Our free online image and color tools help designers and developers work with visual assets efficiently. Pick colors and get instant HEX, RGB, and HSL values, create beautiful CSS gradients with live preview and custom color stops, generate harmonious color palettes from any base color, convert images to Base64 encoded strings for embedding in code, and calculate simplified aspect ratios for responsive layouts. Perfect for UI designers, front-end developers, graphic artists, and anyone working with colors and images in web projects. All processing happens locally in your browser.',
  },
  {
    id: 'date-time-tools',
    name: 'Date and Time Tools',
    slug: 'date-time-tools',
    description: 'Convert timezones, work with Unix timestamps, calculate date differences, and use countdown timers and stopwatches.',
    icon: '🕐',
    seoDescription: 'Our free online date and time tools simplify working with temporal data. Convert times between world timezones instantly, translate Unix timestamps to human-readable dates and back, calculate the exact difference between two dates in multiple units, set countdown timers with visual alerts, and track elapsed time with a precise millisecond stopwatch. Ideal for developers working with APIs and databases, remote teams coordinating across timezones, project managers tracking deadlines, and anyone who needs accurate time calculations without complex software.',
  },
];

/**
 * Get a category configuration by its slug.
 */
export function getCategoryBySlug(slug: string): CategoryConfig | undefined {
  return categories.find((cat) => cat.slug === slug);
}
