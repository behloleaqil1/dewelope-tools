'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function DailyWaterIntake({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [weight, setWeight] = useState('');
  const [activity, setActivity] = useState('moderate');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0) { setOutput('Enter valid weight in kg'); return; }
    const base = w * 0.033;
    const multiplier = activity === 'sedentary' ? 1.0 : activity === 'moderate' ? 1.2 : 1.5;
    const liters = base * multiplier;
    const cups = liters / 0.25;
    const oz = liters * 33.814;
    setOutput(`Recommended Daily Water Intake:\n${liters.toFixed(1)} liters\n${oz.toFixed(0)} fl oz\n~${Math.round(cups)} cups (250ml)\n\nWeight: ${w} kg\nActivity: ${activity}\nFormula: weight × 0.033 × activity multiplier`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-weight`} className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
        <input id={`${toolId}-weight`} value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="70" className="input-field" aria-label={`Weight for ${toolName}`} />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-activity`} className="block text-sm font-medium text-gray-700 mb-1">Activity Level</label>
        <select id={`${toolId}-activity`} value={activity} onChange={(e) => setActivity(e.target.value)} className="input-field" aria-label={`Activity for ${toolName}`}>
          <option value="sedentary">Sedentary</option><option value="moderate">Moderate</option><option value="active">Very Active</option>
        </select>
      </InputArea>
      <button onClick={calculate} className="btn-primary">Calculate</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
