'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToRunningKeyCipher - Encrypt and decrypt text using the Running Key cipher.
 * Uses a long text passage (book, article) as the key instead of a short keyword.
 */
export default function TextToRunningKeyCipher({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [keyText, setKeyText] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [output, setOutput] = useState('');

  const process = () => {
    const text = input.trim().toUpperCase();
    const key = keyText.trim().toUpperCase();

    if (!text || !key) {
      setOutput('Please enter both text and a running key text.');
      return;
    }

    const textLetters = text.replace(/[^A-Z]/g, '');
    const keyLetters = key.replace(/[^A-Z]/g, '');

    if (keyLetters.length < textLetters.length) {
      setOutput('Running key text must be at least as long as the input text (letters only). Please provide a longer key text.');
      return;
    }

    let result = '';

    for (let i = 0; i < textLetters.length; i++) {
      const textChar = textLetters.charCodeAt(i) - 65;
      const keyChar = keyLetters.charCodeAt(i) - 65;

      if (mode === 'encrypt') {
        const cipherChar = (textChar + keyChar) % 26;
        result += String.fromCharCode(cipherChar + 65);
      } else {
        const plainChar = (textChar - keyChar + 26) % 26;
        result += String.fromCharCode(plainChar + 65);
      }
    }

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="flex gap-4 mb-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name={`${toolId}-mode`}
            checked={mode === 'encrypt'}
            onChange={() => setMode('encrypt')}
          />
          Encrypt
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name={`${toolId}-mode`}
            checked={mode === 'decrypt'}
            onChange={() => setMode('decrypt')}
          />
          Decrypt
        </label>
      </div>

      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          {mode === 'encrypt' ? 'Plaintext' : 'Ciphertext'}
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encrypt' ? 'Enter text to encrypt...' : 'Enter text to decrypt...'}
          aria-label={`Text input for ${toolName}`}
          className="input-field h-28 resize-y font-mono"
        />
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-key`} className="block text-sm font-medium text-gray-700 mb-1">
          Running Key Text (must be at least as long as input)
        </label>
        <textarea
          id={`${toolId}-key`}
          value={keyText}
          onChange={(e) => setKeyText(e.target.value)}
          placeholder="Paste a long passage from a book, article, or any text to use as the key..."
          aria-label={`Running key text for ${toolName}`}
          className="input-field h-28 resize-y font-mono"
        />
      </InputArea>

      <button onClick={process} aria-label={`${mode} text`} className="btn-primary">
        {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
      </button>

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
