'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ThermalViaCalculator - Calculate thermal via array heat dissipation.
 * Estimates thermal resistance of via arrays for heat transfer through PCBs.
 */
export default function ThermalViaCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [viaCount, setViaCount] = useState('9');
  const [drillDiameter, setDrillDiameter] = useState('0.3');
  const [platingThickness, setPlatingThickness] = useState('25');
  const [boardThickness, setBoardThickness] = useState('1.6');
  const [fillMaterial, setFillMaterial] = useState<'air' | 'solder' | 'copper' | 'epoxy'>('air');
  const [powerDissipation, setPowerDissipation] = useState('1');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const count = parseInt(viaCount);
    const drill = parseFloat(drillDiameter);
    const plating = parseFloat(platingThickness);
    const thickness = parseFloat(boardThickness);
    const power = parseFloat(powerDissipation);

    if (isNaN(count) || isNaN(drill) || isNaN(plating) || isNaN(thickness) || isNaN(power)) {
      setOutput('Please enter valid numeric values.');
      return;
    }

    // Thermal conductivity (W/m·K)
    const kCopper = 385;
    const fillConductivity: Record<string, number> = {
      air: 0.025,
      solder: 50,
      copper: 385,
      epoxy: 0.25,
    };
    const kFill = fillConductivity[fillMaterial];

    const outerRadius = drill / 2; // mm
    const platingMm = plating / 1000;
    const innerRadius = outerRadius - platingMm;

    // Copper barrel area
    const copperArea = Math.PI * (outerRadius * outerRadius - innerRadius * innerRadius); // mm²
    // Fill area
    const fillArea = Math.PI * innerRadius * innerRadius; // mm²

    // Thermal resistance of one via: R = L / (k * A)
    const lengthM = thickness / 1000;
    const copperAreaM2 = copperArea / 1e6;
    const fillAreaM2 = fillArea / 1e6;

    const rCopper = lengthM / (kCopper * copperAreaM2);
    const rFill = lengthM / (kFill * fillAreaM2);

    // Parallel resistance of copper barrel and fill
    const rSingleVia = (rCopper * rFill) / (rCopper + rFill);

    // Array of vias in parallel
    const rArray = rSingleVia / count;

    // Temperature rise
    const deltaT = power * rArray;

    const lines: string[] = [];
    lines.push('=== Thermal Via Array Calculator ===');
    lines.push('');
    lines.push(`Via Count: ${count}`);
    lines.push(`Drill Diameter: ${drill} mm`);
    lines.push(`Plating Thickness: ${plating} µm`);
    lines.push(`Board Thickness: ${thickness} mm`);
    lines.push(`Fill Material: ${fillMaterial}`);
    lines.push(`Power Dissipation: ${power} W`);
    lines.push('');
    lines.push('--- Thermal Results ---');
    lines.push(`Single Via Thermal Resistance: ${rSingleVia.toFixed(2)} °C/W`);
    lines.push(`Array Thermal Resistance (${count} vias): ${rArray.toFixed(2)} °C/W`);
    lines.push(`Temperature Rise at ${power}W: ${deltaT.toFixed(2)} °C`);
    lines.push('');
    lines.push('--- Per-Via Breakdown ---');
    lines.push(`Copper Barrel Resistance: ${rCopper.toFixed(2)} °C/W`);
    lines.push(`Fill Resistance: ${rFill.toFixed(2)} °C/W`);
    lines.push(`Copper Cross-section: ${copperArea.toFixed(4)} mm²`);
    lines.push(`Fill Cross-section: ${fillArea.toFixed(4)} mm²`);
    lines.push('');
    if (deltaT > 40) {
      lines.push('⚠ High temperature rise. Consider more vias or filled vias.');
    } else if (deltaT > 20) {
      lines.push('⚠ Moderate temperature rise. Monitor thermal performance.');
    } else {
      lines.push('✓ Acceptable thermal performance.');
    }

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">Number of Vias</label>
            <input id={`${toolId}-count`} type="number" min="1" value={viaCount} onChange={(e) => setViaCount(e.target.value)} className="input-field" aria-label={`Number of vias for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-drill`} className="block text-sm font-medium text-gray-700 mb-1">Drill Diameter (mm)</label>
            <input id={`${toolId}-drill`} type="number" step="0.05" value={drillDiameter} onChange={(e) => setDrillDiameter(e.target.value)} className="input-field" aria-label="Drill diameter" />
          </div>
          <div>
            <label htmlFor={`${toolId}-plating`} className="block text-sm font-medium text-gray-700 mb-1">Plating Thickness (µm)</label>
            <input id={`${toolId}-plating`} type="number" step="1" value={platingThickness} onChange={(e) => setPlatingThickness(e.target.value)} className="input-field" aria-label="Plating thickness" />
          </div>
          <div>
            <label htmlFor={`${toolId}-board`} className="block text-sm font-medium text-gray-700 mb-1">Board Thickness (mm)</label>
            <input id={`${toolId}-board`} type="number" step="0.1" value={boardThickness} onChange={(e) => setBoardThickness(e.target.value)} className="input-field" aria-label="Board thickness" />
          </div>
          <div>
            <label htmlFor={`${toolId}-fill`} className="block text-sm font-medium text-gray-700 mb-1">Fill Material</label>
            <select id={`${toolId}-fill`} value={fillMaterial} onChange={(e) => setFillMaterial(e.target.value as 'air' | 'solder' | 'copper' | 'epoxy')} className="input-field" aria-label="Fill material">
              <option value="air">Air (hollow)</option>
              <option value="epoxy">Epoxy filled</option>
              <option value="solder">Solder filled</option>
              <option value="copper">Copper filled</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-power`} className="block text-sm font-medium text-gray-700 mb-1">Power Dissipation (W)</label>
            <input id={`${toolId}-power`} type="number" step="0.1" value={powerDissipation} onChange={(e) => setPowerDissipation(e.target.value)} className="input-field" aria-label="Power dissipation" />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate Thermal Resistance</button>
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
