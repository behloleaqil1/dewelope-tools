'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToDingbats - Convert text to dingbat/ornament Unicode characters.
 * Maps letters to decorative Unicode dingbat symbols.
 */
export default function TextToDingbats({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [style, setStyle] = useState<'ornamental' | 'floral' | 'stars' | 'snowflakes'>('ornamental');
  const [output, setOutput] = useState('');

  const dingbatSets: Record<string, string[]> = {
    ornamental: ['✦', '✧', '✩', '✪', '✫', '✬', '✭', '✮', '✯', '✰', '✱', '✲', '✳', '✴', '✵', '✶', '✷', '✸', '✹', '✺', '✻', '✼', '✽', '✾', '✿', '❀'],
    floral: ['❁', '❂', '❃', '❄', '❅', '❆', '❇', '❈', '❉', '❊', '❋', '✿', '❀', '❁', '✾', '✽', '❃', '❊', '❋', '❇', '❈', '❉', '✿', '❀', '❁', '❂'],
    stars: ['★', '☆', '✡', '✦', '✧', '✩', '✪', '✫', '✬', '✭', '✮', '✯', '✰', '⭐', '🌟', '💫', '⭑', '⭒', '✶', '✷', '✸', '✹', '✺', '✻', '✼', '✽'],
    snowflakes: ['❄', '❅', '❆', '✻', '✼', '❇', '❈', '❉', '❊', '❋', '✳', '✴', '✵', '✶', '✷', '✸', '✹', '✺', '✻', '✼', '✽', '✾', '✿', '❀', '❁', '❂'],
  };

  const convert = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    const chars = dingbatSets[style];
    const result = input.split('').map(char => {
      const upper = char.toUpperCase();
      if (upper >= 'A' && upper <= 'Z') {
        const index = upper.charCodeAt(0) - 65;
        return chars[index % chars.length];
      }
      if (char === ' ') return ' ';
      if (char === '\n') return '\n';
      return char;
    }).join('');

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Enter text to convert</label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to convert to dingbats..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
        <div className="mt-3">
          <label htmlFor={`${toolId}-style`} className="block text-sm font-medium text-gray-700 mb-1">Dingbat Style</label>
          <select id={`${toolId}-style`} value={style} onChange={(e) => setStyle(e.target.value as typeof style)} className="input-field" aria-label="Dingbat style">
            <option value="ornamental">Ornamental</option>
            <option value="floral">Floral</option>
            <option value="stars">Stars</option>
            <option value="snowflakes">Snowflakes</option>
          </select>
        </div>
        <button onClick={convert} className="btn-primary mt-4">Convert to Dingbats</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Dingbat Result</label>
            <pre className="whitespace-pre-wrap text-2xl text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
