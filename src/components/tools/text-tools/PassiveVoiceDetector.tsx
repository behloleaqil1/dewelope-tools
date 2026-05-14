'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const PASSIVE_PATTERNS = [
  /\b(is|are|was|were|been|being|be)\s+(being\s+)?\w+ed\b/gi,
  /\b(is|are|was|were|been|being|be)\s+(being\s+)?\w+en\b/gi,
  /\b(got|get|gets|getting)\s+\w+ed\b/gi,
];

/**
 * PassiveVoiceDetector - Detects passive voice constructions in text.
 */
export default function PassiveVoiceDetector({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<{ matches: { text: string; index: number }[]; percentage: number; sentences: number } | null>(null);

  const detect = () => {
    setError(undefined);
    setResult(null);
    if (!text.trim()) { setError('Please enter text to analyze'); return; }

    const matches: { text: string; index: number }[] = [];
    const seen = new Set<number>();

    for (const pattern of PASSIVE_PATTERNS) {
      const regex = new RegExp(pattern.source, pattern.flags);
      let match;
      while ((match = regex.exec(text)) !== null) {
        if (!seen.has(match.index)) {
          matches.push({ text: match[0], index: match.index });
          seen.add(match.index);
        }
      }
    }

    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const passiveSentences = sentences.filter(s => {
      return PASSIVE_PATTERNS.some(p => new RegExp(p.source, p.flags).test(s));
    });

    const percentage = sentences.length > 0 ? (passiveSentences.length / sentences.length) * 100 : 0;

    setResult({ matches, percentage, sentences: sentences.length });
  };

  const getHighlightedText = (): string => {
    if (!result || result.matches.length === 0) return text;
    let highlighted = text;
    const sorted = [...result.matches].sort((a, b) => b.index - a.index);
    for (const m of sorted) {
      highlighted = highlighted.substring(0, m.index) + `【${m.text}】` + highlighted.substring(m.index + m.text.length);
    }
    return highlighted;
  };

  const copyText = result ? `Passive constructions found: ${result.matches.length}\nPassive sentences: ${result.percentage.toFixed(1)}%\nTotal sentences: ${result.sentences}\n\nMatches:\n${result.matches.map(m => `- "${m.text}"`).join('\n')}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Text to Analyze</label>
        <textarea id={`${toolId}-input`} value={text} onChange={(e) => setText(e.target.value)} placeholder="The report was written by the team. The ball was kicked by the player." aria-label={`Text input for ${toolName}`} className="input-field min-h-[120px]" />
      </InputArea>
      <button onClick={detect} aria-label="Detect passive voice" className="btn-primary">Detect Passive Voice</button>
      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-orange-600">{result.matches.length}</div>
                <div className="text-xs text-gray-500">Passive Found</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-800">{result.percentage.toFixed(1)}%</div>
                <div className="text-xs text-gray-500">Passive Sentences</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-800">{result.sentences}</div>
                <div className="text-xs text-gray-500">Total Sentences</div>
              </div>
            </div>
            {result.matches.length > 0 && (
              <>
                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  <div className="text-xs text-gray-500 mb-1">Text with passive voice highlighted 【...】</div>
                  <div className="text-sm text-gray-800 whitespace-pre-wrap">{getHighlightedText()}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-gray-500 font-medium">Passive constructions:</div>
                  {result.matches.map((m, i) => (
                    <span key={i} className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded mr-1 mb-1">{m.text}</span>
                  ))}
                </div>
              </>
            )}
            {result.matches.length === 0 && (
              <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-center text-green-700 text-sm">No passive voice detected. Your writing uses active voice.</div>
            )}
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
