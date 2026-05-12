'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToBrailleGrade2 - Convert text to Grade 2 Braille with contractions.
 * Implements common Grade 2 Braille contractions for English text.
 */

const BRAILLE_ALPHA: Record<string, string> = {
  a: '⠁', b: '⠃', c: '⠉', d: '⠙', e: '⠑', f: '⠋', g: '⠛', h: '⠓', i: '⠊', j: '⠚',
  k: '⠅', l: '⠇', m: '⠍', n: '⠝', o: '⠕', p: '⠏', q: '⠟', r: '⠗', s: '⠎', t: '⠞',
  u: '⠥', v: '⠧', w: '⠺', x: '⠭', y: '⠽', z: '⠵',
  '1': '⠼⠁', '2': '⠼⠃', '3': '⠼⠉', '4': '⠼⠙', '5': '⠼⠑',
  '6': '⠼⠋', '7': '⠼⠛', '8': '⠼⠓', '9': '⠼⠊', '0': '⠼⠚',
  ' ': '⠀', '.': '⠲', ',': '⠂', '!': '⠖', '?': '⠦', ';': '⠆', ':': '⠒',
  '-': '⠤', "'": '⠄', '"': '⠦',
};

// Grade 2 whole-word contractions
const GRADE2_WORDS: Record<string, string> = {
  but: '⠃', can: '⠉', do: '⠙', every: '⠑', from: '⠋', go: '⠛',
  have: '⠓', just: '⠚', knowledge: '⠅', like: '⠇', more: '⠍',
  not: '⠝', people: '⠏', quite: '⠟', rather: '⠗', so: '⠎',
  that: '⠞', us: '⠥', very: '⠧', will: '⠺', it: '⠭', you: '⠽',
  as: '⠵', and: '⠯', for: '⠿', of: '⠷', the: '⠮', with: '⠾',
  child: '⠡', shall: '⠩', this: '⠹', which: '⠱', out: '⠳',
  still: '⠌', his: '⠦', was: '⠴', were: '⠶',
};

// Grade 2 group-sign contractions (within words)
const GRADE2_GROUPS: [string, string][] = [
  ['ing', '⠬'], ['tion', '⠰⠝'], ['ness', '⠰⠎'], ['ment', '⠰⠞'],
  ['ound', '⠳⠝⠙'], ['ount', '⠳⠝⠞'], ['th', '⠹'], ['sh', '⠩'],
  ['ch', '⠡'], ['wh', '⠱'], ['ou', '⠳'], ['st', '⠌'],
  ['er', '⠻'], ['ed', '⠫'], ['en', '⠢'], ['in', '⠔'],
  ['ar', '⠜'], ['gh', '⠣'],
];

export default function TextToBrailleGrade2({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [contractionsUsed, setContractionsUsed] = useState<string[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!input) { setOutput(''); setContractionsUsed([]); return; }

    debounceRef.current = setTimeout(() => {
      const contractions: string[] = [];

      // Process with capital indicators
      let finalResult = '';
      const inputWords = input.split(/(\s+)/);

      for (let w = 0; w < inputWords.length; w++) {
        const origWord = inputWords[w];
        if (/^\s+$/.test(origWord)) {
          finalResult += '⠀';
          continue;
        }

        const lowerWord = origWord.toLowerCase();

        // Check if entire word is uppercase
        if (origWord === origWord.toUpperCase() && origWord !== origWord.toLowerCase() && origWord.length > 1) {
          finalResult += '⠠⠠';
        } else if (origWord[0] === origWord[0].toUpperCase() && origWord[0] !== origWord[0].toLowerCase()) {
          finalResult += '⠠';
        }

        // Convert the word
        if (GRADE2_WORDS[lowerWord]) {
          finalResult += GRADE2_WORDS[lowerWord];
        } else {
          const rem = lowerWord;
          let j = 0;
          while (j < rem.length) {
            let found = false;
            for (const [pattern, braille] of GRADE2_GROUPS) {
              if (rem.substring(j).startsWith(pattern)) {
                finalResult += braille;
                j += pattern.length;
                found = true;
                break;
              }
            }
            if (!found) {
              finalResult += BRAILLE_ALPHA[rem[j]] || rem[j];
              j++;
            }
          }
        }
      }

      setOutput(finalResult);
      setContractionsUsed([...new Set(contractions)].slice(0, 15));
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Enter Text</label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to convert to Grade 2 Braille..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Grade 2 Braille Output</label>
            <pre className="whitespace-pre-wrap text-2xl font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 leading-relaxed">{output}</pre>

            {contractionsUsed.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Contractions Used</h4>
                <div className="flex flex-wrap gap-2">
                  {contractionsUsed.map((c, i) => (
                    <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200">{c}</span>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-gray-500">Grade 2 Braille uses contractions to shorten common words and letter combinations. Capital indicator: ⠠</p>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
