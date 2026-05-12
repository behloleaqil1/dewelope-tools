'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SmithChartCalculator - Calculate impedance on Smith chart.
 * Converts between impedance, reflection coefficient, and VSWR.
 */
export default function SmithChartCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [zReal, setZReal] = useState('');
  const [zImag, setZImag] = useState('');
  const [z0, setZ0] = useState('50');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const r = parseFloat(zReal);
    const x = parseFloat(zImag);
    const z0Val = parseFloat(z0);

    if (isNaN(r) || isNaN(x) || isNaN(z0Val) || z0Val === 0) {
      setOutput('Error: Please enter valid impedance values. Z0 cannot be zero.');
      return;
    }

    // Normalized impedance
    const zNormR = r / z0Val;
    const zNormX = x / z0Val;

    // Reflection coefficient: Γ = (Z - Z0) / (Z + Z0)
    const numR = r - z0Val;
    const numX = x;
    const denR = r + z0Val;
    const denX = x;

    const denMagSq = denR * denR + denX * denX;
    const gammaR = (numR * denR + numX * denX) / denMagSq;
    const gammaX = (numX * denR - numR * denX) / denMagSq;

    const gammaMag = Math.sqrt(gammaR * gammaR + gammaX * gammaX);
    const gammaAngle = Math.atan2(gammaX, gammaR) * (180 / Math.PI);

    // VSWR
    const vswr = gammaMag < 1 ? (1 + gammaMag) / (1 - gammaMag) : Infinity;

    // Return loss
    const returnLoss = gammaMag > 0 ? -20 * Math.log10(gammaMag) : Infinity;

    // Mismatch loss
    const mismatchLoss = -10 * Math.log10(1 - gammaMag * gammaMag);

    const results = [
      `=== Smith Chart Results ===`,
      ``,
      `Load Impedance: ${r} ${x >= 0 ? '+' : '-'} j${Math.abs(x)} Ω`,
      `Characteristic Impedance (Z₀): ${z0Val} Ω`,
      ``,
      `Normalized Impedance: ${zNormR.toFixed(4)} ${zNormX >= 0 ? '+' : '-'} j${Math.abs(zNormX).toFixed(4)}`,
      ``,
      `Reflection Coefficient (Γ):`,
      `  Magnitude: ${gammaMag.toFixed(6)}`,
      `  Angle: ${gammaAngle.toFixed(2)}°`,
      `  Real: ${gammaR.toFixed(6)}`,
      `  Imaginary: ${gammaX.toFixed(6)}`,
      ``,
      `VSWR: ${vswr === Infinity ? '∞' : vswr.toFixed(4)}`,
      `Return Loss: ${returnLoss === Infinity ? '∞' : returnLoss.toFixed(2)} dB`,
      `Mismatch Loss: ${mismatchLoss.toFixed(4)} dB`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-real`} className="block text-sm font-medium text-gray-700 mb-1">Resistance (R) Ω</label>
              <input id={`${toolId}-real`} type="number" value={zReal} onChange={(e) => setZReal(e.target.value)} placeholder="75" aria-label={`Resistance for ${toolName}`} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-imag`} className="block text-sm font-medium text-gray-700 mb-1">Reactance (X) Ω</label>
              <input id={`${toolId}-imag`} type="number" value={zImag} onChange={(e) => setZImag(e.target.value)} placeholder="25" aria-label="Reactance value" className="input-field" />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-z0`} className="block text-sm font-medium text-gray-700 mb-1">Characteristic Impedance (Z₀) Ω</label>
            <input id={`${toolId}-z0`} type="number" value={z0} onChange={(e) => setZ0(e.target.value)} placeholder="50" aria-label="Characteristic impedance" className="input-field" />
          </div>
          <button onClick={calculate} className="btn-primary">Calculate</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Smith Chart Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
