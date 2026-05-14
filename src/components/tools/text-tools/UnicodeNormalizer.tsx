'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * UnicodeNormalizer - Normalize text using NFC/NFD/NFKC/NFKD forms
 */
export default function UnicodeNormalizer({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [form, setForm] = useState<'NFC' | 'NFD' | 'NFKC' | 'NFKD'>('NFC');
  const [result, setResult] = useState<{ normalized: string; originalLength: number; normalizedLength: number } | null>(null);

  function normalize() {
    if (!input) return;
    const normalized = input.normalize(form);
    setResult({
      normalized,
      originalLength: [...input].length,
      normalizedLength: [...normalized].length,
    });
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Text Input</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter text to normalize (e.g., café, naïve)" aria-label={`Text input for ${toolName}`} className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y" />
        <label htmlFor={`${toolId}-form`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Normalization Form</label>
        <select id={`${toolId}-form`} value={form} onChange={(e) => setForm(e.target.value as 'NFC' | 'NFD' | 'NFKC' | 'NFKD')} aria-label={`Normalization form for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="NFC">NFC (Canonical Decomposition + Composition)</option>
          <option value="NFD">NFD (Canonical Decomposition)</option>
          <option value="NFKC">NFKC (Compatibility Decomposition + Composition)</option>
          <option value="NFKD">NFKD (Compatibility Decomposition)</option>
        </select>
      </InputArea>

      <button onClick={normalize} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Normalize</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 bg-white p-3 rounded border border-gray-200">{result.normalized}</pre>
            <div className="text-sm text-gray-600">
              <p>Original code points: {result.originalLength}</p>
              <p>Normalized code points: {result.normalizedLength}</p>
              <p>Form: {form}</p>
            </div>
            <CopyToClipboard text={result.normalized} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
