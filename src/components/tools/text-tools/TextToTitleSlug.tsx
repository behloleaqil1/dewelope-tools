'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToTitleSlug - Converts article titles to SEO-friendly URL slugs.
 * Removes stop words, special characters, and normalizes for URL use.
 */

const stopWords = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
  'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
  'could', 'should', 'may', 'might', 'shall', 'can', 'need', 'dare',
  'ought', 'used', 'it', 'its', 'this', 'that', 'these', 'those',
  'i', 'me', 'my', 'we', 'our', 'you', 'your', 'he', 'him', 'his',
  'she', 'her', 'they', 'them', 'their', 'what', 'which', 'who',
  'when', 'where', 'why', 'how', 'not', 'no', 'nor', 'as', 'if',
  'then', 'than', 'too', 'very', 'just', 'about', 'above', 'after',
  'again', 'all', 'also', 'am', 'any', 'because', 'before', 'between',
  'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such',
  'into', 'through', 'during', 'until', 'while', 'so', 'up', 'out',
  'only', 'own', 'same', 'here', 'there',
]);

export default function TextToTitleSlug({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [removeStopWords, setRemoveStopWords] = useState(true);
  const [maxLength, setMaxLength] = useState('60');
  const [output, setOutput] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input.trim()) {
      setOutput('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      let words = input
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .split(/\s+/)
        .filter(Boolean);

      if (removeStopWords && words.length > 1) {
        const filtered = words.filter((w) => !stopWords.has(w));
        if (filtered.length > 0) words = filtered;
      }

      let slug = words.join('-');
      slug = slug.replace(/-+/g, '-').replace(/^-|-$/g, '');

      const max = parseInt(maxLength) || 60;
      if (slug.length > max) {
        slug = slug.substring(0, max);
        const lastDash = slug.lastIndexOf('-');
        if (lastDash > 0) slug = slug.substring(0, lastDash);
      }

      setOutput(slug);
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input, removeStopWords, maxLength]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter article title
        </label>
        <input
          id={`${toolId}-input`}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. How to Build a REST API with Node.js and Express"
          aria-label={`Title input for ${toolName}`}
          className="input-field"
        />
        <div className="flex flex-wrap gap-4 mt-3">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={removeStopWords}
              onChange={(e) => setRemoveStopWords(e.target.checked)}
              className="rounded border-gray-300"
            />
            Remove stop words
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            Max length:
            <input
              type="number"
              value={maxLength}
              onChange={(e) => setMaxLength(e.target.value)}
              min="10"
              max="200"
              className="input-field w-20"
              aria-label="Maximum slug length"
            />
          </label>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">SEO-Friendly Slug</label>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <code className="text-sm font-mono text-gray-800 break-all">{output}</code>
            </div>
            <div className="text-xs text-gray-500">{output.length} characters</div>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
