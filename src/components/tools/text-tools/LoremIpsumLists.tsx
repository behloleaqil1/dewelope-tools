'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * LoremIpsumLists - Generates Lorem Ipsum text as bullet point lists or numbered lists.
 */
export default function LoremIpsumLists({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [count, setCount] = useState('5');
  const [listType, setListType] = useState<'bullet' | 'numbered' | 'dash'>('bullet');
  const [output, setOutput] = useState('');

  const LOREM_ITEMS = [
    'Lorem ipsum dolor sit amet consectetur adipiscing elit',
    'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
    'Ut enim ad minim veniam quis nostrud exercitation ullamco',
    'Duis aute irure dolor in reprehenderit in voluptate velit esse',
    'Excepteur sint occaecat cupidatat non proident sunt in culpa',
    'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit',
    'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet',
    'Ut enim ad minima veniam quis nostrum exercitationem ullam corporis',
    'Quis autem vel eum iure reprehenderit qui in ea voluptate velit',
    'At vero eos et accusamus et iusto odio dignissimos ducimus',
    'Nam libero tempore cum soluta nobis est eligendi optio cumque',
    'Temporibus autem quibusdam et aut officiis debitis aut rerum',
    'Itaque earum rerum hic tenetur a sapiente delectus ut aut reiciendis',
    'Nulla pariatur excepteur sint occaecat cupidatat non proident',
    'Sunt in culpa qui officia deserunt mollit anim id est laborum',
    'Curabitur pretium tincidunt lacus nulla gravida orci a odio',
    'Nullam varius dolor eget eros pulvinar pellentesque tempus',
    'Fusce dapibus tellus ac cursus commodo tortor mauris condimentum',
    'Maecenas sed diam eget risus varius blandit sit amet non magna',
    'Praesent commodo cursus magna vel scelerisque nisl consectetur',
  ];

  function generate() {
    const num = Math.max(1, Math.min(50, parseInt(count) || 5));
    const items: string[] = [];

    for (let i = 0; i < num; i++) {
      items.push(LOREM_ITEMS[i % LOREM_ITEMS.length]);
    }

    let formatted: string;
    switch (listType) {
      case 'bullet':
        formatted = items.map((item) => `• ${item}`).join('\n');
        break;
      case 'numbered':
        formatted = items.map((item, i) => `${i + 1}. ${item}`).join('\n');
        break;
      case 'dash':
        formatted = items.map((item) => `- ${item}`).join('\n');
        break;
    }

    setOutput(formatted);
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">
          Number of list items for {toolName}
        </label>
        <div className="flex gap-3 items-end">
          <input
            id={`${toolId}-count`}
            type="number"
            min="1"
            max="50"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            aria-label="Number of list items"
            className="input-field w-24"
          />
          <select
            value={listType}
            onChange={(e) => setListType(e.target.value as typeof listType)}
            aria-label="List style"
            className="input-field w-auto text-sm"
          >
            <option value="bullet">• Bullet points</option>
            <option value="numbered">1. Numbered</option>
            <option value="dash">- Dashes</option>
          </select>
        </div>
      </InputArea>

      <button onClick={generate} aria-label="Generate list" className="btn-primary">
        Generate List
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Generated List</label>
              <CopyToClipboard text={output} />
            </div>
            <pre className="whitespace-pre-wrap text-sm text-gray-800 p-4 bg-gray-50 rounded-lg border border-gray-100">
              {output}
            </pre>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
