'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToDancingMen - Convert text to Sherlock Holmes dancing men cipher descriptions.
 * Each letter is mapped to a description of the stick figure pose from the cipher.
 */
export default function TextToDancingMen({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  // Descriptions of dancing men poses for each letter
  const dancingMenMap: Record<string, string> = {
    A: '🏃 arms up, legs apart',
    B: '🏃 right arm up, left down, legs together',
    C: '🏃 both arms right, legs apart',
    D: '🏃 left arm up, right out, legs together',
    E: '🏃 both arms down, legs apart (flag)',
    F: '🏃 right arm out, left down, legs apart',
    G: '🏃 both arms up-right, legs together',
    H: '🏃 arms crossed overhead, legs apart',
    I: '🏃 right arm up, left out, legs together',
    J: '🏃 left arm up, right down, legs apart',
    K: '🏃 both arms out, legs together',
    L: '🏃 right arm down, left up-right, legs apart',
    M: '🏃 arms down-spread, legs together',
    N: '🏃 right arm up-left, left down, legs apart',
    O: '🏃 both arms overhead, legs together',
    P: '🏃 left arm out, right up, legs apart',
    Q: '🏃 right arm down-right, left up, legs together',
    R: '🏃 both arms left, legs apart',
    S: '🏃 arms at sides, legs apart',
    T: '🏃 both arms straight up, legs together',
    U: '🏃 right arm out, left up, legs apart',
    V: '🏃 both arms down-angled, legs together',
    W: '🏃 arms wavy, legs apart',
    X: '🏃 arms and legs crossed',
    Y: '🏃 arms up-V shape, legs together',
    Z: '🏃 right arm diagonal, left at side, legs apart',
  };

  const convert = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    const lines: string[] = [];
    const words = input.toUpperCase().split(/\s+/);

    words.forEach((word, wordIdx) => {
      const letterDescs: string[] = [];
      for (const char of word) {
        if (dancingMenMap[char]) {
          letterDescs.push(`  ${char}: ${dancingMenMap[char]}`);
        }
      }
      if (letterDescs.length > 0) {
        // In the original cipher, last letter of a word holds a flag
        lines.push(`Word ${wordIdx + 1}: "${word}"`);
        letterDescs.forEach((desc, i) => {
          const flag = i === letterDescs.length - 1 ? ' [FLAG - end of word]' : '';
          lines.push(desc + flag);
        });
        lines.push('');
      }
    });

    setOutput(lines.join('\n').trim());
  };

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
          placeholder="Enter text to convert to dancing men descriptions..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-36 resize-y font-mono"
        />
        <button
          onClick={convert}
          className="btn-primary mt-2"
        >
          Convert to Dancing Men
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Dancing Men Cipher Descriptions</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <div className="mt-3 p-3 bg-gray-50 rounded text-xs text-gray-600">
              <p className="font-medium mb-1">About the Dancing Men Cipher:</p>
              <p>From Arthur Conan Doyle&apos;s &quot;The Adventure of the Dancing Men&quot; (1903). Each stick figure pose represents a letter. A figure holding a flag marks the end of a word.</p>
            </div>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
