'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * DateFormatConverter - Convert dates between formats (US, EU, ISO, etc.).
 * Parses a date string and displays it in multiple common formats.
 */
export default function DateFormatConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<{ formats: { label: string; value: string }[] } | null>(null);
  const [error, setError] = useState('');

  const convert = () => {
    setError('');
    if (!input.trim()) {
      setError('Please enter a date.');
      setOutput(null);
      return;
    }

    const date = new Date(input.trim());
    if (isNaN(date.getTime())) {
      // Try parsing common formats manually
      const parts = input.trim().match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2,4})$/);
      if (parts) {
        const [, a, b, c] = parts;
        const year = c.length === 2 ? 2000 + parseInt(c) : parseInt(c);
        // Try MM/DD/YYYY first
        const tryDate = new Date(year, parseInt(a) - 1, parseInt(b));
        if (!isNaN(tryDate.getTime())) {
          generateFormats(tryDate);
          return;
        }
        // Try DD/MM/YYYY
        const tryDate2 = new Date(year, parseInt(b) - 1, parseInt(a));
        if (!isNaN(tryDate2.getTime())) {
          generateFormats(tryDate2);
          return;
        }
      }
      setError('Could not parse date. Try formats like: 2024-01-15, 01/15/2024, January 15 2024');
      setOutput(null);
      return;
    }

    generateFormats(date);
  };

  const generateFormats = (date: Date) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const y = date.getFullYear();
    const m = pad(date.getMonth() + 1);
    const d = pad(date.getDate());
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const formats = [
      { label: 'ISO 8601', value: `${y}-${m}-${d}` },
      { label: 'US (MM/DD/YYYY)', value: `${m}/${d}/${y}` },
      { label: 'EU (DD/MM/YYYY)', value: `${d}/${m}/${y}` },
      { label: 'EU Dot (DD.MM.YYYY)', value: `${d}.${m}.${y}` },
      { label: 'Long US', value: `${monthNames[date.getMonth()]} ${date.getDate()}, ${y}` },
      { label: 'Long EU', value: `${date.getDate()} ${monthNames[date.getMonth()]} ${y}` },
      { label: 'Short', value: `${monthShort[date.getMonth()]} ${date.getDate()}, ${y}` },
      { label: 'With Day', value: `${dayNames[date.getDay()]}, ${monthNames[date.getMonth()]} ${date.getDate()}, ${y}` },
      { label: 'YYYY/MM/DD', value: `${y}/${m}/${d}` },
      { label: 'DD-MMM-YYYY', value: `${d}-${monthShort[date.getMonth()]}-${y}` },
    ];

    setOutput({ formats });
  };

  const copyText = output ? output.formats.map((f) => `${f.label}: ${f.value}`).join('\n') : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter a date
        </label>
        <input
          id={`${toolId}-input`}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="2024-01-15, 01/15/2024, January 15 2024..."
          aria-label={`Date input for ${toolName}`}
          className="input-field font-mono"
        />
      </InputArea>

      <button onClick={convert} className="btn-primary">Convert Date</button>

      <OutputArea hasContent={output !== null}>
        {output && (
          <div className="space-y-3">
            <div className="space-y-2">
              {output.formats.map((f, i) => (
                <div key={i} className="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-200">
                  <span className="text-sm text-gray-600">{f.label}</span>
                  <span className="text-sm font-mono font-medium text-gray-800">{f.value}</span>
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
