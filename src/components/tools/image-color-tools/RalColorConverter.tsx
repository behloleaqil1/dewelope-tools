'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * RalColorConverter - RAL to hex conversion.
 */
export default function RalColorConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [ralCode, setRalCode] = useState('');
  const [result, setResult] = useState<{ ral: string; name: string; hex: string; rgb: string } | null>(null);
  const [error, setError] = useState('');

  const RAL_COLORS: Record<string, { name: string; hex: string }> = {
    '1000': { name: 'Green beige', hex: '#bebd7f' },
    '1001': { name: 'Beige', hex: '#c2b078' },
    '1002': { name: 'Sand yellow', hex: '#c6a664' },
    '1003': { name: 'Signal yellow', hex: '#e5be01' },
    '1004': { name: 'Golden yellow', hex: '#cda434' },
    '1005': { name: 'Honey yellow', hex: '#a98307' },
    '2000': { name: 'Yellow orange', hex: '#ed760e' },
    '2001': { name: 'Red orange', hex: '#c93c20' },
    '2002': { name: 'Vermilion', hex: '#cb2821' },
    '2003': { name: 'Pastel orange', hex: '#ff7514' },
    '3000': { name: 'Flame red', hex: '#af2b1e' },
    '3001': { name: 'Signal red', hex: '#a52019' },
    '3002': { name: 'Carmine red', hex: '#a2231d' },
    '3003': { name: 'Ruby red', hex: '#9b111e' },
    '4001': { name: 'Red lilac', hex: '#6d3461' },
    '4002': { name: 'Red violet', hex: '#922b3e' },
    '5000': { name: 'Violet blue', hex: '#354d73' },
    '5001': { name: 'Green blue', hex: '#1f3438' },
    '5002': { name: 'Ultramarine blue', hex: '#20214f' },
    '5003': { name: 'Sapphire blue', hex: '#1d1e33' },
    '5005': { name: 'Signal blue', hex: '#1e2460' },
    '5010': { name: 'Gentian blue', hex: '#0e294b' },
    '5015': { name: 'Sky blue', hex: '#2271b3' },
    '6000': { name: 'Patina green', hex: '#316650' },
    '6001': { name: 'Emerald green', hex: '#287233' },
    '6002': { name: 'Leaf green', hex: '#2d572c' },
    '6003': { name: 'Olive green', hex: '#424632' },
    '7000': { name: 'Squirrel grey', hex: '#78858b' },
    '7001': { name: 'Silver grey', hex: '#8a9597' },
    '7016': { name: 'Anthracite grey', hex: '#293133' },
    '7035': { name: 'Light grey', hex: '#d7d7d7' },
    '7040': { name: 'Window grey', hex: '#9da1aa' },
    '8000': { name: 'Green brown', hex: '#826c34' },
    '8001': { name: 'Ochre brown', hex: '#955f20' },
    '9001': { name: 'Cream', hex: '#fdf4e3' },
    '9002': { name: 'Grey white', hex: '#e7ebda' },
    '9003': { name: 'Signal white', hex: '#f4f4f4' },
    '9005': { name: 'Jet black', hex: '#0a0a0a' },
    '9010': { name: 'Pure white', hex: '#ffffff' },
    '9011': { name: 'Graphite black', hex: '#1c1c1c' },
  };

  function convert() {
    setError('');
    setResult(null);
    const code = ralCode.trim().replace(/^ral\s*/i, '');
    if (!code) { setError('Please enter a RAL code'); return; }

    const entry = RAL_COLORS[code];
    if (!entry) { setError(`RAL ${code} not found. Try codes like 1003, 3000, 5015, 7035, 9005.`); return; }

    const r = parseInt(entry.hex.slice(1, 3), 16);
    const g = parseInt(entry.hex.slice(3, 5), 16);
    const b = parseInt(entry.hex.slice(5, 7), 16);

    setResult({ ral: `RAL ${code}`, name: entry.name, hex: entry.hex, rgb: `rgb(${r}, ${g}, ${b})` });
  }

  const copyText = result ? `${result.ral} — ${result.name}\nHex: ${result.hex}\nRGB: ${result.rgb}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">RAL Code</label>
        <input id={`${toolId}-input`} type="text" value={ralCode} onChange={(e) => setRalCode(e.target.value)} placeholder="e.g., 5015, 9005, 3000" aria-label={`RAL code for ${toolName}`} className="input-field w-48" />
      </InputArea>

      <button onClick={convert} aria-label="Convert RAL to hex" className="btn-primary">Convert</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="w-20 h-20 rounded-lg border border-gray-300" style={{ backgroundColor: result.hex }} />
              <div className="space-y-1">
                <div className="font-bold text-gray-800">{result.ral}</div>
                <div className="text-sm text-gray-600">{result.name}</div>
                <div className="text-sm font-mono text-gray-600">{result.hex}</div>
                <div className="text-sm font-mono text-gray-600">{result.rgb}</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
