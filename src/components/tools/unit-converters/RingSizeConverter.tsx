'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * RingSizeConverter - Converts between US, UK, EU, Japanese ring sizes and diameter in mm.
 */
export default function RingSizeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [inputValue, setInputValue] = useState('');
  const [fromSystem, setFromSystem] = useState<'us' | 'uk' | 'eu' | 'jp' | 'diameter'>('us');
  const [result, setResult] = useState<{ us: string; uk: string; eu: string; jp: string; diameter: string; circumference: string } | null>(null);
  const [error, setError] = useState('');

  const ukLetters = ['F', 'F½', 'G', 'G½', 'H', 'H½', 'I', 'I½', 'J', 'J½', 'K', 'K½', 'L', 'L½', 'M', 'M½', 'N', 'N½', 'O', 'O½', 'P', 'P½', 'Q', 'Q½', 'R', 'R½', 'S', 'S½', 'T', 'T½', 'U', 'U½', 'V', 'V½', 'W', 'W½', 'X', 'X½', 'Y', 'Y½', 'Z', 'Z½'];

  const convert = () => {
    const val = inputValue.trim();
    if (!val) { setError('Please enter a value'); setResult(null); return; }

    let diameterMm: number;

    switch (fromSystem) {
      case 'us': {
        const usSize = parseFloat(val);
        if (isNaN(usSize) || usSize < 3 || usSize > 14) { setError('US size must be between 3 and 14'); setResult(null); return; }
        // Interpolate: diameter = 12.37 + usSize * 0.8128
        diameterMm = 12.37 + usSize * 0.8128;
        break;
      }
      case 'uk': {
        const ukIdx = ukLetters.findIndex((l) => l.toUpperCase() === val.toUpperCase());
        if (ukIdx === -1) { setError('Enter a valid UK size (F to Z½)'); setResult(null); return; }
        // UK F = ~14.1mm, each half step = ~0.4mm
        diameterMm = 14.1 + ukIdx * 0.4;
        break;
      }
      case 'eu': {
        const euSize = parseFloat(val);
        if (isNaN(euSize) || euSize < 44 || euSize > 72) { setError('EU size must be between 44 and 72'); setResult(null); return; }
        // EU size = circumference in mm, diameter = circumference / π
        diameterMm = euSize / Math.PI;
        break;
      }
      case 'jp': {
        const jpSize = parseInt(val);
        if (isNaN(jpSize) || jpSize < 1 || jpSize > 30) { setError('Japanese size must be between 1 and 30'); setResult(null); return; }
        // JP 1 = ~13mm diameter, each size = ~0.33mm
        diameterMm = 13.0 + (jpSize - 1) * 0.33;
        break;
      }
      case 'diameter': {
        const d = parseFloat(val);
        if (isNaN(d) || d < 12 || d > 25) { setError('Diameter must be between 12 and 25 mm'); setResult(null); return; }
        diameterMm = d;
        break;
      }
      default:
        return;
    }

    setError('');
    const circumference = diameterMm * Math.PI;

    // Convert to all systems
    const usSize = (diameterMm - 12.37) / 0.8128;
    const usRounded = Math.round(usSize * 2) / 2; // Round to nearest 0.5

    const ukIdx = Math.round((diameterMm - 14.1) / 0.4);
    const ukSize = ukIdx >= 0 && ukIdx < ukLetters.length ? ukLetters[ukIdx] : '—';

    const euSize = circumference; // EU = circumference in mm

    const jpSize = Math.round((diameterMm - 13.0) / 0.33) + 1;

    setResult({
      us: usRounded >= 3 && usRounded <= 14 ? usRounded.toString() : '—',
      uk: ukSize,
      eu: euSize.toFixed(1),
      jp: jpSize >= 1 && jpSize <= 30 ? jpSize.toString() : '—',
      diameter: diameterMm.toFixed(2),
      circumference: circumference.toFixed(2),
    });
  };

  const systems = [
    { value: 'us', label: 'US' },
    { value: 'uk', label: 'UK' },
    { value: 'eu', label: 'EU' },
    { value: 'jp', label: 'Japanese' },
    { value: 'diameter', label: 'Diameter (mm)' },
  ] as const;

  const copyText = result
    ? `Ring Size Conversion:\nUS: ${result.us}\nUK: ${result.uk}\nEU: ${result.eu}\nJapanese: ${result.jp}\nDiameter: ${result.diameter} mm\nCircumference: ${result.circumference} mm`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea>
          <label htmlFor={`${toolId}-system`} className="block text-sm font-medium text-gray-700 mb-1">
            Convert from
          </label>
          <select
            id={`${toolId}-system`}
            value={fromSystem}
            onChange={(e) => { setFromSystem(e.target.value as typeof fromSystem); setResult(null); }}
            className="input-field"
            aria-label={`Source ring size system for ${toolName}`}
          >
            {systems.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">
            Size Value
          </label>
          <input
            id={`${toolId}-value`}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={fromSystem === 'uk' ? 'e.g. L' : fromSystem === 'eu' ? 'e.g. 52' : fromSystem === 'jp' ? 'e.g. 12' : fromSystem === 'diameter' ? 'e.g. 17.3' : 'e.g. 7'}
            aria-label={`Ring size value for ${toolName}`}
            className="input-field font-mono"
          />
          {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        </InputArea>
      </div>

      <button onClick={convert} aria-label="Convert ring size" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'US', value: result.us },
                { label: 'UK', value: result.uk },
                { label: 'EU', value: result.eu },
                { label: 'Japanese', value: result.jp },
                { label: 'Diameter', value: `${result.diameter} mm` },
                { label: 'Circumference', value: `${result.circumference} mm` },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                  <div className="text-lg font-bold text-gray-800">{item.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{item.label}</div>
                </div>
              ))}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
