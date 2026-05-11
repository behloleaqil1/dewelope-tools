'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * WireGaugeConverter - Convert between AWG wire gauge and mm² cross-section area.
 * Includes diameter in mm and inches, plus resistance per km.
 */

const AWG_DATA: { awg: string; diameterMm: number; areaMm2: number; resistanceOhmKm: number }[] = [
  { awg: '0000 (4/0)', diameterMm: 11.684, areaMm2: 107.22, resistanceOhmKm: 0.1608 },
  { awg: '000 (3/0)', diameterMm: 10.405, areaMm2: 85.029, resistanceOhmKm: 0.2028 },
  { awg: '00 (2/0)', diameterMm: 9.266, areaMm2: 67.431, resistanceOhmKm: 0.2557 },
  { awg: '0 (1/0)', diameterMm: 8.251, areaMm2: 53.475, resistanceOhmKm: 0.3224 },
  { awg: '1', diameterMm: 7.348, areaMm2: 42.408, resistanceOhmKm: 0.4066 },
  { awg: '2', diameterMm: 6.544, areaMm2: 33.631, resistanceOhmKm: 0.5127 },
  { awg: '3', diameterMm: 5.827, areaMm2: 26.670, resistanceOhmKm: 0.6465 },
  { awg: '4', diameterMm: 5.189, areaMm2: 21.151, resistanceOhmKm: 0.8152 },
  { awg: '5', diameterMm: 4.621, areaMm2: 16.773, resistanceOhmKm: 1.028 },
  { awg: '6', diameterMm: 4.115, areaMm2: 13.302, resistanceOhmKm: 1.296 },
  { awg: '7', diameterMm: 3.665, areaMm2: 10.549, resistanceOhmKm: 1.634 },
  { awg: '8', diameterMm: 3.264, areaMm2: 8.366, resistanceOhmKm: 2.061 },
  { awg: '9', diameterMm: 2.906, areaMm2: 6.631, resistanceOhmKm: 2.599 },
  { awg: '10', diameterMm: 2.588, areaMm2: 5.261, resistanceOhmKm: 3.277 },
  { awg: '11', diameterMm: 2.305, areaMm2: 4.172, resistanceOhmKm: 4.132 },
  { awg: '12', diameterMm: 2.053, areaMm2: 3.309, resistanceOhmKm: 5.211 },
  { awg: '13', diameterMm: 1.828, areaMm2: 2.624, resistanceOhmKm: 6.571 },
  { awg: '14', diameterMm: 1.628, areaMm2: 2.081, resistanceOhmKm: 8.286 },
  { awg: '16', diameterMm: 1.291, areaMm2: 1.309, resistanceOhmKm: 13.17 },
  { awg: '18', diameterMm: 1.024, areaMm2: 0.823, resistanceOhmKm: 20.95 },
  { awg: '20', diameterMm: 0.812, areaMm2: 0.518, resistanceOhmKm: 33.31 },
  { awg: '22', diameterMm: 0.644, areaMm2: 0.326, resistanceOhmKm: 52.96 },
  { awg: '24', diameterMm: 0.511, areaMm2: 0.205, resistanceOhmKm: 84.22 },
  { awg: '26', diameterMm: 0.405, areaMm2: 0.129, resistanceOhmKm: 133.9 },
  { awg: '28', diameterMm: 0.321, areaMm2: 0.081, resistanceOhmKm: 212.9 },
  { awg: '30', diameterMm: 0.255, areaMm2: 0.051, resistanceOhmKm: 338.6 },
];

export default function WireGaugeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mode, setMode] = useState<'awg-to-mm' | 'mm-to-awg'>('awg-to-mm');
  const [awgInput, setAwgInput] = useState('');
  const [mmInput, setMmInput] = useState('');
  const [result, setResult] = useState<{ awg: string; diameterMm: number; areaMm2: number; diameterIn: number; resistanceOhmKm: number } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculate = () => {
    const newErrors: Record<string, string> = {};

    if (mode === 'awg-to-mm') {
      const match = AWG_DATA.find((d) => d.awg === awgInput || d.awg.startsWith(awgInput));
      if (!awgInput.trim() || !match) {
        newErrors.awg = 'Select a valid AWG gauge';
        setErrors(newErrors);
        setResult(null);
        return;
      }
      setErrors({});
      setResult({
        awg: match.awg,
        diameterMm: match.diameterMm,
        areaMm2: match.areaMm2,
        diameterIn: match.diameterMm / 25.4,
        resistanceOhmKm: match.resistanceOhmKm,
      });
    } else {
      const mm2 = parseFloat(mmInput);
      if (!mmInput.trim() || isNaN(mm2) || mm2 <= 0) {
        newErrors.mm = 'Please enter a valid cross-section area in mm²';
        setErrors(newErrors);
        setResult(null);
        return;
      }
      // Find closest AWG
      let closest = AWG_DATA[0];
      let minDiff = Math.abs(AWG_DATA[0].areaMm2 - mm2);
      for (const entry of AWG_DATA) {
        const diff = Math.abs(entry.areaMm2 - mm2);
        if (diff < minDiff) {
          minDiff = diff;
          closest = entry;
        }
      }
      setErrors({});
      setResult({
        awg: closest.awg,
        diameterMm: closest.diameterMm,
        areaMm2: closest.areaMm2,
        diameterIn: closest.diameterMm / 25.4,
        resistanceOhmKm: closest.resistanceOhmKm,
      });
    }
  };

  const copyText = result
    ? `AWG: ${result.awg}\nDiameter: ${result.diameterMm.toFixed(3)} mm (${result.diameterIn.toFixed(4)} in)\nCross-section: ${result.areaMm2.toFixed(3)} mm²\nResistance: ${result.resistanceOhmKm} Ω/km`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" checked={mode === 'awg-to-mm'} onChange={() => setMode('awg-to-mm')} className="text-blue-600" />
          <span className="text-sm text-gray-700">AWG → mm²</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" checked={mode === 'mm-to-awg'} onChange={() => setMode('mm-to-awg')} className="text-blue-600" />
          <span className="text-sm text-gray-700">mm² → AWG</span>
        </label>
      </div>

      {mode === 'awg-to-mm' ? (
        <InputArea error={errors.awg}>
          <label htmlFor={`${toolId}-awg`} className="block text-sm font-medium text-gray-700 mb-1">
            Select AWG Gauge
          </label>
          <select
            id={`${toolId}-awg`}
            value={awgInput}
            onChange={(e) => {
              setAwgInput(e.target.value);
              if (errors.awg) setErrors({});
            }}
            aria-label={`AWG gauge selection for ${toolName}`}
            className="input-field"
          >
            <option value="">-- Select AWG --</option>
            {AWG_DATA.map((d) => (
              <option key={d.awg} value={d.awg}>AWG {d.awg}</option>
            ))}
          </select>
        </InputArea>
      ) : (
        <InputArea error={errors.mm}>
          <label htmlFor={`${toolId}-mm`} className="block text-sm font-medium text-gray-700 mb-1">
            Cross-section Area (mm²)
          </label>
          <input
            id={`${toolId}-mm`}
            type="text"
            inputMode="decimal"
            value={mmInput}
            onChange={(e) => {
              setMmInput(e.target.value);
              if (errors.mm) setErrors({});
            }}
            placeholder="e.g. 2.5"
            aria-label={`Cross-section area for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      )}

      <button onClick={calculate} aria-label="Convert wire gauge" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">AWG {result.awg}</div>
                <div className="text-xs text-gray-500 mt-1">Wire Gauge</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-green-600">{result.areaMm2.toFixed(3)} mm²</div>
                <div className="text-xs text-gray-500 mt-1">Cross-section Area</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-1">
              <p><strong>Diameter:</strong> {result.diameterMm.toFixed(3)} mm ({result.diameterIn.toFixed(4)} in)</p>
              <p><strong>Resistance:</strong> {result.resistanceOhmKm} Ω/km (copper, 20°C)</p>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
