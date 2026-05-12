'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const DAY_SIGNS = [
  'Cipactli (Crocodile)', 'Ehecatl (Wind)', 'Calli (House)', 'Cuetzpalin (Lizard)',
  'Coatl (Serpent)', 'Miquiztli (Death)', 'Mazatl (Deer)', 'Tochtli (Rabbit)',
  'Atl (Water)', 'Itzcuintli (Dog)', 'Ozomatli (Monkey)', 'Malinalli (Grass)',
  'Acatl (Reed)', 'Ocelotl (Jaguar)', 'Cuauhtli (Eagle)', 'Cozcacuauhtli (Vulture)',
  'Ollin (Movement)', 'Tecpatl (Flint)', 'Quiahuitl (Rain)', 'Xochitl (Flower)'
];

export default function AztecCalendarConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [dateStr, setDateStr] = useState('');
  const [output, setOutput] = useState('');

  const convert = () => {
    if (!dateStr) {
      setOutput('Please select a date.');
      return;
    }

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      setOutput('Invalid date.');
      return;
    }

    // Reference: The Tonalpohualli is a 260-day cycle
    // Using a known correlation: June 16, 2024 = 4 Ollin
    // Reference date in Julian Day Number
    const refDate = new Date('2024-06-16');
    const refTrecena = 4; // 1-indexed
    const refDaySign = 16; // 0-indexed (Ollin = index 16)

    const diffDays = Math.floor((date.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24));

    // Calculate trecena (13-day cycle)
    const trecenaNum = ((refTrecena - 1 + diffDays) % 13 + 13) % 13 + 1;

    // Calculate day sign (20-day cycle)
    const daySignIdx = ((refDaySign + diffDays) % 20 + 20) % 20;

    // Calculate position in 260-day cycle
    const cyclePosition = ((diffDays % 260) + 260) % 260;

    const lines = [
      `=== Aztec Tonalpohualli Calendar ===`,
      ``,
      `Gregorian Date: ${date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`,
      ``,
      `--- Tonalpohualli Date ---`,
      `Day Name: ${trecenaNum} ${DAY_SIGNS[daySignIdx]}`,
      `Trecena Number: ${trecenaNum} of 13`,
      `Day Sign: ${DAY_SIGNS[daySignIdx]} (${daySignIdx + 1} of 20)`,
      ``,
      `Position in 260-day cycle: Day ${cyclePosition + 1}`,
      ``,
      `--- About the Tonalpohualli ---`,
      `The Tonalpohualli is a 260-day sacred calendar used by`,
      `the Aztecs. It combines 13 numbers (trecena) with 20 day`,
      `signs to create 260 unique day names.`,
    ];

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">
          Select Date
        </label>
        <input
          id={`${toolId}-date`}
          type="date"
          value={dateStr}
          onChange={(e) => setDateStr(e.target.value)}
          className="input-field"
          aria-label={`Date input for ${toolName}`}
        />
        <button onClick={convert} className="btn-primary mt-2">Convert to Aztec Calendar</button>
      </InputArea>
      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Aztec Tonalpohualli Date</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
