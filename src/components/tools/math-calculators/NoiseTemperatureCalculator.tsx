'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * NoiseTemperatureCalculator - Calculate equivalent noise temperature from noise figure.
 * Te = T0 * (F - 1) where T0 = 290K reference temperature.
 */
export default function NoiseTemperatureCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [noiseFigure, setNoiseFigure] = useState('');
  const [refTemp, setRefTemp] = useState('290');
  const [inputType, setInputType] = useState<'dB' | 'linear'>('dB');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const nf = parseFloat(noiseFigure);
    const t0 = parseFloat(refTemp);

    if (isNaN(nf) || isNaN(t0)) {
      setOutput('Please enter valid numeric values.');
      return;
    }

    let linearNF: number;
    if (inputType === 'dB') {
      linearNF = Math.pow(10, nf / 10);
    } else {
      linearNF = nf;
    }

    if (linearNF < 1) {
      setOutput('Noise figure must be ≥ 1 (linear) or ≥ 0 dB.');
      return;
    }

    const noiseTemp = t0 * (linearNF - 1);
    const nfDb = inputType === 'dB' ? nf : 10 * Math.log10(nf);
    const nfLinear = linearNF;

    const lines = [
      '═══ Equivalent Noise Temperature ═══',
      '',
      `Reference Temperature (T₀): ${t0} K`,
      `Noise Figure: ${nfDb.toFixed(4)} dB (${nfLinear.toFixed(6)} linear)`,
      '',
      `Equivalent Noise Temperature (Te): ${noiseTemp.toFixed(4)} K`,
      '',
      '═══ Formula ═══',
      '',
      'Te = T₀ × (F - 1)',
      `Te = ${t0} × (${nfLinear.toFixed(6)} - 1)`,
      `Te = ${noiseTemp.toFixed(4)} K`,
      '',
      '═══ Additional Info ═══',
      '',
      `System Noise Temperature (Tsys = T₀ + Te): ${(t0 + noiseTemp).toFixed(4)} K`,
      `Noise Power Density (kTe): ${(1.38e-23 * noiseTemp).toExponential(4)} W/Hz`,
    ];

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">
              Noise Figure Input Type
            </label>
            <select
              id={`${toolId}-type`}
              value={inputType}
              onChange={(e) => setInputType(e.target.value as 'dB' | 'linear')}
              className="input-field"
              aria-label={`Input type for ${toolName}`}
            >
              <option value="dB">dB</option>
              <option value="linear">Linear (ratio)</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-nf`} className="block text-sm font-medium text-gray-700 mb-1">
              Noise Figure ({inputType === 'dB' ? 'dB' : 'linear ratio'})
            </label>
            <input
              id={`${toolId}-nf`}
              type="number"
              step="any"
              value={noiseFigure}
              onChange={(e) => setNoiseFigure(e.target.value)}
              placeholder={inputType === 'dB' ? 'e.g. 3' : 'e.g. 2'}
              className="input-field"
              aria-label="Noise figure value"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-ref`} className="block text-sm font-medium text-gray-700 mb-1">
              Reference Temperature (K)
            </label>
            <input
              id={`${toolId}-ref`}
              type="number"
              step="any"
              value={refTemp}
              onChange={(e) => setRefTemp(e.target.value)}
              className="input-field"
              aria-label="Reference temperature in Kelvin"
            />
          </div>
          <button onClick={calculate} className="btn-primary" aria-label="Calculate noise temperature">
            Calculate Noise Temperature
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
