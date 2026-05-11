'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const METHODS = [
  { method: 'GET', desc: 'Retrieve a resource. Safe, idempotent, cacheable.', body: 'No' },
  { method: 'POST', desc: 'Create a resource or submit data. Not idempotent.', body: 'Yes' },
  { method: 'PUT', desc: 'Replace a resource entirely. Idempotent.', body: 'Yes' },
  { method: 'PATCH', desc: 'Partially update a resource. Not necessarily idempotent.', body: 'Yes' },
  { method: 'DELETE', desc: 'Remove a resource. Idempotent.', body: 'Optional' },
  { method: 'HEAD', desc: 'Same as GET but without response body. Safe, idempotent.', body: 'No' },
  { method: 'OPTIONS', desc: 'Describe communication options. Used in CORS preflight.', body: 'No' },
  { method: 'TRACE', desc: 'Loop-back test along the path to the target resource.', body: 'No' },
];

export default function HttpMethodReference({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [filter, setFilter] = useState('');
  const filtered = METHODS.filter(m => m.method.toLowerCase().includes(filter.toLowerCase()) || m.desc.toLowerCase().includes(filter.toLowerCase()));
  const copyText = filtered.map(m => `${m.method}: ${m.desc} (Body: ${m.body})`).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filter methods..." aria-label={`Filter for ${toolName}`} className="input-field" />
      <OutputArea hasContent={true}>
        <div className="space-y-2">
          {filtered.map(m => (
            <div key={m.method} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="font-bold text-blue-600">{m.method}</span>
              <span className="text-sm text-gray-600 ml-2">{m.desc}</span>
              <span className="text-xs text-gray-500 ml-2">(Body: {m.body})</span>
            </div>
          ))}
          <CopyToClipboard text={copyText} />
        </div>
      </OutputArea>
    </div>
  );
}
