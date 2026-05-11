'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const SECTIONS = [
  { title: 'Character Classes', items: [
    { pattern: '.', desc: 'Any character except newline' }, { pattern: '\\d', desc: 'Digit (0-9)' },
    { pattern: '\\D', desc: 'Not a digit' }, { pattern: '\\w', desc: 'Word character (a-z, A-Z, 0-9, _)' },
    { pattern: '\\W', desc: 'Not a word character' }, { pattern: '\\s', desc: 'Whitespace' },
    { pattern: '\\S', desc: 'Not whitespace' }, { pattern: '[abc]', desc: 'Any of a, b, or c' },
    { pattern: '[^abc]', desc: 'Not a, b, or c' }, { pattern: '[a-z]', desc: 'Range a to z' },
  ]},
  { title: 'Quantifiers', items: [
    { pattern: '*', desc: '0 or more' }, { pattern: '+', desc: '1 or more' },
    { pattern: '?', desc: '0 or 1' }, { pattern: '{n}', desc: 'Exactly n' },
    { pattern: '{n,}', desc: 'n or more' }, { pattern: '{n,m}', desc: 'Between n and m' },
  ]},
  { title: 'Anchors', items: [
    { pattern: '^', desc: 'Start of string' }, { pattern: '$', desc: 'End of string' },
    { pattern: '\\b', desc: 'Word boundary' }, { pattern: '\\B', desc: 'Not word boundary' },
  ]},
  { title: 'Groups', items: [
    { pattern: '(abc)', desc: 'Capture group' }, { pattern: '(?:abc)', desc: 'Non-capture group' },
    { pattern: '(?=abc)', desc: 'Positive lookahead' }, { pattern: '(?!abc)', desc: 'Negative lookahead' },
    { pattern: 'a|b', desc: 'Alternation (a or b)' },
  ]},
];

export default function RegexCheatSheet({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [filter, setFilter] = useState('');
  const copyText = SECTIONS.flatMap(s => s.items.map(i => `${i.pattern}\t${i.desc}`)).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search patterns..." aria-label={`Search for ${toolName}`} className="input-field" />
      <OutputArea hasContent={true}>
        <div className="space-y-4">
          {SECTIONS.map(section => {
            const items = section.items.filter(i => !filter || i.pattern.includes(filter) || i.desc.toLowerCase().includes(filter.toLowerCase()));
            if (items.length === 0) return null;
            return (
              <div key={section.title}>
                <h3 className="font-bold text-gray-700 mb-1">{section.title}</h3>
                {items.map((item, i) => (
                  <div key={i} className="flex gap-4 py-1 text-sm border-b border-gray-100">
                    <code className="font-mono text-blue-600 w-20 flex-shrink-0">{item.pattern}</code>
                    <span className="text-gray-700">{item.desc}</span>
                  </div>
                ))}
              </div>
            );
          })}
          <CopyToClipboard text={copyText} />
        </div>
      </OutputArea>
    </div>
  );
}
