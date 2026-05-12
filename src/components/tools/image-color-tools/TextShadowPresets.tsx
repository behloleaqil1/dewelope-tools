'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const PRESETS = [
  { name: 'Simple', value: '1px 1px 2px rgba(0,0,0,0.3)' },
  { name: 'Hard', value: '2px 2px 0px #333' },
  { name: 'Glow', value: '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #3b82f6' },
  { name: 'Neon', value: '0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, 0 0 42px #0fa, 0 0 82px #0fa' },
  { name: 'Retro', value: '3px 3px 0 #f59e0b, 6px 6px 0 #ef4444' },
  { name: 'Emboss', value: '-1px -1px 0 rgba(255,255,255,0.3), 1px 1px 0 rgba(0,0,0,0.8)' },
  { name: '3D', value: '0 1px 0 #ccc, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9, 0 5px 0 #aaa' },
  { name: 'Fire', value: '0 0 4px #fff, 0 -5px 4px #ff3, 2px -10px 6px #fd3, -2px -15px 11px #f80, 2px -25px 18px #f20' },
];

export default function TextShadowPresets({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selected, setSelected] = useState(PRESETS[0]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {PRESETS.map(p => (
          <button key={p.name} onClick={() => setSelected(p)} className={`p-3 rounded-lg border text-center ${selected.name === p.name ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`} aria-label={`${p.name} for ${toolName}`}>
            <span className="text-lg font-bold" style={{ textShadow: p.value }}>{p.name}</span>
          </button>
        ))}
      </div>
      <OutputArea hasContent={true}>
        <div className="space-y-3">
          <div className="p-8 bg-gray-800 rounded-lg text-center"><span className="text-4xl font-bold text-white" style={{ textShadow: selected.value }}>Preview</span></div>
          <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{`text-shadow: ${selected.value};`}</pre>
          <CopyToClipboard text={`text-shadow: ${selected.value};`} />
        </div>
      </OutputArea>
    </div>
  );
}
