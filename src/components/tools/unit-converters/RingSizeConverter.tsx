'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const SIZES = [
  { us: 3, uk: 'F', eu: 44, mm: 14.0 },
  { us: 4, uk: 'H', eu: 46.5, mm: 14.9 },
  { us: 5, uk: 'J', eu: 49, mm: 15.7 },
  { us: 6, uk: 'L', eu: 51.5, mm: 16.5 },
  { us: 7, uk: 'N', eu: 54, mm: 17.3 },
  { us: 8, uk: 'P', eu: 57, mm: 18.1 },
  { us: 9, uk: 'R', eu: 59, mm: 19.0 },
  { us: 10, uk: 'T', eu: 62, mm: 19.8 },
  { us: 11, uk: 'V', eu: 64, mm: 20.6 },
  { us: 12, uk: 'X', eu: 66.5, mm: 21.4 },
  { us: 13, uk: 'Z', eu: 69, mm: 22.2 },
];

export default function RingSizeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [usSize, setUsSize] = useState('7');
  const [result, setResult] = useState('');

  const convert = () => {
    const us = parseFloat(usSize);
    const match = SIZES.find(s => s.us === us);
    if (!match) {
      setResult('Size not found. Try US sizes 3-13.');
      return;
    }
    setResult(`US Size: ${match.us}\nUK Size: ${match.uk}\nEU Size: ${match.eu}\nDiameter: ${match.mm} mm\nCircumference: ${(match.mm * Math.PI).toFixed(1)} mm`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-us`} className="block text-sm font-medium text-gray-700 mb-1">US Ring Size</label>
        <select id={`${toolId}-us`} value={usSize} onChange={(e) => setUsSize(e.target.value)} aria-label={`US size for ${toolName}`} className="input-field">
          {SIZES.map(s => <option key={s.us} value={s.us}>{s.us}</option>)}
        </select>
      </InputArea>
      <button onClick={convert} className="btn-primary" aria-label="Convert ring size">Convert</button>
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
