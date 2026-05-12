'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToPhoneticIpa - Convert English text to approximate IPA pronunciation.
 */
export default function TextToPhoneticIpa({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const ipaMap: Record<string, string> = {
    'a': 'æ', 'b': 'b', 'c': 'k', 'd': 'd', 'e': 'ɛ', 'f': 'f',
    'g': 'ɡ', 'h': 'h', 'i': 'ɪ', 'j': 'dʒ', 'k': 'k', 'l': 'l',
    'm': 'm', 'n': 'n', 'o': 'ɒ', 'p': 'p', 'q': 'kw', 'r': 'ɹ',
    's': 's', 't': 't', 'u': 'ʌ', 'v': 'v', 'w': 'w', 'x': 'ks',
    'y': 'j', 'z': 'z',
  };

  const digraphs: Record<string, string> = {
    'th': 'θ', 'sh': 'ʃ', 'ch': 'tʃ', 'ph': 'f', 'wh': 'w',
    'ng': 'ŋ', 'ck': 'k', 'ee': 'iː', 'oo': 'uː', 'ou': 'aʊ',
    'ow': 'aʊ', 'ai': 'eɪ', 'ay': 'eɪ', 'ea': 'iː', 'oi': 'ɔɪ',
    'oy': 'ɔɪ', 'ar': 'ɑːɹ', 'er': 'ɜːɹ', 'ir': 'ɜːɹ', 'or': 'ɔːɹ',
    'ur': 'ɜːɹ', 'aw': 'ɔː', 'au': 'ɔː', 'igh': 'aɪ',
  };

  const convert = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    const words = input.toLowerCase().split(/\s+/);
    const ipaWords = words.map((word) => {
      let result = '';
      let i = 0;
      const clean = word.replace(/[^a-z]/g, '');

      while (i < clean.length) {
        let matched = false;

        // Check trigraphs
        if (i + 2 < clean.length) {
          const tri = clean.slice(i, i + 3);
          if (digraphs[tri]) {
            result += digraphs[tri];
            i += 3;
            matched = true;
          }
        }

        // Check digraphs
        if (!matched && i + 1 < clean.length) {
          const di = clean.slice(i, i + 2);
          if (digraphs[di]) {
            result += digraphs[di];
            i += 2;
            matched = true;
          }
        }

        // Single character
        if (!matched) {
          result += ipaMap[clean[i]] || clean[i];
          i++;
        }
      }

      return `/${result}/`;
    });

    setOutput(ipaWords.join(' '));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Enter English text</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter English text to convert to IPA..." aria-label={`Text input for ${toolName}`} className="input-field h-32 resize-y" />
      </InputArea>

      <button onClick={convert} className="btn-primary" aria-label="Convert to IPA">Convert to IPA</button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Approximate IPA Transcription</label>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-lg font-mono text-gray-800 leading-relaxed">{output}</p>
            </div>
            <div className="text-xs text-gray-500 bg-yellow-50 p-2 rounded border border-yellow-200">
              Note: This is an approximate letter-by-letter IPA conversion. Actual English pronunciation depends on context, stress patterns, and dialect. For accurate transcriptions, consult a pronunciation dictionary.
            </div>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
