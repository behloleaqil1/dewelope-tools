'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SpeakerDiffractionCalculator - Calculate speaker baffle diffraction effects.
 * Estimates the frequency at which baffle edge diffraction becomes significant
 * and the resulting response ripple based on driver position and baffle dimensions.
 */
export default function SpeakerDiffractionCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [baffleWidth, setBaffleWidth] = useState('');
  const [baffleHeight, setBaffleHeight] = useState('');
  const [driverOffsetX, setDriverOffsetX] = useState('');
  const [driverOffsetY, setDriverOffsetY] = useState('');
  const [driverDiameter, setDriverDiameter] = useState('');
  const [speedOfSound, setSpeedOfSound] = useState('343');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const W = parseFloat(baffleWidth) / 100; // cm to m
    const H = parseFloat(baffleHeight) / 100;
    const offX = parseFloat(driverOffsetX) / 100;
    const offY = parseFloat(driverOffsetY) / 100;
    const dDia = parseFloat(driverDiameter) / 10; // mm to cm to m (input in mm)
    const c = parseFloat(speedOfSound);

    if (isNaN(W) || isNaN(H) || isNaN(offX) || isNaN(offY)) {
      setOutput('Please enter baffle dimensions and driver offset values.');
      return;
    }

    // Calculate distances from driver center to each edge
    const distLeft = offX;
    const distRight = W - offX;
    const distTop = offY;
    const distBottom = H - offY;

    // Distance to corners
    const distTL = Math.sqrt(distLeft * distLeft + distTop * distTop);
    const distTR = Math.sqrt(distRight * distRight + distTop * distTop);
    const distBL = Math.sqrt(distLeft * distLeft + distBottom * distBottom);
    const distBR = Math.sqrt(distRight * distRight + distBottom * distBottom);

    // Diffraction frequency for each edge: f = c / (2 * distance)
    const fLeft = c / (2 * distLeft);
    const fRight = c / (2 * distRight);
    const fTop = c / (2 * distTop);
    const fBottom = c / (2 * distBottom);

    // Primary diffraction frequency (shortest path)
    const shortestEdge = Math.min(distLeft, distRight, distTop, distBottom);
    const longestEdge = Math.max(distLeft, distRight, distTop, distBottom);
    const fPrimary = c / (2 * shortestEdge);
    const fSecondary = c / (2 * longestEdge);

    // Baffle step frequency (where response transitions from 4π to 2π radiation)
    const effectiveBaffleSize = Math.sqrt(W * H);
    const fBaffleStep = c / (Math.PI * effectiveBaffleSize);

    // Estimated ripple magnitude (simplified model)
    const pathDifference = longestEdge - shortestEdge;
    const rippleEstimate = 20 * Math.log10(1 + (shortestEdge / longestEdge));

    let result = '=== Speaker Baffle Diffraction Analysis ===\n\n';
    result += `--- Baffle Dimensions ---\n`;
    result += `Width:                   ${(W * 100).toFixed(1)} cm (${(W * 1000).toFixed(0)} mm)\n`;
    result += `Height:                  ${(H * 100).toFixed(1)} cm (${(H * 1000).toFixed(0)} mm)\n`;
    result += `Baffle Area:             ${(W * H * 10000).toFixed(1)} cm²\n`;
    if (!isNaN(dDia) && dDia > 0) {
      result += `Driver Diameter:         ${(dDia * 1000).toFixed(0)} mm\n`;
    }
    result += `\n--- Driver Position ---\n`;
    result += `Offset from left:        ${(distLeft * 100).toFixed(1)} cm\n`;
    result += `Offset from right:       ${(distRight * 100).toFixed(1)} cm\n`;
    result += `Offset from top:         ${(distTop * 100).toFixed(1)} cm\n`;
    result += `Offset from bottom:      ${(distBottom * 100).toFixed(1)} cm\n`;

    result += `\n--- Edge Distances ---\n`;
    result += `To left edge:            ${(distLeft * 100).toFixed(2)} cm → ${fLeft.toFixed(0)} Hz\n`;
    result += `To right edge:           ${(distRight * 100).toFixed(2)} cm → ${fRight.toFixed(0)} Hz\n`;
    result += `To top edge:             ${(distTop * 100).toFixed(2)} cm → ${fTop.toFixed(0)} Hz\n`;
    result += `To bottom edge:          ${(distBottom * 100).toFixed(2)} cm → ${fBottom.toFixed(0)} Hz\n`;

    result += `\n--- Corner Distances ---\n`;
    result += `To top-left:             ${(distTL * 100).toFixed(2)} cm\n`;
    result += `To top-right:            ${(distTR * 100).toFixed(2)} cm\n`;
    result += `To bottom-left:          ${(distBL * 100).toFixed(2)} cm\n`;
    result += `To bottom-right:         ${(distBR * 100).toFixed(2)} cm\n`;

    result += `\n--- Diffraction Frequencies ---\n`;
    result += `Primary diffraction:     ${fPrimary.toFixed(0)} Hz (shortest path: ${(shortestEdge * 100).toFixed(1)} cm)\n`;
    result += `Secondary diffraction:   ${fSecondary.toFixed(0)} Hz (longest path: ${(longestEdge * 100).toFixed(1)} cm)\n`;
    result += `Baffle step frequency:   ${fBaffleStep.toFixed(0)} Hz\n`;
    result += `Path difference:         ${(pathDifference * 100).toFixed(2)} cm\n`;
    result += `Estimated ripple:        ±${rippleEstimate.toFixed(1)} dB\n`;

    result += `\n--- Recommendations ---\n`;
    if (Math.abs(distLeft - distRight) < 0.01 && Math.abs(distTop - distBottom) < 0.01) {
      result += `• Driver is centered - maximum diffraction ripple expected\n`;
      result += `• Consider offsetting driver to spread diffraction frequencies\n`;
    } else {
      result += `• Asymmetric placement helps spread diffraction effects\n`;
    }
    if (shortestEdge < 0.05) {
      result += `• Very close to edge - high frequency diffraction above ${fPrimary.toFixed(0)} Hz\n`;
    }
    result += `• Chamfering or rounding baffle edges reduces diffraction by 3-6 dB\n`;
    result += `• Felt strips along edges can attenuate diffraction above ${(fPrimary * 0.7).toFixed(0)} Hz\n`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-width`} className="block text-sm font-medium text-gray-700 mb-1">Baffle Width (cm)</label>
              <input id={`${toolId}-width`} type="number" step="0.1" value={baffleWidth} onChange={(e) => setBaffleWidth(e.target.value)} placeholder="25" className="input-field" aria-label={`Baffle width for ${toolName}`} />
            </div>
            <div>
              <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">Baffle Height (cm)</label>
              <input id={`${toolId}-height`} type="number" step="0.1" value={baffleHeight} onChange={(e) => setBaffleHeight(e.target.value)} placeholder="40" className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-offx`} className="block text-sm font-medium text-gray-700 mb-1">Driver Offset X from Left (cm)</label>
              <input id={`${toolId}-offx`} type="number" step="0.1" value={driverOffsetX} onChange={(e) => setDriverOffsetX(e.target.value)} placeholder="8" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-offy`} className="block text-sm font-medium text-gray-700 mb-1">Driver Offset Y from Top (cm)</label>
              <input id={`${toolId}-offy`} type="number" step="0.1" value={driverOffsetY} onChange={(e) => setDriverOffsetY(e.target.value)} placeholder="12" className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-dia`} className="block text-sm font-medium text-gray-700 mb-1">Driver Diameter (mm)</label>
              <input id={`${toolId}-dia`} type="number" step="1" value={driverDiameter} onChange={(e) => setDriverDiameter(e.target.value)} placeholder="130" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-sos`} className="block text-sm font-medium text-gray-700 mb-1">Speed of Sound (m/s)</label>
              <input id={`${toolId}-sos`} type="number" step="1" value={speedOfSound} onChange={(e) => setSpeedOfSound(e.target.value)} className="input-field" />
            </div>
          </div>
          <button onClick={calculate} className="btn-primary">Calculate Diffraction</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Baffle Diffraction Analysis</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
