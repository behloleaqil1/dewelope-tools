'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * IndictionCycleCalculator - Calculate 15-year Indiction cycle position.
 * The Indiction was a Roman tax cycle used for dating in medieval documents.
 */
export default function IndictionCycleCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [year, setYear] = useState('');
  const [era, setEra] = useState('CE');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const y = parseInt(year);

    if (isNaN(y) || y <= 0) {
      setOutput('Please enter a valid positive year.');
      return;
    }

    // Convert to astronomical year (BCE 1 = year 0, BCE 2 = year -1, etc.)
    const astroYear = era === 'BCE' ? -(y - 1) : y;

    // The Indiction cycle: position = ((year + 2) mod 15) + 1
    // This uses the Byzantine calculation starting from 312 CE
    // Standard formula: Indiction = (year + 3) mod 15, with 0 replaced by 15
    let indiction = (astroYear + 3) % 15;
    if (indiction <= 0) indiction += 15;

    // Calculate which full cycle this is (cycles counted from 312 CE)
    const yearsSince312 = astroYear - 312;
    const cycleNumber = Math.floor(yearsSince312 / 15) + 1;

    // Next indiction 1 (start of new cycle)
    const yearsInCurrentCycle = indiction;
    const yearsUntilNewCycle = 15 - yearsInCurrentCycle + 1;

    // Historical context
    let context = '';
    if (astroYear < 312) {
      context = 'Before the formal establishment of the Indiction by Constantine (312 CE). Retroactive calculation.';
    } else if (astroYear <= 476) {
      context = 'Roman Imperial period - Indiction used for tax assessment cycles.';
    } else if (astroYear <= 1453) {
      context = 'Medieval/Byzantine period - Indiction widely used for dating documents and charters.';
    } else if (astroYear <= 1806) {
      context = 'Post-Byzantine - Indiction still used in some ecclesiastical and legal documents.';
    } else {
      context = 'Modern era - Indiction is of historical and liturgical interest only.';
    }

    const lines = [
      '═══ Indiction Cycle Calculator ═══',
      '',
      `Year:        ${y} ${era}`,
      '',
      '── Results ──',
      `  Indiction Number:    ${indiction} of 15`,
      `  Cycle Number:        ${cycleNumber} (from 312 CE)`,
      `  Year in Cycle:       ${indiction}/15`,
      `  Next Cycle Start:    ${astroYear + yearsUntilNewCycle} CE (in ${yearsUntilNewCycle} year${yearsUntilNewCycle !== 1 ? 's' : ''})`,
      '',
      '── Visual Position ──',
      `  [${'█'.repeat(indiction)}${'░'.repeat(15 - indiction)}] ${indiction}/15`,
      '',
      '── Historical Context ──',
      `  ${context}`,
      '',
      '── About the Indiction ──',
      '• 15-year cycle established by Emperor Constantine in 312 CE.',
      '• Originally a Roman tax reassessment period.',
      '• Used extensively in medieval dating (e.g., papal bulls, charters).',
      '• Formula: Indiction = (Year + 3) mod 15 (0 → 15).',
      '• Three variants exist: Byzantine (Sep 1), Papal (Jan 1), Bedean (Sep 24).',
      '',
      '── Nearby Indictions ──',
      ...Array.from({ length: 5 }, (_, i) => {
        const offset = i - 2;
        const nearYear = astroYear + offset;
        let nearInd = (nearYear + 3) % 15;
        if (nearInd <= 0) nearInd += 15;
        const marker = offset === 0 ? ' ◄ current' : '';
        return `  ${nearYear > 0 ? nearYear + ' CE' : Math.abs(nearYear - 1) + ' BCE'}: Indiction ${nearInd}${marker}`;
      }),
    ];

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                placeholder="e.g. 2024"
                className="input-field"
                aria-label={`Year for ${toolName}`}
              />
            </div>
            <div>
              <label htmlFor={`${toolId}-era`} className="block text-sm font-medium text-gray-700 mb-1">
                Era
              </label>
              <select id={`${toolId}-era`} value={era} onChange={(e) => setEra(e.target.value)} className="input-field" aria-label="Era selection">
                <option value="CE">CE (Common Era)</option>
                <option value="BCE">BCE (Before Common Era)</option>
              </select>
            </div>
          </div>
          <button onClick={calculate} className="btn-primary" aria-label="Calculate Indiction">
            Calculate Indiction
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Indiction Cycle Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
