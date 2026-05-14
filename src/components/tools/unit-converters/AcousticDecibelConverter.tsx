'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AcousticDecibelConverter - Convert between dB SPL, dB(A), and reference levels.
 */
export default function AcousticDecibelConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [dbValue, setDbValue] = useState('');
  const [refType, setRefType] = useState('spl');
  const [result, setResult] = useState<{ pressure: string; intensity: string; power: string; description: string; examples: string } | null>(null);
  const [error, setError] = useState('');

  function convert() {
    setError('');
    setResult(null);
    const db = parseFloat(dbValue);
    if (isNaN(db)) { setError('Please enter a valid dB value'); return; }

    // Reference: 20 μPa for SPL, 1 pW/m² for intensity
    const refPressure = 20e-6; // Pa
    const refIntensity = 1e-12; // W/m²

    const pressure = refPressure * Math.pow(10, db / 20);
    const intensity = refIntensity * Math.pow(10, db / 10);
    const power = intensity; // simplified

    let description = '';
    let examples = '';
    if (db <= 10) { description = 'Near silence'; examples = 'Breathing, rustling leaves'; }
    else if (db <= 30) { description = 'Very quiet'; examples = 'Whisper, quiet library'; }
    else if (db <= 50) { description = 'Quiet'; examples = 'Quiet office, moderate rainfall'; }
    else if (db <= 70) { description = 'Moderate'; examples = 'Normal conversation, dishwasher'; }
    else if (db <= 85) { description = 'Loud'; examples = 'Vacuum cleaner, busy traffic'; }
    else if (db <= 100) { description = 'Very loud'; examples = 'Motorcycle, power tools'; }
    else if (db <= 120) { description = 'Extremely loud'; examples = 'Rock concert, thunder'; }
    else { description = 'Painful / Dangerous'; examples = 'Jet engine, gunshot'; }

    setResult({
      pressure: pressure < 0.001 ? pressure.toExponential(3) + ' Pa' : pressure.toFixed(4) + ' Pa',
      intensity: intensity < 0.001 ? intensity.toExponential(3) + ' W/m²' : intensity.toFixed(6) + ' W/m²',
      power: power < 0.001 ? power.toExponential(3) + ' W/m²' : power.toFixed(6) + ' W/m²',
      description,
      examples,
    });
  }

  const copyText = result
    ? `${dbValue} dB ${refType.toUpperCase()}\nPressure: ${result.pressure}\nIntensity: ${result.intensity}\nLevel: ${result.description}\nExamples: ${result.examples}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="flex items-end gap-3">
          <div>
            <label htmlFor={`${toolId}-db`} className="block text-sm font-medium text-gray-700 mb-1">Decibel Value</label>
            <input id={`${toolId}-db`} type="text" inputMode="decimal" value={dbValue} onChange={(e) => setDbValue(e.target.value)} placeholder="e.g., 60" aria-label={`Decibel value for ${toolName}`} className="input-field w-32" />
          </div>
          <div>
            <label htmlFor={`${toolId}-ref`} className="block text-sm font-medium text-gray-700 mb-1">Reference</label>
            <select id={`${toolId}-ref`} value={refType} onChange={(e) => setRefType(e.target.value)} aria-label="Decibel reference type" className="input-field">
              <option value="spl">dB SPL (20 μPa)</option>
              <option value="sil">dB SIL (10⁻¹² W/m²)</option>
            </select>
          </div>
        </div>
      </InputArea>

      <button onClick={convert} aria-label="Convert decibels" className="btn-primary">Convert</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600">{dbValue} dB</div>
              <div className="text-sm text-gray-600 mt-1">{result.description}</div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <div className="text-xs text-gray-500">Sound Pressure</div>
                <div className="font-mono font-medium">{result.pressure}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <div className="text-xs text-gray-500">Sound Intensity</div>
                <div className="font-mono font-medium">{result.intensity}</div>
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-sm">
              <span className="font-medium text-blue-800">Examples:</span> <span className="text-blue-700">{result.examples}</span>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
