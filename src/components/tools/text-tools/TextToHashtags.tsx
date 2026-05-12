'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const STOP_WORDS = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'shall', 'can', 'need', 'dare', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'out', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'and', 'but', 'or', 'nor', 'not', 'so', 'yet', 'both', 'either', 'neither', 'each', 'every', 'all', 'any', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'only', 'own', 'same', 'than', 'too', 'very', 'just', 'because', 'if', 'when', 'while', 'this', 'that', 'these', 'those', 'it', 'its', 'i', 'me', 'my', 'we', 'our', 'you', 'your', 'he', 'him', 'his', 'she', 'her', 'they', 'them', 'their', 'what', 'which', 'who', 'whom', 'how', 'where', 'why', 'about']);

/**
 * TextToHashtags - Generate relevant hashtags from text content.
 */
export default function TextToHashtags({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [maxHashtags, setMaxHashtags] = useState('15');
  const [includeHash, setIncludeHash] = useState(true);
  const [result, setResult] = useState<string[]>([]);

  function generate() {
    if (!input.trim()) {
      setResult([]);
      return;
    }

    const words = input.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
    const freq: Record<string, number> = {};

    words.forEach((word) => {
      if (word.length > 2 && !STOP_WORDS.has(word)) {
        freq[word] = (freq[word] || 0) + 1;
      }
    });

    // Also extract 2-word phrases
    for (let i = 0; i < words.length - 1; i++) {
      const w1 = words[i];
      const w2 = words[i + 1];
      if (w1.length > 2 && w2.length > 2 && !STOP_WORDS.has(w1) && !STOP_WORDS.has(w2)) {
        const phrase = w1 + w2;
        freq[phrase] = (freq[phrase] || 0) + 0.8;
      }
    }

    const max = Math.max(1, Math.min(30, parseInt(maxHashtags) || 15));
    const sorted = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, max)
      .map(([word]) => includeHash ? `#${word}` : word);

    setResult(sorted);
  }

  const copyText = result.join(' ');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text content
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your article, blog post, or any text to generate hashtags..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y"
        />
      </InputArea>

      <div className="flex gap-4 items-center flex-wrap">
        <InputArea>
          <label htmlFor={`${toolId}-max`} className="block text-sm font-medium text-gray-700 mb-1">Max Hashtags</label>
          <input id={`${toolId}-max`} type="number" min="1" max="30" value={maxHashtags} onChange={(e) => setMaxHashtags(e.target.value)} aria-label={`Max hashtags for ${toolName}`} className="input-field w-24" />
        </InputArea>
        <label className="flex items-center gap-2 text-sm text-gray-700 mt-4">
          <input type="checkbox" checked={includeHash} onChange={(e) => setIncludeHash(e.target.checked)} />
          Include # symbol
        </label>
      </div>

      <button onClick={generate} aria-label="Generate hashtags" className="btn-primary">
        Generate Hashtags
      </button>

      <OutputArea hasContent={result.length > 0}>
        {result.length > 0 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Generated Hashtags ({result.length})</label>
            <div className="flex flex-wrap gap-2">
              {result.map((tag, idx) => (
                <span key={idx} className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-200">
                  {tag}
                </span>
              ))}
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p className="text-sm font-mono text-gray-700 break-all">{copyText}</p>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
