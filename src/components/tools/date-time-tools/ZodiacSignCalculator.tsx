'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ZodiacSignCalculator - Determine zodiac sign from birth date with date ranges.
 */
export default function ZodiacSignCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [date, setDate] = useState('');
  const [result, setResult] = useState<{
    sign: string;
    symbol: string;
    element: string;
    dateRange: string;
    quality: string;
    rulingPlanet: string;
  } | null>(null);
  const [error, setError] = useState('');

  const ZODIAC_SIGNS = [
    { sign: 'Capricorn', symbol: '♑', element: 'Earth', quality: 'Cardinal', rulingPlanet: 'Saturn', startMonth: 12, startDay: 22, endMonth: 1, endDay: 19, dateRange: 'Dec 22 – Jan 19' },
    { sign: 'Aquarius', symbol: '♒', element: 'Air', quality: 'Fixed', rulingPlanet: 'Uranus', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18, dateRange: 'Jan 20 – Feb 18' },
    { sign: 'Pisces', symbol: '♓', element: 'Water', quality: 'Mutable', rulingPlanet: 'Neptune', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20, dateRange: 'Feb 19 – Mar 20' },
    { sign: 'Aries', symbol: '♈', element: 'Fire', quality: 'Cardinal', rulingPlanet: 'Mars', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19, dateRange: 'Mar 21 – Apr 19' },
    { sign: 'Taurus', symbol: '♉', element: 'Earth', quality: 'Fixed', rulingPlanet: 'Venus', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20, dateRange: 'Apr 20 – May 20' },
    { sign: 'Gemini', symbol: '♊', element: 'Air', quality: 'Mutable', rulingPlanet: 'Mercury', startMonth: 5, startDay: 21, endMonth: 6, endDay: 20, dateRange: 'May 21 – Jun 20' },
    { sign: 'Cancer', symbol: '♋', element: 'Water', quality: 'Cardinal', rulingPlanet: 'Moon', startMonth: 6, startDay: 21, endMonth: 7, endDay: 22, dateRange: 'Jun 21 – Jul 22' },
    { sign: 'Leo', symbol: '♌', element: 'Fire', quality: 'Fixed', rulingPlanet: 'Sun', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22, dateRange: 'Jul 23 – Aug 22' },
    { sign: 'Virgo', symbol: '♍', element: 'Earth', quality: 'Mutable', rulingPlanet: 'Mercury', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22, dateRange: 'Aug 23 – Sep 22' },
    { sign: 'Libra', symbol: '♎', element: 'Air', quality: 'Cardinal', rulingPlanet: 'Venus', startMonth: 9, startDay: 23, endMonth: 10, endDay: 22, dateRange: 'Sep 23 – Oct 22' },
    { sign: 'Scorpio', symbol: '♏', element: 'Water', quality: 'Fixed', rulingPlanet: 'Pluto', startMonth: 10, startDay: 23, endMonth: 11, endDay: 21, dateRange: 'Oct 23 – Nov 21' },
    { sign: 'Sagittarius', symbol: '♐', element: 'Fire', quality: 'Mutable', rulingPlanet: 'Jupiter', startMonth: 11, startDay: 22, endMonth: 12, endDay: 21, dateRange: 'Nov 22 – Dec 21' },
  ];

  const ELEMENT_COLORS: Record<string, string> = {
    'Fire': 'text-red-600',
    'Earth': 'text-green-600',
    'Air': 'text-sky-600',
    'Water': 'text-blue-600',
  };

  const calculate = () => {
    if (!date) { setError('Please select a date'); setResult(null); return; }
    setError('');

    const d = new Date(date + 'T00:00:00');
    const month = d.getMonth() + 1;
    const day = d.getDate();

    let found = ZODIAC_SIGNS.find(z => {
      if (z.startMonth > z.endMonth) {
        // Crosses year boundary (Capricorn)
        return (month === z.startMonth && day >= z.startDay) || (month === z.endMonth && day <= z.endDay);
      }
      return (month === z.startMonth && day >= z.startDay) || (month === z.endMonth && day <= z.endDay);
    });

    if (!found) {
      // Fallback: shouldn't happen with correct data
      found = ZODIAC_SIGNS[0];
    }

    setResult({
      sign: found.sign,
      symbol: found.symbol,
      element: found.element,
      dateRange: found.dateRange,
      quality: found.quality,
      rulingPlanet: found.rulingPlanet,
    });
  };

  const copyText = result
    ? `Date: ${date}\nZodiac Sign: ${result.sign} ${result.symbol}\nDate Range: ${result.dateRange}\nElement: ${result.element}\nQuality: ${result.quality}\nRuling Planet: ${result.rulingPlanet}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter Birth Date
        </label>
        <input
          id={`${toolId}-date`}
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          aria-label={`Birth date for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <button onClick={calculate} aria-label="Calculate zodiac sign" className="btn-primary">
        Find Zodiac Sign
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
              <div className="text-5xl mb-2">{result.symbol}</div>
              <div className="text-2xl font-bold text-gray-800">{result.sign}</div>
              <div className="text-sm text-gray-500 mt-1">{result.dateRange}</div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className={`text-lg font-bold ${ELEMENT_COLORS[result.element] || 'text-gray-800'}`}>{result.element}</div>
                <div className="text-xs text-gray-500">Element</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-purple-600">{result.quality}</div>
                <div className="text-xs text-gray-500">Quality</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-amber-600">{result.rulingPlanet}</div>
                <div className="text-xs text-gray-500">Ruling Planet</div>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-2">All Zodiac Signs</div>
              <div className="grid grid-cols-4 gap-1 text-xs">
                {ZODIAC_SIGNS.map(z => (
                  <div key={z.sign} className={`p-1 rounded text-center ${z.sign === result.sign ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600'}`}>
                    {z.symbol} {z.sign}
                  </div>
                ))}
              </div>
            </div>

            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
