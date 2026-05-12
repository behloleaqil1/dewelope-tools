'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToBoxDrawing - Draw boxes around text using box-drawing Unicode characters.
 * Supports single, double, rounded, and heavy box styles.
 */
export default function TextToBoxDrawing({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [boxStyle, setBoxStyle] = useState<'single' | 'double' | 'rounded' | 'heavy'>('single');
  const [padding, setPadding] = useState(1);
  const [output, setOutput] = useState('');

  const boxChars = {
    single: { tl: '┌', tr: '┐', bl: '└', br: '┘', h: '─', v: '│' },
    double: { tl: '╔', tr: '╗', bl: '╚', br: '╝', h: '═', v: '║' },
    rounded: { tl: '╭', tr: '╮', bl: '╰', br: '╯', h: '─', v: '│' },
    heavy: { tl: '┏', tr: '┓', bl: '┗', br: '┛', h: '━', v: '┃' },
  };

  const generate = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    const chars = boxChars[boxStyle];
    const lines = input.split('\n');
    const maxLen = Math.max(...lines.map(l => l.length));
    const pad = ' '.repeat(padding);
    const innerWidth = maxLen + padding * 2;

    const result: string[] = [];
    result.push(chars.tl + chars.h.repeat(innerWidth) + chars.tr);

    for (const line of lines) {
      const paddedLine = line + ' '.repeat(maxLen - line.length);
      result.push(chars.v + pad + paddedLine + pad + chars.v);
    }

    result.push(chars.bl + chars.h.repeat(innerWidth) + chars.br);
    setOutput(result.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Enter text to box</label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to draw a box around..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <div>
            <label htmlFor={`${toolId}-style`} className="block text-sm font-medium text-gray-700 mb-1">Box Style</label>
            <select id={`${toolId}-style`} value={boxStyle} onChange={(e) => setBoxStyle(e.target.value as typeof boxStyle)} className="input-field" aria-label="Box drawing style">
              <option value="single">Single (┌─┐)</option>
              <option value="double">Double (╔═╗)</option>
              <option value="rounded">Rounded (╭─╮)</option>
              <option value="heavy">Heavy (┏━┓)</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-padding`} className="block text-sm font-medium text-gray-700 mb-1">Padding</label>
            <input id={`${toolId}-padding`} type="number" min={0} max={10} value={padding} onChange={(e) => setPadding(Number(e.target.value))} className="input-field" aria-label="Box padding" />
          </div>
        </div>
        <button onClick={generate} className="btn-primary mt-4">Draw Box</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Box Drawing Result</label>
            <pre className="whitespace-pre text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
