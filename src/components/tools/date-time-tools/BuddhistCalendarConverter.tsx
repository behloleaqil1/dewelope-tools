'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * BuddhistCalendarConverter - Convert between Gregorian and Buddhist Era (BE) calendar
 */
export default function BuddhistCalendarConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mode, setMode] = useState<'toBE' | 'toGregorian'>('toBE');
  const [dateInput, setDateInput] = useState('');
  const [yearInput, setYearInput] = useState('');
  const [result, setResult] = useState<{ gregorianYear: number; buddhistYear: number; fullDate: string; era: string } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function convert() {
    setError(undefined);
    setResult(null);

    if (mode === 'toBE') {
      if (!dateInput) { setError('Please select a date'); return; }
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) { setError('Invalid date'); return; }
      const gregorianYear = date.getFullYear();
      const buddhistYear = gregorianYear + 543;
      setResult({
        gregorianYear,
        buddhistYear,
        fullDate: date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        era: `B.E. ${buddhistYear}`,
      });
    } else {
      const beYear = parseInt(yearInput);
      if (isNaN(beYear) || beYear < 544) { setError('Buddhist Era year must be 544 or greater'); return; }
      const gregorianYear = beYear - 543;
      setResult({
        gregorianYear,
        buddhistYear: beYear,
        fullDate: `Year ${gregorianYear} CE`,
        era: `${gregorianYear} CE / AD`,
      });
    }
  }

  const copyText = result ? `Gregorian: ${result.gregorianYear} CE\nBuddhist Era: B.E. ${result.buddhistYear}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-mode`} className="block text-sm font-medium text-gray-700 mb-1">Conversion Direction</label>
        <select id={`${toolId}-mode`} value={mode} onChange={(e) => setMode(e.target.value as 'toBE' | 'toGregorian')} aria-label={`Conversion mode for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="toBE">Gregorian → Buddhist Era</option>
          <option value="toGregorian">Buddhist Era → Gregorian</option>
        </select>
        {mode === 'toBE' ? (
          <><label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Gregorian Date</label><input id={`${toolId}-date`} type="date" value={dateInput} onChange={(e) => setDateInput(e.target.value)} aria-label={`Gregorian date for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></>
        ) : (
          <><label htmlFor={`${toolId}-year`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Buddhist Era Year (B.E.)</label><input id={`${toolId}-year`} type="number" value={yearInput} onChange={(e) => setYearInput(e.target.value)} placeholder="e.g., 2567" aria-label={`Buddhist Era year for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></>
        )}
      </InputArea>

      <button onClick={convert} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Convert</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center"><div className="text-lg font-bold text-blue-600">{result.gregorianYear} CE</div><div className="text-xs text-gray-500">Gregorian</div></div>
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-center"><div className="text-lg font-bold text-yellow-600">B.E. {result.buddhistYear}</div><div className="text-xs text-gray-500">Buddhist Era</div></div>
            </div>
            <div className="text-sm text-gray-600">{result.fullDate}</div>
            <div className="text-xs text-gray-500">Buddhist Era = Gregorian Year + 543</div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
