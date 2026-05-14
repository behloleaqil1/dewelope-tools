'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const SAKA_MONTHS = ['Kasa', 'Karo', 'Katiga', 'Kapat', 'Kalima', 'Kanem', 'Kapitu', 'Kawalu', 'Kasanga', 'Kadasa', 'Jyestha', 'Sadha'];

/**
 * BalineseSakaCalendarConverter - Convert Gregorian to Balinese Saka calendar
 */
export default function BalineseSakaCalendarConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [dateInput, setDateInput] = useState('');
  const [result, setResult] = useState<{ sakaYear: number; month: string; wuku: string; pancawara: string } | null>(null);
  const [error, setError] = useState<string | undefined>();

  const WUKU_NAMES = ['Sinta', 'Landep', 'Ukir', 'Kulantir', 'Tolu', 'Gumbreg', 'Wariga', 'Warigadean', 'Julungwangi', 'Sungsang', 'Dungulan', 'Kuningan', 'Langkir', 'Medangsia', 'Pujut', 'Pahang', 'Krulut', 'Merakih', 'Tambir', 'Medangkungan', 'Matal', 'Uye', 'Menail', 'Prangbakat', 'Bala', 'Ugu', 'Wayang', 'Klawu', 'Dukut', 'Watugunung'];
  const PANCAWARA = ['Umanis', 'Paing', 'Pon', 'Wage', 'Kliwon'];

  function convert() {
    setError(undefined);
    setResult(null);

    if (!dateInput) { setError('Please select a date'); return; }
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) { setError('Invalid date'); return; }

    // Saka year is approximately Gregorian year - 78
    const sakaYear = date.getFullYear() - 78;
    const monthIndex = date.getMonth();

    // Wuku cycle: 210-day cycle, calculate from a reference point
    const refDate = new Date(2000, 0, 5); // Known Sinta start
    const daysDiff = Math.floor((date.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24));
    const wukuDay = ((daysDiff % 210) + 210) % 210;
    const wukuWeek = Math.floor(wukuDay / 7);
    const pancawaraIndex = ((daysDiff % 5) + 5) % 5;

    setResult({
      sakaYear,
      month: SAKA_MONTHS[monthIndex],
      wuku: WUKU_NAMES[wukuWeek],
      pancawara: PANCAWARA[pancawaraIndex],
    });
  }

  const copyText = result ? `Saka Year: ${result.sakaYear}\nMonth: ${result.month}\nWuku: ${result.wuku}\nPancawara: ${result.pancawara}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">Gregorian Date</label>
        <input id={`${toolId}-date`} type="date" value={dateInput} onChange={(e) => setDateInput(e.target.value)} aria-label={`Date input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </InputArea>

      <button onClick={convert} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Convert</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="text-lg font-semibold text-gray-800">Saka Year: {result.sakaYear}</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 text-center"><div className="font-bold text-orange-600">{result.month}</div><div className="text-xs text-gray-500">Month</div></div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 text-center"><div className="font-bold text-purple-600">{result.wuku}</div><div className="text-xs text-gray-500">Wuku Week</div></div>
            </div>
            <div className="text-md text-gray-700">Pancawara: {result.pancawara}</div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
