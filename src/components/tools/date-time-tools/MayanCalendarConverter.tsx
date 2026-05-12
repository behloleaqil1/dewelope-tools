'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MayanCalendarConverter - Convert Gregorian dates to Mayan Long Count.
 * Uses the GMT correlation constant (584283) to convert Julian Day Number to Mayan Long Count.
 */

const TZOLKIN_NAMES = [
  'Imix', 'Ik', 'Akbal', 'Kan', 'Chicchan', 'Cimi', 'Manik', 'Lamat',
  'Muluc', 'Oc', 'Chuen', 'Eb', 'Ben', 'Ix', 'Men', 'Cib',
  'Caban', 'Etznab', 'Cauac', 'Ahau',
];

const HAAB_NAMES = [
  'Pop', 'Wo', 'Sip', 'Sotz', 'Sek', 'Xul', 'Yaxkin', 'Mol',
  'Chen', 'Yax', 'Sak', 'Keh', 'Mak', 'Kankin', 'Muwan', 'Pax',
  'Kayab', 'Kumku', 'Wayeb',
];

function gregorianToJDN(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

function jdnToLongCount(jdn: number): { baktun: number; katun: number; tun: number; uinal: number; kin: number } {
  const GMT = 584283;
  const days = jdn - GMT;
  const baktun = Math.floor(days / 144000);
  const remainder1 = days % 144000;
  const katun = Math.floor(remainder1 / 7200);
  const remainder2 = remainder1 % 7200;
  const tun = Math.floor(remainder2 / 360);
  const remainder3 = remainder2 % 360;
  const uinal = Math.floor(remainder3 / 20);
  const kin = remainder3 % 20;
  return { baktun, katun, tun, uinal, kin };
}

function jdnToTzolkin(jdn: number): { number: number; name: string } {
  const GMT = 584283;
  const days = jdn - GMT;
  const num = ((days + 3) % 13 + 13) % 13 + 1;
  const nameIdx = ((days + 19) % 20 + 20) % 20;
  return { number: num, name: TZOLKIN_NAMES[nameIdx] };
}

function jdnToHaab(jdn: number): { day: number; month: string } {
  const GMT = 584283;
  const days = jdn - GMT;
  const dayOfYear = ((days + 348) % 365 + 365) % 365;
  const monthIdx = Math.floor(dayOfYear / 20);
  const day = dayOfYear % 20;
  return { day, month: HAAB_NAMES[monthIdx] };
}

export default function MayanCalendarConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const today = new Date();
  const [year, setYear] = useState(String(today.getFullYear()));
  const [month, setMonth] = useState(String(today.getMonth() + 1));
  const [day, setDay] = useState(String(today.getDate()));
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    longCount: string;
    tzolkin: string;
    haab: string;
    jdn: number;
  } | null>(null);

  const convert = () => {
    setError('');
    setResult(null);

    const y = parseInt(year);
    const m = parseInt(month);
    const d = parseInt(day);

    if (isNaN(y) || isNaN(m) || isNaN(d)) {
      setError('Please enter valid year, month, and day values');
      return;
    }
    if (m < 1 || m > 12) {
      setError('Month must be between 1 and 12');
      return;
    }
    if (d < 1 || d > 31) {
      setError('Day must be between 1 and 31');
      return;
    }

    const jdn = gregorianToJDN(y, m, d);
    const lc = jdnToLongCount(jdn);
    const tzolkin = jdnToTzolkin(jdn);
    const haab = jdnToHaab(jdn);

    const longCount = `${lc.baktun}.${lc.katun}.${lc.tun}.${lc.uinal}.${lc.kin}`;
    const tzolkinStr = `${tzolkin.number} ${tzolkin.name}`;
    const haabStr = `${haab.day} ${haab.month}`;

    setResult({ longCount, tzolkin: tzolkinStr, haab: haabStr, jdn });
  };

  const setToday = () => {
    const now = new Date();
    setYear(String(now.getFullYear()));
    setMonth(String(now.getMonth() + 1));
    setDay(String(now.getDate()));
  };

  const copyText = result
    ? `Mayan Calendar Conversion\nDate: ${year}-${month}-${day}\nLong Count: ${result.longCount}\nTzolkin: ${result.tzolkin}\nHaab: ${result.haab}\nJulian Day Number: ${result.jdn}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-3 gap-3">
        <InputArea error={error && !year ? error : ''}>
          <label htmlFor={`${toolId}-year`} className="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <input id={`${toolId}-year`} type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="2024" aria-label={`Year for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-month`} className="block text-sm font-medium text-gray-700 mb-1">Month</label>
          <input id={`${toolId}-month`} type="number" min={1} max={12} value={month} onChange={(e) => setMonth(e.target.value)} placeholder="1" aria-label={`Month for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-day`} className="block text-sm font-medium text-gray-700 mb-1">Day</label>
          <input id={`${toolId}-day`} type="number" min={1} max={31} value={day} onChange={(e) => setDay(e.target.value)} placeholder="1" aria-label={`Day for ${toolName}`} className="input-field" />
        </InputArea>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button onClick={convert} aria-label="Convert to Mayan calendar" className="btn-primary">Convert</button>
        <button onClick={setToday} aria-label="Set today's date" className="btn-primary bg-gray-600 hover:bg-gray-700">Today</button>
      </div>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600 font-mono">{result.longCount}</div>
                <div className="text-xs text-gray-500 mt-1">Long Count</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-purple-600">{result.tzolkin}</div>
                <div className="text-xs text-gray-500 mt-1">Tzolkin (260-day)</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-green-600">{result.haab}</div>
                <div className="text-xs text-gray-500 mt-1">Haab (365-day)</div>
              </div>
            </div>
            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p><strong>Long Count format:</strong> Baktun.Katun.Tun.Uinal.Kin</p>
              <p><strong>Julian Day Number:</strong> {result.jdn}</p>
              <p><strong>Correlation:</strong> GMT (584283)</p>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
