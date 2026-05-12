'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToEnigmaCipher - Simulate a basic Enigma machine cipher with configurable rotors.
 */
export default function TextToEnigmaCipher({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [rotorOffset1, setRotorOffset1] = useState(0);
  const [rotorOffset2, setRotorOffset2] = useState(0);
  const [rotorOffset3, setRotorOffset3] = useState(0);

  const ROTOR1 = 'EKMFLGDQVZNTOWYHXUSPAIBRCJ';
  const ROTOR2 = 'AJDKSIRUXBLHWTMCQGZNPYFVOE';
  const ROTOR3 = 'BDFHJLCPRTXVZNYEIWGAKMUSQO';
  const REFLECTOR = 'YRUHQSLDPXNGOKMIEBFZCWVJAT';

  function enigmaEncrypt(text: string): string {
    const upperText = text.toUpperCase();
    let r1 = rotorOffset1 % 26;
    let r2 = rotorOffset2 % 26;
    let r3 = rotorOffset3 % 26;
    let result = '';

    for (const ch of upperText) {
      if (ch < 'A' || ch > 'Z') {
        result += ch;
        continue;
      }

      // Step rotors
      r1 = (r1 + 1) % 26;
      if (r1 === 0) {
        r2 = (r2 + 1) % 26;
        if (r2 === 0) {
          r3 = (r3 + 1) % 26;
        }
      }

      let idx = (ch.charCodeAt(0) - 65 + r1) % 26;
      idx = (ROTOR1.charCodeAt(idx) - 65 + r2) % 26;
      idx = (ROTOR2.charCodeAt(idx) - 65 + r3) % 26;
      idx = ROTOR3.charCodeAt(idx) - 65;

      // Reflector
      idx = REFLECTOR.charCodeAt(idx) - 65;

      // Reverse through rotors
      idx = ROTOR3.indexOf(String.fromCharCode(((idx - r3 + 26) % 26) + 65));
      idx = ROTOR2.indexOf(String.fromCharCode(((idx - r2 + 26) % 26) + 65));
      idx = ROTOR1.indexOf(String.fromCharCode(((idx - r1 + 26) % 26) + 65));

      result += String.fromCharCode((idx % 26) + 65);
    }

    return result;
  }

  function handleEncrypt() {
    if (!input.trim()) {
      setOutput('');
      return;
    }
    setOutput(enigmaEncrypt(input));
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div>
            <label htmlFor={`${toolId}-r1`} className="block text-sm font-medium text-gray-700 mb-1">Rotor 1 Offset</label>
            <input id={`${toolId}-r1`} type="number" min={0} max={25} value={rotorOffset1} onChange={(e) => setRotorOffset1(Number(e.target.value))} className="input-field" aria-label="Rotor 1 offset" />
          </div>
          <div>
            <label htmlFor={`${toolId}-r2`} className="block text-sm font-medium text-gray-700 mb-1">Rotor 2 Offset</label>
            <input id={`${toolId}-r2`} type="number" min={0} max={25} value={rotorOffset2} onChange={(e) => setRotorOffset2(Number(e.target.value))} className="input-field" aria-label="Rotor 2 offset" />
          </div>
          <div>
            <label htmlFor={`${toolId}-r3`} className="block text-sm font-medium text-gray-700 mb-1">Rotor 3 Offset</label>
            <input id={`${toolId}-r3`} type="number" min={0} max={25} value={rotorOffset3} onChange={(e) => setRotorOffset3(Number(e.target.value))} className="input-field" aria-label="Rotor 3 offset" />
          </div>
        </div>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Text to Encrypt
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to encrypt with Enigma cipher..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-40 resize-y font-mono"
        />
        <button onClick={handleEncrypt} className="btn-primary mt-2">
          Encrypt
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Encrypted Output</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
