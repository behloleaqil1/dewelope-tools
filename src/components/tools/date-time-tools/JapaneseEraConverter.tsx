'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * JapaneseEraConverter - Convert between Gregorian and Japanese era dates.
 * Supports Reiwa, Heisei, Showa, Taisho, and Meiji eras.
 */
export default function JapaneseEraConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [direction, setDirection] = useState<'toJapanese' | 'toGregorian'>('toJapanese');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('1');
  const [day, setDay] = useState('');
  const [era, setEra] = useState('reiwa');
  const [eraYear, setEraYear] = useState('');
  const [result, setResult] = useState<{ display: string; detail: string } | null>(null);
  const [error, setError] = useState('');

  const eras = [
    { id: 'reiwa', name: 'Reiwa (令和)', kanji: '令和', startYear: 2019, startMonth: 5, startDay: 1 },
    { id: 'heisei', name: 'Heisei (平成)', kanji: '平成', startYear: 1989, startMonth: 1, startDay: 8 },
    { id: 'showa', name: 'Shōwa (昭和)', kanji: '昭和', startYear: 1926, startMonth: 12, startDay: 25 },
    { id: 'taisho', name: 'Taishō (大正)', kanji: '大正', startYear: 1912, startMonth: 7, startDay: 30 },
    { id: 'meiji', name: 'Meiji (明治)', kanji: '明治', startYear: 1868, startMonth: 1, startDay: 25 },
  ];

  const findEra = (gYear: number, gMonth: number, gDay: number) => {
    for (const e of eras) {
      const startDate = new Date(e.startYear, e.startMonth - 1, e.startDay);
      const checkDate = new Date(gYear, gMonth - 1, gDay);
      if (checkDate >= startDate) {
        return e;
      }
    }
    return null;
  };

  const convert = () => {
    setError('');
    setResult(null);

    if (direction === 'toJapanese') {
      const y = parseInt(year);
      const m = parseInt(month);
      const d = parseInt(day);

      if (isNaN(y) || y < 1868) { setError('Enter a valid year (1868 or later)'); return; }
      if (isNaN(d) || d < 1 || d > 31) { setError('Enter a valid day (1-31)'); return; }

      const matchedEra = findEra(y, m, d);
      if (!matchedEra) { setError('Date is before the Meiji era (1868)'); return; }

      const eraYearNum = y - matchedEra.startYear + 1;
      const eraYearDisplay = eraYearNum === 1 ? '元' : String(eraYearNum);

      setResult({
        display: `${matchedEra.kanji}${eraYearDisplay}年${m}月${d}日`,
        detail: `${matchedEra.name} Year ${eraYearNum} (${y} AD), Month ${m}, Day ${d}`,
      });
    } else {
      const selectedEra = eras.find(e => e.id === era);
      if (!selectedEra) { setError('Select a valid era'); return; }

      const ey = parseInt(eraYear);
      const m = parseInt(month);
      const d = parseInt(day);

      if (isNaN(ey) || ey < 1) { setError('Enter a valid era year (1 or higher)'); return; }
      if (isNaN(d) || d < 1 || d > 31) { setError('Enter a valid day (1-31)'); return; }

      const gregorianYear = selectedEra.startYear + ey - 1;

      setResult({
        display: `${gregorianYear}年${m}月${d}日 (${gregorianYear} AD)`,
        detail: `${selectedEra.kanji}${ey === 1 ? '元' : ey}年 = ${gregorianYear} AD, ${m}/${d}`,
      });
    }
  };

  const copyText = result ? `${result.display}\n${result.detail}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="flex gap-4 mb-3">
          <label className="inline-flex items-center text-sm">
            <input type="radio" checked={direction === 'toJapanese'} onChange={() => setDirection('toJapanese')} className="mr-1" />
            Gregorian → Japanese Era
          </label>
          <label className="inline-flex items-center text-sm">
            <input type="radio" checked={direction === 'toGregorian'} onChange={() => setDirection('toGregorian')} className="mr-1" />
            Japanese Era → Gregorian
          </label>
        </div>

        {direction === 'toJapanese' ? (
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label htmlFor={`${toolId}-year`} className="block text-sm font-medium text-gray-700 mb-1">Year (AD)</label>
              <input
                id={`${toolId}-year`}
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2024"
                className="input-field"
                aria-label={`Gregorian year for ${toolName}`}
              />
            </div>
            <div>
              <label htmlFor={`${toolId}-month`} className="block text-sm font-medium text-gray-700 mb-1">Month</label>
              <select
                id={`${toolId}-month`}
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="input-field"
                aria-label={`Month for ${toolName}`}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`${toolId}-day`} className="block text-sm font-medium text-gray-700 mb-1">Day</label>
              <input
                id={`${toolId}-day`}
                type="number"
                min="1"
                max="31"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                placeholder="15"
                className="input-field"
                aria-label={`Day for ${toolName}`}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor={`${toolId}-era`} className="block text-sm font-medium text-gray-700 mb-1">Era</label>
                <select
                  id={`${toolId}-era`}
                  value={era}
                  onChange={(e) => setEra(e.target.value)}
                  className="input-field"
                  aria-label={`Japanese era for ${toolName}`}
                >
                  {eras.map(e => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor={`${toolId}-erayear`} className="block text-sm font-medium text-gray-700 mb-1">Era Year</label>
                <input
                  id={`${toolId}-erayear`}
                  type="number"
                  min="1"
                  value={eraYear}
                  onChange={(e) => setEraYear(e.target.value)}
                  placeholder="6"
                  className="input-field"
                  aria-label={`Era year for ${toolName}`}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor={`${toolId}-month2`} className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                <select
                  id={`${toolId}-month2`}
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="input-field"
                  aria-label={`Month for ${toolName}`}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor={`${toolId}-day2`} className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                <input
                  id={`${toolId}-day2`}
                  type="number"
                  min="1"
                  max="31"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  placeholder="15"
                  className="input-field"
                  aria-label={`Day for ${toolName}`}
                />
              </div>
            </div>
          </div>
        )}
      </InputArea>

      <button onClick={convert} aria-label="Convert date" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600">{result.display}</div>
              <div className="text-sm text-gray-500 mt-2">{result.detail}</div>
            </div>
            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <strong>Era Reference:</strong> Reiwa (2019–), Heisei (1989–2019), Shōwa (1926–1989), Taishō (1912–1926), Meiji (1868–1912)
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
