'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToFlagSemaphoreVisual - Show flag semaphore as visual arm positions.
 * Each letter is represented by two arm positions (clock positions).
 */

const SEMAPHORE_POSITIONS: Record<string, [number, number]> = {
  'A': [225, 270], 'B': [180, 270], 'C': [135, 270], 'D': [90, 270],
  'E': [270, 315], 'F': [270, 0], 'G': [270, 45], 'H': [180, 225],
  'I': [135, 225], 'J': [90, 0], 'K': [90, 225], 'L': [90, 180],
  'M': [90, 135], 'N': [45, 225], 'O': [45, 180], 'P': [45, 135],
  'Q': [45, 90], 'R': [0, 225], 'S': [0, 180], 'T': [0, 135],
  'U': [0, 90], 'V': [315, 135], 'W': [315, 90], 'X': [315, 45],
  'Y': [0, 45], 'Z': [315, 0],
};

function getDirection(angle: number): string {
  const dirs: Record<number, string> = {
    0: '↑ Up', 45: '↗ Up-Right', 90: '→ Right', 135: '↘ Down-Right',
    180: '↓ Down', 225: '↙ Down-Left', 270: '← Left', 315: '↖ Up-Left',
  };
  return dirs[angle] || `${angle}°`;
}

export default function TextToFlagSemaphoreVisual({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    const results: string[] = [];
    for (const char of input.toUpperCase()) {
      if (char === ' ') {
        results.push('--- [SPACE] ---');
      } else if (SEMAPHORE_POSITIONS[char]) {
        const pos = SEMAPHORE_POSITIONS[char];
        const leftDir = getDirection(pos[0]);
        const rightDir = getDirection(pos[1]);
        results.push(`${char}:  Left arm ${leftDir}  |  Right arm ${rightDir}`);
      } else if (/[0-9]/.test(char)) {
        results.push(`${char}: (Numerals use special indicator + letter positions)`);
      } else {
        results.push(`${char}: (No semaphore representation)`);
      }
    }

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text to convert to flag semaphore
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text (A-Z)..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
        <button onClick={convert} className="btn-primary mt-4">Show Semaphore Positions</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Flag Semaphore Arm Positions</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
