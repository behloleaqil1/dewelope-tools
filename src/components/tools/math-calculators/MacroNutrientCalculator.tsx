'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function MacroNutrientCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [calories, setCalories] = useState('');
  const [split, setSplit] = useState('balanced');
  const [output, setOutput] = useState('');

  const splits: Record<string, [number, number, number]> = { balanced: [0.3, 0.4, 0.3], lowcarb: [0.4, 0.2, 0.4], highcarb: [0.2, 0.55, 0.25], keto: [0.6, 0.1, 0.3] };

  const calculate = () => {
    const cal = parseFloat(calories);
    if (isNaN(cal) || cal <= 0) { setOutput('Enter valid calorie amount'); return; }
    const [fatPct, carbPct, protPct] = splits[split];
    const fat = (cal * fatPct) / 9;
    const carbs = (cal * carbPct) / 4;
    const protein = (cal * protPct) / 4;
    setOutput(`Daily Calories: ${cal} kcal\nSplit: ${split}\n\nProtein: ${protein.toFixed(0)}g (${(protPct * 100).toFixed(0)}% = ${(cal * protPct).toFixed(0)} kcal)\nCarbs: ${carbs.toFixed(0)}g (${(carbPct * 100).toFixed(0)}% = ${(cal * carbPct).toFixed(0)} kcal)\nFat: ${fat.toFixed(0)}g (${(fatPct * 100).toFixed(0)}% = ${(cal * fatPct).toFixed(0)} kcal)`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-cal`} className="block text-sm font-medium text-gray-700 mb-1">Daily Calories (kcal)</label>
        <input id={`${toolId}-cal`} value={calories} onChange={(e) => setCalories(e.target.value)} placeholder="2000" className="input-field" aria-label={`Calories for ${toolName}`} />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-split`} className="block text-sm font-medium text-gray-700 mb-1">Macro Split</label>
        <select id={`${toolId}-split`} value={split} onChange={(e) => setSplit(e.target.value)} className="input-field" aria-label={`Split for ${toolName}`}>
          <option value="balanced">Balanced (30/40/30)</option><option value="lowcarb">Low Carb (40/20/40)</option><option value="highcarb">High Carb (20/55/25)</option><option value="keto">Keto (60/10/30)</option>
        </select>
      </InputArea>
      <button onClick={calculate} className="btn-primary">Calculate Macros</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
