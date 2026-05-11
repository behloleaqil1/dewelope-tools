'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PalindromeChecker - Checks if text is a palindrome, ignoring spaces, punctuation, and case.
 */
export default function PalindromeChecker({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ isPalindrome: boolean; cleaned: string; reversed: string } | null>(null);

  const check = () => {
    if (!input.trim()) {
      setResult(null);
      return;
    }

    const cleaned = input.toLowerCase().replace(/[^a-z0-9]/g, '');
    const reversed = cleaned.split('').reverse().join('');
    const isPalindrome = cleaned.length > 0 && cleaned === reversed;

    setResult({ isPalindrome, cleaned, reversed });
  };

  const copyText = result
    ? `Text: "${input}"\nCleaned: "${result.cleaned}"\nReversed: "${result.reversed}"\nIs Palindrome: ${result.isPalindrome ? 'Yes' : 'No'}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text to check
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. A man, a plan, a canal: Panama"
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y"
        />
      </InputArea>

      <button onClick={check} aria-label="Check palindrome" className="btn-primary">
        Check Palindrome
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className={`text-center p-4 rounded-lg border ${result.isPalindrome ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className={`text-2xl font-bold ${result.isPalindrome ? 'text-green-600' : 'text-red-600'}`}>
                {result.isPalindrome ? '✓ Palindrome' : '✗ Not a Palindrome'}
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2 text-sm">
              <div><span className="font-medium text-gray-600">Cleaned text:</span> <span className="font-mono">{result.cleaned}</span></div>
              <div><span className="font-medium text-gray-600">Reversed:</span> <span className="font-mono">{result.reversed}</span></div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
