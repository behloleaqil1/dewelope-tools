'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const LOREM_SENTENCES = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'Curabitur pretium tincidunt lacus nulla gravida orci a odio.',
  'Nullam varius dolor eget eros pulvinar pellentesque.',
  'Quisque malesuada placerat nisl et pellentesque.',
  'Fusce vulputate eleifend sapien vestibulum purus quam.',
  'Praesent blandit dolor sed nunc vestibulum gravida.',
  'Aenean sollicitudin nec sagittis pharetra massa ac.',
  'Donec posuere vulputate arcu phasellus accumsan cursus velit.',
  'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.',
  'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.',
  'Maecenas ullamcorper dui et placerat feugiat eros pede varius nisi condimentum viverra.',
  'Integer tincidunt cras dapibus vivamus elementum semper nisi.',
  'Aenean vulputate eleifend tellus aenean leo ligula porttitor eu consequat vitae.',
  'Vivamus in erat ut urna cursus vestibulum etiam aliquam.',
  'Nam eget dui etiam rhoncus maecenas tempus tellus eget condimentum.',
  'Donec vitae sapien ut libero venenatis faucibus nullam quis ante.',
  'Etiam sit amet orci eget eros faucibus tincidunt dui leo.',
  'Sed fringilla mauris sit amet nibh donec sodales sagittis magna.',
  'Phasellus viverra nulla ut metus varius laoreet quisque rutrum.',
  'Aenean imperdiet etiam ultricies nisi nam eget dui.',
  'Cras ultricies mi eu turpis hendrerit fringilla vestibulum ante ipsum primis.',
  'Morbi mollis tellus ac sapien pellentesque dui non felis.',
  'Nulla facilisi cras non velit nec nisi vulputate nonummy.',
  'Maecenas tincidunt lacus at velit vivamus vel nulla eget eros elementum pellentesque.',
  'Quisque porta volutpat erat quisque erat eros viverra eget congue eget semper rutrum nulla.',
  'Nunc purus metus aliquam vitae luctus quis pellentesque et malesuada.',
];

/**
 * LoremIpsumSentences - Generates a specified number of Lorem Ipsum sentences.
 * Supports 1-100 sentences, cycling through a pool of predefined sentences.
 */
export default function LoremIpsumSentences({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [count, setCount] = useState('5');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();

  const generate = () => {
    const num = parseInt(count, 10);

    if (isNaN(num) || num < 1 || num > 100) {
      setError('Please enter a number between 1 and 100');
      setOutput('');
      return;
    }

    setError(undefined);

    const sentences: string[] = [];
    for (let i = 0; i < num; i++) {
      sentences.push(LOREM_SENTENCES[i % LOREM_SENTENCES.length]);
    }

    setOutput(sentences.join(' '));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">
          Number of sentences (1-100)
        </label>
        <input
          id={`${toolId}-count`}
          type="text"
          inputMode="numeric"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && generate()}
          placeholder="e.g. 5"
          aria-label={`Number of sentences for ${toolName}`}
          className="input-field max-w-[200px]"
        />
      </InputArea>

      <button onClick={generate} aria-label="Generate Lorem Ipsum sentences" className="btn-primary">
        Generate
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{output}</p>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
