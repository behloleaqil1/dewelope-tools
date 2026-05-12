'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const PATTERNS = [
  { pattern: '.', desc: 'Any character except newline' },
  { pattern: '\\d', desc: 'Digit (0-9)' },
  { pattern: '\\w', desc: 'Word character (a-z, A-Z, 0-9, _)' },
  { pattern: '\\s', desc: 'Whitespace (space, tab, newline)' },
  { pattern: '^', desc: 'Start of string' },
  { pattern: '$', desc: 'End of string' },
  { pattern: '*', desc: 'Zero or more' },
  { pattern: '+', desc: 'One or more' },
  { pattern: '?', desc: 'Zero or one (optional)' },
  { pattern: '{n,m}', desc: 'Between n and m times' },
  { pattern: '[abc]', desc: 'Character class (a, b, or c)' },
  { pattern: '[^abc]', desc: 'Not a, b, or c' },
  { pattern: '(abc)', desc: 'Capture group' },
  { pattern: 'a|b', desc: 'Alternation (a or b)' },
  { pattern: '\\b', desc: 'Word boundary' },
];

export default function RegexCheatSheet({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [filter, setFilter] = useState('');
  const filtered = PATTERNS.filter(p => p.pattern.includes(filter) || p.desc.toLowerCase().includes(filter.toLowerCase()));
  const copyText = filtered.map(p => `${p.pattern}  →  ${p.desc}`).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filter patterns..." aria-label={`Filter for ${toolName}`} className="input-field" />
      <OutputArea hasContent={filtered.length > 0}>
        <div className="space-y-1">
          {filtered.map(p => (
            <div key={p.pattern} className="flex items-center gap-3 p-2 bg-gray-50 rounded border border-gray-200">
              <code className="font-mono font-bold text-purple-600 min-w-[60px]">{p.pattern}</code>
              <span className="text-sm text-gray-700">{p.desc}</span>
            </div>
          ))}
          <CopyToClipboard text={copyText} />
        </div>
      </OutputArea>
    </div>
  );
}
