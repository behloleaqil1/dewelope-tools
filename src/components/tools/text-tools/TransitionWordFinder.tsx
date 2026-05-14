'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const TRANSITIONS: Record<string, string[]> = {
  'Addition': ['furthermore', 'moreover', 'additionally', 'also', 'besides', 'in addition', 'likewise', 'similarly'],
  'Contrast': ['however', 'nevertheless', 'nonetheless', 'on the other hand', 'conversely', 'in contrast', 'although', 'whereas', 'but', 'yet', 'still'],
  'Cause/Effect': ['therefore', 'consequently', 'as a result', 'thus', 'hence', 'accordingly', 'because', 'since', 'due to'],
  'Time/Sequence': ['first', 'second', 'third', 'finally', 'meanwhile', 'subsequently', 'previously', 'then', 'next', 'afterward', 'before', 'after'],
  'Example': ['for example', 'for instance', 'specifically', 'namely', 'such as', 'in particular', 'to illustrate'],
  'Conclusion': ['in conclusion', 'to summarize', 'in summary', 'overall', 'ultimately', 'in short', 'to conclude'],
  'Emphasis': ['indeed', 'certainly', 'in fact', 'undoubtedly', 'clearly', 'obviously', 'especially', 'particularly'],
};

/**
 * TransitionWordFinder - Finds and categorizes transition words in text.
 */
export default function TransitionWordFinder({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<{ found: { word: string; category: string; count: number }[]; total: number; density: number } | null>(null);

  const analyze = () => {
    setError(undefined);
    setResult(null);
    if (!text.trim()) { setError('Please enter text to analyze'); return; }

    const lower = text.toLowerCase();
    const words = text.split(/\s+/).length;
    const found: { word: string; category: string; count: number }[] = [];

    for (const [category, transitions] of Object.entries(TRANSITIONS)) {
      for (const word of transitions) {
        const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
        const matches = lower.match(regex);
        if (matches && matches.length > 0) {
          found.push({ word, category, count: matches.length });
        }
      }
    }

    found.sort((a, b) => b.count - a.count);
    const total = found.reduce((sum, f) => sum + f.count, 0);
    const density = words > 0 ? (total / words) * 100 : 0;

    setResult({ found, total, density });
  };

  const copyText = result ? `Total transitions: ${result.total}\nTransition density: ${result.density.toFixed(1)}%\n\n${result.found.map(f => `${f.word} (${f.category}): ${f.count}x`).join('\n')}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Text to Analyze</label>
        <textarea id={`${toolId}-input`} value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter your text here. The tool will find and categorize transition words..." aria-label={`Text input for ${toolName}`} className="input-field min-h-[120px]" />
      </InputArea>
      <button onClick={analyze} aria-label="Find transition words" className="btn-primary">Find Transitions</button>
      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
                <div className="text-xl font-bold text-blue-700">{result.total}</div>
                <div className="text-xs text-gray-500">Transitions Found</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-center">
                <div className="text-xl font-bold text-green-700">{result.density.toFixed(1)}%</div>
                <div className="text-xs text-gray-500">Transition Density</div>
              </div>
            </div>
            {result.found.length > 0 ? (
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {result.found.map((f, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-800">{f.word}</span>
                      <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">{f.category}</span>
                    </div>
                    <span className="text-sm font-mono text-gray-600">{f.count}×</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-center text-yellow-700 text-sm">No transition words found. Consider adding transitions to improve flow.</div>
            )}
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
