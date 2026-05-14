'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CopticAlexandrianDateConverter - Convert Gregorian to Coptic/Alexandrian calendar.
 */
export default function CopticAlexandrianDateConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<{ coptic: string; monthName: string; year: number } | null>(null);
  const [error, setError] = useState('');

  function gregorianToCoptic(gy: number, gm: number, gd: number): [number, number, number] {
    // Julian Day Number
    const a = Math.floor((14 - gm) / 12);
    const y = gy + 4800 - a;
    const m = gm + 12 * a - 3;
    const jdn = gd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

    // Coptic epoch: August 29, 284 CE (Julian) = JDN 1825030
    const copticEpoch = 1824665;
    const days = jdn - copticEpoch;

    const copticYear = Math.floor((4 * days + 3) / 1461);
    const dayOfYear = days - Math.floor((copticYear * 1461) / 4) + 1;

    let copticMonth: number, copticDay: number;
    if (dayOfYear <= 360) {
      copticMonth = Math.ceil(dayOfYear / 30);
      copticDay = dayOfYear - (copticMonth - 1) * 30;
    } else {
      copticMonth = 13;
      copticDay = dayOfYear - 360;
    }

    return [copticYear, copticMonth, copticDay];
  }

  function calculate() {
    setError('');
    setResult(null);
    const d = new Date(date);
    if (isNaN(d.getTime())) { setError('Please enter a valid date'); return; }

    const [cy, cm, cd] = gregorianToCoptic(d.getFullYear(), d.getMonth() + 1, d.getDate());

    const months = ['Thout', 'Paopi', 'Hathor', 'Koiak', 'Tobi', 'Meshir', 'Paremhat', 'Parmouti', 'Pashons', 'Paoni', 'Epip', 'Mesori', 'Pi Kogi Enavot'];

    setResult({
      coptic: `${cy}/${cm.toString().padStart(2, '0')}/${cd.toString().padStart(2, '0')}`,
      monthName: months[cm - 1] || 'Unknown',
      year: cy,
    });
  }

  const copyText = result ? `Coptic: ${result.coptic}\nMonth: ${result.monthName}\nYear: ${result.year} AM (Anno Martyrum)` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">Gregorian Date</label>
        <input id={`${toolId}-date`} type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label={`Gregorian date for ${toolName}`} className="input-field w-48" />
      </InputArea>

      <button onClick={calculate} aria-label="Convert to Coptic date" className="btn-primary">Convert to Coptic</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600 font-mono">{result.coptic}</div>
              <div className="text-sm text-gray-600 mt-1">{result.monthName}, {result.year} AM</div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
