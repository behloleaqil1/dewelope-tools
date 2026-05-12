'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const ACTIVITIES: Record<string, number> = { walking: 3.5, running: 8.0, cycling: 6.0, swimming: 7.0, yoga: 2.5, weightlifting: 5.0, dancing: 4.5, hiking: 5.5 };

export default function CalorieBurnCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [weight, setWeight] = useState('');
  const [duration, setDuration] = useState('');
  const [activity, setActivity] = useState('running');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const w = parseFloat(weight), d = parseFloat(duration);
    if (isNaN(w) || isNaN(d) || w <= 0 || d <= 0) { setOutput('Enter valid weight and duration'); return; }
    const met = ACTIVITIES[activity];
    const calories = (met * w * d) / 60;
    setOutput(`Calories Burned: ~${Math.round(calories)} kcal\nActivity: ${activity}\nMET Value: ${met}\nWeight: ${w} kg\nDuration: ${d} minutes`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-weight`} className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
        <input id={`${toolId}-weight`} value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="70" className="input-field" aria-label={`Weight for ${toolName}`} />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-activity`} className="block text-sm font-medium text-gray-700 mb-1">Activity</label>
        <select id={`${toolId}-activity`} value={activity} onChange={(e) => setActivity(e.target.value)} className="input-field" aria-label={`Activity for ${toolName}`}>
          {Object.keys(ACTIVITIES).map(a => <option key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1)}</option>)}
        </select>
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-duration`} className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
        <input id={`${toolId}-duration`} value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="30" className="input-field" aria-label={`Duration for ${toolName}`} />
      </InputArea>
      <button onClick={calculate} className="btn-primary">Calculate Calories</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
