'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToPigpenCipher - Convert text to Pigpen/Masonic cipher descriptions.
 * Maps each letter to its corresponding Pigpen cipher grid symbol description.
 */
export default function TextToPigpenCipher({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!input) { setOutput(''); return; }

    const pigpenSymbols: Record<string, string> = {
      a: '⌐', b: '⊓', c: '¬', d: '⌐·', e: '⊓·', f: '¬·',
      g: '⊔', h: '⊏', i: '⊐', j: '⊔·', k: '⊏·', l: '⊐·',
      m: '△', n: '▽', o: '◁', p: '▷', q: '△·', r: '▽·',
      s: '◁·', t: '▷·', u: '⊓⌐', v: '⊓¬', w: '⊔⊏', x: '⊔⊐',
      y: '◇', z: '◇·',
    };

    const pigpenDescs: Record<string, string> = {
      a: 'open right, open top (grid 1, pos 1)',
      b: 'closed top and sides (grid 1, pos 2)',
      c: 'open left, open top (grid 1, pos 3)',
      d: 'open right, open bottom (grid 1, pos 4)',
      e: 'closed sides and bottom (grid 1, pos 5)',
      f: 'open left, open bottom (grid 1, pos 6)',
      g: 'open right, closed bottom (grid 1, pos 7)',
      h: 'closed bottom and sides (grid 1, pos 8)',
      i: 'open left, closed bottom (grid 1, pos 9)',
      j: 'open right, open top + dot (grid 2, pos 1)',
      k: 'closed top and sides + dot (grid 2, pos 2)',
      l: 'open left, open top + dot (grid 2, pos 3)',
      m: 'open right, open bottom + dot (grid 2, pos 4)',
      n: 'closed sides and bottom + dot (grid 2, pos 5)',
      o: 'open left, open bottom + dot (grid 2, pos 6)',
      p: 'open right, closed bottom + dot (grid 2, pos 7)',
      q: 'closed bottom and sides + dot (grid 2, pos 8)',
      r: 'open left, closed bottom + dot (grid 2, pos 9)',
      s: 'triangle up (X grid, pos 1)',
      t: 'triangle right (X grid, pos 2)',
      u: 'triangle down (X grid, pos 3)',
      v: 'triangle left (X grid, pos 4)',
      w: 'triangle up + dot (X grid, pos 5)',
      x: 'triangle right + dot (X grid, pos 6)',
      y: 'triangle down + dot (X grid, pos 7)',
      z: 'triangle left + dot (X grid, pos 8)',
    };

    debounceRef.current = setTimeout(() => {
      const symbolLine: string[] = [];
      const descLine: string[] = [];

      for (const char of input.toLowerCase()) {
        if (char >= 'a' && char <= 'z') {
          symbolLine.push(pigpenSymbols[char]);
          descLine.push(`${char.toUpperCase()} = ${pigpenDescs[char]}`);
        } else if (char === ' ') {
          symbolLine.push(' ');
        } else {
          symbolLine.push(char);
        }
      }

      const lines: string[] = [];
      lines.push('Symbols: ' + symbolLine.join(' '));
      lines.push('');
      lines.push('Letter Descriptions:');
      lines.push(...descLine);

      setOutput(lines.join('\n'));
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input]);

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
          placeholder="Enter text to convert to Pigpen cipher..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Pigpen Cipher Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
