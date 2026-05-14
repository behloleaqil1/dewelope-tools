'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * LunarPhaseTracker - Calculate current moon phase for a given date.
 */
export default function LunarPhaseTracker({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<{ phase: string; illumination: number; age: number; emoji: string; nextFull: string } | null>(null);
  const [error, setError] = useState('');

  function calculate() {
    setError('');
    setResult(null);
    const d = new Date(date);
    if (isNaN(d.getTime())) { setError('Please enter a valid date'); return; }

    // Known new moon: January 6, 2000
    const knownNew = new Date(2000, 0, 6, 18, 14);
    const synodicMonth = 29.53058867; // days

    const daysSinceNew = (d.getTime() - knownNew.getTime()) / (1000 * 60 * 60 * 24);
    const age = ((daysSinceNew % synodicMonth) + synodicMonth) % synodicMonth;
    const fraction = age / synodicMonth;

    // Illumination (approximate)
    const illumination = Math.round((1 - Math.cos(2 * Math.PI * fraction)) / 2 * 100);

    // Phase name
    let phase: string;
    let emoji: string;
    if (age < 1.85) { phase = 'New Moon'; emoji = '🌑'; }
    else if (age < 7.38) { phase = 'Waxing Crescent'; emoji = '🌒'; }
    else if (age < 9.23) { phase = 'First Quarter'; emoji = '🌓'; }
    else if (age < 14.77) { phase = 'Waxing Gibbous'; emoji = '🌔'; }
    else if (age < 16.61) { phase = 'Full Moon'; emoji = '🌕'; }
    else if (age < 22.15) { phase = 'Waning Gibbous'; emoji = '🌖'; }
    else if (age < 24.0) { phase = 'Last Quarter'; emoji = '🌗'; }
    else if (age < 27.68) { phase = 'Waning Crescent'; emoji = '🌘'; }
    else { phase = 'New Moon'; emoji = '🌑'; }

    // Next full moon
    const daysToFull = age < 14.77 ? 14.77 - age : synodicMonth - age + 14.77;
    const nextFullDate = new Date(d.getTime() + daysToFull * 24 * 60 * 60 * 1000);
    const nextFull = nextFullDate.toISOString().split('T')[0];

    setResult({ phase, illumination, age: Math.round(age * 100) / 100, emoji, nextFull });
  }

  const copyText = result ? `Date: ${date}\nPhase: ${result.phase} ${result.emoji}\nIllumination: ${result.illumination}%\nMoon Age: ${result.age} days\nNext Full Moon: ${result.nextFull}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <input id={`${toolId}-date`} type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label={`Date for ${toolName}`} className="input-field w-48" />
      </InputArea>

      <button onClick={calculate} aria-label="Calculate lunar phase" className="btn-primary">Calculate Phase</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-900 p-6 rounded-lg text-center">
              <div className="text-5xl">{result.emoji}</div>
              <div className="text-xl font-bold text-white mt-2">{result.phase}</div>
              <div className="text-sm text-gray-300 mt-1">{result.illumination}% illuminated</div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <div className="text-xs text-gray-500">Moon Age</div>
                <div className="font-mono font-medium">{result.age} days</div>
              </div>
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <div className="text-xs text-gray-500">Next Full Moon</div>
                <div className="font-mono font-medium">{result.nextFull}</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
