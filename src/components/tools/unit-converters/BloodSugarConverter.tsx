'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function BloodSugarConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [unit, setUnit] = useState<'mgdl' | 'mmol'>('mgdl');
  const [output, setOutput] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!input) { setOutput(''); return; }
    debounceRef.current = setTimeout(() => {
      const val = parseFloat(input);
      if (isNaN(val)) { setOutput('Enter a valid number'); return; }
      if (unit === 'mgdl') {
        const mmol = val / 18.0182;
        setOutput(`${val} mg/dL = ${mmol.toFixed(2)} mmol/L\n\nNormal fasting: 70-100 mg/dL (3.9-5.6 mmol/L)\nPre-diabetic: 100-125 mg/dL (5.6-6.9 mmol/L)`);
      } else {
        const mgdl = val * 18.0182;
        setOutput(`${val} mmol/L = ${mgdl.toFixed(1)} mg/dL\n\nNormal fasting: 3.9-5.6 mmol/L (70-100 mg/dL)\nPre-diabetic: 5.6-6.9 mmol/L (100-125 mg/dL)`);
      }
    }, 200);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input, unit]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">From Unit</label>
        <select id={`${toolId}-unit`} value={unit} onChange={(e) => setUnit(e.target.value as 'mgdl' | 'mmol')} className="input-field" aria-label={`Unit for ${toolName}`}>
          <option value="mgdl">mg/dL → mmol/L</option><option value="mmol">mmol/L → mg/dL</option>
        </select>
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Value</label>
        <input id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder={unit === 'mgdl' ? '100' : '5.5'} className="input-field" aria-label={`Value for ${toolName}`} />
      </InputArea>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
