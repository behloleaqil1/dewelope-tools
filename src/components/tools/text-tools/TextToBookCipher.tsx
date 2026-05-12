'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function TextToBookCipher({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [plaintext, setPlaintext] = useState('');
  const [bookText, setBookText] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const encrypt = () => {
    setError('');
    setOutput('');
    if (!plaintext.trim() || !bookText.trim()) {
      setError('Both plaintext and book text are required');
      return;
    }
    const words = bookText.split(/\s+/);
    const charMap: Record<string, number[]> = {};
    words.forEach((word, idx) => {
      if (word.length > 0) {
        const firstChar = word[0].toLowerCase();
        if (!charMap[firstChar]) charMap[firstChar] = [];
        charMap[firstChar].push(idx + 1);
      }
    });

    const result: string[] = [];
    for (const ch of plaintext.toLowerCase()) {
      if (ch === ' ') {
        result.push('/');
      } else if (charMap[ch] && charMap[ch].length > 0) {
        const positions = charMap[ch];
        const pos = positions[Math.floor(Math.random() * positions.length)];
        result.push(String(pos));
      } else {
        setError(`Character "${ch}" not found in book text word starts`);
        return;
      }
    }
    setOutput(result.join(' '));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-book`} className="block text-sm font-medium text-gray-700 mb-1">
          Book / Key Text (reference passage)
        </label>
        <textarea
          id={`${toolId}-book`}
          value={bookText}
          onChange={(e) => setBookText(e.target.value)}
          placeholder="Paste a passage of text to use as the cipher key..."
          aria-label="Book text for cipher key"
          className="input-field h-32 resize-y font-mono"
        />
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">
          Plaintext to Encrypt
        </label>
        <textarea
          id={`${toolId}-input`}
          value={plaintext}
          onChange={(e) => setPlaintext(e.target.value)}
          placeholder="Enter text to encrypt..."
          aria-label={`Plaintext input for ${toolName}`}
          className="input-field h-24 resize-y font-mono"
        />
        <button onClick={encrypt} className="btn-primary mt-2">Encrypt with Book Cipher</button>
      </InputArea>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Cipher Output (word positions)</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
