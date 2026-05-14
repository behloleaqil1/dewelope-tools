'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * HeartRateTrainingZoneCalculator - Calculate heart rate training zones from age and resting HR.
 */
export default function HeartRateTrainingZoneCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [age, setAge] = useState('');
  const [restingHr, setRestingHr] = useState('');

  const calculate = (): string => {
    const a = parseInt(age);
    const rhr = parseInt(restingHr) || 60;
    if (isNaN(a) || a < 10 || a > 100) return '';

    const maxHr = 220 - a;
    const hrReserve = maxHr - rhr;

    const zones = [
      { name: 'Zone 1 - Recovery', min: 0.5, max: 0.6, desc: 'Very light, warm-up/cool-down' },
      { name: 'Zone 2 - Endurance', min: 0.6, max: 0.7, desc: 'Light, fat burning, base fitness' },
      { name: 'Zone 3 - Aerobic', min: 0.7, max: 0.8, desc: 'Moderate, improves cardiovascular fitness' },
      { name: 'Zone 4 - Threshold', min: 0.8, max: 0.9, desc: 'Hard, increases speed endurance' },
      { name: 'Zone 5 - Maximum', min: 0.9, max: 1.0, desc: 'Maximum effort, short intervals' },
    ];

    const lines = zones.map(z => {
      const low = Math.round(hrReserve * z.min + rhr);
      const high = Math.round(hrReserve * z.max + rhr);
      return `${z.name}\n  ${low} - ${high} bpm (${Math.round(z.min * 100)}-${Math.round(z.max * 100)}%)\n  ${z.desc}`;
    });

    return `Max Heart Rate: ${maxHr} bpm\nResting HR: ${rhr} bpm\nHR Reserve: ${hrReserve} bpm\n(Karvonen Method)\n\n${lines.join('\n\n')}`;
  };

  const result = calculate();

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div>
        <label htmlFor={`${toolId}-age`} className="block text-sm font-medium text-gray-700 mb-1">Age</label>
        <input id={`${toolId}-age`} type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="30" min="10" max="100" aria-label={`Age for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label htmlFor={`${toolId}-rhr`} className="block text-sm font-medium text-gray-700 mb-1">Resting Heart Rate (bpm)</label>
        <input id={`${toolId}-rhr`} type="number" value={restingHr} onChange={(e) => setRestingHr(e.target.value)} placeholder="60" min="30" max="120" aria-label={`Resting heart rate for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 bg-gray-50 p-3 rounded-lg">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
