'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function TextToBrailleArt({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [pattern, setPattern] = useState<'fill' | 'border' | 'diagonal' | 'dots'>('fill');
  const [width, setWidth] = useState(20);
  const [height, setHeight] = useState(5);
  const [output, setOutput] = useState('');

  const brailleChars = {
    fill: '⣿',
    empty: '⠀',
    topLeft: '⠋',
    topRight: '⠙',
    bottomLeft: '⠣',
    bottomRight: '⠴',
    horizontal: '⠒',
    vertical: '⡇',
    dot: '⠐',
    diagonal: '⠑',
  };

  const generate = () => {
    let result = '';

    if (input) {
      // Convert text to braille-style block letters
      const chars = input.toUpperCase().split('');
      const lines = ['', '', ''];
      chars.forEach(ch => {
        const block = getCharBlock(ch);
        lines[0] += block[0] + ' ';
        lines[1] += block[1] + ' ';
        lines[2] += block[2] + ' ';
      });
      result = lines.join('\n');
    } else {
      // Generate pattern
      const rows: string[] = [];
      for (let y = 0; y < height; y++) {
        let row = '';
        for (let x = 0; x < width; x++) {
          switch (pattern) {
            case 'fill':
              row += brailleChars.fill;
              break;
            case 'border':
              if (y === 0 || y === height - 1 || x === 0 || x === width - 1) {
                row += brailleChars.fill;
              } else {
                row += brailleChars.empty;
              }
              break;
            case 'diagonal':
              row += (x + y) % 2 === 0 ? brailleChars.diagonal : brailleChars.empty;
              break;
            case 'dots':
              row += (x + y) % 3 === 0 ? brailleChars.dot : brailleChars.empty;
              break;
          }
        }
        rows.push(row);
      }
      result = rows.join('\n');
    }

    setOutput(result);
  };

  function getCharBlock(ch: string): [string, string, string] {
    const blocks: Record<string, [string, string, string]> = {
      'A': ['⠋⠉⠙', '⠏⠉⠹', '⠇⠀⠸'],
      'B': ['⠏⠉⠹', '⠏⠉⠹', '⠏⠉⠼'],
      'C': ['⠋⠉⠙', '⠇⠀⠀', '⠣⠤⠴'],
      'D': ['⠏⠉⠙', '⠇⠀⠸', '⠏⠤⠼'],
      'E': ['⠏⠉⠉', '⠏⠉⠉', '⠏⠤⠤'],
      'F': ['⠏⠉⠉', '⠏⠉⠀', '⠇⠀⠀'],
      'H': ['⠇⠀⠸', '⠏⠉⠹', '⠇⠀⠸'],
      'I': ['⠉⠋⠉', '⠀⠇⠀', '⠤⠧⠤'],
      'L': ['⠇⠀⠀', '⠇⠀⠀', '⠏⠤⠤'],
      'O': ['⠋⠉⠙', '⠇⠀⠸', '⠣⠤⠴'],
      'T': ['⠉⠋⠉', '⠀⠇⠀', '⠀⠇⠀'],
      ' ': ['⠀⠀⠀', '⠀⠀⠀', '⠀⠀⠀'],
    };
    return blocks[ch] || ['⠿⠿⠿', '⠿⠿⠿', '⠿⠿⠿'];
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Text (optional, leave empty for patterns)</label>
            <input id={`${toolId}-input`} type="text" value={input} onChange={(e) => setInput(e.target.value)} className="input-field" placeholder="HELLO" aria-label={`Text input for ${toolName}`} />
          </div>
          {!input && (
            <>
              <div>
                <label htmlFor={`${toolId}-pattern`} className="block text-sm font-medium text-gray-700 mb-1">Pattern</label>
                <select id={`${toolId}-pattern`} value={pattern} onChange={(e) => setPattern(e.target.value as 'fill' | 'border' | 'diagonal' | 'dots')} className="input-field" aria-label="Pattern type">
                  <option value="fill">Fill</option>
                  <option value="border">Border</option>
                  <option value="diagonal">Diagonal</option>
                  <option value="dots">Dots</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor={`${toolId}-width`} className="block text-sm font-medium text-gray-700 mb-1">Width</label>
                  <input id={`${toolId}-width`} type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} min={1} max={80} className="input-field" aria-label="Width" />
                </div>
                <div>
                  <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                  <input id={`${toolId}-height`} type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} min={1} max={40} className="input-field" aria-label="Height" />
                </div>
              </div>
            </>
          )}
          <button onClick={generate} className="btn-primary">Generate Braille Art</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Braille Art</label>
            <pre className="whitespace-pre-wrap text-lg font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
