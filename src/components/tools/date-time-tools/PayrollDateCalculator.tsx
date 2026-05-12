'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PayrollDateCalculator - Calculate next payday based on pay frequency.
 */
export default function PayrollDateCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [lastPayday, setLastPayday] = useState('');
  const [frequency, setFrequency] = useState<'weekly' | 'biweekly' | 'semimonthly' | 'monthly'>('biweekly');
  const [result, setResult] = useState<{ nextPayday: string; daysUntil: number; upcoming: string[] } | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    setError('');
    setResult(null);

    if (!lastPayday) {
      setError('Please enter your last payday');
      return;
    }

    const last = new Date(lastPayday + 'T00:00:00');
    if (isNaN(last.getTime())) {
      setError('Invalid date');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const getNextPaydays = (startDate: Date, freq: string, count: number): Date[] => {
      const dates: Date[] = [];
      let current = new Date(startDate);

      while (dates.length < count) {
        let next: Date;

        switch (freq) {
          case 'weekly':
            next = new Date(current);
            next.setDate(next.getDate() + 7);
            break;
          case 'biweekly':
            next = new Date(current);
            next.setDate(next.getDate() + 14);
            break;
          case 'semimonthly': {
            next = new Date(current);
            const day = next.getDate();
            if (day <= 15) {
              next.setDate(15);
              if (next <= current) {
                const lastDay = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
                next.setDate(lastDay);
              }
            } else {
              next.setMonth(next.getMonth() + 1);
              next.setDate(1);
            }
            break;
          }
          case 'monthly':
            next = new Date(current);
            next.setMonth(next.getMonth() + 1);
            break;
          default:
            next = new Date(current);
            next.setDate(next.getDate() + 14);
        }

        if (next > today) {
          dates.push(next);
        }
        current = next;

        if (dates.length === 0 && current > new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000)) break;
      }

      return dates;
    };

    const upcoming = getNextPaydays(last, frequency, 6);

    if (upcoming.length === 0) {
      setError('Could not calculate upcoming paydays. Check your last payday date.');
      return;
    }

    const nextPayday = upcoming[0];
    const daysUntil = Math.ceil((nextPayday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    setResult({
      nextPayday: nextPayday.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      daysUntil,
      upcoming: upcoming.map(d => d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })),
    });
  };

  const copyText = result
    ? `Next Payday: ${result.nextPayday}\nDays Until: ${result.daysUntil}\n\nUpcoming:\n${result.upcoming.join('\n')}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-last`} className="block text-sm font-medium text-gray-700 mb-1">Last Payday</label>
        <input id={`${toolId}-last`} type="date" value={lastPayday} onChange={(e) => setLastPayday(e.target.value)} aria-label={`Last payday for ${toolName}`} className="input-field" />
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-freq`} className="block text-sm font-medium text-gray-700 mb-1">Pay Frequency</label>
        <select id={`${toolId}-freq`} value={frequency} onChange={(e) => setFrequency(e.target.value as 'weekly' | 'biweekly' | 'semimonthly' | 'monthly')} className="input-field" aria-label={`Pay frequency for ${toolName}`}>
          <option value="weekly">Weekly</option>
          <option value="biweekly">Bi-weekly (every 2 weeks)</option>
          <option value="semimonthly">Semi-monthly (1st &amp; 15th)</option>
          <option value="monthly">Monthly</option>
        </select>
      </InputArea>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <button onClick={calculate} className="btn-primary" aria-label="Calculate next payday">Calculate Next Payday</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-xl font-bold text-green-600">{result.nextPayday}</div>
              <div className="text-sm text-gray-500 mt-1">{result.daysUntil} day{result.daysUntil !== 1 ? 's' : ''} from today</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upcoming Paydays</label>
              <div className="space-y-1">
                {result.upcoming.map((date, i) => (
                  <div key={i} className="text-sm font-mono text-gray-700 bg-gray-50 px-3 py-2 rounded border border-gray-200">{date}</div>
                ))}
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
