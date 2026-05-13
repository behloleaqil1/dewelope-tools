'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SamplingRateCalculator - Calculate Nyquist sampling rate from signal bandwidth.
 * Nyquist theorem: Fs >= 2 × Fmax to avoid aliasing.
 */
export default function SamplingRateCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [bandwidth, setBandwidth] = useState('20');
  const [unit, setUnit] = useState('kHz');
  const [oversampleFactor, setOversampleFactor] = useState('1');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const bw = parseFloat(bandwidth);
    const osf = parseFloat(oversampleFactor);

    if (isNaN(bw) || bw <= 0) {
      setOutput('Please enter a valid positive bandwidth.');
      return;
    }
    if (isNaN(osf) || osf < 1) {
      setOutput('Oversample factor must be at least 1.');
      return;
    }

    const multipliers: Record<string, number> = { Hz: 1, kHz: 1e3, MHz: 1e6, GHz: 1e9 };
    const bwHz = bw * (multipliers[unit] || 1e3);
    const nyquistRate = 2 * bwHz;
    const actualRate = nyquistRate * osf;

    const formatFreq = (hz: number) => {
      if (hz >= 1e9) return `${(hz / 1e9).toFixed(4)} GHz`;
      if (hz >= 1e6) return `${(hz / 1e6).toFixed(4)} MHz`;
      if (hz >= 1e3) return `${(hz / 1e3).toFixed(4)} kHz`;
      return `${hz.toFixed(2)} Hz`;
    };

    const samplesPerCycle = actualRate / bwHz;
    const bitDepths = [8, 16, 24, 32];
    const dataRates = bitDepths.map(bits => ({
      bits,
      rate: actualRate * bits,
    }));

    const lines = [
      `=== Nyquist Sampling Rate Calculator ===`,
      ``,
      `Signal Bandwidth (Fmax): ${bw} ${unit} (${formatFreq(bwHz)})`,
      `Oversample Factor: ${osf}x`,
      ``,
      `--- Nyquist Theorem ---`,
      `Minimum Sampling Rate (Fs ≥ 2×Fmax): ${formatFreq(nyquistRate)}`,
      `Actual Sampling Rate (with ${osf}x oversample): ${formatFreq(actualRate)}`,
      ``,
      `--- Signal Details ---`,
      `Samples per cycle at Fmax: ${samplesPerCycle.toFixed(2)}`,
      `Nyquist frequency (Fs/2): ${formatFreq(actualRate / 2)}`,
      `Frequency resolution (1 sample): ${formatFreq(actualRate)}`,
      ``,
      `--- Data Rates (mono channel) ---`,
      ...dataRates.map(d => `  ${d.bits}-bit: ${formatFreq(d.rate).replace('Hz', 'bps').replace('kHz', 'kbps').replace('MHz', 'Mbps').replace('GHz', 'Gbps')}`),
      ``,
      `--- Common Standards ---`,
      `  Audio CD: 44.1 kHz (22.05 kHz bandwidth)`,
      `  DVD Audio: 96 kHz (48 kHz bandwidth)`,
      `  Telephony: 8 kHz (4 kHz bandwidth)`,
    ];

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label htmlFor={`${toolId}-bw`} className="block text-sm font-medium text-gray-700 mb-1">
              Signal Bandwidth (Fmax)
            </label>
            <input
              id={`${toolId}-bw`}
              type="number"
              value={bandwidth}
              onChange={(e) => setBandwidth(e.target.value)}
              className="input-field"
              aria-label={`Signal bandwidth for ${toolName}`}
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">
              Unit
            </label>
            <select
              id={`${toolId}-unit`}
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="input-field"
              aria-label="Frequency unit"
            >
              <option value="Hz">Hz</option>
              <option value="kHz">kHz</option>
              <option value="MHz">MHz</option>
              <option value="GHz">GHz</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-osf`} className="block text-sm font-medium text-gray-700 mb-1">
              Oversample Factor
            </label>
            <input
              id={`${toolId}-osf`}
              type="number"
              value={oversampleFactor}
              onChange={(e) => setOversampleFactor(e.target.value)}
              min="1"
              step="0.5"
              className="input-field"
              aria-label="Oversample factor"
            />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-3">
          Calculate Sampling Rate
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Sampling Rate Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
