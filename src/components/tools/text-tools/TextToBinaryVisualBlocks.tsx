'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToBinaryVisualBlocks - Show binary representation of text as colored blocks.
 */
export default function TextToBinaryVisualBlocks({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [zeroColor, setZeroColor] = useState('#1f2937');
  const [oneColor, setOneColor] = useState('#3b82f6');
  const [blockSize, setBlockSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [output, setOutput] = useState<{ char: string; binary: string }[]>([]);

  const convert = () => {
    if (!input) {
      setOutput([]);
      return;
    }
    const result = input.split('').map(char => ({
      char,
      binary: char.charCodeAt(0).toString(2).padStart(8, '0'),
    }));
    setOutput(result);
  };

  const sizeMap = { sm: 'w-3 h-3', md: 'w-4 h-4', lg: 'w-6 h-6' };
  const gapMap = { sm: 'gap-0.5', md: 'gap-1', lg: 'gap-1.5' };

  const binaryText = output.map(o => o.binary).join(' ');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Enter Text</label>
            <textarea
              id={`${toolId}-input`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type text to visualize as binary blocks..."
              className="input-field h-24 resize-y"
              aria-label={`Text input for ${toolName}`}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor={`${toolId}-zero`} className="block text-sm font-medium text-gray-700 mb-1">0 Color</label>
              <input id={`${toolId}-zero`} type="color" value={zeroColor} onChange={(e) => setZeroColor(e.target.value)} className="w-full h-9 rounded cursor-pointer" aria-label="Color for zero bits" />
            </div>
            <div>
              <label htmlFor={`${toolId}-one`} className="block text-sm font-medium text-gray-700 mb-1">1 Color</label>
              <input id={`${toolId}-one`} type="color" value={oneColor} onChange={(e) => setOneColor(e.target.value)} className="w-full h-9 rounded cursor-pointer" aria-label="Color for one bits" />
            </div>
            <div>
              <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">Block Size</label>
              <select id={`${toolId}-size`} value={blockSize} onChange={(e) => setBlockSize(e.target.value as 'sm' | 'md' | 'lg')} className="input-field" aria-label="Block size">
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </div>
          </div>
          <button onClick={convert} className="btn-primary w-full">Visualize Binary</button>
        </div>
      </InputArea>

      <OutputArea hasContent={output.length > 0}>
        {output.length > 0 && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Binary Visual Blocks</label>
            <div className="space-y-2">
              {output.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-sm font-mono w-8 text-gray-600 text-center">{item.char === ' ' ? '␣' : item.char}</span>
                  <div className={`flex ${gapMap[blockSize]}`}>
                    {item.binary.split('').map((bit, bitIdx) => (
                      <div
                        key={bitIdx}
                        className={`${sizeMap[blockSize]} rounded-sm`}
                        style={{ backgroundColor: bit === '0' ? zeroColor : oneColor }}
                        title={`${item.char} bit ${bitIdx}: ${bit}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-mono text-gray-500">{item.binary}</span>
                </div>
              ))}
            </div>
            <CopyToClipboard text={binaryText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
