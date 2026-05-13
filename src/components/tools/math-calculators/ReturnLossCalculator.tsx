'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ReturnLossCalculator - Calculate return loss from VSWR or reflection coefficient.
 * Provides return loss in dB, mismatch loss, and reflected power percentage.
 */
export default function ReturnLossCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mode, setMode] = useState<'vswr' | 'gamma'>('vswr');
  const [vswr, setVswr] = useState('');
  const [gamma, setGamma] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    let reflectionCoeff: number;

    if (mode === 'vswr') {
      const vswrVal = parseFloat(vswr);
      if (isNaN(vswrVal) || vswrVal < 1) {
        setOutput('Error: VSWR must be >= 1');
        return;
      }
      reflectionCoeff = (vswrVal - 1) / (vswrVal + 1);
    } else {
      reflectionCoeff = parseFloat(gamma);
      if (isNaN(reflectionCoeff) || reflectionCoeff < 0 || reflectionCoeff > 1) {
        setOutput('Error: Reflection coefficient must be between 0 and 1');
        return;
      }
    }

    const returnLoss = reflectionCoeff > 0 ? -20 * Math.log10(reflectionCoeff) : Infinity;
    const mismatchLoss = -10 * Math.log10(1 - reflectionCoeff * reflectionCoeff);
    const reflectedPower = reflectionCoeff * reflectionCoeff * 100;
    const transmittedPower = 100 - reflectedPower;
    const computedVswr = (1 + reflectionCoeff) / (1 - reflectionCoeff);

    const results = [
      `Reflection Coefficient (Γ): ${reflectionCoeff.toFixed(6)}`,
      `VSWR: ${computedVswr.toFixed(4)}:1`,
      `Return Loss: ${returnLoss === Infinity ? '∞' : returnLoss.toFixed(4)} dB`,
      `Mismatch Loss: ${mismatchLoss.toFixed(4)} dB`,
      `Reflected Power: ${reflectedPower.toFixed(2)}%`,
      `Transmitted Power: ${transmittedPower.toFixed(2)}%`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Input Mode</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as 'vswr' | 'gamma')}
              aria-label={`Input mode for ${toolName}`}
              className="input-field"
            >
              <option value="vswr">From VSWR</option>
              <option value="gamma">From Reflection Coefficient (Γ)</option>
            </select>
          </div>
          {mode === 'vswr' ? (
            <div>
              <label htmlFor={`${toolId}-vswr`} className="block text-sm font-medium text-gray-700 mb-1">
                VSWR (≥ 1)
              </label>
              <input
                id={`${toolId}-vswr`}
                type="number"
                step="0.01"
                min="1"
                value={vswr}
                onChange={(e) => setVswr(e.target.value)}
                placeholder="e.g. 1.5"
                aria-label="VSWR value"
                className="input-field"
              />
            </div>
          ) : (
            <div>
              <label htmlFor={`${toolId}-gamma`} className="block text-sm font-medium text-gray-700 mb-1">
                Reflection Coefficient Γ (0 to 1)
              </label>
              <input
                id={`${toolId}-gamma`}
                type="number"
                step="0.001"
                min="0"
                max="1"
                value={gamma}
                onChange={(e) => setGamma(e.target.value)}
                placeholder="e.g. 0.2"
                aria-label="Reflection coefficient"
                className="input-field"
              />
            </div>
          )}
          <button onClick={calculate} className="btn-primary w-full">
            Calculate Return Loss
          </button>
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
