'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * DateFormatter - Formats dates in various patterns (ISO, US, EU, custom).
 * Accepts date input and shows multiple format outputs.
 */
export default function DateFormatter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [dateInput, setDateInput] = useState('');
  const [results, setResults] = useState<{ label: string; value: string }[]>([]);
  const [error, setError] = useState('');

  const formatDate = () => {
    if (!dateInput.trim()) {
      setError('Please enter a date');
      setResults([]);
      return;
    }

    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      setError('Invalid date. Try formats like: 2024-01-15, Jan 15 2024, 01/15/2024');
      setResults([]);
      return;
    }

    setError('');

    const pad = (n: number) => n.toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    const monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const formats = [
      { label: 'ISO 8601', value: `${year}-${month}-${day}T${hours}:${minutes}:${seconds}` },
      { label: 'ISO Date', value: `${year}-${month}-${day}` },
      { label: 'US Format', value: `${month}/${day}/${year}` },
      { label: 'EU Format', value: `${day}/${month}/${year}` },
      { label: 'Long US', value: `${monthNames[date.getMonth()]} ${date.getDate()}, ${year}` },
      { label: 'Long EU', value: `${date.getDate()} ${monthNames[date.getMonth()]} ${year}` },
      { label: 'Short', value: `${monthShort[date.getMonth()]} ${date.getDate()}, ${year}` },
      { label: 'With Day', value: `${dayNames[date.getDay()]}, ${monthNames[date.getMonth()]} ${date.getDate()}, ${year}` },
      { label: 'Unix Timestamp', value: Math.floor(date.getTime() / 1000).toString() },
      { label: 'RFC 2822', value: date.toUTCString() },
      { label: 'Dot Format', value: `${day}.${month}.${year}` },
      { label: 'Compact', value: `${year}${month}${day}` },
    ];

    setResults(formats);
  };

  const copyAll = results.map(r => `${r.label}: ${r.value}`).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter a date
        </label>
        <input
          id={`${toolId}-input`}
          type="text"
          value={dateInput}
          onChange={(e) => {
            setDateInput(e.target.value);
            if (error) setError('');
          }}
          placeholder="e.g. 2024-03-15, Mar 15 2024, 03/15/2024"
          aria-label={`Date input for ${toolName}`}
          className="input-field"
        />
        <p className="text-xs text-gray-500 mt-1">
          Accepts: YYYY-MM-DD, MM/DD/YYYY, Month Day Year, etc.
        </p>
      </InputArea>

      <button onClick={formatDate} aria-label="Format date" className="btn-primary">
        Format Date
      </button>

      <OutputArea hasContent={results.length > 0}>
        {results.length > 0 && (
          <div className="space-y-2">
            <div className="grid grid-cols-1 gap-2">
              {results.map((r) => (
                <div key={r.label} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg border border-gray-200">
                  <span className="text-sm text-gray-600 font-medium">{r.label}</span>
                  <span className="text-sm font-mono text-gray-800">{r.value}</span>
                </div>
              ))}
            </div>
            <CopyToClipboard text={copyAll} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
