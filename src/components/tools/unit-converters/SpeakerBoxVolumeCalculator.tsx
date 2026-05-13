'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SpeakerBoxVolumeCalculator - Calculate speaker enclosure volume.
 * Computes internal volume for sealed and ported speaker boxes from dimensions.
 */
export default function SpeakerBoxVolumeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [depth, setDepth] = useState('');
  const [thickness, setThickness] = useState('0.75');
  const [portDiameter, setPortDiameter] = useState('');
  const [portLength, setPortLength] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const w = parseFloat(width);
    const h = parseFloat(height);
    const d = parseFloat(depth);
    const t = parseFloat(thickness) || 0;

    if (isNaN(w) || isNaN(h) || isNaN(d) || w <= 0 || h <= 0 || d <= 0) {
      setOutput('Please enter valid positive dimensions.');
      return;
    }

    // External volume
    const extVolCubicInches = w * h * d;
    const extVolLiters = extVolCubicInches * 0.016387;
    const extVolCubicFeet = extVolCubicInches / 1728;

    // Internal dimensions (subtract material thickness from each side)
    const intW = w - (2 * t);
    const intH = h - (2 * t);
    const intD = d - (2 * t);

    if (intW <= 0 || intH <= 0 || intD <= 0) {
      setOutput('Material thickness is too large for the given dimensions.');
      return;
    }

    const intVolCubicInches = intW * intH * intD;
    const intVolLiters = intVolCubicInches * 0.016387;
    const intVolCubicFeet = intVolCubicInches / 1728;

    // Port displacement
    let portDisplacement = 0;
    const pd = parseFloat(portDiameter);
    const pl = parseFloat(portLength);
    if (!isNaN(pd) && !isNaN(pl) && pd > 0 && pl > 0) {
      const portRadius = pd / 2;
      portDisplacement = Math.PI * portRadius * portRadius * pl;
    }

    const netVolCubicInches = intVolCubicInches - portDisplacement;
    const netVolLiters = netVolCubicInches * 0.016387;
    const netVolCubicFeet = netVolCubicInches / 1728;

    const lines = [
      '═══ Speaker Box Volume Calculator ═══',
      '',
      '── External Dimensions ──',
      `  Width:  ${w}" × Height: ${h}" × Depth: ${d}"`,
      `  Material Thickness: ${t}"`,
      '',
      '── External Volume ──',
      `  ${extVolCubicInches.toFixed(2)} cubic inches`,
      `  ${extVolCubicFeet.toFixed(4)} cubic feet`,
      `  ${extVolLiters.toFixed(2)} liters`,
      '',
      '── Internal Dimensions ──',
      `  Width:  ${intW.toFixed(2)}" × Height: ${intH.toFixed(2)}" × Depth: ${intD.toFixed(2)}"`,
      '',
      '── Internal Volume ──',
      `  ${intVolCubicInches.toFixed(2)} cubic inches`,
      `  ${intVolCubicFeet.toFixed(4)} cubic feet`,
      `  ${intVolLiters.toFixed(2)} liters`,
    ];

    if (portDisplacement > 0) {
      lines.push(
        '',
        '── Port Displacement ──',
        `  Port: ${pd}" diameter × ${pl}" length`,
        `  Displacement: ${portDisplacement.toFixed(2)} cubic inches`,
        '',
        '── Net Internal Volume (after port) ──',
        `  ${netVolCubicInches.toFixed(2)} cubic inches`,
        `  ${netVolCubicFeet.toFixed(4)} cubic feet`,
        `  ${netVolLiters.toFixed(2)} liters`,
      );
    }

    lines.push(
      '',
      '── Notes ──',
      '• Internal volume accounts for material thickness on all sides.',
      '• Port displacement reduces usable internal volume.',
      '• Bracing and driver displacement further reduce net volume.',
    );

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label htmlFor={`${toolId}-w`} className="block text-sm font-medium text-gray-700 mb-1">Width (inches)</label>
              <input id={`${toolId}-w`} type="number" step="any" value={width} onChange={(e) => setWidth(e.target.value)} placeholder="e.g. 14" className="input-field" aria-label={`Width for ${toolName}`} />
            </div>
            <div>
              <label htmlFor={`${toolId}-h`} className="block text-sm font-medium text-gray-700 mb-1">Height (inches)</label>
              <input id={`${toolId}-h`} type="number" step="any" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g. 18" className="input-field" aria-label="Height" />
            </div>
            <div>
              <label htmlFor={`${toolId}-d`} className="block text-sm font-medium text-gray-700 mb-1">Depth (inches)</label>
              <input id={`${toolId}-d`} type="number" step="any" value={depth} onChange={(e) => setDepth(e.target.value)} placeholder="e.g. 12" className="input-field" aria-label="Depth" />
            </div>
            <div>
              <label htmlFor={`${toolId}-t`} className="block text-sm font-medium text-gray-700 mb-1">Thickness (inches)</label>
              <input id={`${toolId}-t`} type="number" step="any" value={thickness} onChange={(e) => setThickness(e.target.value)} placeholder="e.g. 0.75" className="input-field" aria-label="Material thickness" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-pd`} className="block text-sm font-medium text-gray-700 mb-1">Port Diameter (inches, optional)</label>
              <input id={`${toolId}-pd`} type="number" step="any" value={portDiameter} onChange={(e) => setPortDiameter(e.target.value)} placeholder="e.g. 3" className="input-field" aria-label="Port diameter" />
            </div>
            <div>
              <label htmlFor={`${toolId}-pl`} className="block text-sm font-medium text-gray-700 mb-1">Port Length (inches, optional)</label>
              <input id={`${toolId}-pl`} type="number" step="any" value={portLength} onChange={(e) => setPortLength(e.target.value)} placeholder="e.g. 10" className="input-field" aria-label="Port length" />
            </div>
          </div>
          <button onClick={calculate} className="btn-primary" aria-label="Calculate speaker box volume">
            Calculate Volume
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Speaker Box Volume Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
