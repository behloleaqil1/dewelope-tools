'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MetonicCycleCalculator - Calculate Metonic cycle (19-year lunar cycle) position.
 * The Metonic cycle is the period after which lunar phases repeat on the same calendar dates.
 */
export default function MetonicCycleCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [output, setOutput] = useState('');

  const calculate = () => {
    const y = parseInt(year);
    if (isNaN(y) || y < 1 || y > 9999) {
      setOutput('Please enter a valid year (1-9999).');
      return;
    }

    // Golden Number = (year mod 19) + 1
    const goldenNumber = (y % 19) + 1;

    // Current position in the Metonic cycle (0-18)
    const cyclePosition = (y - 1) % 19;

    // Metonic cycle number
    const cycleNumber = Math.floor((y - 1) / 19) + 1;

    // Years until next cycle start
    const yearsRemaining = 19 - cyclePosition;

    // Next cycle start year
    const nextCycleStart = y + yearsRemaining;

    // Previous cycle start
    const currentCycleStart = y - cyclePosition;

    // Determine if this is a leap year in the Metonic cycle
    // In the Hebrew calendar, years 3, 6, 8, 11, 14, 17, 19 of the cycle are leap years
    const leapYears = [3, 6, 8, 11, 14, 17, 19];
    const isMetonicLeap = leapYears.includes(goldenNumber);

    // Epact calculation (simplified Julian epact)
    const epact = (11 * (goldenNumber - 1)) % 30;

    const results = [
      `═══ Metonic Cycle Calculator ═══`,
      ``,
      `Year: ${y}`,
      ``,
      `Metonic Cycle Position:`,
      `  Golden Number: ${goldenNumber} (of 19)`,
      `  Position in cycle: Year ${cyclePosition + 1} of 19`,
      `  Cycle number: ${cycleNumber} (since year 1)`,
      ``,
      `Cycle Boundaries:`,
      `  Current cycle started: ${currentCycleStart}`,
      `  Current cycle ends: ${currentCycleStart + 18}`,
      `  Next cycle starts: ${nextCycleStart}`,
      `  Years remaining: ${yearsRemaining - 1}`,
      ``,
      `Lunar Data:`,
      `  Epact (age of moon on Jan 1): ${epact} days`,
      `  Hebrew calendar leap year: ${isMetonicLeap ? 'Yes (13 months)' : 'No (12 months)'}`,
      ``,
      `Same Lunar Phase Dates:`,
      `  Previous occurrence: ${y - 19}`,
      `  Next occurrence: ${y + 19}`,
      ``,
      `About the Metonic Cycle:`,
      `  • 19 solar years ≈ 235 synodic months`,
      `  • Duration: 6,939.688 days`,
      `  • Accuracy: ~2 hours drift per cycle`,
      `  • Used in: Hebrew, Chinese, and Greek calendars`,
      `  • Named after Meton of Athens (432 BCE)`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-year`} className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <input id={`${toolId}-year`} type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="e.g. 2024" className="input-field" aria-label={`Year input for ${toolName}`} />
          </div>
          <button onClick={calculate} className="btn-primary">Calculate Metonic Position</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
