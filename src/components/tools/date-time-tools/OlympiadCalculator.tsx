'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * OlympiadCalculator - Calculate which ancient Greek Olympiad a year falls in.
 * The first Olympiad began in 776 BCE, with each Olympiad lasting 4 years.
 */
export default function OlympiadCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [year, setYear] = useState('');
  const [era, setEra] = useState<'bce' | 'ce'>('bce');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const y = parseInt(year);
    if (isNaN(y) || y <= 0) {
      setOutput('Please enter a valid positive year number.');
      return;
    }

    // Convert to astronomical year (BCE years are negative, 1 BCE = 0)
    const astroYear = era === 'bce' ? -(y - 1) : y;

    // First Olympiad: 776 BCE = astronomical year -775
    const firstOlympiadYear = -775;

    if (astroYear < firstOlympiadYear) {
      setOutput(`The year ${y} ${era.toUpperCase()} is before the first Olympiad (776 BCE).`);
      return;
    }

    // Last ancient Olympics: 393 CE (abolished by Theodosius I)
    const lastAncientYear = 393;
    const isAncient = astroYear <= lastAncientYear;

    // Calculate Olympiad number (1-indexed)
    const yearsSinceFirst = astroYear - firstOlympiadYear;
    const olympiadNumber = Math.floor(yearsSinceFirst / 4) + 1;
    const yearInOlympiad = (yearsSinceFirst % 4) + 1;

    // Calculate the start year of this Olympiad
    const olympiadStartAstro = firstOlympiadYear + (olympiadNumber - 1) * 4;
    const olympiadEndAstro = olympiadStartAstro + 3;

    const formatYear = (astro: number): string => {
      if (astro <= 0) return `${Math.abs(astro) + 1} BCE`;
      return `${astro} CE`;
    };

    const lines = [
      '═══ Ancient Greek Olympiad Calculator ═══',
      '',
      `Input Year: ${y} ${era.toUpperCase()}`,
      '',
      '── Olympiad Result ──',
      `  Olympiad Number: ${olympiadNumber}`,
      `  Year within Olympiad: ${yearInOlympiad} of 4`,
      `  Olympiad Period: ${formatYear(olympiadStartAstro)} – ${formatYear(olympiadEndAstro)}`,
      '',
      `  Status: ${isAncient ? '🏛️ Ancient Olympic period (776 BCE – 393 CE)' : '📜 Post-ancient period (after 393 CE)'}`,
      '',
      '── Historical Context ──',
      `  Years since first Olympiad: ${yearsSinceFirst}`,
      `  Total Olympiads elapsed: ${olympiadNumber - 1} complete`,
    ];

    if (yearInOlympiad === 1) {
      lines.push('  🏆 This is an Olympic Games year!');
    } else {
      lines.push(`  Next Games: Year 1 of Olympiad ${olympiadNumber + 1} (${formatYear(olympiadEndAstro + 1)})`);
    }

    lines.push(
      '',
      '── Reference ──',
      '  • 1st Olympiad: 776 BCE (traditional founding)',
      '  • Games held every 4 years at Olympia',
      '  • Last ancient games: ~393 CE (Olympiad 293)',
      '  • Named after the sanctuary of Zeus at Olympia',
      `  • Greek notation: OL. ${olympiadNumber}, ${yearInOlympiad}`,
    );

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-year`} className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <input
                id={`${toolId}-year`}
                type="number"
                min="1"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g. 490"
                className="input-field"
                aria-label={`Year for ${toolName}`}
              />
            </div>
            <div>
              <label htmlFor={`${toolId}-era`} className="block text-sm font-medium text-gray-700 mb-1">
                Era
              </label>
              <select
                id={`${toolId}-era`}
                value={era}
                onChange={(e) => setEra(e.target.value as 'bce' | 'ce')}
                className="input-field"
                aria-label="Era selection"
              >
                <option value="bce">BCE (Before Common Era)</option>
                <option value="ce">CE (Common Era)</option>
              </select>
            </div>
          </div>
          <button onClick={calculate} className="btn-primary" aria-label="Calculate Olympiad">
            Calculate Olympiad
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Olympiad Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
