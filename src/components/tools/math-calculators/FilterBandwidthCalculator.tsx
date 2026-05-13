'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * FilterBandwidthCalculator - Calculate filter Q factor and bandwidth.
 * Computes Q factor, bandwidth, and related parameters from center frequency and -3dB points.
 */
export default function FilterBandwidthCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [centerFreq, setCenterFreq] = useState('');
  const [lowerFreq, setLowerFreq] = useState('');
  const [upperFreq, setUpperFreq] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const fc = parseFloat(centerFreq);
    const fl = parseFloat(lowerFreq);
    const fu = parseFloat(upperFreq);

    if (isNaN(fc) || isNaN(fl) || isNaN(fu)) {
      setOutput('Please enter valid frequency values.');
      return;
    }

    if (fl >= fu) {
      setOutput('Lower frequency must be less than upper frequency.');
      return;
    }

    if (fc <= 0 || fl <= 0 || fu <= 0) {
      setOutput('All frequencies must be positive.');
      return;
    }

    const bandwidth = fu - fl;
    const qFactor = fc / bandwidth;
    const geometricCenter = Math.sqrt(fl * fu);
    const fractionalBw = bandwidth / fc;
    const percentBw = fractionalBw * 100;
    const shapeFactor = (fu / fl);

    let classification = '';
    if (qFactor > 100) classification = 'Very Narrow Band';
    else if (qFactor > 10) classification = 'Narrow Band';
    else if (qFactor > 1) classification = 'Moderate Band';
    else classification = 'Wide Band';

    const lines = [
      '═══ Filter Bandwidth Analysis ═══',
      '',
      `Center Frequency (fc): ${fc} MHz`,
      `Lower -3dB (fl):       ${fl} MHz`,
      `Upper -3dB (fu):       ${fu} MHz`,
      '',
      '── Calculated Parameters ──',
      `  Bandwidth (BW):       ${bandwidth.toFixed(4)} MHz`,
      `  Q Factor:             ${qFactor.toFixed(4)}`,
      `  Fractional BW:        ${fractionalBw.toFixed(6)}`,
      `  Percentage BW:        ${percentBw.toFixed(2)}%`,
      `  Geometric Center:     ${geometricCenter.toFixed(4)} MHz`,
      `  Shape Factor (fu/fl): ${shapeFactor.toFixed(4)}`,
      '',
      `  Classification: ${classification}`,
      '',
      '── Formulas ──',
      `  BW = fu - fl = ${fu} - ${fl} = ${bandwidth.toFixed(4)} MHz`,
      `  Q  = fc / BW = ${fc} / ${bandwidth.toFixed(4)} = ${qFactor.toFixed(4)}`,
      '',
      '── Notes ──',
      '• Higher Q means narrower bandwidth (more selective).',
      '• Geometric center = √(fl × fu) for bandpass filters.',
      '• Fractional bandwidth is useful for comparing filters.',
    ];

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-center`} className="block text-sm font-medium text-gray-700 mb-1">
              Center Frequency (MHz)
            </label>
            <input
              id={`${toolId}-center`}
              type="number"
              step="any"
              value={centerFreq}
              onChange={(e) => setCenterFreq(e.target.value)}
              placeholder="e.g. 100"
              className="input-field"
              aria-label={`Center frequency for ${toolName}`}
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-lower`} className="block text-sm font-medium text-gray-700 mb-1">
              Lower -3dB Frequency (MHz)
            </label>
            <input
              id={`${toolId}-lower`}
              type="number"
              step="any"
              value={lowerFreq}
              onChange={(e) => setLowerFreq(e.target.value)}
              placeholder="e.g. 98"
              className="input-field"
              aria-label="Lower -3dB frequency"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-upper`} className="block text-sm font-medium text-gray-700 mb-1">
              Upper -3dB Frequency (MHz)
            </label>
            <input
              id={`${toolId}-upper`}
              type="number"
              step="any"
              value={upperFreq}
              onChange={(e) => setUpperFreq(e.target.value)}
              placeholder="e.g. 102"
              className="input-field"
              aria-label="Upper -3dB frequency"
            />
          </div>
          <button onClick={calculate} className="btn-primary" aria-label="Calculate filter bandwidth">
            Calculate Bandwidth & Q
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Filter Analysis Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
