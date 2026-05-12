'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToPigLatinSentence - Convert full sentences to Pig Latin preserving punctuation.
 * Handles capitalization, punctuation at end of words, and multi-sentence text.
 */
export default function TextToPigLatinSentence({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function toPigLatin(word: string): string {
    // Extract leading and trailing punctuation
    const leadMatch = word.match(/^([^a-zA-Z]*)/);
    const trailMatch = word.match(/([^a-zA-Z]*)$/);
    const leading = leadMatch ? leadMatch[1] : '';
    const trailing = trailMatch ? trailMatch[1] : '';
    const core = word.slice(leading.length, word.length - (trailing.length || 0)) || word.slice(leading.length);

    if (!core || !/[a-zA-Z]/.test(core)) return word;

    const isCapitalized = core[0] === core[0].toUpperCase() && core[0] !== core[0].toLowerCase();
    const isAllCaps = core === core.toUpperCase() && core.length > 1;
    const lowerCore = core.toLowerCase();

    let pigWord: string;
    const vowels = 'aeiou';

    if (vowels.includes(lowerCore[0])) {
      pigWord = lowerCore + 'way';
    } else {
      // Find first vowel cluster
      let consonantCluster = '';
      let rest = lowerCore;
      for (let i = 0; i < lowerCore.length; i++) {
        if (vowels.includes(lowerCore[i])) {
          consonantCluster = lowerCore.slice(0, i);
          rest = lowerCore.slice(i);
          break;
        }
      }
      if (!consonantCluster) {
        pigWord = lowerCore + 'ay';
      } else {
        pigWord = rest + consonantCluster + 'ay';
      }
    }

    // Restore capitalization
    if (isAllCaps) {
      pigWord = pigWord.toUpperCase();
    } else if (isCapitalized) {
      pigWord = pigWord.charAt(0).toUpperCase() + pigWord.slice(1);
    }

    return leading + pigWord + trailing;
  }

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input) {
      setOutput('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      const result = input
        .split(/(\s+)/)
        .map((segment) => {
          if (/^\s+$/.test(segment)) return segment;
          return toPigLatin(segment);
        })
        .join('');
      setOutput(result);
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text to convert to Pig Latin
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter sentences to convert to Pig Latin..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-48 resize-y font-mono"
        />
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Pig Latin Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
