'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SarosCycleCalculator - Calculate Saros eclipse cycle (18 years, 11 days, 8 hours).
 */
export default function SarosCycleCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [eclipseDate, setEclipseDate] = useState('');
  const [eclipseType, setEclipseType] = useState<'solar' | 'lunar'>('solar');
  const [cycles, setCycles] = useState('3');
  const [output, setOutput] = useState('');

  // Saros cycle: 6585.3211 days = 18 years, 11 days, 8 hours (or 10 days if 5 leap years)
  const SAROS_DAYS = 6585.3211;

  const calculate = () => {
    if (!eclipseDate) {
      setOutput('Please enter an eclipse date.');
      return;
    }

    const numCycles = parseInt(cycles) || 3;
    const startDate = new Date(eclipseDate);

    if (isNaN(startDate.getTime())) {
      setOutput('Please enter a valid date.');
      return;
    }

    const results: string[] = [
      `Eclipse Type: ${eclipseType === 'solar' ? 'Solar' : 'Lunar'}`,
      `Reference Date: ${startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
      ``,
      `Saros Cycle: 6585.3211 days`,
      `  ≈ 18 years, 11 days, 8 hours`,
      `  (or 18 years, 10 days, 8 hours if 5 leap years in interval)`,
      ``,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `Future Eclipses in this Saros Series:`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    ];

    for (let i = 1; i <= numCycles; i++) {
      const futureMs = startDate.getTime() + (SAROS_DAYS * i * 24 * 60 * 60 * 1000);
      const futureDate = new Date(futureMs);
      const yearsAhead = (SAROS_DAYS * i / 365.25).toFixed(1);
      results.push(`  Cycle +${i}: ${futureDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} (~${yearsAhead} years ahead)`);
    }

    results.push('');
    results.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    results.push(`Past Eclipses in this Saros Series:`);
    results.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    for (let i = 1; i <= numCycles; i++) {
      const pastMs = startDate.getTime() - (SAROS_DAYS * i * 24 * 60 * 60 * 1000);
      const pastDate = new Date(pastMs);
      const yearsBack = (SAROS_DAYS * i / 365.25).toFixed(1);
      results.push(`  Cycle -${i}: ${pastDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} (~${yearsBack} years ago)`);
    }

    results.push('');
    results.push(`Notes:`);
    results.push(`  • Each Saros series lasts ~1200-1500 years`);
    results.push(`  • Contains 69-87 eclipses per series`);
    results.push(`  • Eclipse shifts ~120° longitude each cycle`);
    results.push(`  • After 3 Saros cycles (Exeligmos, ~54 years), eclipse returns to similar longitude`);

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">Eclipse Date</label>
            <input id={`${toolId}-date`} type="date" value={eclipseDate} onChange={(e) => setEclipseDate(e.target.value)} className="input-field" aria-label={`Eclipse date for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">Eclipse Type</label>
            <select id={`${toolId}-type`} value={eclipseType} onChange={(e) => setEclipseType(e.target.value as 'solar' | 'lunar')} className="input-field" aria-label="Eclipse type">
              <option value="solar">Solar Eclipse</option>
              <option value="lunar">Lunar Eclipse</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-cycles`} className="block text-sm font-medium text-gray-700 mb-1">Number of Cycles</label>
            <input id={`${toolId}-cycles`} type="number" min="1" max="10" value={cycles} onChange={(e) => setCycles(e.target.value)} className="input-field" aria-label="Number of Saros cycles" />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate Saros Cycle</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Saros Cycle Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
