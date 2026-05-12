'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * VswrCalculator - Calculate VSWR from reflection coefficient and related parameters.
 */
export default function VswrCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mode, setMode] = useState<'gamma' | 'impedance' | 'power'>('gamma');
  const [gammaMag, setGammaMag] = useState('');
  const [zLoad, setZLoad] = useState('');
  const [z0, setZ0] = useState('50');
  const [forwardPower, setForwardPower] = useState('');
  const [reflectedPower, setReflectedPower] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    let gamma = 0;

    if (mode === 'gamma') {
      gamma = parseFloat(gammaMag);
      if (isNaN(gamma) || gamma < 0 || gamma >= 1) {
        setOutput('Error: Reflection coefficient must be between 0 and 1 (exclusive).');
        return;
      }
    } else if (mode === 'impedance') {
      const zl = parseFloat(zLoad);
      const z0Val = parseFloat(z0);
      if (isNaN(zl) || isNaN(z0Val) || z0Val === 0) {
        setOutput('Error: Please enter valid impedance values.');
        return;
      }
      gamma = Math.abs((zl - z0Val) / (zl + z0Val));
    } else if (mode === 'power') {
      const pf = parseFloat(forwardPower);
      const pr = parseFloat(reflectedPower);
      if (isNaN(pf) || isNaN(pr) || pf <= 0 || pr < 0 || pr >= pf) {
        setOutput('Error: Forward power must be positive and greater than reflected power.');
        return;
      }
      gamma = Math.sqrt(pr / pf);
    }

    const vswr = (1 + gamma) / (1 - gamma);
    const returnLoss = gamma > 0 ? -20 * Math.log10(gamma) : Infinity;
    const mismatchLoss = -10 * Math.log10(1 - gamma * gamma);
    const powerDelivered = (1 - gamma * gamma) * 100;

    const results = [
      `=== VSWR Calculation Results ===`,
      ``,
      `Reflection Coefficient (|Γ|): ${gamma.toFixed(6)}`,
      `VSWR: ${vswr.toFixed(4)} : 1`,
      `Return Loss: ${returnLoss === Infinity ? '∞' : returnLoss.toFixed(2)} dB`,
      `Mismatch Loss: ${mismatchLoss.toFixed(4)} dB`,
      `Power Delivered: ${powerDelivered.toFixed(2)}%`,
      `Power Reflected: ${(gamma * gamma * 100).toFixed(2)}%`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-mode`} className="block text-sm font-medium text-gray-700 mb-1">Input Mode</label>
            <select id={`${toolId}-mode`} value={mode} onChange={(e) => setMode(e.target.value as 'gamma' | 'impedance' | 'power')} aria-label={`Input mode for ${toolName}`} className="input-field">
              <option value="gamma">Reflection Coefficient (|Γ|)</option>
              <option value="impedance">Load & Characteristic Impedance</option>
              <option value="power">Forward & Reflected Power</option>
            </select>
          </div>

          {mode === 'gamma' && (
            <div>
              <label htmlFor={`${toolId}-gamma`} className="block text-sm font-medium text-gray-700 mb-1">|Γ| (0 to 1)</label>
              <input id={`${toolId}-gamma`} type="number" step="0.01" min="0" max="0.99" value={gammaMag} onChange={(e) => setGammaMag(e.target.value)} placeholder="0.333" aria-label="Reflection coefficient magnitude" className="input-field" />
            </div>
          )}

          {mode === 'impedance' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor={`${toolId}-zl`} className="block text-sm font-medium text-gray-700 mb-1">Load Impedance (Ω)</label>
                <input id={`${toolId}-zl`} type="number" value={zLoad} onChange={(e) => setZLoad(e.target.value)} placeholder="75" aria-label="Load impedance" className="input-field" />
              </div>
              <div>
                <label htmlFor={`${toolId}-z0`} className="block text-sm font-medium text-gray-700 mb-1">Z₀ (Ω)</label>
                <input id={`${toolId}-z0`} type="number" value={z0} onChange={(e) => setZ0(e.target.value)} placeholder="50" aria-label="Characteristic impedance" className="input-field" />
              </div>
            </div>
          )}

          {mode === 'power' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor={`${toolId}-pf`} className="block text-sm font-medium text-gray-700 mb-1">Forward Power (W)</label>
                <input id={`${toolId}-pf`} type="number" value={forwardPower} onChange={(e) => setForwardPower(e.target.value)} placeholder="100" aria-label="Forward power" className="input-field" />
              </div>
              <div>
                <label htmlFor={`${toolId}-pr`} className="block text-sm font-medium text-gray-700 mb-1">Reflected Power (W)</label>
                <input id={`${toolId}-pr`} type="number" value={reflectedPower} onChange={(e) => setReflectedPower(e.target.value)} placeholder="11" aria-label="Reflected power" className="input-field" />
              </div>
            </div>
          )}

          <button onClick={calculate} className="btn-primary">Calculate VSWR</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">VSWR Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
