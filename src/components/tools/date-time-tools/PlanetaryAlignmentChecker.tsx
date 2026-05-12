'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface PlanetPosition {
  name: string;
  longitude: number;
  constellation: string;
  symbol: string;
}

const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

/**
 * PlanetaryAlignmentChecker - Check approximate planetary positions for a date.
 * Uses simplified orbital calculations to show approximate ecliptic longitudes.
 */
export default function PlanetaryAlignmentChecker({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [dateStr, setDateStr] = useState('');
  const [result, setResult] = useState<PlanetPosition[] | null>(null);
  const [alignments, setAlignments] = useState<string[]>([]);

  // Simplified planetary position calculation using mean orbital elements
  function calculatePositions(date: Date): PlanetPosition[] {
    // Days since J2000.0 (Jan 1, 2000 12:00 TT)
    const j2000 = new Date(2000, 0, 1, 12, 0, 0).getTime();
    const d = (date.getTime() - j2000) / 86400000;

    // Simplified mean longitudes (degrees) and daily motion
    const planets = [
      { name: 'Mercury', symbol: '☿', L0: 252.25, rate: 4.09233 },
      { name: 'Venus', symbol: '♀', L0: 181.98, rate: 1.60213 },
      { name: 'Earth (Sun)', symbol: '☉', L0: 100.46, rate: 0.98560 },
      { name: 'Mars', symbol: '♂', L0: 355.43, rate: 0.52403 },
      { name: 'Jupiter', symbol: '♃', L0: 34.35, rate: 0.08309 },
      { name: 'Saturn', symbol: '♄', L0: 50.08, rate: 0.03346 },
      { name: 'Uranus', symbol: '⛢', L0: 314.06, rate: 0.01173 },
      { name: 'Neptune', symbol: '♆', L0: 304.35, rate: 0.00598 },
    ];

    return planets.map((p) => {
      let longitude = (p.L0 + p.rate * d) % 360;
      if (longitude < 0) longitude += 360;
      const signIndex = Math.floor(longitude / 30);
      const constellation = ZODIAC_SIGNS[signIndex];
      return { name: p.name, longitude: Math.round(longitude * 100) / 100, constellation, symbol: p.symbol };
    });
  }

  function findAlignments(positions: PlanetPosition[]): string[] {
    const notes: string[] = [];
    const threshold = 10; // degrees for conjunction

    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        let diff = Math.abs(positions[i].longitude - positions[j].longitude);
        if (diff > 180) diff = 360 - diff;

        if (diff <= threshold) {
          notes.push(`${positions[i].symbol} ${positions[i].name} conjunct ${positions[j].symbol} ${positions[j].name} (${diff.toFixed(1)}° apart)`);
        } else if (Math.abs(diff - 180) <= threshold) {
          notes.push(`${positions[i].symbol} ${positions[i].name} opposite ${positions[j].symbol} ${positions[j].name}`);
        } else if (Math.abs(diff - 90) <= threshold) {
          notes.push(`${positions[i].symbol} ${positions[i].name} square ${positions[j].symbol} ${positions[j].name}`);
        } else if (Math.abs(diff - 120) <= threshold) {
          notes.push(`${positions[i].symbol} ${positions[i].name} trine ${positions[j].symbol} ${positions[j].name}`);
        }
      }
    }

    return notes;
  }

  const calculate = () => {
    const date = dateStr ? new Date(dateStr) : new Date();
    if (isNaN(date.getTime())) return;

    const positions = calculatePositions(date);
    setResult(positions);
    setAlignments(findAlignments(positions));
  };

  const copyText = result
    ? `Planetary Positions for ${dateStr || 'Today'}\n${result.map((p) => `${p.symbol} ${p.name}: ${p.longitude}° (${p.constellation})`).join('\n')}${alignments.length > 0 ? '\n\nAlignments:\n' + alignments.join('\n') : ''}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">
          Select Date
        </label>
        <input
          id={`${toolId}-date`}
          type="date"
          value={dateStr}
          onChange={(e) => setDateStr(e.target.value)}
          aria-label={`Date for ${toolName}`}
          className="input-field w-56"
        />
      </InputArea>

      <button onClick={calculate} aria-label="Check planetary positions" className="btn-primary">
        Check Positions
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Approximate Planetary Positions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {result.map((planet) => (
                  <div key={planet.name} className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                    <div className="text-2xl mb-1">{planet.symbol}</div>
                    <div className="text-sm font-medium text-gray-800">{planet.name}</div>
                    <div className="text-xs text-blue-600 font-mono">{planet.longitude}°</div>
                    <div className="text-xs text-gray-500">{planet.constellation}</div>
                  </div>
                ))}
              </div>
            </div>

            {alignments.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Notable Aspects</h3>
                <ul className="space-y-1">
                  {alignments.map((a, idx) => (
                    <li key={idx} className="text-sm text-gray-700 bg-blue-50 p-2 rounded border border-blue-100">{a}</li>
                  ))}
                </ul>
              </div>
            )}

            {alignments.length === 0 && (
              <p className="text-sm text-gray-500 italic">No major aspects (conjunctions, oppositions, squares, or trines) within 10° threshold.</p>
            )}

            <p className="text-xs text-gray-400">Note: These are simplified mean-longitude approximations for educational purposes. For precise ephemeris data, consult astronomical software.</p>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
