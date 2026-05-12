'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToWingdingsArrows - Convert directional words to arrow Unicode symbols.
 * Maps words like "up", "down", "left", "right", "north", etc. to Unicode arrows.
 */
export default function TextToWingdingsArrows({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const arrowMap: Record<string, string> = {
    'up': '↑',
    'down': '↓',
    'left': '←',
    'right': '→',
    'north': '↑',
    'south': '↓',
    'east': '→',
    'west': '←',
    'northeast': '↗',
    'northwest': '↖',
    'southeast': '↘',
    'southwest': '↙',
    'ne': '↗',
    'nw': '↖',
    'se': '↘',
    'sw': '↙',
    'upleft': '↖',
    'upright': '↗',
    'downleft': '↙',
    'downright': '↘',
    'leftright': '↔',
    'updown': '↕',
    'forward': '→',
    'backward': '←',
    'back': '←',
    'next': '→',
    'previous': '←',
    'return': '↩',
    'enter': '↵',
    'refresh': '↻',
    'reload': '↺',
    'undo': '↶',
    'redo': '↷',
    'curved-right': '↪',
    'curved-left': '↩',
    'double-right': '⇒',
    'double-left': '⇐',
    'double-up': '⇑',
    'double-down': '⇓',
    'thick-right': '➡',
    'thick-left': '⬅',
    'thick-up': '⬆',
    'thick-down': '⬇',
  };

  const convert = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    const result = input.replace(/\b[\w-]+\b/gi, (word) => {
      const lower = word.toLowerCase();
      return arrowMap[lower] || word;
    });

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text with directional words
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Go right then turn left. Head northeast to the exit."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
        <button onClick={convert} className="btn-primary mt-4">Convert to Arrows</button>
        <div className="mt-3 text-xs text-gray-500">
          <p>Supported words: up, down, left, right, north, south, east, west, northeast, northwest, southeast, southwest, forward, backward, return, enter, refresh, undo, redo, double-right, thick-up, etc.</p>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
