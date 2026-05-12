'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * NumerologyCalculator - Calculate numerology life path number from birth date.
 * Reduces birth date digits to a single digit (or master number 11, 22, 33).
 */

const LIFE_PATH_MEANINGS: Record<number, { title: string; traits: string; description: string }> = {
  1: { title: 'The Leader', traits: 'Independent, ambitious, pioneering', description: 'Natural born leaders who are innovative and determined. You forge your own path and inspire others to follow.' },
  2: { title: 'The Diplomat', traits: 'Cooperative, sensitive, balanced', description: 'Peacemakers who excel at partnerships and mediation. You bring harmony and understanding to relationships.' },
  3: { title: 'The Communicator', traits: 'Creative, expressive, social', description: 'Gifted communicators with artistic talents. You inspire joy and creativity in those around you.' },
  4: { title: 'The Builder', traits: 'Practical, disciplined, hardworking', description: 'Reliable and methodical, you create solid foundations. Your dedication and persistence achieve lasting results.' },
  5: { title: 'The Adventurer', traits: 'Freedom-loving, versatile, dynamic', description: 'Seekers of change and variety who thrive on new experiences. You adapt quickly and embrace life fully.' },
  6: { title: 'The Nurturer', traits: 'Responsible, caring, harmonious', description: 'Natural caregivers devoted to family and community. You create beauty and comfort wherever you go.' },
  7: { title: 'The Seeker', traits: 'Analytical, introspective, spiritual', description: 'Deep thinkers drawn to knowledge and inner wisdom. You seek truth and understanding beyond the surface.' },
  8: { title: 'The Achiever', traits: 'Ambitious, authoritative, successful', description: 'Driven to achieve material and professional success. You have natural business acumen and executive ability.' },
  9: { title: 'The Humanitarian', traits: 'Compassionate, generous, idealistic', description: 'Selfless souls dedicated to serving humanity. You see the big picture and work toward universal good.' },
  11: { title: 'The Intuitive (Master)', traits: 'Visionary, inspirational, enlightened', description: 'Master number with heightened intuition and spiritual insight. You channel higher wisdom to inspire and uplift others.' },
  22: { title: 'The Master Builder', traits: 'Powerful, practical visionary', description: 'Master number combining vision with practical ability. You can turn the most ambitious dreams into reality.' },
  33: { title: 'The Master Teacher', traits: 'Selfless, devoted, uplifting', description: 'Master number of compassion and spiritual giving. You teach and heal through unconditional love and devotion.' },
};

export default function NumerologyCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [birthDate, setBirthDate] = useState('');
  const [result, setResult] = useState<{
    lifePathNumber: number;
    steps: string[];
    meaning: { title: string; traits: string; description: string };
  } | null>(null);
  const [error, setError] = useState('');

  const reduceToSingle = (num: number): { value: number; steps: string[] } => {
    const steps: string[] = [];
    let current = num;

    while (current > 9 && current !== 11 && current !== 22 && current !== 33) {
      const digits = current.toString().split('').map(Number);
      const sum = digits.reduce((a, b) => a + b, 0);
      steps.push(`${digits.join(' + ')} = ${sum}`);
      current = sum;
    }

    return { value: current, steps };
  };

  const calculate = () => {
    setError('');
    setResult(null);

    if (!birthDate) {
      setError('Please enter a birth date.');
      return;
    }

    const parts = birthDate.split('-');
    if (parts.length !== 3) {
      setError('Invalid date format.');
      return;
    }

    const [year, month, day] = parts;
    const allSteps: string[] = [];

    // Reduce month
    const monthNum = parseInt(month, 10);
    const monthResult = reduceToSingle(monthNum);
    allSteps.push(`Month: ${month} → ${monthResult.value}`);
    if (monthResult.steps.length > 0) allSteps.push(...monthResult.steps.map((s) => `  ${s}`));

    // Reduce day
    const dayNum = parseInt(day, 10);
    const dayResult = reduceToSingle(dayNum);
    allSteps.push(`Day: ${day} → ${dayResult.value}`);
    if (dayResult.steps.length > 0) allSteps.push(...dayResult.steps.map((s) => `  ${s}`));

    // Reduce year
    const yearDigits = year.split('').map(Number);
    const yearSum = yearDigits.reduce((a, b) => a + b, 0);
    const yearResult = reduceToSingle(yearSum);
    allSteps.push(`Year: ${yearDigits.join(' + ')} = ${yearSum} → ${yearResult.value}`);
    if (yearResult.steps.length > 0) allSteps.push(...yearResult.steps.map((s) => `  ${s}`));

    // Final sum
    const finalSum = monthResult.value + dayResult.value + yearResult.value;
    allSteps.push(`Sum: ${monthResult.value} + ${dayResult.value} + ${yearResult.value} = ${finalSum}`);

    const finalResult = reduceToSingle(finalSum);
    if (finalResult.steps.length > 0) allSteps.push(...finalResult.steps);
    allSteps.push(`Life Path Number: ${finalResult.value}`);

    const meaning = LIFE_PATH_MEANINGS[finalResult.value] || LIFE_PATH_MEANINGS[finalResult.value % 9 || 9];

    setResult({
      lifePathNumber: finalResult.value,
      steps: allSteps,
      meaning,
    });
  };

  const copyText = result
    ? `Numerology Life Path Number: ${result.lifePathNumber}\nBirth Date: ${birthDate}\n\n${result.meaning.title}\nTraits: ${result.meaning.traits}\n${result.meaning.description}\n\nCalculation Steps:\n${result.steps.join('\n')}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">
          Birth Date
        </label>
        <input
          id={`${toolId}-date`}
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          aria-label={`Birth date for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <button onClick={calculate} aria-label="Calculate life path number" className="btn-primary">
        Calculate Life Path Number
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-5 rounded-lg border border-purple-200 text-center">
              <div className="text-4xl font-bold text-purple-700">{result.lifePathNumber}</div>
              <div className="text-lg font-medium text-purple-600 mt-1">{result.meaning.title}</div>
              <div className="text-sm text-purple-500 mt-1">{result.meaning.traits}</div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700">{result.meaning.description}</p>
            </div>

            <details className="bg-gray-50 rounded-lg border border-gray-200">
              <summary className="px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 rounded-lg">
                Calculation Steps
              </summary>
              <div className="px-4 pb-3">
                <pre className="text-xs font-mono text-gray-600 whitespace-pre-wrap">{result.steps.join('\n')}</pre>
              </div>
            </details>

            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
