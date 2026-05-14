'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const POWER_WORDS = ['amazing', 'proven', 'secret', 'ultimate', 'essential', 'powerful', 'incredible', 'guaranteed', 'exclusive', 'free', 'new', 'easy', 'best', 'top', 'how', 'why', 'what', 'guide', 'tips', 'ways', 'mistakes', 'never', 'always', 'must', 'need'];
const EMOTIONAL_WORDS = ['love', 'hate', 'fear', 'joy', 'angry', 'happy', 'sad', 'excited', 'worried', 'surprised', 'shocking', 'heartbreaking', 'inspiring', 'terrifying', 'brilliant'];

/**
 * HeadlineAnalyzer - Scores and analyzes headlines for effectiveness.
 */
export default function HeadlineAnalyzer({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [headline, setHeadline] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<{ score: number; wordCount: number; charCount: number; powerWords: string[]; emotionalWords: string[]; hasNumber: boolean; isQuestion: boolean; tips: string[] } | null>(null);

  const analyze = () => {
    setError(undefined);
    setResult(null);
    if (!headline.trim()) { setError('Please enter a headline to analyze'); return; }

    const words = headline.trim().split(/\s+/);
    const wordCount = words.length;
    const charCount = headline.trim().length;
    const lower = headline.toLowerCase();

    let score = 50; // Base score

    // Word count scoring (ideal: 6-12 words)
    if (wordCount >= 6 && wordCount <= 12) score += 15;
    else if (wordCount >= 4 && wordCount <= 15) score += 8;
    else score -= 10;

    // Character count (ideal: 50-60 for SEO)
    if (charCount >= 50 && charCount <= 60) score += 10;
    else if (charCount >= 40 && charCount <= 70) score += 5;

    // Power words
    const foundPower = POWER_WORDS.filter(w => lower.includes(w));
    score += Math.min(foundPower.length * 5, 15);

    // Emotional words
    const foundEmotional = EMOTIONAL_WORDS.filter(w => lower.includes(w));
    score += Math.min(foundEmotional.length * 5, 10);

    // Numbers
    const hasNumber = /\d/.test(headline);
    if (hasNumber) score += 10;

    // Question
    const isQuestion = headline.trim().endsWith('?');
    if (isQuestion) score += 5;

    // Starts with capital
    if (/^[A-Z]/.test(headline.trim())) score += 3;

    // Tips
    const tips: string[] = [];
    if (wordCount < 6) tips.push('Add more words (aim for 6-12 words)');
    if (wordCount > 15) tips.push('Shorten your headline (aim for 6-12 words)');
    if (foundPower.length === 0) tips.push('Add a power word (e.g., proven, essential, ultimate)');
    if (!hasNumber) tips.push('Consider adding a number (e.g., "7 Ways to...")');
    if (charCount > 70) tips.push('Shorten for SEO (aim for 50-60 characters)');
    if (foundEmotional.length === 0) tips.push('Add emotional appeal to connect with readers');

    setResult({ score: Math.min(100, Math.max(0, score)), wordCount, charCount, powerWords: foundPower, emotionalWords: foundEmotional, hasNumber, isQuestion, tips });
  };

  const copyText = result ? `Headline: "${headline}"\nScore: ${result.score}/100\nWords: ${result.wordCount}\nCharacters: ${result.charCount}\nPower words: ${result.powerWords.join(', ') || 'none'}\nEmotional words: ${result.emotionalWords.join(', ') || 'none'}\nHas number: ${result.hasNumber ? 'Yes' : 'No'}\n\nTips:\n${result.tips.map(t => `- ${t}`).join('\n')}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
        <input id={`${toolId}-input`} type="text" value={headline} onChange={(e) => setHeadline(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && analyze()} placeholder="7 Proven Ways to Write Better Headlines" aria-label={`Headline input for ${toolName}`} className="input-field" />
      </InputArea>
      <button onClick={analyze} aria-label="Analyze headline" className="btn-primary">Analyze Headline</button>
      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className={`text-3xl font-bold ${result.score >= 70 ? 'text-green-600' : result.score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>{result.score}/100</div>
              <div className="text-sm text-gray-500">{result.score >= 70 ? 'Strong headline' : result.score >= 50 ? 'Average headline' : 'Needs improvement'}</div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div className="text-center"><div className="text-sm font-bold text-gray-700">{result.wordCount}</div><div className="text-xs text-gray-500">Words</div></div>
              <div className="text-center"><div className="text-sm font-bold text-gray-700">{result.charCount}</div><div className="text-xs text-gray-500">Chars</div></div>
              <div className="text-center"><div className="text-sm font-bold text-gray-700">{result.hasNumber ? '✓' : '✗'}</div><div className="text-xs text-gray-500">Number</div></div>
              <div className="text-center"><div className="text-sm font-bold text-gray-700">{result.isQuestion ? '✓' : '✗'}</div><div className="text-xs text-gray-500">Question</div></div>
            </div>
            {result.tips.length > 0 && (
              <div className="space-y-1">
                <div className="text-xs font-medium text-gray-500">Suggestions:</div>
                {result.tips.map((tip, i) => (
                  <div key={i} className="text-sm text-gray-700 bg-yellow-50 p-2 rounded border border-yellow-200">💡 {tip}</div>
                ))}
              </div>
            )}
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
