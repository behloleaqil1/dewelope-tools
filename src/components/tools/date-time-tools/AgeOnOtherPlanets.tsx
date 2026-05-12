'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface PlanetAge {
  planet: string;
  age: number;
  orbitalPeriod: number;
  emoji: string;
}

// Orbital periods in Earth days
const PLANETS: { name: string; days: number; emoji: string }[] = [
  { name: 'Mercury', days: 87.97, emoji: '☿' },
  { name: 'Venus', days: 224.7, emoji: '♀' },
  { name: 'Earth', days: 365.25, emoji: '🌍' },
  { name: 'Mars', days: 687.0, emoji: '♂' },
  { name: 'Jupiter', days: 4332.59, emoji: '♃' },
  { name: 'Saturn', days: 10759.22, emoji: '♄' },
  { name: 'Uranus', days: 30688.5, emoji: '♅' },
  { name: 'Neptune', days: 60182.0, emoji: '♆' },
  { name: 'Pluto', days: 90560.0, emoji: '⯓' },
];

/**
 * AgeOnOtherPlanets - Calculates your age on other planets based on their orbital periods.
 */
export default function AgeOnOtherPlanets({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [birthDate, setBirthDate] = useState('');
  const [results, setResults] = useState<PlanetAge[]>([]);
  const [error, setError] = useState<string | undefined>();

  function calculate() {
    setError(undefined);
    setResults([]);

    if (!birthDate) {
      setError('Please select your birth date');
      return;
    }

    const birth = new Date(birthDate);
    const now = new Date();

    if (birth > now) {
      setError('Birth date cannot be in the future');
      return;
    }

    const diffMs = now.getTime() - birth.getTime();
    const earthDays = diffMs / (1000 * 60 * 60 * 24);

    const ages: PlanetAge[] = PLANETS.map((planet) => ({
      planet: planet.name,
      age: earthDays / planet.days,
      orbitalPeriod: planet.days,
      emoji: planet.emoji,
    }));

    setResults(ages);
  }

  const copyText = results.length > 0
    ? results.map((r) => `${r.planet}: ${r.age.toFixed(2)} years`).join('\n')
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">
          Your Birth Date
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

      <button onClick={calculate} aria-label="Calculate age on other planets" className="btn-primary">
        Calculate Planetary Ages
      </button>

      <OutputArea hasContent={results.length > 0}>
        {results.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Your Age on Each Planet</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {results.map((r) => (
                <div key={r.planet} className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                  <div className="text-2xl mb-1">{r.emoji}</div>
                  <div className="text-sm font-medium text-gray-700">{r.planet}</div>
                  <div className="text-xl font-bold text-blue-600">{r.age.toFixed(2)}</div>
                  <div className="text-xs text-gray-500">years</div>
                  <div className="text-xs text-gray-400 mt-1">
                    Orbit: {r.orbitalPeriod.toFixed(0)} Earth days
                  </div>
                </div>
              ))}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
