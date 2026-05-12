'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * HumanEraCalendar - Convert dates to Holocene/Human Era calendar (add 10000 years).
 * The Holocene Era (HE) adds 10,000 years to the Gregorian calendar to represent
 * the approximate start of human civilization.
 */
export default function HumanEraCalendar({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [dateInput, setDateInput] = useState('');
  const [result, setResult] = useState<{
    gregorian: string;
    holocene: string;
    heYear: number;
    ceYear: number;
    dayOfYear: number;
    daysInYear: number;
    era: string;
    explanation: string;
  } | null>(null);
  const [error, setError] = useState('');

  const convert = () => {
    setError('');
    setResult(null);

    if (!dateInput) {
      setError('Please select a date');
      return;
    }

    const date = new Date(dateInput + 'T00:00:00');
    if (isNaN(date.getTime())) {
      setError('Invalid date');
      return;
    }

    const ceYear = date.getFullYear();
    const heYear = ceYear + 10000;
    const month = date.toLocaleString('en-US', { month: 'long' });
    const day = date.getDate();

    const startOfYear = new Date(ceYear, 0, 1);
    const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / 86400000) + 1;
    const isLeap = (ceYear % 4 === 0 && ceYear % 100 !== 0) || ceYear % 400 === 0;
    const daysInYear = isLeap ? 366 : 365;

    const gregorian = `${month} ${day}, ${ceYear} CE`;
    const holocene = `${month} ${day}, ${heYear} HE`;

    const era = ceYear < 0 ? 'BCE' : 'CE';
    const explanation = `The Holocene Era (HE) adds 10,000 years to the Gregorian year. This places the approximate beginning of human civilization (the Neolithic Revolution, ~10,000 BCE) at year 1 HE, making all of recorded human history fit within a single continuous calendar.`;

    setResult({ gregorian, holocene, heYear, ceYear, dayOfYear, daysInYear, era, explanation });
  };

  const today = () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    setDateInput(`${yyyy}-${mm}-${dd}`);
  };

  const copyText = result
    ? `Gregorian: ${result.gregorian}\nHolocene Era: ${result.holocene}\n\nCE Year: ${result.ceYear}\nHE Year: ${result.heYear}\nDay of Year: ${result.dayOfYear}/${result.daysInYear}\n\n${result.explanation}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">
          Select Date
        </label>
        <div className="flex gap-2">
          <input
            id={`${toolId}-date`}
            type="date"
            value={dateInput}
            onChange={(e) => { setDateInput(e.target.value); if (error) setError(''); }}
            aria-label={`Date input for ${toolName}`}
            className="input-field flex-1"
          />
          <button onClick={today} className="px-3 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300" aria-label="Use today's date">
            Today
          </button>
        </div>
      </InputArea>

      <button onClick={convert} className="btn-primary" aria-label="Convert to Human Era">
        Convert to Human Era
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-sm text-gray-500 mb-1">Gregorian Calendar</div>
                <div className="text-lg font-bold text-gray-800">{result.gregorian}</div>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 text-center">
                <div className="text-sm text-amber-600 mb-1">Holocene / Human Era</div>
                <div className="text-lg font-bold text-amber-800">{result.holocene}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-800">{result.ceYear}</div>
                <div className="text-xs text-gray-500">CE Year</div>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-center">
                <div className="text-xl font-bold text-amber-700">{result.heYear}</div>
                <div className="text-xs text-amber-600">HE Year</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-800">{result.dayOfYear}/{result.daysInYear}</div>
                <div className="text-xs text-gray-500">Day of Year</div>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">{result.explanation}</p>
            </div>

            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
