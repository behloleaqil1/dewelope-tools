'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * KeywordDensityChecker - Calculates keyword density percentage in text.
 */
export default function KeywordDensityChecker({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [text, setText] = useState('');
  const [keyword, setKeyword] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<{ density: number; occurrences: number; totalWords: number; status: string; recommendation: string } | null>(null);

  const analyze = () => {
    setError(undefined);
    setResult(null);
    if (!text.trim()) { setError('Please enter text to analyze'); return; }
    if (!keyword.trim()) { setError('Please enter a keyword to check'); return; }

    const words = text.split(/\s+/).filter(w => w.length > 0);
    const totalWords = words.length;
    const keyLower = keyword.toLowerCase().trim();
    const textLower = text.toLowerCase();

    // Count exact phrase occurrences
    const regex = new RegExp(`\\b${keyLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = textLower.match(regex) || [];
    const occurrences = matches.length;

    const keywordWordCount = keyLower.split(/\s+/).length;
    const density = totalWords > 0 ? (occurrences * keywordWordCount / totalWords) * 100 : 0;

    let status: string;
    let recommendation: string;
    if (density === 0) { status = 'Not found'; recommendation = 'Add your keyword naturally throughout the text'; }
    else if (density < 0.5) { status = 'Too low'; recommendation = 'Increase keyword usage slightly for better SEO'; }
    else if (density <= 2.5) { status = 'Optimal'; recommendation = 'Good keyword density for SEO'; }
    else if (density <= 4) { status = 'High'; recommendation = 'Consider reducing to avoid keyword stuffing'; }
    else { status = 'Too high'; recommendation = 'Reduce keyword usage to avoid penalties'; }

    setResult({ density, occurrences, totalWords, status, recommendation });
  };

  const copyText = result ? `Keyword: "${keyword}"\nOccurrences: ${result.occurrences}\nTotal Words: ${result.totalWords}\nDensity: ${result.density.toFixed(2)}%\nStatus: ${result.status}\nRecommendation: ${result.recommendation}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-text`} className="block text-sm font-medium text-gray-700 mb-1">Text Content</label>
            <textarea id={`${toolId}-text`} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste your article or page content here..." aria-label={`Text content for ${toolName}`} className="input-field min-h-[100px]" />
          </div>
          <div>
            <label htmlFor={`${toolId}-keyword`} className="block text-sm font-medium text-gray-700 mb-1">Target Keyword</label>
            <input id={`${toolId}-keyword`} type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && analyze()} placeholder="e.g. web development" aria-label="Target keyword to check density" className="input-field" />
          </div>
        </div>
      </InputArea>
      <button onClick={analyze} aria-label="Check keyword density" className="btn-primary">Check Density</button>
      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className={`p-4 rounded-lg border text-center ${result.density >= 0.5 && result.density <= 2.5 ? 'bg-green-50 border-green-200' : result.density > 4 ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'}`}>
              <div className={`text-3xl font-bold ${result.density >= 0.5 && result.density <= 2.5 ? 'text-green-700' : result.density > 4 ? 'text-red-700' : 'text-yellow-700'}`}>{result.density.toFixed(2)}%</div>
              <div className="text-sm text-gray-600">{result.status}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.occurrences}</div>
                <div className="text-xs text-gray-500">Occurrences</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.totalWords}</div>
                <div className="text-xs text-gray-500">Total Words</div>
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-sm text-blue-800">💡 {result.recommendation}</div>
            <div className="bg-gray-50 p-2 rounded border border-gray-200 text-xs text-gray-500">Ideal range: 0.5% - 2.5% for most content</div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
