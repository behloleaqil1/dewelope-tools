'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ChineseZodiacCalculator - Determines the Chinese zodiac animal from a birth year.
 */
export default function ChineseZodiacCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [year, setYear] = useState('');
  const [result, setResult] = useState<{ animal: string; element: string; emoji: string; traits: string; years: string } | null>(null);
  const [error, setError] = useState<string | undefined>();

  const ANIMALS = [
    { name: 'Rat', emoji: '🐀', traits: 'Quick-witted, resourceful, versatile, kind' },
    { name: 'Ox', emoji: '🐂', traits: 'Diligent, dependable, strong, determined' },
    { name: 'Tiger', emoji: '🐅', traits: 'Brave, confident, competitive, unpredictable' },
    { name: 'Rabbit', emoji: '🐇', traits: 'Quiet, elegant, kind, responsible' },
    { name: 'Dragon', emoji: '🐉', traits: 'Confident, intelligent, enthusiastic, ambitious' },
    { name: 'Snake', emoji: '🐍', traits: 'Enigmatic, intelligent, wise, graceful' },
    { name: 'Horse', emoji: '🐴', traits: 'Animated, active, energetic, free-spirited' },
    { name: 'Goat', emoji: '🐐', traits: 'Calm, gentle, creative, sympathetic' },
    { name: 'Monkey', emoji: '🐒', traits: 'Sharp, smart, curious, mischievous' },
    { name: 'Rooster', emoji: '🐓', traits: 'Observant, hardworking, courageous, talented' },
    { name: 'Dog', emoji: '🐕', traits: 'Loyal, honest, amiable, kind' },
    { name: 'Pig', emoji: '🐖', traits: 'Compassionate, generous, diligent, optimistic' },
  ];

  const ELEMENTS = ['Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth', 'Metal', 'Metal', 'Water', 'Water'];

  const calculate = () => {
    setError(undefined);
    setResult(null);

    const yearNum = parseInt(year);
    if (!year.trim() || isNaN(yearNum) || yearNum < 1 || yearNum > 9999) {
      setError('Please enter a valid year (1-9999)');
      return;
    }

    // Chinese zodiac cycle starts from 4 (year 4 AD = Rat)
    const animalIndex = (yearNum - 4) % 12;
    const normalizedIndex = ((animalIndex % 12) + 12) % 12;
    const animal = ANIMALS[normalizedIndex];

    // Element cycle based on last digit of year
    const elementIndex = (yearNum - 4) % 10;
    const normalizedElementIndex = ((elementIndex % 10) + 10) % 10;
    const element = ELEMENTS[normalizedElementIndex];

    // Find nearby years with same animal
    const nearbyYears: number[] = [];
    for (let y = yearNum - 24; y <= yearNum + 24; y += 12) {
      if (y > 0) nearbyYears.push(y);
    }

    setResult({
      animal: animal.name,
      element,
      emoji: animal.emoji,
      traits: animal.traits,
      years: nearbyYears.join(', '),
    });
  };

  const copyText = result
    ? `Year: ${year}\nChinese Zodiac: ${result.animal} ${result.emoji}\nElement: ${result.element}\nTraits: ${result.traits}\nOther ${result.animal} years: ${result.years}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-year`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter birth year
        </label>
        <input
          id={`${toolId}-year`}
          type="text"
          inputMode="numeric"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="e.g. 1990"
          aria-label={`Birth year for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <button onClick={calculate} aria-label="Find Chinese zodiac" className="btn-primary">
        Find Zodiac Animal
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-5xl mb-2">{result.emoji}</div>
              <div className="text-2xl font-bold text-gray-800">{result.element} {result.animal}</div>
              <div className="text-sm text-gray-500 mt-1">Year {year}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2 text-sm">
              <div><span className="font-medium text-gray-600">Traits:</span> {result.traits}</div>
              <div><span className="font-medium text-gray-600">Element:</span> {result.element}</div>
              <div><span className="font-medium text-gray-600">Other {result.animal} years:</span> <span className="font-mono text-xs">{result.years}</span></div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
