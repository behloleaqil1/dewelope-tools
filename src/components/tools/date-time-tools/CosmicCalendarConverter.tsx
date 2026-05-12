'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CosmicCalendarConverter - Map Earth's history to a single calendar year.
 * Converts billions of years ago to a date on the Cosmic Calendar (Carl Sagan's concept).
 * The Big Bang is January 1, and the present is December 31 at midnight.
 */
export default function CosmicCalendarConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [yearsAgo, setYearsAgo] = useState('');
  const [output, setOutput] = useState('');

  const AGE_OF_UNIVERSE = 13.8e9; // 13.8 billion years

  const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  const MILESTONES = [
    { yearsAgo: 13.8e9, event: 'Big Bang' },
    { yearsAgo: 13.0e9, event: 'First galaxies form' },
    { yearsAgo: 9.2e9, event: 'Milky Way forms' },
    { yearsAgo: 4.6e9, event: 'Solar System forms' },
    { yearsAgo: 4.5e9, event: 'Earth forms' },
    { yearsAgo: 3.8e9, event: 'First life on Earth' },
    { yearsAgo: 2.4e9, event: 'Great Oxidation Event' },
    { yearsAgo: 540e6, event: 'Cambrian Explosion' },
    { yearsAgo: 230e6, event: 'First dinosaurs' },
    { yearsAgo: 66e6, event: 'Dinosaur extinction' },
    { yearsAgo: 6e6, event: 'First hominids' },
    { yearsAgo: 200000, event: 'Homo sapiens appear' },
    { yearsAgo: 10000, event: 'Agriculture begins' },
  ];

  const yearsAgoToCosmicDate = (ya: number): { month: string; day: number; time: string } => {
    const fractionOfYear = 1 - (ya / AGE_OF_UNIVERSE);
    const totalDays = fractionOfYear * 365;

    let dayCount = Math.floor(totalDays);
    if (dayCount < 0) dayCount = 0;
    if (dayCount > 364) dayCount = 364;

    let month = 0;
    let remaining = dayCount;
    for (let i = 0; i < 12; i++) {
      if (remaining < DAYS_IN_MONTH[i]) {
        month = i;
        break;
      }
      remaining -= DAYS_IN_MONTH[i];
    }

    const day = remaining + 1;
    const fractionalDay = totalDays - Math.floor(totalDays);
    const totalSeconds = fractionalDay * 86400;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    return { month: MONTH_NAMES[month], day, time };
  };

  const calculate = () => {
    const ya = parseFloat(yearsAgo);

    if (isNaN(ya) || ya < 0) {
      setOutput('Please enter a valid number of years ago (0 or greater).');
      return;
    }

    if (ya > AGE_OF_UNIVERSE) {
      setOutput(`Value exceeds the age of the universe (${AGE_OF_UNIVERSE / 1e9} billion years).`);
      return;
    }

    const date = yearsAgoToCosmicDate(ya);
    const results: string[] = [];

    results.push(`Input: ${ya >= 1e9 ? (ya / 1e9).toFixed(2) + ' billion' : ya >= 1e6 ? (ya / 1e6).toFixed(2) + ' million' : ya.toLocaleString()} years ago`);
    results.push(``);
    results.push(`Cosmic Calendar Date: ${date.month} ${date.day}, ~${date.time}`);
    results.push(`(If the universe's history were compressed into one year)`);
    results.push(``);
    results.push(`═══ Reference Milestones ═══`);
    results.push(``);

    MILESTONES.forEach((m) => {
      const d = yearsAgoToCosmicDate(m.yearsAgo);
      const label = m.yearsAgo >= 1e9 ? `${(m.yearsAgo / 1e9).toFixed(1)}B` : m.yearsAgo >= 1e6 ? `${(m.yearsAgo / 1e6).toFixed(0)}M` : `${(m.yearsAgo / 1000).toFixed(0)}K`;
      results.push(`${d.month.padEnd(10)} ${String(d.day).padStart(2)}  ${label.padStart(6)} ya  ${m.event}`);
    });

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-years`} className="block text-sm font-medium text-gray-700 mb-1">
              Years Ago
            </label>
            <input
              id={`${toolId}-years`}
              type="number"
              value={yearsAgo}
              onChange={(e) => setYearsAgo(e.target.value)}
              placeholder="e.g. 4600000000 (4.6 billion)"
              aria-label={`Years ago input for ${toolName}`}
              className="input-field"
              min="0"
              step="any"
            />
            <p className="text-xs text-gray-500 mt-1">Enter years ago (e.g., 4600000000 for Earth&apos;s formation, 66000000 for dinosaur extinction)</p>
          </div>
          <button onClick={calculate} className="btn-primary w-full">Convert to Cosmic Calendar</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Cosmic Calendar</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
