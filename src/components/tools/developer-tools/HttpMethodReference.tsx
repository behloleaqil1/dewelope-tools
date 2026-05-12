'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const METHODS = [
  { method: 'GET', desc: 'Retrieve a resource. Safe, idempotent, cacheable.' },
  { method: 'POST', desc: 'Create a resource. Not idempotent.' },
  { method: 'PUT', desc: 'Replace a resource entirely. Idempotent.' },
  { method: 'PATCH', desc: 'Partially update a resource. Not necessarily idempotent.' },
  { method: 'DELETE', desc: 'Remove a resource. Idempotent.' },
  { method: 'HEAD', desc: 'Same as GET but without response body.' },
  { method: 'OPTIONS', desc: 'Describe communication options for the target resource.' },
];

export default function HttpMethodReference({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [filter, setFilter] = useState('');
  const filtered = METHODS.filter(m => m.method.toLowerCase().includes(filter.toLowerCase()) || m.desc.toLowerCase().includes(filter.toLowerCase()));
  const copyText = filtered.map(m => `${m.method}: ${m.desc}`).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filter methods..." aria-label={`Filter for ${toolName}`} className="input-field" />
      <OutputArea hasContent={filtered.length > 0}>
        <div className="space-y-2">
          {filtered.map(m => (
            <div key={m.method} className="p-3 bg-gray-50 rounded border border-gray-200">
              <span className="font-bold text-blue-600">{m.method}</span>
              <span className="ml-2 text-sm text-gray-700">{m.desc}</span>
            </div>
          ))}
          <CopyToClipboard text={copyText} />
        </div>
      </OutputArea>
    </div>
  );
}
