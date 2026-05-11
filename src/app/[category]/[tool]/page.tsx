import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { categories } from '@/data/categories';
import { getAllTools, getToolBySlug } from '@/data/tools-registry';
import { generateToolStructuredData } from '@/lib/seo/structured-data';
import { generateHowToSchema } from '@/lib/seo/howto-schema';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import ToolPageShell from '@/components/tools/ToolPageShell';
import RelatedTools from '@/components/seo/RelatedTools';
import ToolSeoContent from '@/components/seo/ToolSeoContent';
import CrossCategoryTools from '@/components/seo/CrossCategoryTools';
import AdUnit from '@/components/ads/AdUnit';
import { CategoryId } from '@/types';

interface ToolPageProps {
  params: { category: string; tool: string };
}

function ToolLoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-10 bg-gray-200 rounded w-full" />
      <div className="h-32 bg-gray-200 rounded w-full" />
      <div className="h-10 bg-gray-200 rounded w-1/3" />
      <div className="h-32 bg-gray-200 rounded w-full" />
    </div>
  );
}

/**
 * AUTO-GENERATED component map.
 * When you add a new tool, just add its componentPath in tools-registry.ts
 * and create the component file. This map handles the rest.
 *
 * Format in registry: componentPath: '@/components/tools/{category}/{ComponentName}'
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TOOL_COMPONENTS: Record<string, React.ComponentType<any>> = {
  // Unit Converters
  'temperature-converter': dynamic(() => import('@/components/tools/unit-converters/TemperatureConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'length-converter': dynamic(() => import('@/components/tools/unit-converters/LengthConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'weight-mass-converter': dynamic(() => import('@/components/tools/unit-converters/WeightMassConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'speed-converter': dynamic(() => import('@/components/tools/unit-converters/SpeedConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'volume-converter': dynamic(() => import('@/components/tools/unit-converters/VolumeConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'area-converter': dynamic(() => import('@/components/tools/unit-converters/AreaConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'data-storage-converter': dynamic(() => import('@/components/tools/unit-converters/DataStorageConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'pressure-converter': dynamic(() => import('@/components/tools/unit-converters/PressureConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Text Tools
  'word-counter': dynamic(() => import('@/components/tools/text-tools/WordCounter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'character-counter': dynamic(() => import('@/components/tools/text-tools/CharacterCounter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'case-converter': dynamic(() => import('@/components/tools/text-tools/CaseConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'lorem-ipsum-generator': dynamic(() => import('@/components/tools/text-tools/LoremIpsumGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-reverser': dynamic(() => import('@/components/tools/text-tools/TextReverser'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'remove-duplicate-lines': dynamic(() => import('@/components/tools/text-tools/RemoveDuplicateLines'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'find-and-replace': dynamic(() => import('@/components/tools/text-tools/FindAndReplace'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'slug-generator': dynamic(() => import('@/components/tools/text-tools/SlugGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Math Calculators
  'percentage-calculator': dynamic(() => import('@/components/tools/math-calculators/PercentageCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'bmi-calculator': dynamic(() => import('@/components/tools/math-calculators/BmiCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'loan-mortgage-calculator': dynamic(() => import('@/components/tools/math-calculators/LoanMortgageCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'tip-calculator': dynamic(() => import('@/components/tools/math-calculators/TipCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'discount-calculator': dynamic(() => import('@/components/tools/math-calculators/DiscountCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'age-calculator': dynamic(() => import('@/components/tools/math-calculators/AgeCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'number-base-converter': dynamic(() => import('@/components/tools/math-calculators/NumberBaseConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Developer Tools
  'json-formatter': dynamic(() => import('@/components/tools/developer-tools/JsonFormatter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'base64-encoder-decoder': dynamic(() => import('@/components/tools/developer-tools/Base64EncoderDecoder'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'url-encoder-decoder': dynamic(() => import('@/components/tools/developer-tools/UrlEncoderDecoder'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'html-entity-encoder-decoder': dynamic(() => import('@/components/tools/developer-tools/HtmlEntityEncoderDecoder'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'regex-tester': dynamic(() => import('@/components/tools/developer-tools/RegexTester'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'uuid-generator': dynamic(() => import('@/components/tools/developer-tools/UuidGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'hash-generator': dynamic(() => import('@/components/tools/developer-tools/HashGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'color-code-converter': dynamic(() => import('@/components/tools/developer-tools/ColorCodeConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Image and Color Tools
  'color-picker': dynamic(() => import('@/components/tools/image-color-tools/ColorPicker'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'gradient-generator': dynamic(() => import('@/components/tools/image-color-tools/GradientGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'palette-generator': dynamic(() => import('@/components/tools/image-color-tools/PaletteGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'image-to-base64': dynamic(() => import('@/components/tools/image-color-tools/ImageToBase64'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'aspect-ratio-calculator': dynamic(() => import('@/components/tools/image-color-tools/AspectRatioCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Date and Time Tools
  'timezone-converter': dynamic(() => import('@/components/tools/date-time-tools/TimezoneConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'unix-timestamp-converter': dynamic(() => import('@/components/tools/date-time-tools/UnixTimestampConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'date-difference-calculator': dynamic(() => import('@/components/tools/date-time-tools/DateDifferenceCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'countdown-timer': dynamic(() => import('@/components/tools/date-time-tools/CountdownTimer'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'stopwatch': dynamic(() => import('@/components/tools/date-time-tools/Stopwatch'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'relative-time-calculator': dynamic(() => import('@/components/tools/date-time-tools/RelativeTimeCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'week-number-calculator': dynamic(() => import('@/components/tools/date-time-tools/WeekNumberCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'time-duration-calculator': dynamic(() => import('@/components/tools/date-time-tools/TimeDurationCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'days-until-calculator': dynamic(() => import('@/components/tools/date-time-tools/DaysUntilCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // New Developer Tools
  'password-generator': dynamic(() => import('@/components/tools/developer-tools/PasswordGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'markdown-to-html': dynamic(() => import('@/components/tools/developer-tools/MarkdownToHtml'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'jwt-decoder': dynamic(() => import('@/components/tools/developer-tools/JwtDecoder'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'css-minifier': dynamic(() => import('@/components/tools/developer-tools/CssMinifier'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'html-minifier': dynamic(() => import('@/components/tools/developer-tools/HtmlMinifier'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'javascript-minifier': dynamic(() => import('@/components/tools/developer-tools/JsMinifier'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'cron-expression-generator': dynamic(() => import('@/components/tools/developer-tools/CronGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // New Text Tools
  'password-strength-checker': dynamic(() => import('@/components/tools/text-tools/PasswordStrengthChecker'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-to-binary': dynamic(() => import('@/components/tools/text-tools/TextToBinary'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'random-number-generator': dynamic(() => import('@/components/tools/text-tools/RandomNumberGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'emoji-picker': dynamic(() => import('@/components/tools/text-tools/EmojiPicker'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // New Math Tools
  'pixel-to-rem-converter': dynamic(() => import('@/components/tools/math-calculators/PixelToRemConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'hex-to-decimal-converter': dynamic(() => import('@/components/tools/math-calculators/HexToDecimalConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // New Image Tools
  'rgb-to-hex-converter': dynamic(() => import('@/components/tools/image-color-tools/RgbToHexConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'image-info': dynamic(() => import('@/components/tools/image-color-tools/ImageInfo'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'color-shade-generator': dynamic(() => import('@/components/tools/image-color-tools/ColorShadeGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // New Developer Tools (batch 3)
  'csv-to-json': dynamic(() => import('@/components/tools/developer-tools/CsvToJson'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'screen-resolution': dynamic(() => import('@/components/tools/developer-tools/ScreenResolution'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // New Text Tools (batch 3)
  'text-diff-checker': dynamic(() => import('@/components/tools/text-tools/TextDiffChecker'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'lorem-ipsum-words': dynamic(() => import('@/components/tools/text-tools/LoremIpsumWords'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'typing-speed-test': dynamic(() => import('@/components/tools/text-tools/TypingSpeedTest'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // New Math Tools (batch 3)
  'compound-interest-calculator': dynamic(() => import('@/components/tools/math-calculators/CompoundInterestCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'electricity-cost-calculator': dynamic(() => import('@/components/tools/math-calculators/ElectricityCostCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'fuel-cost-calculator': dynamic(() => import('@/components/tools/math-calculators/FuelCostCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'invoice-generator': dynamic(() => import('@/components/tools/math-calculators/InvoiceGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'salary-calculator': dynamic(() => import('@/components/tools/math-calculators/SalaryCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'unit-price-calculator': dynamic(() => import('@/components/tools/math-calculators/UnitPriceCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'mortgage-affordability-calculator': dynamic(() => import('@/components/tools/math-calculators/MortgageAffordabilityCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // New Developer Tools (batch 4)
  'meta-tag-generator': dynamic(() => import('@/components/tools/developer-tools/MetaTagGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'open-graph-generator': dynamic(() => import('@/components/tools/developer-tools/OpenGraphGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'json-to-yaml': dynamic(() => import('@/components/tools/developer-tools/JsonToYaml'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'tailwind-color-converter': dynamic(() => import('@/components/tools/developer-tools/TailwindColorConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // New Text Tools (batch 4)
  'text-repeater': dynamic(() => import('@/components/tools/text-tools/TextRepeater'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'line-counter': dynamic(() => import('@/components/tools/text-tools/LineCounter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'reading-time-calculator': dynamic(() => import('@/components/tools/text-tools/ReadingTimeCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'twitter-char-counter': dynamic(() => import('@/components/tools/text-tools/TwitterCharCounter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'hashtag-generator': dynamic(() => import('@/components/tools/text-tools/HashtagGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'lorem-ipsum-sentences': dynamic(() => import('@/components/tools/text-tools/LoremIpsumSentences'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Batch 5 Developer Tools
  'rot13-encoder': dynamic(() => import('@/components/tools/developer-tools/Rot13Encoder'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'subnet-calculator': dynamic(() => import('@/components/tools/developer-tools/SubnetCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Batch 5 Math Tools
  'roi-calculator': dynamic(() => import('@/components/tools/math-calculators/RoiCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'break-even-calculator': dynamic(() => import('@/components/tools/math-calculators/BreakEvenCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'savings-goal-calculator': dynamic(() => import('@/components/tools/math-calculators/SavingsGoalCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Batch 5 Image Tools
  'color-contrast-checker': dynamic(() => import('@/components/tools/image-color-tools/ColorContrastChecker'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Batch 5 Date Tools
  'pomodoro-timer': dynamic(() => import('@/components/tools/date-time-tools/PomodoroTimer'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // JSON to CSV
  'json-to-csv': dynamic(() => import('@/components/tools/developer-tools/JsonToCsv'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Batch 6
  'yaml-to-json': dynamic(() => import('@/components/tools/developer-tools/YamlToJson'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'sql-formatter': dynamic(() => import('@/components/tools/developer-tools/SqlFormatter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'chmod-calculator': dynamic(() => import('@/components/tools/developer-tools/ChmodCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-to-morse-code': dynamic(() => import('@/components/tools/text-tools/TextToMorseCode'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'word-frequency-counter': dynamic(() => import('@/components/tools/text-tools/WordFrequencyCounter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'gpa-calculator': dynamic(() => import('@/components/tools/math-calculators/GpaCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'scientific-notation-converter': dynamic(() => import('@/components/tools/math-calculators/ScientificNotationConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'color-blindness-simulator': dynamic(() => import('@/components/tools/image-color-tools/ColorBlindnessSimulator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'energy-converter': dynamic(() => import('@/components/tools/unit-converters/EnergyConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'time-unit-converter': dynamic(() => import('@/components/tools/unit-converters/TimeUnitConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Batch 7
  'binary-to-decimal': dynamic(() => import('@/components/tools/developer-tools/BinaryToDecimal'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'http-status-codes': dynamic(() => import('@/components/tools/developer-tools/HttpStatusCodes'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-to-nato-alphabet': dynamic(() => import('@/components/tools/text-tools/TextToNatoAlphabet'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'markup-stripper': dynamic(() => import('@/components/tools/text-tools/MarkupStripper'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'pythagorean-calculator': dynamic(() => import('@/components/tools/math-calculators/PythagoreanCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'fraction-calculator': dynamic(() => import('@/components/tools/math-calculators/FractionCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'hex-to-rgb-converter': dynamic(() => import('@/components/tools/image-color-tools/HexToRgbConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'angle-converter': dynamic(() => import('@/components/tools/unit-converters/AngleConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'frequency-converter': dynamic(() => import('@/components/tools/unit-converters/FrequencyConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Batch 8
  'json-path-finder': dynamic(() => import('@/components/tools/developer-tools/JsonPathFinder'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'ip-address-lookup': dynamic(() => import('@/components/tools/developer-tools/IpAddressLookup'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'lorem-ipsum-lists': dynamic(() => import('@/components/tools/text-tools/LoremIpsumLists'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-sorter': dynamic(() => import('@/components/tools/text-tools/TextSorter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'percentage-change-calculator': dynamic(() => import('@/components/tools/math-calculators/PercentageChangeCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'quadratic-equation-solver': dynamic(() => import('@/components/tools/math-calculators/QuadraticEquationSolver'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'random-color-generator': dynamic(() => import('@/components/tools/image-color-tools/RandomColorGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'force-converter': dynamic(() => import('@/components/tools/unit-converters/ForceConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'power-converter': dynamic(() => import('@/components/tools/unit-converters/PowerConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Batch 9
  'xml-formatter': dynamic(() => import('@/components/tools/developer-tools/XmlFormatter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'whitespace-remover': dynamic(() => import('@/components/tools/text-tools/WhitespaceRemover'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'average-calculator': dynamic(() => import('@/components/tools/math-calculators/AverageCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'ratio-calculator': dynamic(() => import('@/components/tools/math-calculators/RatioCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'image-placeholder-generator': dynamic(() => import('@/components/tools/image-color-tools/ImagePlaceholderGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'density-converter': dynamic(() => import('@/components/tools/unit-converters/DensityConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'torque-converter': dynamic(() => import('@/components/tools/unit-converters/TorqueConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'work-hours-calculator': dynamic(() => import('@/components/tools/date-time-tools/WorkHoursCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-columnizer': dynamic(() => import('@/components/tools/text-tools/TextColumnizer'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'css-gradient-code-generator': dynamic(() => import('@/components/tools/developer-tools/CssGradientGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Batch 10
  'json-validator': dynamic(() => import('@/components/tools/developer-tools/JsonValidator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'css-unit-converter': dynamic(() => import('@/components/tools/developer-tools/CssUnitConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-truncator': dynamic(() => import('@/components/tools/text-tools/TextTruncator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'vowel-counter': dynamic(() => import('@/components/tools/text-tools/VowelCounter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'tax-calculator': dynamic(() => import('@/components/tools/math-calculators/TaxCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'margin-calculator': dynamic(() => import('@/components/tools/math-calculators/MarginCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'color-mixer': dynamic(() => import('@/components/tools/image-color-tools/ColorMixer'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'cooking-converter': dynamic(() => import('@/components/tools/unit-converters/CookingConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'age-in-days-calculator': dynamic(() => import('@/components/tools/date-time-tools/AgeInDaysCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Batch 11
  'number-to-words': dynamic(() => import('@/components/tools/math-calculators/NumberToWords'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'roman-numeral-converter': dynamic(() => import('@/components/tools/math-calculators/RomanNumeralConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'binary-calculator': dynamic(() => import('@/components/tools/developer-tools/BinaryCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'json-to-typescript': dynamic(() => import('@/components/tools/developer-tools/JsonToTypescript'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-to-slug-advanced': dynamic(() => import('@/components/tools/text-tools/TextToSlugAdvanced'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'date-formatter': dynamic(() => import('@/components/tools/date-time-tools/DateFormatter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'color-name-finder': dynamic(() => import('@/components/tools/image-color-tools/ColorNameFinder'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'speed-distance-time-calculator': dynamic(() => import('@/components/tools/math-calculators/SpeedDistanceTimeCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'number-sequence-generator': dynamic(() => import('@/components/tools/math-calculators/NumberSequenceGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-to-html-entities': dynamic(() => import('@/components/tools/developer-tools/TextToHtmlEntities'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Batch 12
  'string-length-calculator': dynamic(() => import('@/components/tools/text-tools/StringLengthCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-to-ascii-art': dynamic(() => import('@/components/tools/text-tools/TextToAsciiArt'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'ip-to-binary': dynamic(() => import('@/components/tools/developer-tools/IpToBinary'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'regex-escape': dynamic(() => import('@/components/tools/developer-tools/RegexEscape'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'loan-payoff-calculator': dynamic(() => import('@/components/tools/math-calculators/LoanPayoffCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'inflation-calculator': dynamic(() => import('@/components/tools/math-calculators/InflationCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'hsl-to-hex-converter': dynamic(() => import('@/components/tools/image-color-tools/HslToHexConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'fuel-efficiency-converter': dynamic(() => import('@/components/tools/unit-converters/FuelEfficiencyConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'shoe-size-converter': dynamic(() => import('@/components/tools/unit-converters/ShoeSizeConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'business-days-calculator': dynamic(() => import('@/components/tools/date-time-tools/BusinessDaysCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Batch 13
  'palindrome-checker': dynamic(() => import('@/components/tools/text-tools/PalindromeChecker'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-to-pig-latin': dynamic(() => import('@/components/tools/text-tools/TextToPigLatin'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'docker-run-generator': dynamic(() => import('@/components/tools/developer-tools/DockerRunGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'htaccess-redirect-generator': dynamic(() => import('@/components/tools/developer-tools/HtaccessRedirectGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'monthly-budget-calculator': dynamic(() => import('@/components/tools/math-calculators/MonthlyBudgetCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'tip-split-calculator': dynamic(() => import('@/components/tools/math-calculators/TipSplitCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'color-temperature-picker': dynamic(() => import('@/components/tools/image-color-tools/ColorTemperaturePicker'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'clothing-size-converter': dynamic(() => import('@/components/tools/unit-converters/ClothingSizeConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'timezone-meeting-planner': dynamic(() => import('@/components/tools/date-time-tools/TimezoneMeetingPlanner'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'leap-year-checker': dynamic(() => import('@/components/tools/date-time-tools/LeapYearChecker'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Batch 14
  'caesar-cipher': dynamic(() => import('@/components/tools/developer-tools/CaesarCipher'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'html-table-generator': dynamic(() => import('@/components/tools/developer-tools/HtmlTableGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'sentence-case-converter': dynamic(() => import('@/components/tools/text-tools/SentenceCaseConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-to-number-list': dynamic(() => import('@/components/tools/text-tools/TextToNumberList'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'prime-number-checker': dynamic(() => import('@/components/tools/math-calculators/PrimeNumberChecker'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'fibonacci-calculator': dynamic(() => import('@/components/tools/math-calculators/FibonacciCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'svg-to-css-background': dynamic(() => import('@/components/tools/image-color-tools/SvgToCssBackground'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'blood-type-compatibility': dynamic(() => import('@/components/tools/math-calculators/BloodTypeCompatibility'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'electric-vehicle-range': dynamic(() => import('@/components/tools/math-calculators/ElectricVehicleRange'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'world-clock': dynamic(() => import('@/components/tools/date-time-tools/WorldClock'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Batch 15
  'vigenere-cipher': dynamic(() => import('@/components/tools/developer-tools/VigenereCipher'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'css-box-shadow-generator': dynamic(() => import('@/components/tools/developer-tools/CssBoxShadowGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'acronym-generator': dynamic(() => import('@/components/tools/text-tools/AcronymGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-statistics': dynamic(() => import('@/components/tools/text-tools/TextStatistics'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'factorial-calculator': dynamic(() => import('@/components/tools/math-calculators/FactorialCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'permutation-combination-calculator': dynamic(() => import('@/components/tools/math-calculators/PermutationCombinationCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'cmyk-to-rgb-converter': dynamic(() => import('@/components/tools/image-color-tools/CmykToRgbConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'luminance-calculator': dynamic(() => import('@/components/tools/image-color-tools/LuminanceCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'flow-rate-converter': dynamic(() => import('@/components/tools/unit-converters/FlowRateConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'epoch-converter': dynamic(() => import('@/components/tools/date-time-tools/EpochConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Batch 16
  'atbash-cipher': dynamic(() => import('@/components/tools/developer-tools/AtbashCipher'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'css-border-radius-generator': dynamic(() => import('@/components/tools/developer-tools/CssBorderRadiusGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'word-scrambler': dynamic(() => import('@/components/tools/text-tools/WordScrambler'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-to-title-case': dynamic(() => import('@/components/tools/text-tools/TextToTitleCase'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'lcm-gcd-calculator': dynamic(() => import('@/components/tools/math-calculators/LcmGcdCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'matrix-calculator': dynamic(() => import('@/components/tools/math-calculators/MatrixCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'pantone-to-hex': dynamic(() => import('@/components/tools/image-color-tools/PantoneToHex'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'data-transfer-rate-converter': dynamic(() => import('@/components/tools/unit-converters/DataTransferRateConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'illuminance-converter': dynamic(() => import('@/components/tools/unit-converters/IlluminanceConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'sunrise-sunset-calculator': dynamic(() => import('@/components/tools/date-time-tools/SunriseSunsetCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Batch 17
  'base32-encoder-decoder': dynamic(() => import('@/components/tools/developer-tools/Base32EncoderDecoder'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'css-text-shadow-generator': dynamic(() => import('@/components/tools/developer-tools/CssTextShadowGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-to-braille': dynamic(() => import('@/components/tools/text-tools/TextToBraille'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-indent-converter': dynamic(() => import('@/components/tools/text-tools/TextIndentConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'standard-deviation-calculator': dynamic(() => import('@/components/tools/math-calculators/StandardDeviationCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'triangle-area-calculator': dynamic(() => import('@/components/tools/math-calculators/TriangleAreaCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'color-wheel-generator': dynamic(() => import('@/components/tools/image-color-tools/ColorWheelGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'fuel-consumption-tracker': dynamic(() => import('@/components/tools/math-calculators/FuelConsumptionTracker'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'luminosity-converter': dynamic(() => import('@/components/tools/unit-converters/LuminosityConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'meeting-duration-calculator': dynamic(() => import('@/components/tools/date-time-tools/MeetingDurationCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Batch 18
  'hex-dump-viewer': dynamic(() => import('@/components/tools/developer-tools/HexDumpViewer'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'nginx-config-generator': dynamic(() => import('@/components/tools/developer-tools/NginxConfigGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-to-leetspeak': dynamic(() => import('@/components/tools/text-tools/TextToLeetspeak'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'line-number-adder': dynamic(() => import('@/components/tools/text-tools/LineNumberAdder'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'circle-calculator': dynamic(() => import('@/components/tools/math-calculators/CircleCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'cylinder-volume-calculator': dynamic(() => import('@/components/tools/math-calculators/CylinderVolumeCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'gradient-palette-generator': dynamic(() => import('@/components/tools/image-color-tools/GradientPaletteGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'bandwidth-calculator': dynamic(() => import('@/components/tools/math-calculators/BandwidthCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'acceleration-converter': dynamic(() => import('@/components/tools/unit-converters/AccelerationConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'pregnancy-due-date-calculator': dynamic(() => import('@/components/tools/date-time-tools/PregnancyDueDateCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Batch 19
  'url-parser': dynamic(() => import('@/components/tools/developer-tools/UrlParser'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'git-command-generator': dynamic(() => import('@/components/tools/developer-tools/GitCommandGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-to-upside-down': dynamic(() => import('@/components/tools/text-tools/TextToUpsideDown'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-wrap-formatter': dynamic(() => import('@/components/tools/text-tools/TextWrapFormatter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'sphere-calculator': dynamic(() => import('@/components/tools/math-calculators/SphereCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'cone-calculator': dynamic(() => import('@/components/tools/math-calculators/ConeCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'color-harmonizer': dynamic(() => import('@/components/tools/image-color-tools/ColorHarmonizer'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'paper-size-reference': dynamic(() => import('@/components/tools/unit-converters/PaperSizeReference'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'timezone-abbreviation-lookup': dynamic(() => import('@/components/tools/date-time-tools/TimezoneAbbreviationLookup'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'sleep-cycle-calculator': dynamic(() => import('@/components/tools/date-time-tools/SleepCycleCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Batch 20
  'toml-to-json': dynamic(() => import('@/components/tools/developer-tools/TomlToJson'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'css-filter-generator': dynamic(() => import('@/components/tools/developer-tools/CssFilterGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-to-zalgo': dynamic(() => import('@/components/tools/text-tools/TextToZalgo'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'duplicate-word-finder': dynamic(() => import('@/components/tools/text-tools/DuplicateWordFinder'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'area-of-polygon-calculator': dynamic(() => import('@/components/tools/math-calculators/AreaOfPolygonCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'exponent-calculator': dynamic(() => import('@/components/tools/math-calculators/ExponentCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'color-opacity-converter': dynamic(() => import('@/components/tools/image-color-tools/ColorOpacityConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'typography-scale-generator': dynamic(() => import('@/components/tools/image-color-tools/TypographyScaleGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'radioactivity-converter': dynamic(() => import('@/components/tools/unit-converters/RadioactivityConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'date-to-day-of-week': dynamic(() => import('@/components/tools/date-time-tools/DateToDayOfWeek'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Batch 21
  'punycode-converter': dynamic(() => import('@/components/tools/developer-tools/PunycodeConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'css-clip-path-generator': dynamic(() => import('@/components/tools/developer-tools/CssClipPathGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-to-small-caps': dynamic(() => import('@/components/tools/text-tools/TextToSmallCaps'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'blank-line-remover': dynamic(() => import('@/components/tools/text-tools/BlankLineRemover'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'trapezoid-area-calculator': dynamic(() => import('@/components/tools/math-calculators/TrapezoidAreaCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'logarithm-calculator': dynamic(() => import('@/components/tools/math-calculators/LogarithmCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'color-gradient-css-stops': dynamic(() => import('@/components/tools/image-color-tools/ColorGradientCssStops'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'font-size-converter': dynamic(() => import('@/components/tools/unit-converters/FontSizeConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'julian-date-converter': dynamic(() => import('@/components/tools/date-time-tools/JulianDateConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'time-zone-offset-calculator': dynamic(() => import('@/components/tools/date-time-tools/TimeZoneOffsetCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Batch 22
  'escape-unescape-json': dynamic(() => import('@/components/tools/developer-tools/EscapeUnescapeJson'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'sitemap-generator': dynamic(() => import('@/components/tools/developer-tools/SitemapGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'css-animation-generator': dynamic(() => import('@/components/tools/developer-tools/CssAnimationGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-to-superscript': dynamic(() => import('@/components/tools/text-tools/TextToSuperscript'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-to-subscript': dynamic(() => import('@/components/tools/text-tools/TextToSubscript'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'parallelogram-calculator': dynamic(() => import('@/components/tools/math-calculators/ParallelogramCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'percentage-of-percentage': dynamic(() => import('@/components/tools/math-calculators/PercentageOfPercentage'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'color-palette-from-image-url': dynamic(() => import('@/components/tools/image-color-tools/ColorPaletteFromImageUrl'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'magnetic-field-converter': dynamic(() => import('@/components/tools/unit-converters/MagneticFieldConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'sound-level-converter': dynamic(() => import('@/components/tools/unit-converters/SoundLevelConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'retirement-age-calculator': dynamic(() => import('@/components/tools/date-time-tools/RetirementAgeCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Batch 23
  'json-minifier': dynamic(() => import('@/components/tools/developer-tools/JsonMinifier'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'robots-txt-generator': dynamic(() => import('@/components/tools/developer-tools/RobotsTxtGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-to-strikethrough': dynamic(() => import('@/components/tools/text-tools/TextToStrikethrough'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-to-bold-unicode': dynamic(() => import('@/components/tools/text-tools/TextToBoldUnicode'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'rectangle-calculator': dynamic(() => import('@/components/tools/math-calculators/RectangleCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'simple-interest-calculator': dynamic(() => import('@/components/tools/math-calculators/SimpleInterestCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'color-to-grayscale': dynamic(() => import('@/components/tools/image-color-tools/ColorToGrayscale'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'electric-charge-converter': dynamic(() => import('@/components/tools/unit-converters/ElectricChargeConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'voltage-converter': dynamic(() => import('@/components/tools/unit-converters/VoltageConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'quarter-calculator': dynamic(() => import('@/components/tools/date-time-tools/QuarterCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Batch 24
  'yaml-validator': dynamic(() => import('@/components/tools/developer-tools/YamlValidator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'favicon-generator-code': dynamic(() => import('@/components/tools/developer-tools/FaviconGeneratorCode'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-to-italic-unicode': dynamic(() => import('@/components/tools/text-tools/TextToItalicUnicode'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'sentence-splitter': dynamic(() => import('@/components/tools/text-tools/SentenceSplitter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'rhombus-calculator': dynamic(() => import('@/components/tools/math-calculators/RhombusCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'weighted-average-calculator': dynamic(() => import('@/components/tools/math-calculators/WeightedAverageCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'color-inversion-tool': dynamic(() => import('@/components/tools/image-color-tools/ColorInversionTool'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'viscosity-converter': dynamic(() => import('@/components/tools/unit-converters/ViscosityConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'electrical-resistance-converter': dynamic(() => import('@/components/tools/unit-converters/ElectricalResistanceConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'holiday-countdown': dynamic(() => import('@/components/tools/date-time-tools/HolidayCountdown'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Batch 25
  'sql-to-mongodb': dynamic(() => import('@/components/tools/developer-tools/SqlToMongodb'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'env-file-generator': dynamic(() => import('@/components/tools/developer-tools/EnvFileGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-to-monospace-unicode': dynamic(() => import('@/components/tools/text-tools/TextToMonospaceUnicode'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'paragraph-counter': dynamic(() => import('@/components/tools/text-tools/ParagraphCounter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'ellipse-calculator': dynamic(() => import('@/components/tools/math-calculators/EllipseCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'debt-payoff-calculator': dynamic(() => import('@/components/tools/math-calculators/DebtPayoffCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'color-saturation-adjuster': dynamic(() => import('@/components/tools/image-color-tools/ColorSaturationAdjuster'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'concentration-converter': dynamic(() => import('@/components/tools/unit-converters/ConcentrationConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'radiation-dose-converter': dynamic(() => import('@/components/tools/unit-converters/RadiationDoseConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'season-calculator': dynamic(() => import('@/components/tools/date-time-tools/SeasonCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Batch 26
  'graphql-query-builder': dynamic(() => import('@/components/tools/developer-tools/GraphqlQueryBuilder'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'csp-header-generator': dynamic(() => import('@/components/tools/developer-tools/CspHeaderGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-to-double-struck': dynamic(() => import('@/components/tools/text-tools/TextToDoubleStruck'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'word-density-analyzer': dynamic(() => import('@/components/tools/text-tools/WordDensityAnalyzer'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'hexagon-calculator': dynamic(() => import('@/components/tools/math-calculators/HexagonCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'investment-return-calculator': dynamic(() => import('@/components/tools/math-calculators/InvestmentReturnCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'color-brightness-adjuster': dynamic(() => import('@/components/tools/image-color-tools/ColorBrightnessAdjuster'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'electrical-power-converter': dynamic(() => import('@/components/tools/unit-converters/ElectricalPowerConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'capacitance-converter': dynamic(() => import('@/components/tools/unit-converters/CapacitanceConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'zodiac-sign-calculator': dynamic(() => import('@/components/tools/date-time-tools/ZodiacSignCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Batch 27
  'xpath-tester': dynamic(() => import('@/components/tools/developer-tools/XpathTester'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'cors-header-generator': dynamic(() => import('@/components/tools/developer-tools/CorsHeaderGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-to-circled-unicode': dynamic(() => import('@/components/tools/text-tools/TextToCircledUnicode'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'anagram-checker': dynamic(() => import('@/components/tools/text-tools/AnagramChecker'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'pentagon-calculator': dynamic(() => import('@/components/tools/math-calculators/PentagonCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'currency-exchange-calculator': dynamic(() => import('@/components/tools/math-calculators/CurrencyExchangeCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'color-hue-rotator': dynamic(() => import('@/components/tools/image-color-tools/ColorHueRotator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'inductance-converter': dynamic(() => import('@/components/tools/unit-converters/InductanceConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'electric-current-converter': dynamic(() => import('@/components/tools/unit-converters/ElectricCurrentConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'chinese-zodiac-calculator': dynamic(() => import('@/components/tools/date-time-tools/ChineseZodiacCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Batch 28
  'jwt-generator': dynamic(() => import('@/components/tools/developer-tools/JwtGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'api-response-formatter': dynamic(() => import('@/components/tools/developer-tools/ApiResponseFormatter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-to-squared-unicode': dynamic(() => import('@/components/tools/text-tools/TextToSquaredUnicode'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'syllable-counter': dynamic(() => import('@/components/tools/text-tools/SyllableCounter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'octagon-calculator': dynamic(() => import('@/components/tools/math-calculators/OctagonCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'paycheck-calculator': dynamic(() => import('@/components/tools/math-calculators/PaycheckCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'color-to-tailwind': dynamic(() => import('@/components/tools/image-color-tools/ColorToTailwind'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'frequency-to-wavelength': dynamic(() => import('@/components/tools/unit-converters/FrequencyToWavelength'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'temperature-to-color': dynamic(() => import('@/components/tools/image-color-tools/TemperatureToColor'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'moon-phase-calculator': dynamic(() => import('@/components/tools/date-time-tools/MoonPhaseCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Batch 29
  'html-to-markdown': dynamic(() => import('@/components/tools/developer-tools/HtmlToMarkdown'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'json-schema-generator': dynamic(() => import('@/components/tools/developer-tools/JsonSchemaGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-to-fullwidth': dynamic(() => import('@/components/tools/text-tools/TextToFullwidth'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'readability-score': dynamic(() => import('@/components/tools/text-tools/ReadabilityScore'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'decagon-calculator': dynamic(() => import('@/components/tools/math-calculators/DecagonCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'rent-vs-buy-calculator': dynamic(() => import('@/components/tools/math-calculators/RentVsBuyCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'color-accessibility-checker': dynamic(() => import('@/components/tools/image-color-tools/ColorAccessibilityChecker'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'wavelength-to-color': dynamic(() => import('@/components/tools/image-color-tools/WavelengthToColor'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'magnetic-flux-converter': dynamic(() => import('@/components/tools/unit-converters/MagneticFluxConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'day-of-year-calculator': dynamic(() => import('@/components/tools/date-time-tools/DayOfYearCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Batch 30
  'markdown-table-generator': dynamic(() => import('@/components/tools/developer-tools/MarkdownTableGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'json-diff-viewer': dynamic(() => import('@/components/tools/developer-tools/JsonDiffViewer'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-to-wingdings': dynamic(() => import('@/components/tools/text-tools/TextToWingdings'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'consonant-cluster-finder': dynamic(() => import('@/components/tools/text-tools/ConsonantClusterFinder'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'regular-polygon-calculator': dynamic(() => import('@/components/tools/math-calculators/RegularPolygonCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'car-loan-calculator': dynamic(() => import('@/components/tools/math-calculators/CarLoanCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'color-palette-extractor': dynamic(() => import('@/components/tools/image-color-tools/ColorPaletteExtractor'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'specific-heat-converter': dynamic(() => import('@/components/tools/unit-converters/SpecificHeatConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'thermal-conductivity-converter': dynamic(() => import('@/components/tools/unit-converters/ThermalConductivityConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'century-calculator': dynamic(() => import('@/components/tools/date-time-tools/CenturyCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Batch 31
  'typescript-to-json': dynamic(() => import('@/components/tools/developer-tools/TypescriptToJson'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'css-flexbox-generator': dynamic(() => import('@/components/tools/developer-tools/CssFlexboxGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-to-bubble-letters': dynamic(() => import('@/components/tools/text-tools/TextToBubbleLetters'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'word-boundary-splitter': dynamic(() => import('@/components/tools/text-tools/WordBoundarySplitter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'surface-area-calculator': dynamic(() => import('@/components/tools/math-calculators/SurfaceAreaCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'tip-percentage-calculator': dynamic(() => import('@/components/tools/math-calculators/TipPercentageCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'color-space-converter': dynamic(() => import('@/components/tools/image-color-tools/ColorSpaceConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'angular-velocity-converter': dynamic(() => import('@/components/tools/unit-converters/AngularVelocityConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'electric-field-converter': dynamic(() => import('@/components/tools/unit-converters/ElectricFieldConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'time-since-calculator': dynamic(() => import('@/components/tools/date-time-tools/TimeSinceCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Batch 32
  'css-grid-generator': dynamic(() => import('@/components/tools/developer-tools/CssGridGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'package-json-generator': dynamic(() => import('@/components/tools/developer-tools/PackageJsonGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-to-morse-audio': dynamic(() => import('@/components/tools/text-tools/TextToMorseAudio'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-case-detector': dynamic(() => import('@/components/tools/text-tools/TextCaseDetector'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'volume-of-shapes': dynamic(() => import('@/components/tools/math-calculators/VolumeOfShapes'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'down-payment-calculator': dynamic(() => import('@/components/tools/math-calculators/DownPaymentCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'color-harmony-wheel': dynamic(() => import('@/components/tools/image-color-tools/ColorHarmonyWheel'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'pressure-altitude-converter': dynamic(() => import('@/components/tools/unit-converters/PressureAltitudeConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'speed-of-sound-calculator': dynamic(() => import('@/components/tools/unit-converters/SpeedOfSoundCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'event-countdown-creator': dynamic(() => import('@/components/tools/date-time-tools/EventCountdownCreator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Batch 33
  'css-variable-generator': dynamic(() => import('@/components/tools/developer-tools/CssVariableGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'sql-insert-generator': dynamic(() => import('@/components/tools/developer-tools/SqlInsertGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-to-emoji-replace': dynamic(() => import('@/components/tools/text-tools/TextToEmojiReplace'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-line-reverser': dynamic(() => import('@/components/tools/text-tools/TextLineReverser'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'wage-to-salary-converter': dynamic(() => import('@/components/tools/math-calculators/WageToSalaryConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'mortgage-extra-payment': dynamic(() => import('@/components/tools/math-calculators/MortgageExtraPayment'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'color-blending-modes': dynamic(() => import('@/components/tools/image-color-tools/ColorBlendingModes'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'mach-number-calculator': dynamic(() => import('@/components/tools/unit-converters/MachNumberCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'astronomical-unit-converter': dynamic(() => import('@/components/tools/unit-converters/AstronomicalUnitConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'date-range-generator': dynamic(() => import('@/components/tools/date-time-tools/DateRangeGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Batch 34
  'tailwind-class-sorter': dynamic(() => import('@/components/tools/developer-tools/TailwindClassSorter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'http-header-parser': dynamic(() => import('@/components/tools/developer-tools/HttpHeaderParser'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-to-camel-case': dynamic(() => import('@/components/tools/text-tools/TextToCamelCase'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-to-snake-case': dynamic(() => import('@/components/tools/text-tools/TextToSnakeCase'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'area-under-curve-calculator': dynamic(() => import('@/components/tools/math-calculators/AreaUnderCurveCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'sales-commission-calculator': dynamic(() => import('@/components/tools/math-calculators/SalesCommissionCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'color-distance-calculator': dynamic(() => import('@/components/tools/image-color-tools/ColorDistanceCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'wire-gauge-converter': dynamic(() => import('@/components/tools/unit-converters/WireGaugeConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'ph-scale-calculator': dynamic(() => import('@/components/tools/unit-converters/PhScaleCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'time-addition-calculator': dynamic(() => import('@/components/tools/date-time-tools/TimeAdditionCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Batch 35
  'html-list-generator': dynamic(() => import('@/components/tools/developer-tools/HtmlListGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'json-to-xml': dynamic(() => import('@/components/tools/developer-tools/JsonToXml'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-to-constant-case': dynamic(() => import('@/components/tools/text-tools/TextToConstantCase'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-to-dot-case': dynamic(() => import('@/components/tools/text-tools/TextToDotCase'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'interest-rate-converter': dynamic(() => import('@/components/tools/math-calculators/InterestRateConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'calorie-burn-calculator': dynamic(() => import('@/components/tools/math-calculators/CalorieBurnCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'color-gradient-text-generator': dynamic(() => import('@/components/tools/image-color-tools/ColorGradientTextGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'density-altitude-calculator': dynamic(() => import('@/components/tools/unit-converters/DensityAltitudeCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'unix-permission-converter': dynamic(() => import('@/components/tools/developer-tools/UnixPermissionConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'time-between-dates': dynamic(() => import('@/components/tools/date-time-tools/TimeBetweenDates'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Batch 36
  'xml-to-json': dynamic(() => import('@/components/tools/developer-tools/XmlToJson'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'css-transform-generator': dynamic(() => import('@/components/tools/developer-tools/CssTransformGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-to-path-case': dynamic(() => import('@/components/tools/text-tools/TextToPathCase'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-to-header-case': dynamic(() => import('@/components/tools/text-tools/TextToHeaderCase'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'net-salary-calculator': dynamic(() => import('@/components/tools/math-calculators/NetSalaryCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'body-fat-calculator': dynamic(() => import('@/components/tools/math-calculators/BodyFatCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'color-palette-from-hex': dynamic(() => import('@/components/tools/image-color-tools/ColorPaletteFromHex'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'cooking-temperature-converter': dynamic(() => import('@/components/tools/unit-converters/CookingTemperatureConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'aspect-ratio-resizer': dynamic(() => import('@/components/tools/image-color-tools/AspectRatioResizer'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'recurring-date-calculator': dynamic(() => import('@/components/tools/date-time-tools/RecurringDateCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Batch 37
  'ini-to-json': dynamic(() => import('@/components/tools/developer-tools/IniToJson'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'css-transition-generator': dynamic(() => import('@/components/tools/developer-tools/CssTransitionGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-to-train-case': dynamic(() => import('@/components/tools/text-tools/TextToTrainCase'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-character-replacer': dynamic(() => import('@/components/tools/text-tools/TextCharacterReplacer'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'waist-to-hip-ratio': dynamic(() => import('@/components/tools/math-calculators/WaistToHipRatio'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'unit-rate-calculator': dynamic(() => import('@/components/tools/math-calculators/UnitRateCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'color-temperature-to-rgb': dynamic(() => import('@/components/tools/image-color-tools/ColorTemperatureToRgb'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'paper-weight-converter': dynamic(() => import('@/components/tools/unit-converters/PaperWeightConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'screen-ppi-calculator': dynamic(() => import('@/components/tools/image-color-tools/ScreenPpiCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'workday-counter': dynamic(() => import('@/components/tools/date-time-tools/WorkdayCounter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Batch 38
  'properties-to-json': dynamic(() => import('@/components/tools/developer-tools/PropertiesToJson'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'css-aspect-ratio-generator': dynamic(() => import('@/components/tools/developer-tools/CssAspectRatioGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-to-spongebob-case': dynamic(() => import('@/components/tools/text-tools/TextToSpongebobCase'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-prefix-suffix-adder': dynamic(() => import('@/components/tools/text-tools/TextPrefixSuffixAdder'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'ideal-weight-calculator': dynamic(() => import('@/components/tools/math-calculators/IdealWeightCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'markup-to-selling-price': dynamic(() => import('@/components/tools/math-calculators/MarkupToSellingPrice'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'color-channel-separator': dynamic(() => import('@/components/tools/image-color-tools/ColorChannelSeparator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'dpi-calculator': dynamic(() => import('@/components/tools/image-color-tools/DpiCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'nautical-converter': dynamic(() => import('@/components/tools/unit-converters/NauticalConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'age-difference-calculator': dynamic(() => import('@/components/tools/date-time-tools/AgeDifferenceCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Batch 39
  'csv-column-extractor': dynamic(() => import('@/components/tools/developer-tools/CsvColumnExtractor'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'html-entity-reference': dynamic(() => import('@/components/tools/developer-tools/HtmlEntityReference'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-to-reverse-case': dynamic(() => import('@/components/tools/text-tools/TextToReverseCase'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-numbering-tool': dynamic(() => import('@/components/tools/text-tools/TextNumberingTool'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'pace-calculator': dynamic(() => import('@/components/tools/math-calculators/PaceCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'concrete-calculator': dynamic(() => import('@/components/tools/math-calculators/ConcreteCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'color-to-css-filter': dynamic(() => import('@/components/tools/image-color-tools/ColorToCssFilter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'resolution-converter': dynamic(() => import('@/components/tools/unit-converters/ResolutionConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'image-dimension-calculator': dynamic(() => import('@/components/tools/image-color-tools/ImageDimensionCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'timezone-converter-multi': dynamic(() => import('@/components/tools/date-time-tools/TimezoneConverterMulti'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Batch 40 - Mega batch (50 tools)
  'html-beautifier': dynamic(() => import('@/components/tools/developer-tools/HtmlBeautifier'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'css-selector-tester': dynamic(() => import('@/components/tools/developer-tools/CssSelectorTester'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'dotenv-validator': dynamic(() => import('@/components/tools/developer-tools/DotenvValidator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'http-method-reference': dynamic(() => import('@/components/tools/developer-tools/HttpMethodReference'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'mime-type-lookup': dynamic(() => import('@/components/tools/developer-tools/MimeTypeLookup'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'user-agent-parser': dynamic(() => import('@/components/tools/developer-tools/UserAgentParser'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'json-to-go-struct': dynamic(() => import('@/components/tools/developer-tools/JsonToGoStruct'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'json-to-python-dict': dynamic(() => import('@/components/tools/developer-tools/JsonToPythonDict'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'sql-escape-tool': dynamic(() => import('@/components/tools/developer-tools/SqlEscapeTool'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'regex-cheat-sheet': dynamic(() => import('@/components/tools/developer-tools/RegexCheatSheet'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-to-kebab-case': dynamic(() => import('@/components/tools/text-tools/TextToKebabCase'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-to-pascal-case': dynamic(() => import('@/components/tools/text-tools/TextToPascalCase'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'remove-extra-spaces': dynamic(() => import('@/components/tools/text-tools/RemoveExtraSpaces'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'add-prefix-suffix': dynamic(() => import('@/components/tools/text-tools/AddPrefixSuffix'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'number-each-line': dynamic(() => import('@/components/tools/text-tools/NumberEachLine'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'extract-emails': dynamic(() => import('@/components/tools/text-tools/ExtractEmails'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'extract-urls': dynamic(() => import('@/components/tools/text-tools/ExtractUrls'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-to-csv': dynamic(() => import('@/components/tools/text-tools/TextToCsv'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'square-root-calculator': dynamic(() => import('@/components/tools/math-calculators/SquareRootCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'cube-root-calculator': dynamic(() => import('@/components/tools/math-calculators/CubeRootCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'absolute-value-calculator': dynamic(() => import('@/components/tools/math-calculators/AbsoluteValueCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'modulo-calculator': dynamic(() => import('@/components/tools/math-calculators/ModuloCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'mean-median-mode': dynamic(() => import('@/components/tools/math-calculators/MeanMedianMode'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'variance-calculator': dynamic(() => import('@/components/tools/math-calculators/VarianceCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'combinations-generator': dynamic(() => import('@/components/tools/math-calculators/CombinationsGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'binary-to-text': dynamic(() => import('@/components/tools/math-calculators/BinaryToText'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'octal-calculator': dynamic(() => import('@/components/tools/math-calculators/OctalCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'hex-arithmetic': dynamic(() => import('@/components/tools/math-calculators/HexArithmetic'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'color-format-converter': dynamic(() => import('@/components/tools/image-color-tools/ColorFormatConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'gradient-direction-picker': dynamic(() => import('@/components/tools/image-color-tools/GradientDirectionPicker'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'color-tint-generator': dynamic(() => import('@/components/tools/image-color-tools/ColorTintGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'color-tone-generator': dynamic(() => import('@/components/tools/image-color-tools/ColorToneGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'number-system-converter': dynamic(() => import('@/components/tools/unit-converters/NumberSystemConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'typography-unit-converter': dynamic(() => import('@/components/tools/unit-converters/TypographyUnitConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'fuel-volume-converter': dynamic(() => import('@/components/tools/unit-converters/FuelVolumeConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'date-add-subtract': dynamic(() => import('@/components/tools/date-time-tools/DateAddSubtract'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'weekday-counter': dynamic(() => import('@/components/tools/date-time-tools/WeekdayCounter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'date-to-unix': dynamic(() => import('@/components/tools/date-time-tools/DateToUnix'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Batch 40 new tools
  'tsv-to-json': dynamic(() => import('@/components/tools/developer-tools/TsvToJson'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'css-counter-generator': dynamic(() => import('@/components/tools/developer-tools/CssCounterGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-to-alternating-case': dynamic(() => import('@/components/tools/text-tools/TextToAlternatingCase'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-to-csv-converter': dynamic(() => import('@/components/tools/text-tools/TextToCsvConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'pool-volume-calculator': dynamic(() => import('@/components/tools/math-calculators/PoolVolumeCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'gravel-calculator': dynamic(() => import('@/components/tools/math-calculators/GravelCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'color-to-pantone-nearest': dynamic(() => import('@/components/tools/image-color-tools/ColorToPantoneNearest'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'shoe-size-to-foot-length': dynamic(() => import('@/components/tools/unit-converters/ShoeSizeToFootLength'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'image-crop-calculator': dynamic(() => import('@/components/tools/image-color-tools/ImageCropCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'daylight-saving-checker': dynamic(() => import('@/components/tools/date-time-tools/DaylightSavingChecker'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Batch 41
  'json-to-form-data': dynamic(() => import('@/components/tools/developer-tools/JsonToFormData'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'css-will-change-generator': dynamic(() => import('@/components/tools/developer-tools/CssWillChangeGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-to-title-slug': dynamic(() => import('@/components/tools/text-tools/TextToTitleSlug'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-mirror': dynamic(() => import('@/components/tools/text-tools/TextMirror'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'paint-calculator': dynamic(() => import('@/components/tools/math-calculators/PaintCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'tile-calculator': dynamic(() => import('@/components/tools/math-calculators/TileCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'color-to-rgba-string': dynamic(() => import('@/components/tools/image-color-tools/ColorToRgbaString'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'ring-size-converter': dynamic(() => import('@/components/tools/unit-converters/RingSizeConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'photo-print-size-calculator': dynamic(() => import('@/components/tools/image-color-tools/PhotoPrintSizeCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'date-pattern-generator': dynamic(() => import('@/components/tools/date-time-tools/DatePatternGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  // Batch 42
  'json-to-graphql-schema': dynamic(() => import('@/components/tools/developer-tools/JsonToGraphqlSchema'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'css-scroll-snap-generator': dynamic(() => import('@/components/tools/developer-tools/CssScrollSnapGenerator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-to-emoji-art': dynamic(() => import('@/components/tools/text-tools/TextToEmojiArt'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'text-line-joiner': dynamic(() => import('@/components/tools/text-tools/TextLineJoiner'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'staircase-calculator': dynamic(() => import('@/components/tools/math-calculators/StaircaseCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'fence-calculator': dynamic(() => import('@/components/tools/math-calculators/FenceCalculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'color-to-hsb': dynamic(() => import('@/components/tools/image-color-tools/ColorToHsb'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'bra-size-converter': dynamic(() => import('@/components/tools/unit-converters/BraSizeConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'banner-size-reference': dynamic(() => import('@/components/tools/image-color-tools/BannerSizeReference'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
  'iso-week-date-converter': dynamic(() => import('@/components/tools/date-time-tools/IsoWeekDateConverter'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
};

const FallbackComponent = dynamic(() => import('@/components/tools/ToolEnginePlaceholder'), { loading: () => <ToolLoadingSkeleton />, ssr: false });

export function generateStaticParams() {
  return getAllTools().map((tool) => ({ category: tool.category, tool: tool.slug }));
}

export function generateMetadata({ params }: ToolPageProps): Metadata {
  const tool = getToolBySlug(params.tool);
  if (!tool) return { title: 'Tool Not Found' };

  return {
    title: tool.metaTitle,
    description: tool.metaDescription,
    keywords: tool.keywords,
    alternates: { canonical: `/${tool.category}/${tool.slug}` },
    openGraph: {
      title: tool.metaTitle,
      description: tool.metaDescription,
      url: `/${tool.category}/${tool.slug}`,
      siteName: 'DeWelope Tools',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: tool.metaTitle,
      description: tool.metaDescription,
    },
  };
}

export default function ToolPage({ params }: ToolPageProps) {
  const tool = getToolBySlug(params.tool);
  if (!tool || tool.category !== params.category) notFound();

  const category = categories.find((cat) => cat.id === tool.category);
  if (!category) notFound();

  const ToolEngine = TOOL_COMPONENTS[tool.id] || FallbackComponent;
  const structuredData = generateToolStructuredData(tool);
  const howToSchema = generateHowToSchema(tool);

  return (
    <div className="max-w-7xl mx-auto">
      {/* JSON-LD WebApplication structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* JSON-LD HowTo structured data */}
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}

      <div className="flex flex-col lg:flex-row lg:gap-8">
        <article className="flex-1 min-w-0">
          <Breadcrumbs
            category={{ name: category.name, slug: category.slug }}
            tool={{ name: tool.name, slug: tool.slug }}
          />
          <ToolPageShell toolName={tool.name} description={tool.description}>
            <ToolEngine toolId={tool.id} toolName={tool.name} />
          </ToolPageShell>

          {/* SEO content section */}
          <ToolSeoContent
            toolName={tool.name}
            howToUse={tool.howToUse}
            howToSteps={tool.howToSteps}
          />

          {/* Related tools for internal linking */}
          <RelatedTools
            currentToolId={tool.id}
            category={tool.category as CategoryId}
            categorySlug={category.slug}
          />

          {/* Cross-category tools for broader internal linking */}
          <CrossCategoryTools currentCategory={tool.category as CategoryId} />
        </article>

        <aside className="hidden lg:block w-72 flex-shrink-0" aria-label="Sidebar">
          <div className="sticky top-20">
            <AdUnit position="sidebar" size="300x250" />
          </div>
        </aside>
      </div>
    </div>
  );
}
