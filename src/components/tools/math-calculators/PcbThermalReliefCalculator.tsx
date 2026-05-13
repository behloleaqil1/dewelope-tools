'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PcbThermalReliefCalculator - Calculate thermal relief pad dimensions for PCB design.
 * Computes spoke width, gap angle, thermal resistance, and pad geometry.
 */
export default function PcbThermalReliefCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [padDiameter, setPadDiameter] = useState('60');
  const [drillDiameter, setDrillDiameter] = useState('30');
  const [spokeCount, setSpokeCount] = useState('4');
  const [spokeWidth, setSpokeWidth] = useState('10');
  const [copperThickness, setCopperThickness] = useState('1.4');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const pad = parseFloat(padDiameter);
    const drill = parseFloat(drillDiameter);
    const spokes = parseInt(spokeCount);
    const spoke = parseFloat(spokeWidth);
    const thickness = parseFloat(copperThickness);

    if (isNaN(pad) || isNaN(drill) || isNaN(spokes) || isNaN(spoke) || isNaN(thickness)) {
      setOutput('Please enter valid numeric values.');
      return;
    }

    if (drill >= pad) {
      setOutput('Drill diameter must be smaller than pad diameter.');
      return;
    }

    const annularRing = (pad - drill) / 2;
    const padArea = Math.PI * (Math.pow(pad / 2, 2) - Math.pow(drill / 2, 2));
    const spokeArea = spokes * spoke * annularRing;
    const gapArea = padArea - spokeArea;
    const gapAngle = 360 / spokes;
    const spokeAngle = (spoke / (Math.PI * (pad / 2 + drill / 2) / 2)) * (180 / Math.PI);
    const gapActualAngle = gapAngle - spokeAngle;

    // Thermal resistance approximation (simplified model)
    const copperConductivity = 385; // W/(m·K)
    const spokeLength = annularRing / 1000; // convert mil to mm to m
    const spokeCrossSection = (spoke / 1000) * (thickness / 1000); // mm² to m²
    const thermalResPerSpoke = (spokeLength / 1000) / (copperConductivity * spokeCrossSection / 1e6);
    const totalThermalRes = thermalResPerSpoke / spokes;

    const lines = [
      '=== PCB Thermal Relief Calculation ===',
      '',
      '--- Input Parameters ---',
      `Pad Diameter: ${pad} mil`,
      `Drill Diameter: ${drill} mil`,
      `Number of Spokes: ${spokes}`,
      `Spoke Width: ${spoke} mil`,
      `Copper Thickness: ${thickness} oz (${(thickness * 1.37).toFixed(1)} mil)`,
      '',
      '--- Geometry Results ---',
      `Annular Ring: ${annularRing.toFixed(2)} mil`,
      `Pad Annular Area: ${padArea.toFixed(2)} mil²`,
      `Total Spoke Area: ${spokeArea.toFixed(2)} mil²`,
      `Total Gap Area: ${gapArea.toFixed(2)} mil²`,
      `Gap Angle (per section): ${gapActualAngle.toFixed(1)}°`,
      `Spoke Angle: ~${spokeAngle.toFixed(1)}°`,
      '',
      '--- Thermal Analysis ---',
      `Thermal Resistance (per spoke): ~${thermalResPerSpoke.toFixed(2)} °C/W`,
      `Total Thermal Resistance: ~${totalThermalRes.toFixed(2)} °C/W`,
      `Copper Coverage: ${((spokeArea / padArea) * 100).toFixed(1)}%`,
      '',
      '--- Design Notes ---',
      `• ${spokes} spokes at ${gapAngle}° spacing`,
      `• Wider spokes = better thermal conductivity but harder soldering`,
      `• Typical spoke width: 8-15 mil for hand soldering`,
      `• Minimum annular ring: ${annularRing >= 7 ? '✓ OK' : '⚠ Below 7 mil minimum'}`,
    ];

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-pad`} className="block text-sm font-medium text-gray-700 mb-1">Pad Diameter (mil)</label>
            <input id={`${toolId}-pad`} type="number" value={padDiameter} onChange={(e) => setPadDiameter(e.target.value)} className="input-field" aria-label={`Pad diameter for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-drill`} className="block text-sm font-medium text-gray-700 mb-1">Drill Diameter (mil)</label>
            <input id={`${toolId}-drill`} type="number" value={drillDiameter} onChange={(e) => setDrillDiameter(e.target.value)} className="input-field" aria-label="Drill diameter" />
          </div>
          <div>
            <label htmlFor={`${toolId}-spokes`} className="block text-sm font-medium text-gray-700 mb-1">Number of Spokes</label>
            <select id={`${toolId}-spokes`} value={spokeCount} onChange={(e) => setSpokeCount(e.target.value)} className="input-field" aria-label="Number of spokes">
              <option value="2">2</option>
              <option value="4">4</option>
              <option value="6">6</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-spoke-width`} className="block text-sm font-medium text-gray-700 mb-1">Spoke Width (mil)</label>
            <input id={`${toolId}-spoke-width`} type="number" value={spokeWidth} onChange={(e) => setSpokeWidth(e.target.value)} className="input-field" aria-label="Spoke width" />
          </div>
          <div>
            <label htmlFor={`${toolId}-copper`} className="block text-sm font-medium text-gray-700 mb-1">Copper Thickness (oz)</label>
            <input id={`${toolId}-copper`} type="number" step="0.1" value={copperThickness} onChange={(e) => setCopperThickness(e.target.value)} className="input-field" aria-label="Copper thickness" />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate Thermal Relief</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Thermal Relief Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
