'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const PRESETS = [
  { name: 'Subtle', value: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)' },
  { name: 'Medium', value: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)' },
  { name: 'Large', value: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)' },
  { name: 'Floating', value: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)' },
  { name: 'Inset', value: 'inset 0 2px 4px rgba(0,0,0,0.1)' },
  { name: 'Neon Blue', value: '0 0 10px #3b82f6, 0 0 40px #3b82f6' },
  { name: 'Neon Pink', value: '0 0 10px #ec4899, 0 0 40px #ec4899' },
  { name: 'Soft', value: '0 2px 15px -3px rgba(0,0,0,0.07), 0 10px 20px -2px rgba(0,0,0,0.04)' },
];

export default function BoxShadowPresets({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selected, setSelected] = useState(PRESETS[0]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {PRESETS.map(p => (
          <button key={p.name} onClick={() => setSelected(p)} className={`p-4 rounded-lg border text-sm ${selected.name === p.name ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`} aria-label={`${p.name} preset for ${toolName}`}>
            <div className="w-full h-12 bg-white rounded" style={{ boxShadow: p.value }} />
            <span className="mt-2 block text-xs text-gray-600">{p.name}</span>
          </button>
        ))}
      </div>
      <OutputArea hasContent={true}>
        <div className="space-y-3">
          <div className="p-8 flex justify-center"><div className="w-32 h-32 bg-white rounded-lg" style={{ boxShadow: selected.value }} /></div>
          <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{`box-shadow: ${selected.value};`}</pre>
          <CopyToClipboard text={`box-shadow: ${selected.value};`} />
        </div>
      </OutputArea>
    </div>
  );
}
