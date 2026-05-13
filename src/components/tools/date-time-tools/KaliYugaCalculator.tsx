'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * KaliYugaCalculator - Calculate position in the Hindu Kali Yuga cycle.
 * Computes elapsed time, remaining time, and percentage through the current age.
 */
export default function KaliYugaCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [day, setDay] = useState(new Date().getDate().toString());
  const [output, setOutput] = useState('');

  const calculate = () => {
    const y = parseInt(year);
    const m = parseInt(month);
    const d = parseInt(day);

    if (isNaN(y) || isNaN(m) || isNaN(d)) {
      setOutput('Please enter a valid date.');
      return;
    }

    // Kali Yuga started on February 17/18, 3102 BCE (Julian calendar)
    // Duration of Kali Yuga: 432,000 years
    const _kaliYugaStart = -3101; // 3102 BCE in astronomical year numbering
    const kaliYugaDuration = 432000; // years

    // Calculate Kali Yuga year
    // The Kali Yuga epoch is considered to start at 3102 BCE
    let kaliYear = y + 3101;
    if (y <= 0) {
      kaliYear = y + 3102; // Adjust for no year 0 in BCE/CE
    }

    // Adjust for months (Kali Yuga new year is around mid-February)
    if (m < 2 || (m === 2 && d < 18)) {
      kaliYear -= 1;
    }

    const elapsed = kaliYear;
    const remaining = kaliYugaDuration - elapsed;
    const percentComplete = (elapsed / kaliYugaDuration) * 100;

    // Four Yugas cycle (Maha Yuga = 4,320,000 years)
    const satyaYugaDuration = 1728000;
    const tretaYugaDuration = 1296000;
    const dvaparaYugaDuration = 864000;
    const mahaYugaDuration = satyaYugaDuration + tretaYugaDuration + dvaparaYugaDuration + kaliYugaDuration;

    // Day of Brahma calculation (Kalpa = 4.32 billion years)
    const kalpaDuration = 4320000000;
    // Current position in Brahma's day (we are in the 28th Maha Yuga of the 7th Manvantara)
    const currentManvantara = 7;
    const currentMahaYuga = 28;

    let result = '=== Kali Yuga Position Calculator ===\n\n';
    result += `--- Input Date ---\n`;
    result += `Gregorian Date:          ${y} CE, ${m}/${d}\n\n`;

    result += `--- Kali Yuga Status ---\n`;
    result += `Kali Yuga Year:          ${elapsed.toLocaleString()}\n`;
    result += `Years Elapsed:           ${elapsed.toLocaleString()} years\n`;
    result += `Years Remaining:         ${remaining.toLocaleString()} years\n`;
    result += `Total Duration:          ${kaliYugaDuration.toLocaleString()} years\n`;
    result += `Progress:                ${percentComplete.toFixed(4)}%\n`;
    result += `Started:                 3102 BCE (February 17/18)\n`;
    result += `Ends:                    ${(kaliYugaDuration - 3101).toLocaleString()} CE\n\n`;

    result += `--- Four Yugas (Ages) ---\n`;
    result += `Satya Yuga (Golden):     ${satyaYugaDuration.toLocaleString()} years\n`;
    result += `Treta Yuga (Silver):     ${tretaYugaDuration.toLocaleString()} years\n`;
    result += `Dvapara Yuga (Bronze):   ${dvaparaYugaDuration.toLocaleString()} years\n`;
    result += `Kali Yuga (Iron):        ${kaliYugaDuration.toLocaleString()} years ← Current\n`;
    result += `Maha Yuga (Full Cycle):  ${mahaYugaDuration.toLocaleString()} years\n\n`;

    result += `--- Cosmic Context ---\n`;
    result += `Current Manvantara:      ${currentManvantara}th (Vaivasvata)\n`;
    result += `Current Maha Yuga:       ${currentMahaYuga}th of 71\n`;
    result += `Kalpa Duration:          ${(kalpaDuration / 1e9).toFixed(2)} billion years\n`;
    result += `Current Kalpa:           Shveta-Varaha\n\n`;

    result += `--- Characteristics of Kali Yuga ---\n`;
    result += `• Shortest of the four ages (1/10 of Maha Yuga)\n`;
    result += `• Known as the Age of Darkness or Age of Vice\n`;
    result += `• Dharma stands on one leg (vs four in Satya Yuga)\n`;
    result += `• Human lifespan: ~100 years (vs 100,000 in Satya)\n`;
    result += `• Virtue diminishes by 1/4 compared to each prior age\n`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor={`${toolId}-year`} className="block text-sm font-medium text-gray-700 mb-1">Year (CE)</label>
              <input id={`${toolId}-year`} type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="2024" className="input-field" aria-label={`Year for ${toolName}`} />
            </div>
            <div>
              <label htmlFor={`${toolId}-month`} className="block text-sm font-medium text-gray-700 mb-1">Month</label>
              <input id={`${toolId}-month`} type="number" min="1" max="12" value={month} onChange={(e) => setMonth(e.target.value)} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-day`} className="block text-sm font-medium text-gray-700 mb-1">Day</label>
              <input id={`${toolId}-day`} type="number" min="1" max="31" value={day} onChange={(e) => setDay(e.target.value)} className="input-field" />
            </div>
          </div>
          <button onClick={calculate} className="btn-primary">Calculate Kali Yuga Position</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Kali Yuga Analysis</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
