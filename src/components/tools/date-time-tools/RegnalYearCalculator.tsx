'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * RegnalYearCalculator - Convert between regnal years and Gregorian dates.
 * Supports major English/British monarchs and custom reign start dates.
 */
export default function RegnalYearCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mode, setMode] = useState<'toGregorian' | 'toRegnal'>('toGregorian');
  const [monarch, setMonarch] = useState('elizabeth-ii');
  const [regnalYear, setRegnalYear] = useState('');
  const [gregorianDate, setGregorianDate] = useState('');
  const [customStart, setCustomStart] = useState('');
  const [output, setOutput] = useState('');

  const monarchs: Record<string, { name: string; start: string; end?: string }> = {
    'william-i': { name: 'William I', start: '1066-12-25', end: '1087-09-09' },
    'henry-viii': { name: 'Henry VIII', start: '1509-04-22', end: '1547-01-28' },
    'elizabeth-i': { name: 'Elizabeth I', start: '1558-11-17', end: '1603-03-24' },
    'charles-i': { name: 'Charles I', start: '1625-03-27', end: '1649-01-30' },
    'victoria': { name: 'Victoria', start: '1837-06-20', end: '1901-01-22' },
    'george-v': { name: 'George V', start: '1910-05-06', end: '1936-01-20' },
    'george-vi': { name: 'George VI', start: '1936-12-11', end: '1952-02-06' },
    'elizabeth-ii': { name: 'Elizabeth II', start: '1952-02-06', end: '2022-09-08' },
    'charles-iii': { name: 'Charles III', start: '2022-09-08' },
    'custom': { name: 'Custom', start: '' },
  };

  const calculate = () => {
    const selectedMonarch = monarchs[monarch];
    const startDate = monarch === 'custom' ? new Date(customStart) : new Date(selectedMonarch.start);

    if (isNaN(startDate.getTime())) {
      setOutput('Please enter a valid reign start date.');
      return;
    }

    if (mode === 'toGregorian') {
      const year = parseInt(regnalYear);
      if (isNaN(year) || year < 1) {
        setOutput('Please enter a valid regnal year (1 or greater).');
        return;
      }

      const reignStart = new Date(startDate);
      const yearStart = new Date(reignStart);
      yearStart.setFullYear(yearStart.getFullYear() + year - 1);
      const yearEnd = new Date(reignStart);
      yearEnd.setFullYear(yearEnd.getFullYear() + year);
      yearEnd.setDate(yearEnd.getDate() - 1);

      const results = [
        `=== Regnal Year to Gregorian ===`,
        ``,
        `Monarch: ${selectedMonarch.name}`,
        `Reign began: ${startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`,
        ``,
        `Regnal Year ${year} ${selectedMonarch.name}:`,
        `  From: ${yearStart.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`,
        `  To: ${yearEnd.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`,
        ``,
        selectedMonarch.end ? `Reign ended: ${new Date(selectedMonarch.end).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}` : `Reign: ongoing`,
      ];
      setOutput(results.join('\n'));
    } else {
      const targetDate = new Date(gregorianDate);
      if (isNaN(targetDate.getTime())) {
        setOutput('Please enter a valid Gregorian date.');
        return;
      }

      if (targetDate < startDate) {
        setOutput('The date is before the reign began.');
        return;
      }

      // Calculate regnal year
      let rYear = 1;
      const tempDate = new Date(startDate);
      while (true) {
        const nextAnniversary = new Date(tempDate);
        nextAnniversary.setFullYear(nextAnniversary.getFullYear() + 1);
        if (targetDate < nextAnniversary) break;
        tempDate.setFullYear(tempDate.getFullYear() + 1);
        rYear++;
      }

      const results = [
        `=== Gregorian to Regnal Year ===`,
        ``,
        `Monarch: ${selectedMonarch.name}`,
        `Reign began: ${startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`,
        ``,
        `Date: ${targetDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`,
        `Regnal Year: ${rYear} ${selectedMonarch.name}`,
        ``,
        `Written as: "${rYear} ${selectedMonarch.name}" or "${rYear} ${selectedMonarch.name.charAt(0)}."`,
      ];
      setOutput(results.join('\n'));
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-mode`} className="block text-sm font-medium text-gray-700 mb-1">Conversion Mode</label>
              <select id={`${toolId}-mode`} value={mode} onChange={(e) => setMode(e.target.value as 'toGregorian' | 'toRegnal')} className="input-field" aria-label={`Mode for ${toolName}`}>
                <option value="toGregorian">Regnal Year → Gregorian</option>
                <option value="toRegnal">Gregorian → Regnal Year</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${toolId}-monarch`} className="block text-sm font-medium text-gray-700 mb-1">Monarch</label>
              <select id={`${toolId}-monarch`} value={monarch} onChange={(e) => setMonarch(e.target.value)} className="input-field" aria-label="Select monarch">
                {Object.entries(monarchs).map(([key, m]) => (
                  <option key={key} value={key}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>
          {monarch === 'custom' && (
            <div>
              <label htmlFor={`${toolId}-custom`} className="block text-sm font-medium text-gray-700 mb-1">Custom Reign Start Date</label>
              <input id={`${toolId}-custom`} type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} className="input-field" aria-label="Custom reign start date" />
            </div>
          )}
          {mode === 'toGregorian' ? (
            <div>
              <label htmlFor={`${toolId}-regnal`} className="block text-sm font-medium text-gray-700 mb-1">Regnal Year</label>
              <input id={`${toolId}-regnal`} type="number" min="1" value={regnalYear} onChange={(e) => setRegnalYear(e.target.value)} placeholder="1" className="input-field" aria-label="Regnal year number" />
            </div>
          ) : (
            <div>
              <label htmlFor={`${toolId}-gregorian`} className="block text-sm font-medium text-gray-700 mb-1">Gregorian Date</label>
              <input id={`${toolId}-gregorian`} type="date" value={gregorianDate} onChange={(e) => setGregorianDate(e.target.value)} className="input-field" aria-label="Gregorian date" />
            </div>
          )}
          <button onClick={calculate} className="btn-primary">Convert</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
