'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

// Known solar eclipses (2024-2030) with type and visibility
const SOLAR_ECLIPSES = [
  { date: '2024-04-08', type: 'Total', region: 'North America (Mexico, USA, Canada)' },
  { date: '2024-10-02', type: 'Annular', region: 'South America (Chile, Argentina)' },
  { date: '2025-03-29', type: 'Partial', region: 'Europe, North Africa, Russia' },
  { date: '2025-09-21', type: 'Partial', region: 'South Pacific, New Zealand, Antarctica' },
  { date: '2026-02-17', type: 'Annular', region: 'Antarctica, South America' },
  { date: '2026-08-12', type: 'Total', region: 'Arctic, Greenland, Iceland, Spain' },
  { date: '2027-02-06', type: 'Annular', region: 'South America, Africa' },
  { date: '2027-08-02', type: 'Total', region: 'North Africa, Middle East, India' },
  { date: '2028-01-26', type: 'Annular', region: 'South America, Atlantic' },
  { date: '2028-07-22', type: 'Total', region: 'Australia, New Zealand, South Pacific' },
  { date: '2029-01-14', type: 'Partial', region: 'North America, Central America' },
  { date: '2029-06-12', type: 'Partial', region: 'Arctic, Scandinavia, Russia' },
  { date: '2029-07-11', type: 'Partial', region: 'South America' },
  { date: '2029-12-05', type: 'Partial', region: 'Antarctica, South Pacific' },
  { date: '2030-06-01', type: 'Annular', region: 'North Africa, Europe, Russia' },
  { date: '2030-11-25', type: 'Total', region: 'Southern Africa, Indian Ocean, Australia' },
];

/**
 * SolarEclipseCalculator - Calculate approximate dates of solar eclipses.
 * Shows upcoming eclipses, next eclipse from a given date, and eclipse details.
 */
export default function SolarEclipseCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [dateInput, setDateInput] = useState(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<{
    nextEclipse: typeof SOLAR_ECLIPSES[0] | null;
    daysUntil: number | null;
    previousEclipse: typeof SOLAR_ECLIPSES[0] | null;
    daysSince: number | null;
    upcoming: typeof SOLAR_ECLIPSES;
  } | null>(null);

  function calculate() {
    const checkDate = new Date(dateInput + 'T12:00:00');

    let nextEclipse: typeof SOLAR_ECLIPSES[0] | null = null;
    let daysUntil: number | null = null;
    let previousEclipse: typeof SOLAR_ECLIPSES[0] | null = null;
    let daysSince: number | null = null;

    // Find next eclipse
    for (const eclipse of SOLAR_ECLIPSES) {
      const eclipseDate = new Date(eclipse.date + 'T12:00:00');
      if (eclipseDate >= checkDate) {
        nextEclipse = eclipse;
        daysUntil = Math.ceil((eclipseDate.getTime() - checkDate.getTime()) / (1000 * 60 * 60 * 24));
        break;
      }
    }

    // Find previous eclipse
    for (let i = SOLAR_ECLIPSES.length - 1; i >= 0; i--) {
      const eclipseDate = new Date(SOLAR_ECLIPSES[i].date + 'T12:00:00');
      if (eclipseDate < checkDate) {
        previousEclipse = SOLAR_ECLIPSES[i];
        daysSince = Math.ceil((checkDate.getTime() - eclipseDate.getTime()) / (1000 * 60 * 60 * 24));
        break;
      }
    }

    // Get upcoming eclipses from the selected date
    const upcoming = SOLAR_ECLIPSES.filter((e) => new Date(e.date + 'T12:00:00') >= checkDate).slice(0, 8);

    setResult({ nextEclipse, daysUntil, previousEclipse, daysSince, upcoming });
  }

  function formatDate(dateStr: string): string {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  }

  function getTypeColor(type: string): string {
    switch (type) {
      case 'Total': return 'text-red-600 bg-red-50 border-red-200';
      case 'Annular': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Partial': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  }

  const copyText = result
    ? `Solar Eclipse Information (from ${dateInput}):\n${result.nextEclipse ? `Next Eclipse: ${result.nextEclipse.date} (${result.nextEclipse.type}) - ${result.nextEclipse.region}\nDays until: ${result.daysUntil}` : 'No upcoming eclipses in database'}${result.previousEclipse ? `\nPrevious Eclipse: ${result.previousEclipse.date} (${result.previousEclipse.type}) - ${result.previousEclipse.region}\nDays since: ${result.daysSince}` : ''}`
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
          value={dateInput}
          onChange={(e) => setDateInput(e.target.value)}
          aria-label={`Date for ${toolName}`}
          className="input-field w-48"
        />
      </InputArea>

      <button onClick={calculate} aria-label="Calculate solar eclipses" className="btn-primary">
        Find Eclipses
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-4">
            {result.nextEclipse && (
              <div className="p-4 rounded-lg border-2 border-yellow-300 bg-yellow-50">
                <div className="text-center">
                  <div className="text-3xl mb-1">🌑</div>
                  <div className="text-lg font-bold text-gray-800">Next Solar Eclipse</div>
                  <div className="text-sm text-gray-700 mt-1">{formatDate(result.nextEclipse.date)}</div>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold border ${getTypeColor(result.nextEclipse.type)}`}>
                    {result.nextEclipse.type}
                  </span>
                  <div className="text-sm text-gray-600 mt-2">{result.nextEclipse.region}</div>
                  <div className="text-sm font-medium text-yellow-700 mt-1">{result.daysUntil} days away</div>
                </div>
              </div>
            )}

            {result.previousEclipse && (
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <strong>Previous eclipse:</strong> {formatDate(result.previousEclipse.date)} ({result.previousEclipse.type}) — {result.daysSince} days ago
                <br /><span className="text-xs">{result.previousEclipse.region}</span>
              </div>
            )}

            {result.upcoming.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Upcoming Solar Eclipses</h3>
                <div className="space-y-2">
                  {result.upcoming.map((eclipse, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded border border-gray-200">
                      <div>
                        <span className="font-medium text-gray-700">{formatDate(eclipse.date)}</span>
                        <span className="block text-xs text-gray-500">{eclipse.region}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getTypeColor(eclipse.type)}`}>
                        {eclipse.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
