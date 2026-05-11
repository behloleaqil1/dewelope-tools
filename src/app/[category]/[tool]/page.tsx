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
