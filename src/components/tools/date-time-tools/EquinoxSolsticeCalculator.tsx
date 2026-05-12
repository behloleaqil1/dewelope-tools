'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * EquinoxSolsticeCalculator - Calculate dates of equinoxes and solstices for any year.
 * Uses the Meeus algorithm for approximate equinox/solstice dates.
 */
export default function EquinoxSolsticeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ vernalEquinox: string; summerSolstice: string; autumnalEquinox: string; winterSolstice: string } | null>(null);

  function calculateJDE(y: number, type: 'spring' | 'summer' | 'autumn' | 'winter'): number {
    const Y = (y - 2000) / 1000;
    switch (type) {
      case 'spring':
        return 2451623.80984 + 365242.37404 * Y + 0.05169 * Y * Y - 0.00411 * Y * Y * Y - 0.00057 * Y * Y * Y * Y;
      case 'summer':
        return 2451716.56767 + 365241.62603 * Y + 0.00325 * Y * Y + 0.00888 * Y * Y * Y - 0.00030 * Y * Y * Y * Y;
      case 'autumn':
        return 2451810.21715 + 365242.01767 * Y - 0.11575 * Y * Y + 0.00337 * Y * Y * Y + 0.00078 * Y * Y * Y * Y;
      case 'winter':
        return 2451900.05952 + 365242.74049 * Y - 0.06223 * Y * Y - 0.00823 * Y * Y * Y + 0.00032 * Y * Y * Y * Y;
    }
  }

  function jdeToDate(jde: number): Date {
    const z = Math.floor(jde + 0.5);
    const f = jde + 0.5 - z;
    let a: number;
    if (z < 2299161) {
      a = z;
    } else {
      const alpha = Math.floor((z - 1867216.25) / 36524.25);
      a = z + 1 + alpha - Math.floor(alpha / 4);
    }
    const b = a + 1524;
    const c = Math.floor((b - 122.1) / 365.25);
    const d = Math.floor(365.25 * c);
    const e = Math.floor((b - d) / 30.6001);

    const day = b - d - Math.floor(30.6001 * e) + f;
    const month = e < 14 ? e - 1 : e - 13;
    const yr = month > 2 ? c - 4716 : c - 4715;

    const dayInt = Math.floor(day);
    const hours = (day - dayInt) * 24;
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);

    return new Date(yr, month - 1, dayInt, h, m);
  }

  function formatDate(date: Date): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const d = date.getDate();
    const mon = months[date.getMonth()];
    const h = date.getHours().toString().padStart(2, '0');
    const min = date.getMinutes().toString().padStart(2, '0');
    return `${mon} ${d}, ${date.getFullYear()} ~${h}:${min} UTC`;
  }

  const calculate = () => {
    setError('');
    setResult(null);
    const y = parseInt(year);
    if (!year.trim() || isNaN(y) || y < 1 || y > 3000) {
      setError('Enter a valid year between 1 and 3000');
      return;
    }

    const spring = jdeToDate(calculateJDE(y, 'spring'));
    const summer = jdeToDate(calculateJDE(y, 'summer'));
    const autumn = jdeToDate(calculateJDE(y, 'autumn'));
    const winter = jdeToDate(calculateJDE(y, 'winter'));

    setResult({
      vernalEquinox: formatDate(spring),
      summerSolstice: formatDate(summer),
      autumnalEquinox: formatDate(autumn),
      winterSolstice: formatDate(winter),
    });
  };

  const copyText = result
    ? `Equinoxes & Solstices for ${year}:\nVernal Equinox: ${result.vernalEquinox}\nSummer Solstice: ${result.summerSolstice}\nAutumnal Equinox: ${result.autumnalEquinox}\nWinter Solstice: ${result.winterSolstice}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-year`} className="block text-sm font-medium text-gray-700 mb-1">
          Year
        </label>
        <input
          id={`${toolId}-year`}
          type="text"
          inputMode="numeric"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="e.g. 2024"
          aria-label={`Year for ${toolName}`}
          className="input-field w-40"
        />
      </InputArea>

      <button onClick={calculate} aria-label="Calculate equinoxes and solstices" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="text-xs text-gray-500 mb-1">🌱 Vernal Equinox (Spring)</div>
                <div className="text-lg font-bold text-green-600">{result.vernalEquinox}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="text-xs text-gray-500 mb-1">☀️ Summer Solstice</div>
                <div className="text-lg font-bold text-yellow-600">{result.summerSolstice}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="text-xs text-gray-500 mb-1">🍂 Autumnal Equinox (Fall)</div>
                <div className="text-lg font-bold text-orange-600">{result.autumnalEquinox}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="text-xs text-gray-500 mb-1">❄️ Winter Solstice</div>
                <div className="text-lg font-bold text-blue-600">{result.winterSolstice}</div>
              </div>
            </div>
            <p className="text-xs text-gray-500">Dates are approximate (Northern Hemisphere). Based on the Meeus algorithm.</p>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
