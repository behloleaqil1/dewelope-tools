'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PantoneColorCodeConverter - Pantone to hex approximation converter.
 */
export default function PantoneColorCodeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [pantone, setPantone] = useState('');
  const [result, setResult] = useState<{ pantone: string; hex: string; rgb: string } | null>(null);
  const [error, setError] = useState('');

  // Common Pantone to hex approximations
  const PANTONE_MAP: Record<string, string> = {
    '100': '#f4ed7c', '101': '#f4ed47', '102': '#f9e814', '103': '#c6ad0f',
    '185': '#e4002b', '186': '#ce1126', '200': '#c41e3a', '201': '#9b2335',
    '280': '#012169', '281': '#00205b', '282': '#041c2c', '283': '#92c1e9',
    '284': '#6cace4', '285': '#0072ce', '286': '#0033a0', '287': '#003da5',
    '300': '#005eb8', '301': '#004b87', '302': '#003b5c', '320': '#009b8d',
    '321': '#008c82', '348': '#00843d', '349': '#046a38', '350': '#2c5234',
    '354': '#00b140', '355': '#009639', '356': '#007a33', '360': '#6cc24a',
    '375': '#97d700', '376': '#84bd00', '377': '#7a9a01', '382': '#c4d600',
    '485': '#da291c', '486': '#e8927c', '500': '#ce8e99', '501': '#ea9999',
    '541': '#003c71', '542': '#4698cb', '543': '#9bcbeb', '7421': '#612141',
    '7455': '#3a5dae', '7461': '#0077c8', '7462': '#00558c', '7463': '#002d56',
    '7540': '#4b4f54', '7541': '#d9e1e2', '7542': '#a4bcc2', '7543': '#98a4ae',
    '7544': '#768692', '7545': '#425563', '7546': '#253746', '7547': '#131e29',
    'black': '#2d2926', 'white': '#ffffff', 'warm-red': '#f9423a', 'rubine-red': '#ce0058',
    'rhodamine-red': '#e10098', 'purple': '#bb29bb', 'violet': '#440099', 'blue-072': '#10069f',
    'reflex-blue': '#001489', 'process-blue': '#0085ca', 'green': '#00ab84', 'yellow': '#fedd00',
    'orange-021': '#fe5000',
  };

  function convert() {
    setError('');
    setResult(null);
    const key = pantone.trim().toLowerCase().replace(/^pantone\s*/i, '').replace(/\s*c$/i, '').replace(/\s*u$/i, '');
    if (!key) { setError('Please enter a Pantone code'); return; }

    const hex = PANTONE_MAP[key];
    if (!hex) {
      setError(`Pantone ${pantone} not found in database. Try codes like 285, 185, 348, etc.`);
      return;
    }

    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    setResult({ pantone: `Pantone ${pantone.trim().toUpperCase()}`, hex, rgb: `rgb(${r}, ${g}, ${b})` });
  }

  const copyText = result ? `${result.pantone}\nHex: ${result.hex}\nRGB: ${result.rgb}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Pantone Code</label>
        <input
          id={`${toolId}-input`}
          type="text"
          value={pantone}
          onChange={(e) => setPantone(e.target.value)}
          placeholder="e.g., 285, 185 C, Reflex Blue"
          aria-label={`Pantone code for ${toolName}`}
          className="input-field w-64"
        />
      </InputArea>

      <button onClick={convert} aria-label="Convert Pantone to hex" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="w-20 h-20 rounded-lg border border-gray-300" style={{ backgroundColor: result.hex }} />
              <div className="space-y-1">
                <div className="font-bold text-gray-800">{result.pantone}</div>
                <div className="text-sm font-mono text-gray-600">Hex: {result.hex}</div>
                <div className="text-sm font-mono text-gray-600">{result.rgb}</div>
              </div>
            </div>
            <p className="text-xs text-gray-500">Note: These are approximations. Actual Pantone colors require calibrated printing.</p>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
