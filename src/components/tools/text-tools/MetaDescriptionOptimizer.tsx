'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MetaDescriptionOptimizer - Analyzes meta descriptions for length, keywords, and SEO best practices.
 */
export default function MetaDescriptionOptimizer({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [description, setDescription] = useState('');
  const [keyword, setKeyword] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<{ charCount: number; isOptimalLength: boolean; hasKeyword: boolean; hasCallToAction: boolean; startsWithKeyword: boolean; score: number; tips: string[] } | null>(null);

  const CTA_WORDS = ['learn', 'discover', 'find', 'get', 'try', 'start', 'explore', 'read', 'see', 'check', 'click', 'buy', 'shop', 'sign up', 'join', 'download'];

  const analyze = () => {
    setError(undefined);
    setResult(null);
    if (!description.trim()) { setError('Please enter a meta description'); return; }

    const charCount = description.length;
    const lower = description.toLowerCase();
    const keyLower = keyword.toLowerCase().trim();

    const isOptimalLength = charCount >= 120 && charCount <= 160;
    const hasKeyword = keyLower.length > 0 && lower.includes(keyLower);
    const startsWithKeyword = keyLower.length > 0 && lower.startsWith(keyLower);
    const hasCallToAction = CTA_WORDS.some(cta => lower.includes(cta));

    let score = 0;
    const tips: string[] = [];

    // Length scoring
    if (charCount >= 120 && charCount <= 160) { score += 30; }
    else if (charCount >= 70 && charCount <= 180) { score += 15; tips.push('Aim for 120-160 characters for optimal display'); }
    else { tips.push(charCount < 70 ? 'Too short. Aim for 120-160 characters' : 'Too long. Google will truncate after ~160 characters'); }

    // Keyword
    if (hasKeyword) { score += 25; if (startsWithKeyword) score += 10; }
    else if (keyLower.length > 0) { tips.push('Include your target keyword in the description'); }

    // CTA
    if (hasCallToAction) { score += 20; }
    else { tips.push('Add a call-to-action (e.g., Learn, Discover, Get started)'); }

    // Uniqueness indicators
    if (!/[.!]$/.test(description.trim())) { tips.push('End with a period or call-to-action punctuation'); }
    else { score += 10; }

    // No duplicate words check
    const words = lower.split(/\s+/);
    const wordSet = new Set(words);
    if (wordSet.size / words.length > 0.7) { score += 5; }
    else { tips.push('Reduce word repetition for better readability'); }

    setResult({ charCount, isOptimalLength, hasKeyword, hasCallToAction, startsWithKeyword, score: Math.min(100, score), tips });
  };

  const copyText = result ? `Meta Description: "${description}"\nCharacters: ${result.charCount}\nScore: ${result.score}/100\nOptimal Length: ${result.isOptimalLength ? 'Yes' : 'No'}\nHas Keyword: ${result.hasKeyword ? 'Yes' : 'No'}\nHas CTA: ${result.hasCallToAction ? 'Yes' : 'No'}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-desc`} className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
            <textarea id={`${toolId}-desc`} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter your meta description here..." aria-label={`Meta description input for ${toolName}`} className="input-field min-h-[80px]" />
            <div className={`text-xs mt-1 ${description.length > 160 ? 'text-red-500' : description.length >= 120 ? 'text-green-500' : 'text-gray-500'}`}>{description.length}/160 characters</div>
          </div>
          <div>
            <label htmlFor={`${toolId}-keyword`} className="block text-sm font-medium text-gray-700 mb-1">Target Keyword (optional)</label>
            <input id={`${toolId}-keyword`} type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="e.g. online calculator" aria-label="Target keyword" className="input-field" />
          </div>
        </div>
      </InputArea>
      <button onClick={analyze} aria-label="Analyze meta description" className="btn-primary">Analyze</button>
      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: 'Score', value: `${result.score}/100`, pass: result.score >= 60 },
                { label: 'Length', value: result.isOptimalLength ? 'Optimal' : 'Adjust', pass: result.isOptimalLength },
                { label: 'Keyword', value: result.hasKeyword ? 'Found' : 'Missing', pass: result.hasKeyword },
                { label: 'CTA', value: result.hasCallToAction ? 'Found' : 'Missing', pass: result.hasCallToAction },
              ].map(item => (
                <div key={item.label} className={`p-2 rounded-lg border text-center ${item.pass ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className={`text-sm font-bold ${item.pass ? 'text-green-700' : 'text-red-700'}`}>{item.value}</div>
                  <div className="text-xs text-gray-500">{item.label}</div>
                </div>
              ))}
            </div>
            {result.tips.length > 0 && (
              <div className="space-y-1">
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
