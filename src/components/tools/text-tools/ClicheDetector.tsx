'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const CLICHES: { phrase: string; alternative: string }[] = [
  { phrase: 'at the end of the day', alternative: 'ultimately, in conclusion' },
  { phrase: 'think outside the box', alternative: 'be creative, innovate' },
  { phrase: 'low-hanging fruit', alternative: 'easy wins, simple tasks' },
  { phrase: 'move the needle', alternative: 'make progress, create impact' },
  { phrase: 'hit the ground running', alternative: 'start quickly, begin immediately' },
  { phrase: 'circle back', alternative: 'revisit, follow up' },
  { phrase: 'deep dive', alternative: 'thorough analysis, detailed review' },
  { phrase: 'game changer', alternative: 'significant improvement, breakthrough' },
  { phrase: 'paradigm shift', alternative: 'fundamental change, new approach' },
  { phrase: 'synergy', alternative: 'collaboration, combined effort' },
  { phrase: 'leverage', alternative: 'use, utilize, apply' },
  { phrase: 'best practice', alternative: 'recommended approach, proven method' },
  { phrase: 'touch base', alternative: 'connect, check in' },
  { phrase: 'bandwidth', alternative: 'capacity, availability' },
  { phrase: 'on the same page', alternative: 'in agreement, aligned' },
  { phrase: 'take it to the next level', alternative: 'improve, advance' },
  { phrase: 'at this point in time', alternative: 'now, currently' },
  { phrase: 'it goes without saying', alternative: 'clearly, obviously' },
  { phrase: 'in this day and age', alternative: 'today, currently' },
  { phrase: 'few and far between', alternative: 'rare, uncommon' },
  { phrase: 'last but not least', alternative: 'finally, also important' },
  { phrase: 'needless to say', alternative: 'clearly, obviously' },
  { phrase: 'easier said than done', alternative: 'challenging, difficult in practice' },
  { phrase: 'the bottom line', alternative: 'the key point, essentially' },
  { phrase: 'a no-brainer', alternative: 'an obvious choice, clearly beneficial' },
  { phrase: 'cutting edge', alternative: 'innovative, advanced, modern' },
  { phrase: 'win-win', alternative: 'mutually beneficial' },
  { phrase: 'pain point', alternative: 'problem, challenge, issue' },
  { phrase: 'value add', alternative: 'benefit, contribution' },
  { phrase: 'actionable', alternative: 'practical, implementable' },
];

/**
 * ClicheDetector - Detects cliches in text and suggests alternatives.
 */
export default function ClicheDetector({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [found, setFound] = useState<{ phrase: string; alternative: string; count: number }[]>([]);

  const detect = () => {
    setError(undefined);
    setFound([]);
    if (!text.trim()) { setError('Please enter text to analyze'); return; }

    const lower = text.toLowerCase();
    const results: { phrase: string; alternative: string; count: number }[] = [];

    for (const cliche of CLICHES) {
      const regex = new RegExp(cliche.phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      const matches = lower.match(regex);
      if (matches) {
        results.push({ phrase: cliche.phrase, alternative: cliche.alternative, count: matches.length });
      }
    }

    results.sort((a, b) => b.count - a.count);
    setFound(results);
  };

  const copyText = found.length > 0 ? `Cliches found: ${found.length}\n\n${found.map(f => `"${f.phrase}" (${f.count}x) → Try: ${f.alternative}`).join('\n')}` : 'No cliches detected';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Text to Analyze</label>
        <textarea id={`${toolId}-input`} value={text} onChange={(e) => setText(e.target.value)} placeholder="At the end of the day, we need to think outside the box and move the needle..." aria-label={`Text input for ${toolName}`} className="input-field min-h-[120px]" />
      </InputArea>
      <button onClick={detect} aria-label="Detect cliches" className="btn-primary">Detect Clichés</button>
      <OutputArea hasContent={found.length > 0 || text.trim().length > 0}>
        {found.length > 0 ? (
          <div className="space-y-3">
            <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 text-center">
              <div className="text-xl font-bold text-orange-700">{found.length}</div>
              <div className="text-xs text-gray-500">Clichés Detected</div>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {found.map((f, i) => (
                <div key={i} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-red-700 line-through">&quot;{f.phrase}&quot;</span>
                    <span className="text-xs text-gray-500">{f.count}×</span>
                  </div>
                  <div className="text-sm text-green-700">→ Try: {f.alternative}</div>
                </div>
              ))}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        ) : text.trim().length > 0 ? (
          <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-center text-green-700 text-sm">No clichés detected. Your writing is fresh and original.</div>
        ) : null}
      </OutputArea>
    </div>
  );
}
