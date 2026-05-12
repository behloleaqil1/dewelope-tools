'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToPigLatinAdvanced - Advanced Pig Latin converter with multiple dialect options.
 * Supports classic, Yiddish-style, and custom suffix modes.
 */
export default function TextToPigLatinAdvanced({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [dialect, setDialect] = useState<'classic' | 'yay' | 'custom'>('classic');
  const [customSuffix, setCustomSuffix] = useState('ay');
  const [output, setOutput] = useState('');

  const VOWELS = 'aeiouAEIOU';

  function convertWord(word: string): string {
    if (!word) return word;

    // Preserve non-alpha characters
    const leadPunct = word.match(/^[^a-zA-Z]*/)?.[0] || '';
    const trailPunct = word.match(/[^a-zA-Z]*$/)?.[0] || '';
    const core = word.slice(leadPunct.length, word.length - (trailPunct.length || 0) || undefined);

    if (!core) return word;

    const isCapitalized = core[0] === core[0].toUpperCase() && core[0] !== core[0].toLowerCase();
    const lowerCore = core.toLowerCase();

    let result: string;

    const suffix = dialect === 'classic' ? 'ay' : dialect === 'yay' ? 'yay' : customSuffix;

    if (VOWELS.includes(lowerCore[0])) {
      // Starts with vowel
      if (dialect === 'yay') {
        result = lowerCore + 'yay';
      } else {
        result = lowerCore + 'way';
      }
    } else {
      // Find consonant cluster
      let clusterEnd = 0;
      for (let i = 0; i < lowerCore.length; i++) {
        if (VOWELS.includes(lowerCore[i])) break;
        clusterEnd = i + 1;
      }
      const cluster = lowerCore.slice(0, clusterEnd);
      const rest = lowerCore.slice(clusterEnd);
      result = rest + cluster + suffix;
    }

    // Restore capitalization
    if (isCapitalized) {
      result = result.charAt(0).toUpperCase() + result.slice(1);
    }

    return leadPunct + result + trailPunct;
  }

  function convert() {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    const words = input.split(/(\s+)/);
    const converted = words.map((segment) => {
      if (/^\s+$/.test(segment)) return segment;
      return convertWord(segment);
    });
    setOutput(converted.join(''));
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text to convert
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to convert to Pig Latin..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y"
        />
        <div className="mt-3 space-y-2">
          <label className="block text-sm font-medium text-gray-700">Dialect</label>
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-1 text-sm">
              <input type="radio" name="dialect" value="classic" checked={dialect === 'classic'} onChange={() => setDialect('classic')} />
              Classic (-ay)
            </label>
            <label className="flex items-center gap-1 text-sm">
              <input type="radio" name="dialect" value="yay" checked={dialect === 'yay'} onChange={() => setDialect('yay')} />
              Yay (-yay for vowels)
            </label>
            <label className="flex items-center gap-1 text-sm">
              <input type="radio" name="dialect" value="custom" checked={dialect === 'custom'} onChange={() => setDialect('custom')} />
              Custom suffix
            </label>
          </div>
          {dialect === 'custom' && (
            <input
              type="text"
              value={customSuffix}
              onChange={(e) => setCustomSuffix(e.target.value)}
              placeholder="ay"
              aria-label="Custom suffix"
              className="input-field w-32 text-sm"
            />
          )}
        </div>
      </InputArea>

      <button onClick={convert} aria-label="Convert to Pig Latin" className="btn-primary">
        Convert to Pig Latin
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Pig Latin Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
