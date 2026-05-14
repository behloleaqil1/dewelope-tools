'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * EquinoxSolsticeDateFinder - Find equinox/solstice dates for a given year.
 */
export default function EquinoxSolsticeDateFinder({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [result, setResult] = useState<{ events: { name: string; date: string; description: string }[] } | null>(null);
  const [error, setError] = useState('');

  function calculate() {
    setError('');
    setResult(null);
    const y = parseInt(year);
    if (isNaN(y) || y < 1900 || y > 2100) { setError('Please enter a year between 1900 and 2100'); return; }

    // Meeus approximation for equinoxes and solstices
    const jde = (y - 2000) / 1000;

    // March equinox
    const marchJDE = 2451623.80984 + 365242.37404 * jde + 0.05169 * jde * jde;
    // June solstice
    const juneJDE = 2451716.56767 + 365241.62603 * jde + 0.00325 * jde * jde;
    // September equinox
    const septJDE = 2451810.21715 + 365242.01767 * jde - 0.11575 * jde * jde;
    // December solstice
    const decJDE = 2451900.05952 + 365242.74049 * jde - 0.06223 * jde * jde;

    function jdeToDate(jde: number): string {
      const jd = jde + 0.5;
      const z = Math.floor(jd);
      const a = z + 1 + Math.floor((z - 1867216.25) / 36524.25) - Math.floor((z - 1867216.25) / 36524.25 / 4);
      const b = a + 1524;
      const c = Math.floor((b - 122.1) / 365.25);
      const d = Math.floor(365.25 * c);
      const e = Math.floor((b - d) / 30.6001);
      const day = b - d - Math.floor(30.6001 * e);
      const month = e < 14 ? e - 1 : e - 13;
      const yr = month > 2 ? c - 4716 : c - 4715;
      return `${yr}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }

    setResult({
      events: [
        { name: 'Vernal Equinox', date: jdeToDate(marchJDE), description: 'Spring begins (Northern Hemisphere)' },
        { name: 'Summer Solstice', date: jdeToDate(juneJDE), description: 'Longest day (Northern Hemisphere)' },
        { name: 'Autumnal Equinox', date: jdeToDate(septJDE), description: 'Fall begins (Northern Hemisphere)' },
        { name: 'Winter Solstice', date: jdeToDate(decJDE), description: 'Shortest day (Northern Hemisphere)' },
      ],
    });
  }

  const copyText = result ? result.events.map(e => `${e.name}: ${e.date}`).join('\n') : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-year`} className="block text-sm font-medium text-gray-700 mb-1">Year</label>
        <input id={`${toolId}-year`} type="number" min="1900" max="2100" value={year} onChange={(e) => setYear(e.target.value)} aria-label={`Year for ${toolName}`} className="input-field w-32" />
      </InputArea>

      <button onClick={calculate} aria-label="Find equinox and solstice dates" className="btn-primary">Find Dates</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-2">
            {result.events.map((e, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div>
                  <div className="font-medium text-gray-800">{e.name}</div>
                  <div className="text-xs text-gray-500">{e.description}</div>
                </div>
                <div className="font-mono text-blue-600 font-bold">{e.date}</div>
              </div>
            ))}
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
