'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const RING_SIZES = [
  { us: '4', uk: 'H', eu: '46.8', mm: '14.9' }, { us: '5', uk: 'J½', eu: '49.3', mm: '15.7' },
  { us: '6', uk: 'L½', eu: '51.9', mm: '16.5' }, { us: '7', uk: 'N½', eu: '54.4', mm: '17.3' },
  { us: '8', uk: 'P½', eu: '57.0', mm: '18.1' }, { us: '9', uk: 'R½', eu: '59.5', mm: '18.9' },
  { us: '10', uk: 'T½', eu: '62.1', mm: '19.8' }, { us: '11', uk: 'V½', eu: '64.6', mm: '20.6' },
  { us: '12', uk: 'X½', eu: '67.2', mm: '21.4' }, { us: '13', uk: 'Z+1', eu: '69.7', mm: '22.2' },
];

export default function RingSizeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selected, setSelected] = useState('6');
  const [output, setOutput] = useState('');

  const convert = () => {
    const match = RING_SIZES.find(r => r.us === selected);
    if (!match) { setOutput('Size not found'); return; }
    setOutput(`US: ${match.us}\nUK: ${match.uk}\nEU: ${match.eu}\nDiameter: ${match.mm} mm`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">US Ring Size</label>
        <select id={`${toolId}-size`} value={selected} onChange={(e) => setSelected(e.target.value)} className="input-field" aria-label={`Size for ${toolName}`}>
          {RING_SIZES.map(r => <option key={r.us} value={r.us}>US {r.us}</option>)}
        </select>
      </InputArea>
      <button onClick={convert} className="btn-primary">Convert</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
