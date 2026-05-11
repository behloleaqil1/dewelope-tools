'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * DatePatternGenerator - Generates date strings in custom patterns.
 * Supports YYYY, YY, MM, DD, hh, mm, ss, and various separators.
 */

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fullMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function DatePatternGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [date, setDate] = useState('');
  const [pattern, setPattern] = useState('YYYY-MM-DD');
  const [customPattern, setCustomPattern] = useState('');
  const [output, setOutput] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const presetPatterns = [
    { label: 'ISO 8601', value: 'YYYY-MM-DD' },
    { label: 'US Format', value: 'MM/DD/YYYY' },
    { label: 'EU Format', value: 'DD/MM/YYYY' },
    { label: 'UK Format', value: 'DD-MM-YYYY' },
    { label: 'Year.Month.Day', value: 'YYYY.MM.DD' },
    { label: 'Full DateTime', value: 'YYYY-MM-DD hh:mm:ss' },
    { label: 'Compact', value: 'YYYYMMDD' },
    { label: 'Readable', value: 'DD MMM YYYY' },
    { label: 'US DateTime', value: 'MM/DD/YYYY hh:mm' },
    { label: 'Custom', value: 'custom' },
  ];

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const d = date ? new Date(date) : new Date();
      if (isNaN(d.getTime())) {
        setOutput('Invalid date');
        return;
      }

      const activePattern = pattern === 'custom' ? customPattern : pattern;
      if (!activePattern) { setOutput(''); return; }

      const pad = (n: number) => n.toString().padStart(2, '0');

      let result = activePattern;
      result = result.replace(/YYYY/g, d.getFullYear().toString());
      result = result.replace(/YY/g, d.getFullYear().toString().slice(-2));
      result = result.replace(/MMMM/g, fullMonths[d.getMonth()]);
      result = result.replace(/MMM/g, months[d.getMonth()]);
      result = result.replace(/MM/g, pad(d.getMonth() + 1));
      result = result.replace(/DD/g, pad(d.getDate()));
      result = result.replace(/hh/g, pad(d.getHours()));
      result = result.replace(/mm/g, pad(d.getMinutes()));
      result = result.replace(/ss/g, pad(d.getSeconds()));

      setOutput(result);
    }, 200);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [date, pattern, customPattern]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">
              Date (leave empty for today)
            </label>
            <input
              id={`${toolId}-date`}
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              aria-label={`Date input for ${toolName}`}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pattern</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {presetPatterns.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPattern(p.value)}
                  className={`px-3 py-2 text-xs rounded-lg border transition-colors ${
                    pattern === p.value
                      ? 'bg-blue-100 border-blue-400 text-blue-800'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  aria-label={`Select ${p.label} pattern`}
                >
                  <div className="font-medium">{p.label}</div>
                  {p.value !== 'custom' && <div className="font-mono text-gray-500 mt-0.5">{p.value}</div>}
                </button>
              ))}
            </div>
          </div>

          {pattern === 'custom' && (
            <div>
              <label htmlFor={`${toolId}-custom`} className="block text-sm font-medium text-gray-700 mb-1">
                Custom Pattern
              </label>
              <input
                id={`${toolId}-custom`}
                type="text"
                value={customPattern}
                onChange={(e) => setCustomPattern(e.target.value)}
                placeholder="e.g. YYYY/MM/DD hh:mm:ss"
                aria-label="Custom date pattern"
                className="input-field font-mono"
              />
              <p className="text-xs text-gray-500 mt-1">
                Tokens: YYYY, YY, MMMM, MMM, MM, DD, hh, mm, ss
              </p>
            </div>
          )}
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Formatted Date</label>
            <code className="block text-lg font-mono text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-200">{output}</code>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
