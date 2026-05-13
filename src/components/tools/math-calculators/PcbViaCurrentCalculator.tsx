'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PcbViaCurrentCalculator - Calculate PCB via current capacity.
 * Uses IPC-2221 guidelines to estimate current carrying capacity of vias.
 */
export default function PcbViaCurrentCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [drillDiameter, setDrillDiameter] = useState('0.3');
  const [platingThickness, setPlatingThickness] = useState('25');
  const [boardThickness, setBoardThickness] = useState('1.6');
  const [tempRise, setTempRise] = useState('10');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const drill = parseFloat(drillDiameter);
    const plating = parseFloat(platingThickness);
    const thickness = parseFloat(boardThickness);
    const deltaT = parseFloat(tempRise);

    if (isNaN(drill) || isNaN(plating) || isNaN(thickness) || isNaN(deltaT)) {
      setOutput('Please enter valid numeric values.');
      return;
    }

    // Via barrel is a hollow cylinder
    // Cross-sectional area of copper in the via barrel
    const outerRadius = drill / 2; // mm
    const platingMm = plating / 1000; // convert µm to mm
    const innerRadius = outerRadius - platingMm;
    const crossSectionArea = Math.PI * (outerRadius * outerRadius - innerRadius * innerRadius); // mm²
    const crossSectionMils2 = crossSectionArea * 1550.0031; // convert mm² to mils²

    // IPC-2221 formula for internal layers: I = k * ΔT^0.44 * A^0.725
    // k = 0.024 for internal layers
    const k = 0.024;
    const currentCapacity = k * Math.pow(deltaT, 0.44) * Math.pow(crossSectionMils2, 0.725);

    // Via resistance
    const copperResistivity = 1.724e-8; // Ω·m
    const lengthM = thickness / 1000; // mm to m
    const areaM2 = crossSectionArea / 1e6; // mm² to m²
    const resistance = (copperResistivity * lengthM) / areaM2;

    const lines: string[] = [];
    lines.push('=== PCB Via Current Capacity ===');
    lines.push('');
    lines.push(`Drill Diameter: ${drill} mm`);
    lines.push(`Plating Thickness: ${plating} µm`);
    lines.push(`Board Thickness: ${thickness} mm`);
    lines.push(`Temperature Rise: ${deltaT} °C`);
    lines.push('');
    lines.push('--- Results ---');
    lines.push(`Cross-section Area: ${crossSectionArea.toFixed(4)} mm² (${crossSectionMils2.toFixed(2)} mils²)`);
    lines.push(`Current Capacity: ${currentCapacity.toFixed(3)} A`);
    lines.push(`Via Resistance: ${(resistance * 1000).toFixed(4)} mΩ`);
    lines.push(`Voltage Drop at Max Current: ${(currentCapacity * resistance * 1000).toFixed(4)} mV`);
    lines.push('');
    lines.push('--- Recommendations ---');
    if (currentCapacity < 0.5) {
      lines.push('⚠ Low current capacity. Consider larger drill or thicker plating.');
    } else if (currentCapacity < 1.0) {
      lines.push('✓ Suitable for signal vias and low-power connections.');
    } else {
      lines.push('✓ Good current capacity for power vias.');
    }
    lines.push(`For higher currents, use ${Math.ceil(2 / currentCapacity)} parallel vias for 2A.`);

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-drill`} className="block text-sm font-medium text-gray-700 mb-1">Drill Diameter (mm)</label>
            <input id={`${toolId}-drill`} type="number" step="0.05" value={drillDiameter} onChange={(e) => setDrillDiameter(e.target.value)} className="input-field" aria-label={`Drill diameter for ${toolName}`} />
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
            <label htmlFor={`${toolId}-temp`} className="block text-sm font-medium text-gray-700 mb-1">Temperature Rise (°C)</label>
            <input id={`${toolId}-temp`} type="number" step="5" value={tempRise} onChange={(e) => setTempRise(e.target.value)} className="input-field" aria-label="Temperature rise" />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate Via Current</button>
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
