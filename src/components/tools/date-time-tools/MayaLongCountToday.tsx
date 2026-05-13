'use client';

import { useState, useEffect } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MayaLongCountToday - Show today's date in Maya Long Count notation.
 * Calculates Baktun.Katun.Tun.Uinal.Kin from the GMT correlation constant.
 */
export default function MayaLongCountToday({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [output, setOutput] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  });

  const calculateMayaDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00Z');
    if (isNaN(date.getTime())) {
      setOutput('Please enter a valid date.');
      return;
    }

    // GMT correlation constant: Julian Day Number of Maya epoch (0.0.0.0.0)
    // August 11, 3114 BCE = JDN 584283 (Goodman-Martinez-Thompson correlation)
    const GMT_CORRELATION = 584283;

    // Calculate Julian Day Number for the input date
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();

    // Julian Day Number calculation
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

    // Days since Maya epoch
    const daysSinceEpoch = jdn - GMT_CORRELATION;

    if (daysSinceEpoch < 0) {
      setOutput('Date is before the Maya epoch (August 11, 3114 BCE).');
      return;
    }

    // Calculate Long Count components
    let remaining = daysSinceEpoch;
    const baktun = Math.floor(remaining / 144000);
    remaining %= 144000;
    const katun = Math.floor(remaining / 7200);
    remaining %= 7200;
    const tun = Math.floor(remaining / 360);
    remaining %= 360;
    const uinal = Math.floor(remaining / 20);
    const kin = remaining % 20;

    // Tzolkin calculation (260-day cycle)
    const tzolkinNum = ((daysSinceEpoch + 3) % 13) + 1;
    const tzolkinNames = ['Imix', 'Ik', 'Akbal', 'Kan', 'Chicchan', 'Cimi', 'Manik', 'Lamat', 'Muluc', 'Oc', 'Chuen', 'Eb', 'Ben', 'Ix', 'Men', 'Cib', 'Caban', 'Etznab', 'Cauac', 'Ahau'];
    const tzolkinDay = tzolkinNames[(daysSinceEpoch + 19) % 20];

    // Haab calculation (365-day cycle)
    const haabDayOfYear = (daysSinceEpoch + 348) % 365;
    const haabMonths = ['Pop', 'Uo', 'Zip', 'Zotz', 'Tzec', 'Xul', 'Yaxkin', 'Mol', 'Chen', 'Yax', 'Zac', 'Ceh', 'Mac', 'Kankin', 'Muan', 'Pax', 'Kayab', 'Cumku', 'Uayeb'];
    const haabMonth = haabMonths[Math.floor(haabDayOfYear / 20)];
    const haabDay = haabDayOfYear % 20;

    const longCount = `${baktun}.${katun}.${tun}.${uinal}.${kin}`;

    const results: string[] = [];
    results.push('=== Maya Calendar Date ===');
    results.push('');
    results.push(`Gregorian Date: ${dateStr}`);
    results.push('');
    results.push(`Long Count: ${longCount}`);
    results.push('');
    results.push('Components:');
    results.push(`  Baktun (144,000 days): ${baktun}`);
    results.push(`  Katun (7,200 days):    ${katun}`);
    results.push(`  Tun (360 days):        ${tun}`);
    results.push(`  Uinal (20 days):       ${uinal}`);
    results.push(`  Kin (1 day):           ${kin}`);
    results.push('');
    results.push(`Tzolkin (Sacred Calendar): ${tzolkinNum} ${tzolkinDay}`);
    results.push(`Haab (Civil Calendar): ${haabDay} ${haabMonth}`);
    results.push('');
    results.push(`Calendar Round: ${tzolkinNum} ${tzolkinDay} ${haabDay} ${haabMonth}`);
    results.push('');
    results.push(`Days since Maya Epoch: ${daysSinceEpoch.toLocaleString()}`);
    results.push(`Julian Day Number: ${jdn.toLocaleString()}`);
    results.push('');
    results.push('--- Reference ---');
    results.push('  Maya Epoch: 0.0.0.0.0 = August 11, 3114 BCE (GMT)');
    results.push('  Correlation: Goodman-Martinez-Thompson (584283)');

    setOutput(results.join('\n'));
  };

  useEffect(() => {
    calculateMayaDate(selectedDate);
  }, [selectedDate]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
        <input
          id={`${toolId}-date`}
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="input-field"
          aria-label={`Date input for ${toolName}`}
        />
        <p className="text-xs text-gray-500 mt-1">Defaults to today. Change to see any date in Maya Long Count.</p>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Maya Long Count Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
