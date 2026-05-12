'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToNullCipher - Hide message in null cipher (first letter of each word).
 * Encodes a secret message by generating sentences where the first letter of each word spells out the hidden message.
 */
export default function TextToNullCipher({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const wordBank: Record<string, string[]> = {
    a: ['always', 'after', 'about', 'around', 'above'],
    b: ['before', 'being', 'better', 'bring', 'below'],
    c: ['could', 'come', 'carry', 'clear', 'close'],
    d: ['doing', 'during', 'down', 'drive', 'deep'],
    e: ['every', 'even', 'early', 'enough', 'enter'],
    f: ['from', 'find', 'first', 'follow', 'fast'],
    g: ['going', 'great', 'give', 'grow', 'good'],
    h: ['have', 'help', 'here', 'hold', 'high'],
    i: ['into', 'inside', 'indeed', 'imagine', 'improve'],
    j: ['just', 'join', 'jump', 'journey', 'joy'],
    k: ['keep', 'know', 'kind', 'key', 'keen'],
    l: ['long', 'look', 'last', 'leave', 'light'],
    m: ['more', 'make', 'most', 'move', 'much'],
    n: ['never', 'next', 'near', 'new', 'now'],
    o: ['over', 'only', 'open', 'often', 'once'],
    p: ['people', 'place', 'part', 'point', 'put'],
    q: ['quite', 'quick', 'quiet', 'quality', 'question'],
    r: ['really', 'right', 'run', 'read', 'rest'],
    s: ['some', 'still', 'such', 'start', 'show'],
    t: ['their', 'think', 'take', 'time', 'turn'],
    u: ['under', 'until', 'upon', 'use', 'usual'],
    v: ['very', 'view', 'visit', 'value', 'voice'],
    w: ['with', 'would', 'work', 'well', 'want'],
    x: ['xenial', 'xerox', 'xray', 'xeric', 'xenon'],
    y: ['your', 'year', 'young', 'yet', 'yield'],
    z: ['zero', 'zone', 'zenith', 'zeal', 'zoom'],
  };

  const encode = (message: string) => {
    const letters = message.toLowerCase().replace(/[^a-z]/g, '');
    const words: string[] = [];
    for (const letter of letters) {
      const options = wordBank[letter] || [`${letter}word`];
      const word = options[Math.floor(Math.random() * options.length)];
      words.push(word);
    }
    // Group into sentences of 4-6 words
    const sentences: string[] = [];
    let i = 0;
    while (i < words.length) {
      const len = Math.min(4 + Math.floor(Math.random() * 3), words.length - i);
      const sentence = words.slice(i, i + len);
      sentence[0] = sentence[0].charAt(0).toUpperCase() + sentence[0].slice(1);
      sentences.push(sentence.join(' ') + '.');
      i += len;
    }
    return sentences.join(' ');
  };

  const decode = (text: string) => {
    const words = text.split(/\s+/).filter((w) => w.length > 0);
    const letters = words.map((w) => w.replace(/[^a-zA-Z]/, '').charAt(0).toLowerCase());
    return letters.join('');
  };

  const handleProcess = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }
    if (mode === 'encode') {
      setOutput(encode(input));
    } else {
      setOutput(decode(input));
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="flex gap-4 mb-3">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name={`${toolId}-mode`}
              checked={mode === 'encode'}
              onChange={() => setMode('encode')}
            />
            <span className="text-sm font-medium text-gray-700">Encode (hide message)</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name={`${toolId}-mode`}
              checked={mode === 'decode'}
              onChange={() => setMode('decode')}
            />
            <span className="text-sm font-medium text-gray-700">Decode (extract message)</span>
          </label>
        </div>

        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          {mode === 'encode' ? 'Secret message to hide' : 'Text to decode (first letter of each word)'}
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encode' ? 'Enter secret message...' : 'Enter text to extract hidden message...'}
          aria-label={`Input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />

        <button
          onClick={handleProcess}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {mode === 'encode' ? 'Encode' : 'Decode'}
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {mode === 'encode' ? 'Encoded Text (first letters spell your message)' : 'Decoded Message'}
            </label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
