'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PathLossExponentCalculator - Calculate path loss exponent from measurements.
 * Uses two measurement points to determine the path loss exponent n.
 * Formula: n = (PL(d2) - PL(d1)) / (10 × log10(d2/d1))
 */
export default function PathLossExponentCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [d1, setD1] = useState('');
  const [pl1, setPl1] = useState('');
  const [d2, setD2] = useState('');
  const [pl2, setPl2] = useState('');
  const [refDistance, setRefDistance] = useState('1');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const dist1 = parseFloat(d1);
    const loss1 = parseFloat(pl1);
    const dist2 = parseFloat(d2);
    const loss2 = parseFloat(pl2);
    const dRef = parseFloat(refDistance);

    if (isNaN(dist1) || isNaN(loss1) || isNaN(dist2) || isNaN(loss2) || isNaN(dRef)) {
      setOutput('Please enter valid numeric values for all fields.');
      return;
    }

    if (dist1 <= 0 || dist2 <= 0 || dRef <= 0 || dist1 === dist2) {
      setOutput('Distances must be positive and different from each other.');
      return;
    }

    const n = (loss2 - loss1) / (10 * Math.log10(dist2 / dist1));
    const plRef = loss1 - 10 * n * Math.log10(dist1 / dRef);

    let environment = 'Unknown';
    if (n < 1.8) environment = 'Waveguide / Hallway (guided propagation)';
    else if (n < 2.2) environment = 'Free space';
    else if (n < 3.0) environment = 'Urban area / Office (soft partition)';
    else if (n < 3.5) environment = 'Obstructed office / Urban cellular';
    else if (n < 4.5) environment = 'Dense urban / Indoor (hard partition)';
    else environment = 'Heavily obstructed / Indoor multi-floor';

    const results = [
      `═══ Path Loss Exponent Calculation ═══`,
      ``,
      `Measurement Points:`,
      `  Point 1: d₁ = ${dist1} m, PL₁ = ${loss1} dB`,
      `  Point 2: d₂ = ${dist2} m, PL₂ = ${loss2} dB`,
      `  Reference distance: d₀ = ${dRef} m`,
      ``,
      `Results:`,
      `  Path Loss Exponent (n): ${n.toFixed(4)}`,
      `  Path Loss at d₀ (PL₀): ${plRef.toFixed(2)} dB`,
      ``,
      `Environment Match: ${environment}`,
      ``,
      `Path Loss Model:`,
      `  PL(d) = ${plRef.toFixed(2)} + ${(10 * n).toFixed(2)} × log₁₀(d / ${dRef})  [dB]`,
      ``,
      `Reference Values:`,
      `  n = 2.0  → Free space`,
      `  n = 2.7-3.5 → Urban area`,
      `  n = 3.0-5.0 → Indoor (shadowed)`,
      `  n = 1.6-1.8 → Hallway / Corridor`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Enter two measurement points (distance and path loss) to calculate the exponent.</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-d1`} className="block text-sm font-medium text-gray-700 mb-1">Distance 1 (m)</label>
              <input id={`${toolId}-d1`} type="number" value={d1} onChange={(e) => setD1(e.target.value)} placeholder="e.g. 10" className="input-field" aria-label={`Distance 1 for ${toolName}`} />
            </div>
            <div>
              <label htmlFor={`${toolId}-pl1`} className="block text-sm font-medium text-gray-700 mb-1">Path Loss 1 (dB)</label>
              <input id={`${toolId}-pl1`} type="number" value={pl1} onChange={(e) => setPl1(e.target.value)} placeholder="e.g. 60" className="input-field" aria-label="Path loss at distance 1" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-d2`} className="block text-sm font-medium text-gray-700 mb-1">Distance 2 (m)</label>
              <input id={`${toolId}-d2`} type="number" value={d2} onChange={(e) => setD2(e.target.value)} placeholder="e.g. 100" className="input-field" aria-label="Distance 2" />
            </div>
            <div>
              <label htmlFor={`${toolId}-pl2`} className="block text-sm font-medium text-gray-700 mb-1">Path Loss 2 (dB)</label>
              <input id={`${toolId}-pl2`} type="number" value={pl2} onChange={(e) => setPl2(e.target.value)} placeholder="e.g. 80" className="input-field" aria-label="Path loss at distance 2" />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-ref`} className="block text-sm font-medium text-gray-700 mb-1">Reference Distance d₀ (m)</label>
            <input id={`${toolId}-ref`} type="number" value={refDistance} onChange={(e) => setRefDistance(e.target.value)} className="input-field" aria-label="Reference distance" />
          </div>
          <button onClick={calculate} className="btn-primary">Calculate Path Loss Exponent</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
