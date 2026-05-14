'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ThaiBuddhistEraConverter - Convert Gregorian to Thai Buddhist Era (BE).
 */
export default function ThaiBuddhistEraConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<{ beYear: number; formatted: string; thaiMonth: string; thaiDay: string } | null>(null);
  const [error, setError] = useState('');

  function calculate() {
    setError('');
    setResult(null);
    const d = new Date(date);
    if (isNaN(d.getTime())) { setError('Please enter a valid date'); return; }

    // Thai Buddhist Era = Gregorian year + 543
    const beYear = d.getFullYear() + 543;
    const month = d.getMonth() + 1;
    const day = d.getDate();

    const thaiMonths = ['มกราคม (Mokkarakhom)', 'กุมภาพันธ์ (Kumphaphan)', 'มีนาคม (Minakhom)', 'เมษายน (Mesayon)', 'พฤษภาคม (Phruetsaphakhom)', 'มิถุนายน (Mithunayon)', 'กรกฎาคม (Karakadakhom)', 'สิงหาคม (Singhakhom)', 'กันยายน (Kanyayon)', 'ตุลาคม (Tulakhom)', 'พฤศจิกายน (Phruetsachikayon)', 'ธันวาคม (Thanwakhom)'];
    const thaiDays = ['อาทิตย์ (Athit)', 'จันทร์ (Chan)', 'อังคาร (Angkhan)', 'พุธ (Phut)', 'พฤหัสบดี (Phruhat)', 'ศุกร์ (Suk)', 'เสาร์ (Sao)'];

    setResult({
      beYear,
      formatted: `${day}/${month}/${beYear}`,
      thaiMonth: thaiMonths[month - 1],
      thaiDay: thaiDays[d.getDay()],
    });
  }

  const copyText = result ? `Thai Buddhist Era: ${result.formatted}\nBE Year: ${result.beYear}\nMonth: ${result.thaiMonth}\nDay: ${result.thaiDay}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">Gregorian Date</label>
        <input id={`${toolId}-date`} type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label={`Gregorian date for ${toolName}`} className="input-field w-48" />
      </InputArea>

      <button onClick={calculate} aria-label="Convert to Thai Buddhist Era" className="btn-primary">Convert to BE</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600">{result.formatted}</div>
              <div className="text-sm text-gray-600 mt-1">พ.ศ. {result.beYear} (Buddhist Era)</div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <div className="text-xs text-gray-500">Month</div>
                <div className="font-medium">{result.thaiMonth}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <div className="text-xs text-gray-500">Day</div>
                <div className="font-medium">{result.thaiDay}</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
