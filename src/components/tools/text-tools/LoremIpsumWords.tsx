'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'at', 'vero', 'eos',
  'accusamus', 'iusto', 'odio', 'dignissimos', 'ducimus', 'blanditiis',
  'praesentium', 'voluptatum', 'deleniti', 'atque', 'corrupti', 'quos', 'dolores',
  'quas', 'molestias', 'excepturi', 'obcaecati', 'cupiditate', 'provident',
  'similique', 'architecto', 'beatae', 'vitae', 'dicta', 'explicabo', 'nemo',
  'ipsam', 'voluptatem', 'quia', 'voluptas', 'aspernatur', 'aut', 'odit',
  'fugit', 'consequuntur', 'magni', 'dolorem', 'numquam', 'eius', 'modi',
  'tempora', 'quaerat', 'neque', 'porro', 'quisquam', 'nihil', 'impedit',
  'quo', 'minus', 'maxime', 'placeat', 'facere', 'possimus', 'omnis',
  'repudiandae', 'commodi', 'nesciunt', 'alias', 'consequatur', 'perferendis',
  'doloribus', 'asperiores', 'repellat',
];

/**
 * LoremIpsumWords - Generates a specified number of Lorem Ipsum words.
 * Cycles through the word list to produce exactly N words.
 */
export default function LoremIpsumWords({ toolId, toolName: _toolName }: { toolId: string; toolName: string }) {
  const [wordCount, setWordCount] = useState('50');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();

  function handleGenerate() {
    setError(undefined);
    setOutput('');

    const count = parseInt(wordCount, 10);

    if (isNaN(count) || count < 1 || count > 1000) {
      setError('Please enter a number between 1 and 1000');
      return;
    }

    const words: string[] = [];
    for (let i = 0; i < count; i++) {
      words.push(LOREM_WORDS[i % LOREM_WORDS.length]);
    }

    // Capitalize first word
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);

    setOutput(words.join(' ') + '.');
  }

  return (
    <div className="space-y-5">
      <InputArea error={error}>
        <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">
          Number of Words (1–1000)
        </label>
        <input
          id={`${toolId}-count`}
          type="number"
          min={1}
          max={1000}
          value={wordCount}
          onChange={(e) => setWordCount(e.target.value)}
          placeholder="50"
          aria-label="Number of Lorem Ipsum words to generate"
          className="input-field"
        />
      </InputArea>

      <button
        onClick={handleGenerate}
        aria-label="Generate Lorem Ipsum words"
        className="btn-primary"
      >
        Generate
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-gray-700">Generated Text</h3>
              <CopyToClipboard text={output} />
            </div>
            <p className="text-sm text-gray-800 p-4 bg-gray-50 rounded-lg border border-gray-100 leading-relaxed">
              {output}
            </p>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
