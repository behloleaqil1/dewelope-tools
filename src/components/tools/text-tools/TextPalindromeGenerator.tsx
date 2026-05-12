'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextPalindromeGenerator - Generate palindromes from input text.
 * Creates palindromes by mirroring the input text in various ways.
 */
export default function TextPalindromeGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'mirror' | 'word-mirror' | 'shortest'>('mirror');
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    let result = '';
    const text = input.trim();

    switch (mode) {
      case 'mirror': {
        // Mirror the text: append reverse of text (minus last char) to create palindrome
        const reversed = text.split('').reverse().join('');
        result = text + reversed.slice(1);
        break;
      }
      case 'word-mirror': {
        // Mirror by words: "hello world" -> "hello world world hello"
        const words = text.split(/\s+/);
        const reversedWords = [...words].reverse();
        result = [...words, ...reversedWords.slice(1)].join(' ');
        break;
      }
      case 'shortest': {
        // Find shortest palindrome by adding minimum characters to the end
        const lower = text.toLowerCase().replace(/[^a-z0-9]/g, '');
        const end = lower.length - 1;
        // Find longest palindromic suffix
        const chars = lower.split('');
        let suffixStart = 0;
        for (let i = 0; i <= end; i++) {
          let left = i;
          let right = end;
          let isPalin = true;
          while (left < right) {
            if (chars[left] !== chars[right]) {
              isPalin = false;
              break;
            }
            left++;
            right--;
          }
          if (isPalin) {
            suffixStart = i;
            break;
          }
        }
        // Add reverse of prefix to the end
        const prefix = text.slice(0, suffixStart);
        result = text + prefix.split('').reverse().join('');
        break;
      }
    }

    const isPalindrome = (s: string) => {
      const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
      return clean === clean.split('').reverse().join('');
    };

    const verification = isPalindrome(result) ? '✓ Valid palindrome' : '~ Approximate palindrome (includes spaces/punctuation)';

    setOutput(`Result: ${result}\n\nLength: ${result.length} characters\nVerification: ${verification}\n\nOriginal: "${text}"\nMode: ${mode === 'mirror' ? 'Character Mirror' : mode === 'word-mirror' ? 'Word Mirror' : 'Shortest Palindrome'}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to generate a palindrome..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as 'mirror' | 'word-mirror' | 'shortest')}
            aria-label="Palindrome generation mode"
            className="input-field"
          >
            <option value="mirror">Character Mirror (append reverse)</option>
            <option value="word-mirror">Word Mirror (mirror words)</option>
            <option value="shortest">Shortest Palindrome (minimal additions)</option>
          </select>
        </div>
      </InputArea>

      <button onClick={generate} aria-label="Generate palindrome" className="btn-primary">
        Generate Palindrome
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Palindrome</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
