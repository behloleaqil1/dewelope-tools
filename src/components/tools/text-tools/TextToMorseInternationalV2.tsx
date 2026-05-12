'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const MORSE_MAP: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
  '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.', '.': '.-.-.-', ',': '--..--', '?': '..--..',
  '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...',
  ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-',
  '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.', "'": '.----.',
};

const PROSIGNS: Record<string, string> = {
  'AR': '.-.-. (End of message)',
  'AS': '.-... (Wait)',
  'BT': '-...- (Break/New paragraph)',
  'CT': '-.-.- (Start copying)',
  'HH': '........ (Error/Correction)',
  'KN': '-.--. (Invite specific station)',
  'NJ': '-..--- (Shift to Wabun)',
  'SK': '...-.- (End of contact)',
  'SN': '...-. (Understood)',
  'SOS': '...---... (Distress)',
};

const QCODES: Record<string, string> = {
  'QRA': 'What is your station name?',
  'QRG': 'What is my exact frequency?',
  'QRH': 'Does my frequency vary?',
  'QRL': 'Are you busy?',
  'QRM': 'Are you being interfered with?',
  'QRN': 'Are you troubled by static?',
  'QRO': 'Shall I increase power?',
  'QRP': 'Shall I decrease power?',
  'QRQ': 'Shall I send faster?',
  'QRS': 'Shall I send more slowly?',
  'QRT': 'Shall I stop sending?',
  'QRV': 'Are you ready?',
  'QRZ': 'Who is calling me?',
  'QSB': 'Are my signals fading?',
  'QSL': 'Can you acknowledge receipt?',
  'QSO': 'Can you communicate directly?',
  'QSY': 'Shall I change frequency?',
  'QTH': 'What is your position/location?',
};

/**
 * TextToMorseInternationalV2 - International Morse with prosigns and Q-codes reference.
 */
export default function TextToMorseInternationalV2({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [showProsigns, setShowProsigns] = useState(false);
  const [showQCodes, setShowQCodes] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!input) { setOutput(''); return; }

    debounceRef.current = setTimeout(() => {
      const words = input.toUpperCase().split(' ');
      const morseWords = words.map(word => {
        return word.split('').map(char => MORSE_MAP[char] || char).join(' ');
      });
      setOutput(morseWords.join(' / '));
    }, 200);

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
          placeholder="Enter text to convert to International Morse..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Morse Code Output</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>

      <div className="flex flex-wrap gap-3">
        <button onClick={() => setShowProsigns(!showProsigns)} className="btn-primary text-sm">
          {showProsigns ? 'Hide' : 'Show'} Prosigns
        </button>
        <button onClick={() => setShowQCodes(!showQCodes)} className="btn-primary text-sm">
          {showQCodes ? 'Hide' : 'Show'} Q-Codes
        </button>
      </div>

      {showProsigns && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Prosigns Reference</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs font-mono">
            {Object.entries(PROSIGNS).map(([key, val]) => (
              <div key={key}><span className="font-bold text-blue-600">{key}</span>: {val}</div>
            ))}
          </div>
        </div>
      )}

      {showQCodes && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Q-Codes Reference</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
            {Object.entries(QCODES).map(([key, val]) => (
              <div key={key}><span className="font-bold font-mono text-blue-600">{key}</span>: {val}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
