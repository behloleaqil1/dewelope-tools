'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SpeakerSdCalculator - Calculate speaker effective piston area (Sd)
 * from cone diameter or effective diameter measurements.
 */
export default function SpeakerSdCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [diameter, setDiameter] = useState('165');
  const [unit, setUnit] = useState('mm');
  const [surroundWidth, setSurroundWidth] = useState('10');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const dia = parseFloat(diameter);
    const surround = parseFloat(surroundWidth);

    if (isNaN(dia) || dia <= 0) {
      setOutput('Please enter a valid diameter.');
      return;
    }

    let diameterMm = dia;
    if (unit === 'cm') diameterMm = dia * 10;
    if (unit === 'in') diameterMm = dia * 25.4;

    const surroundMm = isNaN(surround) ? 0 : surround;
    const effectiveDiameter = diameterMm - surroundMm;
    const radiusMm = effectiveDiameter / 2;
    const radiusM = radiusMm / 1000;

    const sdMm2 = Math.PI * radiusMm * radiusMm;
    const sdCm2 = sdMm2 / 100;
    const sdM2 = Math.PI * radiusM * radiusM;
    const sdIn2 = sdMm2 / 645.16;

    // Classify driver size
    let category = '';
    if (sdCm2 < 30) category = 'Tweeter / Small Midrange';
    else if (sdCm2 < 100) category = 'Midrange';
    else if (sdCm2 < 300) category = 'Mid-Woofer';
    else if (sdCm2 < 600) category = 'Woofer';
    else category = 'Subwoofer';

    const result = `Speaker Effective Piston Area (Sd)
════════════════════════════════════════

Input:
  Cone diameter:     ${dia} ${unit} (${diameterMm.toFixed(1)} mm)
  Surround width:    ${surroundMm.toFixed(1)} mm
  Effective diameter: ${effectiveDiameter.toFixed(1)} mm

Results:
────────────────────────────────────────
  Sd = ${sdCm2.toFixed(2)} cm²
  Sd = ${sdMm2.toFixed(1)} mm²
  Sd = ${sdM2.toFixed(6)} m²
  Sd = ${sdIn2.toFixed(2)} in²
────────────────────────────────────────

Driver Category: ${category}

Formula: Sd = π × (d_eff / 2)²
  where d_eff = cone diameter − surround width`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-dia`} className="block text-sm font-medium text-gray-700 mb-1">Cone Diameter</label>
            <input id={`${toolId}-dia`} type="number" step="0.1" value={diameter} onChange={(e) => setDiameter(e.target.value)} className="input-field" aria-label={`Cone diameter for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
            <select id={`${toolId}-unit`} value={unit} onChange={(e) => setUnit(e.target.value)} className="input-field" aria-label="Diameter unit">
              <option value="mm">Millimeters (mm)</option>
              <option value="cm">Centimeters (cm)</option>
              <option value="in">Inches (in)</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-surround`} className="block text-sm font-medium text-gray-700 mb-1">Surround Width (mm)</label>
            <input id={`${toolId}-surround`} type="number" step="0.5" value={surroundWidth} onChange={(e) => setSurroundWidth(e.target.value)} className="input-field" aria-label="Surround width in mm" />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate Sd</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Calculation Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
