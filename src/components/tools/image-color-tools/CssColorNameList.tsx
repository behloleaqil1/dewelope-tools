'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';


export default function CssColorNameList({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [filter, setFilter] = useState('');
  const filtered = COLORS.filter(c => c.includes(filter.toLowerCase()));
  const copyText = filtered.join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filter colors..." aria-label={`Filter for ${toolName}`} className="input-field" />
      <OutputArea hasContent={filtered.length > 0}>
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {filtered.map(c => (
            <div key={c} className="flex items-center gap-2 p-1">
              <div className="w-6 h-6 rounded border border-gray-300" style={{ backgroundColor: c }} />
              <code className="text-sm font-mono">{c}</code>
            </div>
          ))}
        </div>
        <CopyToClipboard text={copyText} />
      </OutputArea>
    </div>
  );
}
