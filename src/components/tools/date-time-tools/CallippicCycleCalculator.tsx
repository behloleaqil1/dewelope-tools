'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CallippicCycleCalculator - Calculate Callippic cycle (76-year calendar cycle).
 * The Callippic cycle = 4 Metonic cycles = 76 years = 940 lunations.
 */
export default function CallippicCycleCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [referenceYear, setReferenceYear] = useState('');
  const [numCycles, setNumCycles] = useState('5');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const year = parseInt(referenceYear);
    const cycles = parseInt(numCycles);

    if (isNaN(year) || isNaN(cycles) || cycles < 1 || cycles > 50) {
      setOutput('Please enter a valid year and number of cycles (1-50).');
      return;
    }

    const CALLIPPIC_YEARS = 76;
    const CALLIPPIC_DAYS = 27759; // 76 years × 365.25 days - 1 day correction
    const LUNATIONS_PER_CYCLE = 940;
    const METONIC_CYCLES = 4;

    const lines = [
      '═══ Callippic Cycle Calculator ═══',
      '',
      `Reference Year: ${year}`,
      '',
      '── Callippic Cycle Facts ──',
      `  Duration: ${CALLIPPIC_YEARS} years`,
      `  Days: ${CALLIPPIC_DAYS} days`,
      `  Lunations: ${LUNATIONS_PER_CYCLE} synodic months`,
      `  Metonic Cycles: ${METONIC_CYCLES} per Callippic cycle`,
      `  Named after: Callippus of Cyzicus (c. 370–300 BC)`,
      '',
      '── Future Callippic Cycles ──',
    ];

    for (let i = 1; i <= cycles; i++) {
      const futureYear = year + (CALLIPPIC_YEARS * i);
      lines.push(`  Cycle +${i}: Year ${futureYear} (${CALLIPPIC_YEARS * i} years from reference)`);
    }

    lines.push('');
    lines.push('── Past Callippic Cycles ──');

    for (let i = 1; i <= cycles; i++) {
      const pastYear = year - (CALLIPPIC_YEARS * i);
      lines.push(`  Cycle -${i}: Year ${pastYear} (${CALLIPPIC_YEARS * i} years before reference)`);
    }

    lines.push('');
    lines.push('── Metonic Sub-Cycles ──');
    for (let i = 1; i <= METONIC_CYCLES; i++) {
      const metonicYear = year + (19 * i);
      lines.push(`  Metonic ${i}: Year ${metonicYear} (+${19 * i} years)`);
    }

    lines.push('');
    lines.push('── Historical Context ──');
    lines.push('• The Callippic cycle improves upon the Metonic cycle');
    lines.push('  by dropping 1 day every 4 Metonic cycles.');
    lines.push('• Used in ancient Greek astronomy for calendar corrections.');
    lines.push('• More accurate lunar-solar synchronization than Metonic alone.');

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-year`} className="block text-sm font-medium text-gray-700 mb-1">
              Reference Year
            </label>
            <input
              id={`${toolId}-year`}
              type="number"
              value={referenceYear}
              onChange={(e) => setReferenceYear(e.target.value)}
              placeholder="e.g. 2024"
              className="input-field"
              aria-label={`Reference year for ${toolName}`}
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-cycles`} className="block text-sm font-medium text-gray-700 mb-1">
              Number of Cycles to Calculate (1-50)
            </label>
            <input
              id={`${toolId}-cycles`}
              type="number"
              min="1"
              max="50"
              value={numCycles}
              onChange={(e) => setNumCycles(e.target.value)}
              className="input-field"
              aria-label="Number of cycles"
            />
          </div>
          <button onClick={calculate} className="btn-primary" aria-label="Calculate Callippic cycle">
            Calculate Callippic Cycle
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Callippic Cycle Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
