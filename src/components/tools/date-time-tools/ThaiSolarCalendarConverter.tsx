'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const THAI_MONTHS = [
  'มกราคม (Makarakhom)', 'กุมภาพันธ์ (Kumphaphan)',
  'มีนาคม (Minakhom)', 'เมษายน (Mesayon)',
  'พฤษภาคม (Phruetsaphakhom)', 'มิถุนายน (Mithunayon)',
  'กรกฎาคม (Karakadakhom)', 'สิงหาคม (Singhakhom)',
  'กันยายน (Kanyanyon)', 'ตุลาคม (Tulakhom)',
  'พฤศจิกายน (Phruetsachikayon)', 'ธันวาคม (Thanwakhom)',
];

const THAI_DAYS = [
  'วันอาทิตย์ (Wan Athit / Sunday)',
  'วันจันทร์ (Wan Chan / Monday)',
  'วันอังคาร (Wan Angkhan / Tuesday)',
  'วันพุธ (Wan Phut / Wednesday)',
  'วันพฤหัสบดี (Wan Pharuehatsabodi / Thursday)',
  'วันศุกร์ (Wan Suk / Friday)',
  'วันเสาร์ (Wan Sao / Saturday)',
];

export default function ThaiSolarCalendarConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [direction, setDirection] = useState('greg-to-thai');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [day, setDay] = useState(new Date().getDate().toString());
  const [output, setOutput] = useState('');

  const calculate = () => {
    const y = parseInt(year);
    const m = parseInt(month);
    const d = parseInt(day);

    if (isNaN(y) || isNaN(m) || isNaN(d) || m < 1 || m > 12 || d < 1 || d > 31) {
      setOutput('Please enter a valid date.');
      return;
    }

    if (direction === 'greg-to-thai') {
      // Thai Buddhist Era = Gregorian + 543
      const thaiYear = y + 543;
      const date = new Date(y, m - 1, d);
      const dayOfWeek = date.getDay();

      const result = `Gregorian to Thai Solar Calendar Conversion
═══════════════════════════════════════════════

Gregorian Date:
  ${d} ${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][m - 1]} ${y} CE

Thai Solar Calendar (พุทธศักราช):
  ┌─────────────────────────────────────────────┐
  │ ${d} ${THAI_MONTHS[m - 1].split(' ')[0]} พ.ศ. ${thaiYear}     │
  │ ${THAI_DAYS[dayOfWeek]}  │
  └─────────────────────────────────────────────┘

Details:
  Thai Year (พ.ศ.):    ${thaiYear} (Buddhist Era)
  Thai Month:          ${THAI_MONTHS[m - 1]}
  Thai Day:            ${d}
  Day of Week:         ${THAI_DAYS[dayOfWeek]}

  Gregorian Year (ค.ศ.): ${y}
  Era Difference:       543 years

Notes:
  • The Thai solar calendar uses Buddhist Era (พุทธศักราช / พ.ศ.)
  • Buddhist Era = Gregorian year + 543
  • Based on the passing of Gautama Buddha (543 BCE)
  • Thailand officially adopted the solar calendar in 1888
  • New Year was moved from April 1 to January 1 in 1941`;

      setOutput(result);
    } else {
      // Thai to Gregorian: subtract 543
      const gregYear = y - 543;
      const date = new Date(gregYear, m - 1, d);
      const dayOfWeek = date.getDay();

      const result = `Thai Solar Calendar to Gregorian Conversion
═══════════════════════════════════════════════

Thai Solar Date (พุทธศักราช):
  ${d} ${THAI_MONTHS[m - 1].split(' ')[0]} พ.ศ. ${y}

Gregorian Date:
  ┌─────────────────────────────────────────────┐
  │ ${d} ${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][m - 1]} ${gregYear} CE │
  │ ${THAI_DAYS[dayOfWeek]}  │
  └─────────────────────────────────────────────┘

Details:
  Gregorian Year (ค.ศ.): ${gregYear}
  Month:                ${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][m - 1]}
  Day:                  ${d}
  Day of Week:          ${THAI_DAYS[dayOfWeek]}

  Thai Year (พ.ศ.):     ${y} (Buddhist Era)
  Era Difference:       543 years

Notes:
  • Gregorian year = Thai year (พ.ศ.) - 543
  • The Thai calendar follows the same months and days as Gregorian
  • Only the year numbering differs (Buddhist Era vs Common Era)`;

      setOutput(result);
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label htmlFor={`${toolId}-dir`} className="block text-sm font-medium text-gray-700 mb-1">Conversion Direction</label>
            <select id={`${toolId}-dir`} value={direction} onChange={(e) => setDirection(e.target.value)} className="input-field" aria-label={`Conversion direction for ${toolName}`}>
              <option value="greg-to-thai">Gregorian → Thai Solar (พ.ศ.)</option>
              <option value="thai-to-greg">Thai Solar (พ.ศ.) → Gregorian</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-year`} className="block text-sm font-medium text-gray-700 mb-1">
              Year {direction === 'greg-to-thai' ? '(CE)' : '(พ.ศ.)'}
            </label>
            <input id={`${toolId}-year`} type="number" value={year} onChange={(e) => setYear(e.target.value)} className="input-field" aria-label="Year" />
          </div>
          <div>
            <label htmlFor={`${toolId}-month`} className="block text-sm font-medium text-gray-700 mb-1">Month (1-12)</label>
            <input id={`${toolId}-month`} type="number" min="1" max="12" value={month} onChange={(e) => setMonth(e.target.value)} className="input-field" aria-label="Month" />
          </div>
          <div>
            <label htmlFor={`${toolId}-day`} className="block text-sm font-medium text-gray-700 mb-1">Day</label>
            <input id={`${toolId}-day`} type="number" min="1" max="31" value={day} onChange={(e) => setDay(e.target.value)} className="input-field" aria-label="Day" />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Convert Date</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Conversion Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded border overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
