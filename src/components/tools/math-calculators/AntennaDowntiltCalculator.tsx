'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AntennaDowntiltCalculator - Calculate antenna electrical/mechanical downtilt.
 */
export default function AntennaDowntiltCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [antennaHeight, setAntennaHeight] = useState('30');
  const [targetDistance, setTargetDistance] = useState('500');
  const [targetHeight, setTargetHeight] = useState('1.5');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const h = parseFloat(antennaHeight);
    const d = parseFloat(targetDistance);
    const ht = parseFloat(targetHeight);

    if (isNaN(h) || isNaN(d) || isNaN(ht) || d <= 0) {
      setOutput('Please enter valid positive numbers. Distance must be greater than 0.');
      return;
    }

    const heightDiff = h - ht;
    const downtiltRad = Math.atan(heightDiff / d);
    const downtiltDeg = downtiltRad * (180 / Math.PI);

    const halfPowerAngle = 7; // typical vertical beamwidth
    const coverageNear = heightDiff / Math.tan((downtiltDeg + halfPowerAngle / 2) * Math.PI / 180);
    const coverageFar = heightDiff / Math.tan(Math.max(0.1, (downtiltDeg - halfPowerAngle / 2)) * Math.PI / 180);

    const lines: string[] = [
      `=== Antenna Downtilt Calculation ===`,
      ``,
      `Input Parameters:`,
      `  Antenna Height: ${h} m`,
      `  Target Distance: ${d} m`,
      `  Target Height: ${ht} m`,
      `  Height Difference: ${heightDiff.toFixed(2)} m`,
      ``,
      `Results:`,
      `  Required Downtilt: ${downtiltDeg.toFixed(2)}°`,
      ``,
      `Coverage Estimate (${halfPowerAngle}° beamwidth):`,
      `  Near edge: ~${Math.max(0, coverageNear).toFixed(1)} m`,
      `  Far edge: ~${coverageFar.toFixed(1)} m`,
      ``,
      `Notes:`,
      `  • Mechanical downtilt physically tilts the antenna`,
      `  • Electrical downtilt adjusts the phase array pattern`,
      `  • Combined downtilt = mechanical + electrical`,
      `  • Typical range: 2° to 15° for macro cells`,
    ];
    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">Antenna Height (m)</label>
            <input id={`${toolId}-height`} type="number" value={antennaHeight} onChange={(e) => setAntennaHeight(e.target.value)} aria-label={`Antenna height for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-distance`} className="block text-sm font-medium text-gray-700 mb-1">Target Distance (m)</label>
            <input id={`${toolId}-distance`} type="number" value={targetDistance} onChange={(e) => setTargetDistance(e.target.value)} aria-label="Target distance" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-target`} className="block text-sm font-medium text-gray-700 mb-1">Target Height (m)</label>
            <input id={`${toolId}-target`} type="number" value={targetHeight} onChange={(e) => setTargetHeight(e.target.value)} aria-label="Target height" className="input-field" />
          </div>
          <button onClick={calculate} className="btn-primary">Calculate Downtilt</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Downtilt Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
