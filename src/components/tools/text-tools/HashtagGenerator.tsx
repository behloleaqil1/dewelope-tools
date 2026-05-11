'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * HashtagGenerator - Generates hashtags from comma-separated keywords.
 * Produces both #camelCase and #lowercase formats for each keyword.
 */
export default function HashtagGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [error, setError] = useState<string | undefined>();

  const generateHashtags = () => {
    if (!input.trim()) {
      setError('Please enter at least one keyword');
      setHashtags([]);
      return;
    }

    setError(undefined);

    const keywords = input
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    if (keywords.length === 0) {
      setError('Please enter valid keywords separated by commas');
      setHashtags([]);
      return;
    }

    const generated: string[] = [];

    keywords.forEach((keyword) => {
      const words = keyword.split(/\s+/).filter((w) => w.length > 0);

      // #lowercase (no spaces)
      const lowercase = '#' + words.map((w) => w.toLowerCase()).join('');
      generated.push(lowercase);

      // #camelCase
      if (words.length > 1) {
        const camelCase =
          '#' +
          words
            .map((w, i) =>
              i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
            )
            .join('');
        generated.push(camelCase);
      }
    });

    // Remove duplicates
    const unique = [...new Set(generated)];
    setHashtags(unique);
  };

  const allHashtagsText = hashtags.join(' ');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter topics or keywords (comma separated)
        </label>
        <input
          id={`${toolId}-input`}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && generateHashtags()}
          placeholder="e.g. web development, machine learning, open source"
          aria-label={`Keywords input for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <button
        onClick={generateHashtags}
        aria-label="Generate hashtags"
        className="btn-primary"
      >
        Generate Hashtags
      </button>

      <OutputArea hasContent={hashtags.length > 0}>
        {hashtags.length > 0 && (
          <div className="space-y-3">
            <div className="text-sm text-gray-600 font-medium">
              {hashtags.length} hashtag{hashtags.length !== 1 ? 's' : ''} generated
            </div>
            <div className="flex flex-wrap gap-2">
              {hashtags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-100"
                >
                  {tag}
                </span>
              ))}
            </div>
            <CopyToClipboard text={allHashtagsText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
