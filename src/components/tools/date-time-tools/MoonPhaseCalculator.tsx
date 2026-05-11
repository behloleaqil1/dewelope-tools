'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MoonPhaseCalculator - Calculate moon phase for any date.
 * Uses a simplified algorithm based on the synodic month (29.53 days).
 */
export default function MoonPhaseCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [dateInput, setDateInput] = useState(() => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  });
  const [result, setResult] = useState<{ phase: string; emoji: string; illumination: number; age: number; nextFull: string; nextNew: string } | null>(null);
  const [error, setError] = useState('');

  const getMoonPhase = (date: Date): { phase: string; emoji: string; illumination: number; age: number } => {
    // Known new moon: January 6, 2000
    const knownNewMoon = new Date(2000, 0, 6, 18, 14, 0);
    const synodicMonth = 29.53058867;

    const diff = (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
    const cycles = diff / synodicMonth;
    const age = (cycles - Math.floor(cycles)) * synodicMonth;

    // Calculate illumination (approximate)
    const illumination = Math.round((1 - Math.cos((age / synodicMonth) * 2 * Math.PI)) / 2 * 100);

    // Determine phase name
    let phase: string;
    let emoji: string;

    if (age < 1.85) { phase = 'New Moon'; emoji = '🌑'; }
    else if (age < 5.53) { phase = 'Waxing Crescent'; emoji = '🌒'; }
    else if (age < 9.22) { phase = 'First Quarter'; emoji = '🌓'; }
    else if (age < 12.91) { phase = 'Waxing Gibbous'; emoji = '🌔'; }
    else if (age < 16.61) { phase = 'Full Moon'; emoji = '🌕'; }
    else if (age < 20.30) { phase = 'Waning Gibbous'; emoji = '🌖'; }
    else if (age < 23.99) { phase = 'Last Quarter'; emoji = '🌗'; }
    else if (age < 27.68) { phase = 'Waning Crescent'; emoji = '🌘'; }
    else { phase = 'New Moon'; emoji = '🌑'; }

    return { phase, emoji, illumination, age: Math.round(age * 10) / 10 };
  };

  const getNextPhaseDate = (date: Date, targetAge: number): string => {
    const knownNewMoon = new Date(2000, 0, 6, 18, 14, 0);
    const synodicMonth = 29.53058867;

    const diff = (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
    const cycles = diff / synodicMonth;
    const currentAge = (cycles - Math.floor(cycles)) * synodicMonth;

    let daysUntil = targetAge - currentAge;
    if (daysUntil <= 0) daysUntil += synodicMonth;

    const nextDate = new Date(date.getTime() + daysUntil * 24 * 60 * 60 * 1000);
    return nextDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const calculate = () => {
    if (!dateInput) {
      setError('Please select a date.');
      setResult(null);
      return;
    }

    const date = new Date(dateInput + 'T12:00:00');
    if (isNaN(date.getTime())) {
      setError('Invalid date.');
      setResult(null);
      return;
    }

    setError('');

    const { phase, emoji, illumination, age } = getMoonPhase(date);
    const nextFull = getNextPhaseDate(date, 14.765);
    const nextNew = getNextPhaseDate(date, 0);

    setResult({ phase, emoji, illumination, age, nextFull, nextNew });
  };

  const copyText = result
    ? `Date: ${dateInput}\nMoon Phase: ${result.phase} ${result.emoji}\nIllumination: ${result.illumination}%\nMoon Age: ${result.age} days\nNext Full Moon: ${result.nextFull}\nNext New Moon: ${result.nextNew}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">
          Select Date
        </label>
        <input
          id={`${toolId}-date`}
          type="date"
          value={dateInput}
          onChange={(e) => {
            setDateInput(e.target.value);
            if (error) setError('');
          }}
          aria-label={`Date input for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <button onClick={calculate} aria-label="Calculate moon phase" className="btn-primary">
        Calculate Moon Phase
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="text-center bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="text-6xl mb-2">{result.emoji}</div>
              <div className="text-xl font-bold text-gray-800">{result.phase}</div>
              <div className="text-sm text-gray-500 mt-1">{result.illumination}% illuminated</div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-blue-600">{result.age}</div>
                <div className="text-xs text-gray-500">Days Old</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xs font-bold text-purple-600">{result.nextFull}</div>
                <div className="text-xs text-gray-500">Next Full</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xs font-bold text-gray-600">{result.nextNew}</div>
                <div className="text-xs text-gray-500">Next New</div>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Based on synodic month calculation (29.53 days). Approximate values.
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
