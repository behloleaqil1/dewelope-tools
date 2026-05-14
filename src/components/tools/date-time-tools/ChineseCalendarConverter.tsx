'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const ANIMALS = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];

/**
 * ChineseCalendarConverter - Convert Gregorian date to Chinese calendar elements
 */
export default function ChineseCalendarConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [dateInput, setDateInput] = useState('');
  const [result, setResult] = useState<{ year: number; stem: string; branch: string; animal: string; element: string; cycleYear: number } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function convert() {
    setError(undefined);
    setResult(null);

    if (!dateInput) { setError('Please select a date'); return; }
    const date = new Date(dateInput);
    const year = date.getFullYear();

    if (year < 1900 || year > 2100) { setError('Year must be between 1900 and 2100'); return; }

    const stemIndex = (year - 4) % 10;
    const branchIndex = (year - 4) % 12;
    const cycleYear = ((year - 4) % 60) + 1;
    const elements = ['Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth', 'Metal', 'Metal', 'Water', 'Water'];

    setResult({
      year,
      stem: HEAVENLY_STEMS[stemIndex],
      branch: EARTHLY_BRANCHES[branchIndex],
      animal: ANIMALS[branchIndex],
      element: elements[stemIndex],
      cycleYear,
    });
  }

  const copyText = result ? `Year: ${result.year}\nHeavenly Stem: ${result.stem}\nEarthly Branch: ${result.branch}\nAnimal: ${result.animal}\nElement: ${result.element}\n60-year cycle: Year ${result.cycleYear}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
        <input id={`${toolId}-date`} type="date" value={dateInput} onChange={(e) => setDateInput(e.target.value)} aria-label={`Date input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </InputArea>

      <button onClick={convert} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Convert</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="text-2xl text-center font-bold text-red-600">{result.stem}{result.branch} — {result.animal}</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-red-50 p-3 rounded-lg border border-red-200 text-center"><div className="text-lg font-bold">{result.stem}</div><div className="text-xs text-gray-500">Heavenly Stem</div></div>
              <div className="bg-red-50 p-3 rounded-lg border border-red-200 text-center"><div className="text-lg font-bold">{result.branch}</div><div className="text-xs text-gray-500">Earthly Branch</div></div>
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-center"><div className="text-lg font-bold">{result.element}</div><div className="text-xs text-gray-500">Element</div></div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center"><div className="text-lg font-bold">{result.cycleYear}/60</div><div className="text-xs text-gray-500">Cycle Year</div></div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
