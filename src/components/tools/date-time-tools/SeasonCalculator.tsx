'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SeasonCalculator - Determine which season a date falls in (configurable hemisphere).
 */
export default function SeasonCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [hemisphere, setHemisphere] = useState<'north' | 'south'>('north');
  const [result, setResult] = useState<{
    season: string;
    emoji: string;
    startDate: string;
    endDate: string;
    daysIntoSeason: number;
    daysRemaining: number;
    nextSeason: string;
  } | null>(null);
  const [error, setError] = useState('');

  // Meteorological seasons (by month)
  const SEASONS_NORTH = [
    { name: 'Winter', emoji: '❄️', months: [12, 1, 2], start: '12-01', end: '02-28' },
    { name: 'Spring', emoji: '🌸', months: [3, 4, 5], start: '03-01', end: '05-31' },
    { name: 'Summer', emoji: '☀️', months: [6, 7, 8], start: '06-01', end: '08-31' },
    { name: 'Autumn', emoji: '🍂', months: [9, 10, 11], start: '09-01', end: '11-30' },
  ];

  const SEASONS_SOUTH = [
    { name: 'Summer', emoji: '☀️', months: [12, 1, 2], start: '12-01', end: '02-28' },
    { name: 'Autumn', emoji: '🍂', months: [3, 4, 5], start: '03-01', end: '05-31' },
    { name: 'Winter', emoji: '❄️', months: [6, 7, 8], start: '06-01', end: '08-31' },
    { name: 'Spring', emoji: '🌸', months: [9, 10, 11], start: '09-01', end: '11-30' },
  ];

  const calculate = () => {
    if (!date) { setError('Please select a date'); setResult(null); return; }
    setError('');

    const d = new Date(date + 'T00:00:00');
    const month = d.getMonth() + 1; // 1-12
    const year = d.getFullYear();

    const seasons = hemisphere === 'north' ? SEASONS_NORTH : SEASONS_SOUTH;
    const season = seasons.find(s => s.months.includes(month));
    if (!season) { setError('Could not determine season'); return; }

    // Calculate season start and end dates for this year
    let seasonStart: Date;
    let seasonEnd: Date;

    if (season.months.includes(12) && season.months.includes(1)) {
      // Winter/Summer crosses year boundary
      if (month === 12) {
        seasonStart = new Date(`${year}-12-01`);
        seasonEnd = new Date(`${year + 1}-02-28`);
      } else {
        seasonStart = new Date(`${year - 1}-12-01`);
        seasonEnd = new Date(`${year}-02-28`);
      }
      // Check for leap year
      if (new Date(seasonEnd.getFullYear(), 1, 29).getDate() === 29) {
        seasonEnd = new Date(`${seasonEnd.getFullYear()}-02-29`);
      }
    } else {
      const startMonth = String(season.months[0]).padStart(2, '0');
      const endMonth = String(season.months[2]).padStart(2, '0');
      seasonStart = new Date(`${year}-${startMonth}-01`);
      const lastDay = new Date(year, season.months[2], 0).getDate();
      seasonEnd = new Date(`${year}-${endMonth}-${lastDay}`);
    }

    const daysIntoSeason = Math.floor((d.getTime() - seasonStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const daysRemaining = Math.floor((seasonEnd.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));

    const currentIdx = seasons.indexOf(season);
    const nextSeason = seasons[(currentIdx + 1) % 4].name;

    setResult({
      season: season.name,
      emoji: season.emoji,
      startDate: seasonStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      endDate: seasonEnd.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      daysIntoSeason,
      daysRemaining,
      nextSeason,
    });
  };

  const copyText = result
    ? `Date: ${date}\nHemisphere: ${hemisphere === 'north' ? 'Northern' : 'Southern'}\nSeason: ${result.season} ${result.emoji}\nSeason Period: ${result.startDate} – ${result.endDate}\nDays into season: ${result.daysIntoSeason}\nDays remaining: ${result.daysRemaining}\nNext season: ${result.nextSeason}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">
          Select a Date
        </label>
        <input
          id={`${toolId}-date`}
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          aria-label={`Date input for ${toolName}`}
          className="input-field"
        />
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">Hemisphere</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`${toolId}-hemisphere`}
                value="north"
                checked={hemisphere === 'north'}
                onChange={() => setHemisphere('north')}
                className="text-blue-600"
              />
              <span className="text-sm text-gray-700">🌍 Northern</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`${toolId}-hemisphere`}
                value="south"
                checked={hemisphere === 'south'}
                onChange={() => setHemisphere('south')}
                className="text-blue-600"
              />
              <span className="text-sm text-gray-700">🌏 Southern</span>
            </label>
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} aria-label="Determine season" className="btn-primary">
        Determine Season
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
              <div className="text-4xl mb-2">{result.emoji}</div>
              <div className="text-2xl font-bold text-gray-800">{result.season}</div>
              <div className="text-sm text-gray-500 mt-1">{hemisphere === 'north' ? 'Northern' : 'Southern'} Hemisphere (Meteorological)</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.daysIntoSeason}</div>
                <div className="text-xs text-gray-500">Days into season</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.daysRemaining}</div>
                <div className="text-xs text-gray-500">Days remaining</div>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm text-gray-600">
              <div><span className="font-medium">Season period:</span> {result.startDate} – {result.endDate}</div>
              <div className="mt-1"><span className="font-medium">Next season:</span> {result.nextSeason}</div>
            </div>

            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
