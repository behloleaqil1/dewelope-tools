'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * BiorhythmCalculator - Calculate biorhythm cycles from birth date.
 * Shows physical (23-day), emotional (28-day), and intellectual (33-day) cycles.
 */

interface BiorhythmResult {
  daysAlive: number;
  physical: number;
  emotional: number;
  intellectual: number;
  physicalPhase: string;
  emotionalPhase: string;
  intellectualPhase: string;
  criticalDays: string[];
}

function getPhase(value: number): string {
  if (Math.abs(value) < 0.05) return 'Critical (crossing zero)';
  if (value > 0.7) return 'Peak';
  if (value > 0.3) return 'High';
  if (value > 0) return 'Rising';
  if (value > -0.3) return 'Declining';
  if (value > -0.7) return 'Low';
  return 'Valley';
}

export default function BiorhythmCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [birthDate, setBirthDate] = useState('');
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');
  const [result, setResult] = useState<BiorhythmResult | null>(null);

  const calculate = () => {
    setError('');
    setResult(null);

    if (!birthDate) { setError('Please enter your birth date'); return; }

    const birth = new Date(birthDate);
    const target = new Date(targetDate || new Date().toISOString().split('T')[0]);

    if (isNaN(birth.getTime())) { setError('Invalid birth date'); return; }
    if (target <= birth) { setError('Target date must be after birth date'); return; }

    const diffMs = target.getTime() - birth.getTime();
    const daysAlive = Math.floor(diffMs / 86400000);

    const physical = Math.sin((2 * Math.PI * daysAlive) / 23);
    const emotional = Math.sin((2 * Math.PI * daysAlive) / 28);
    const intellectual = Math.sin((2 * Math.PI * daysAlive) / 33);

    // Find critical days in next 7 days
    const criticalDays: string[] = [];
    for (let d = 0; d <= 7; d++) {
      const futureDay = daysAlive + d;
      const pVal = Math.sin((2 * Math.PI * futureDay) / 23);
      const eVal = Math.sin((2 * Math.PI * futureDay) / 28);
      const iVal = Math.sin((2 * Math.PI * futureDay) / 33);

      const prevP = Math.sin((2 * Math.PI * (futureDay - 1)) / 23);
      const prevE = Math.sin((2 * Math.PI * (futureDay - 1)) / 28);
      const prevI = Math.sin((2 * Math.PI * (futureDay - 1)) / 33);

      const futureDate = new Date(target.getTime() + d * 86400000);
      const dateStr = futureDate.toLocaleDateString();

      if ((pVal >= 0 && prevP < 0) || (pVal <= 0 && prevP > 0)) {
        criticalDays.push(`${dateStr}: Physical critical day`);
      }
      if ((eVal >= 0 && prevE < 0) || (eVal <= 0 && prevE > 0)) {
        criticalDays.push(`${dateStr}: Emotional critical day`);
      }
      if ((iVal >= 0 && prevI < 0) || (iVal <= 0 && prevI > 0)) {
        criticalDays.push(`${dateStr}: Intellectual critical day`);
      }
    }

    setResult({
      daysAlive,
      physical: Math.round(physical * 1000) / 1000,
      emotional: Math.round(emotional * 1000) / 1000,
      intellectual: Math.round(intellectual * 1000) / 1000,
      physicalPhase: getPhase(physical),
      emotionalPhase: getPhase(emotional),
      intellectualPhase: getPhase(intellectual),
      criticalDays,
    });
  };

  const getBarColor = (value: number, type: string): string => {
    const colors: Record<string, string[]> = {
      physical: ['bg-red-200', 'bg-red-500'],
      emotional: ['bg-green-200', 'bg-green-500'],
      intellectual: ['bg-blue-200', 'bg-blue-500'],
    };
    return value >= 0 ? colors[type][1] : colors[type][0];
  };

  const copyText = result
    ? `Biorhythm for ${targetDate}\nDays alive: ${result.daysAlive}\nPhysical: ${(result.physical * 100).toFixed(1)}% (${result.physicalPhase})\nEmotional: ${(result.emotional * 100).toFixed(1)}% (${result.emotionalPhase})\nIntellectual: ${(result.intellectual * 100).toFixed(1)}% (${result.intellectualPhase})${result.criticalDays.length > 0 ? '\n\nUpcoming Critical Days:\n' + result.criticalDays.join('\n') : ''}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputArea error={error}>
          <label htmlFor={`${toolId}-birth`} className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
          <input id={`${toolId}-birth`} type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} aria-label={`Birth date for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-target`} className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
          <input id={`${toolId}-target`} type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} aria-label={`Target date for ${toolName}`} className="input-field" />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate biorhythm" className="btn-primary">Calculate Biorhythm</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-4">
            <div className="text-center bg-gray-50 p-3 rounded-lg border border-gray-200">
              <span className="text-sm text-gray-600">Days alive: </span>
              <span className="text-lg font-bold text-gray-800">{result.daysAlive.toLocaleString()}</span>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Physical', value: result.physical, phase: result.physicalPhase, color: 'red', cycle: '23-day' },
                { label: 'Emotional', value: result.emotional, phase: result.emotionalPhase, color: 'green', cycle: '28-day' },
                { label: 'Intellectual', value: result.intellectual, phase: result.intellectualPhase, color: 'blue', cycle: '33-day' },
              ].map((bio) => (
                <div key={bio.label} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">{bio.label} <span className="text-xs text-gray-400">({bio.cycle})</span></span>
                    <span className={`text-sm font-bold text-${bio.color}-600`}>{(bio.value * 100).toFixed(1)}%</span>
                  </div>
                  <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div className="absolute inset-y-0 left-1/2 w-px bg-gray-400 z-10" />
                    <div
                      className={`absolute inset-y-0 ${bio.value >= 0 ? 'left-1/2' : ''} rounded-full ${getBarColor(bio.value, bio.label.toLowerCase())}`}
                      style={{
                        width: `${Math.abs(bio.value) * 50}%`,
                        ...(bio.value < 0 ? { right: '50%' } : {}),
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{bio.phase}</div>
                </div>
              ))}
            </div>

            {result.criticalDays.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Upcoming Critical Days (next 7 days)</h4>
                <ul className="space-y-1">
                  {result.criticalDays.map((day, i) => (
                    <li key={i} className="text-sm text-orange-700 bg-orange-50 p-2 rounded border border-orange-200">⚠️ {day}</li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-xs text-gray-500">Biorhythm theory suggests physical, emotional, and intellectual cycles begin at birth. Critical days occur when cycles cross zero. This is for entertainment purposes only.</p>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
