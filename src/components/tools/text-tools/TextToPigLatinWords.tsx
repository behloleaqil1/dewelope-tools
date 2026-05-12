'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToPigLatinWords - Convert individual words to Pig Latin with rules display.
 * Rules: consonant cluster at start moves to end + "ay"; words starting with vowel get "yay".
 */
export default function TextToPigLatinWords({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [breakdown, setBreakdown] = useState<{ original: string; converted: string; rule: string }[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toPigLatin = (word: string): { converted: string; rule: string } => {
    const lower = word.toLowerCase();
    const vowels = 'aeiou';

    if (!lower.match(/[a-z]/)) {
      return { converted: word, rule: 'non-alphabetic (unchanged)' };
    }

    if (vowels.includes(lower[0])) {
      return { converted: word + 'yay', rule: 'starts with vowel → add "yay"' };
    }

    let consonantCluster = '';
    let i = 0;
    while (i < lower.length && !vowels.includes(lower[i])) {
      consonantCluster += lower[i];
      i++;
    }

    const rest = word.slice(i);
    const isUpperCase = word[0] === word[0].toUpperCase();
    let converted = rest + consonantCluster + 'ay';

    if (isUpperCase) {
      converted = converted.charAt(0).toUpperCase() + converted.slice(1).toLowerCase();
    }

    return { converted, rule: `move "${consonantCluster}" to end + "ay"` };
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input.trim()) {
      setOutput('');
      setBreakdown([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      const words = input.split(/(\s+)/);
      const results: { original: string; converted: string; rule: string }[] = [];
      const converted: string[] = [];

      words.forEach((word) => {
        if (/^\s+$/.test(word)) {
          converted.push(word);
        } else {
          const result = toPigLatin(word);
          converted.push(result.converted);
          if (word.match(/[a-z]/i)) {
            results.push({ original: word, converted: result.converted, rule: result.rule });
          }
        }
      });

      setOutput(converted.join(''));
      setBreakdown(results);
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Enter text to convert</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter words to convert to Pig Latin..." aria-label={`Text input for ${toolName}`} className="input-field h-32 resize-y font-mono" />
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pig Latin Result</label>
              <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            </div>
            {breakdown.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Word-by-Word Breakdown</label>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 max-h-48 overflow-y-auto">
                  <table className="w-full text-xs font-mono">
                    <thead>
                      <tr className="text-left text-gray-500">
                        <th className="pb-1">Original</th>
                        <th className="pb-1">Converted</th>
                        <th className="pb-1">Rule Applied</th>
                      </tr>
                    </thead>
                    <tbody>
                      {breakdown.map((item, i) => (
                        <tr key={i} className="border-t border-gray-200">
                          <td className="py-1 text-gray-700">{item.original}</td>
                          <td className="py-1 text-green-700">{item.converted}</td>
                          <td className="py-1 text-gray-500">{item.rule}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
