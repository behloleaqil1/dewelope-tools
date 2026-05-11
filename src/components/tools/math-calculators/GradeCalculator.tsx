'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function GradeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [items, setItems] = useState([{ name: 'Assignment 1', score: '', weight: '' }]);
  const [result, setResult] = useState('');

  const addItem = () => setItems([...items, { name: `Assignment ${items.length + 1}`, score: '', weight: '' }]);
  const updateItem = (i: number, field: string, val: string) => {
    const updated = [...items];
    updated[i] = { ...updated[i], [field]: val };
    setItems(updated);
  };

  const calculate = () => {
    let totalWeight = 0, weightedSum = 0;
    for (const item of items) {
      const s = parseFloat(item.score);
      const w = parseFloat(item.weight);
      if (isNaN(s) || isNaN(w)) continue;
      weightedSum += s * w;
      totalWeight += w;
    }
    if (totalWeight === 0) return;
    const grade = weightedSum / totalWeight;
    const letter = grade >= 90 ? 'A' : grade >= 80 ? 'B' : grade >= 70 ? 'C' : grade >= 60 ? 'D' : 'F';
    setResult(`Final Grade: ${grade.toFixed(2)}% (${letter})\nTotal Weight: ${totalWeight}%`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      {items.map((item, i) => (
        <div key={i} className="grid grid-cols-3 gap-2">
          <input type="text" value={item.name} onChange={(e) => updateItem(i, 'name', e.target.value)} className="input-field text-sm" aria-label={`Item name ${i + 1}`} />
          <input type="text" inputMode="decimal" value={item.score} onChange={(e) => updateItem(i, 'score', e.target.value)} placeholder="Score %" className="input-field text-sm" aria-label={`Score ${i + 1} for ${toolName}`} />
          <input type="text" inputMode="decimal" value={item.weight} onChange={(e) => updateItem(i, 'weight', e.target.value)} placeholder="Weight %" className="input-field text-sm" aria-label={`Weight ${i + 1} for ${toolName}`} />
        </div>
      ))}
      <div className="flex gap-2">
        <button onClick={addItem} className="btn-primary bg-gray-600 hover:bg-gray-700" aria-label="Add item">+ Add Item</button>
        <button onClick={calculate} className="btn-primary" aria-label="Calculate grade">Calculate Grade</button>
      </div>
      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
