'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SpeakerCabinetBracingCalculator - Calculate cabinet panel bracing requirements.
 * Determines brace spacing, panel resonance, and stiffness for speaker enclosures.
 */
export default function SpeakerCabinetBracingCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [panelWidth, setPanelWidth] = useState('400');
  const [panelHeight, setPanelHeight] = useState('600');
  const [panelThickness, setPanelThickness] = useState('18');
  const [material, setMaterial] = useState('mdf');
  const [maxFrequency, setMaxFrequency] = useState('200');
  const [output, setOutput] = useState('');

  const materials: Record<string, { name: string; density: number; youngsModulus: number; poisson: number }> = {
    mdf: { name: 'MDF', density: 750, youngsModulus: 4000, poisson: 0.25 },
    plywood: { name: 'Plywood (Baltic Birch)', density: 680, youngsModulus: 12000, poisson: 0.3 },
    particleboard: { name: 'Particleboard', density: 700, youngsModulus: 2800, poisson: 0.25 },
    hardwood: { name: 'Hardwood (Oak)', density: 750, youngsModulus: 12500, poisson: 0.35 },
  };

  const calculate = () => {
    const w = parseFloat(panelWidth) / 1000; // convert mm to m
    const h = parseFloat(panelHeight) / 1000;
    const t = parseFloat(panelThickness) / 1000;
    const fMax = parseFloat(maxFrequency);
    const mat = materials[material];

    if (isNaN(w) || isNaN(h) || isNaN(t) || isNaN(fMax) || !mat) {
      setOutput('Please enter valid numeric values for all fields.');
      return;
    }

    const E = mat.youngsModulus * 1e6; // Pa
    const rho = mat.density; // kg/m³
    const nu = mat.poisson;

    // Flexural rigidity D = E*t³ / (12*(1-ν²))
    const D = (E * Math.pow(t, 3)) / (12 * (1 - nu * nu));

    // Fundamental panel resonance (simply supported rectangular plate)
    // f11 = (π/2) * sqrt(D / (ρ*t)) * (1/a² + 1/b²)
    const f11 = (Math.PI / 2) * Math.sqrt(D / (rho * t)) * (1 / (w * w) + 1 / (h * h));

    // Number of braces needed to push resonance above target
    // Bracing divides panel into smaller sections
    let bracesHorizontal = 0;
    let bracesVertical = 0;
    let effectiveWidth = w;
    let effectiveHeight = h;
    let currentResonance = f11;

    while (currentResonance < fMax) {
      if (effectiveHeight > effectiveWidth) {
        bracesHorizontal++;
        effectiveHeight = h / (bracesHorizontal + 1);
      } else {
        bracesVertical++;
        effectiveWidth = w / (bracesVertical + 1);
      }
      currentResonance = (Math.PI / 2) * Math.sqrt(D / (rho * t)) * (1 / (effectiveWidth * effectiveWidth) + 1 / (effectiveHeight * effectiveHeight));
    }

    // Recommended brace dimensions
    const braceWidth = Math.max(20, Math.round(t * 1.5));
    const braceDepth = Math.max(30, Math.round(t * 2));

    // Panel mass
    const panelMass = w * h * t * rho;

    const lines: string[] = [];
    lines.push('=== Speaker Cabinet Bracing Calculator ===');
    lines.push('');
    lines.push('--- Panel Parameters ---');
    lines.push(`Panel Dimensions: ${panelWidth}mm × ${panelHeight}mm × ${panelThickness}mm`);
    lines.push(`Material: ${mat.name}`);
    lines.push(`Density: ${rho} kg/m³`);
    lines.push(`Young\'s Modulus: ${mat.youngsModulus} MPa`);
    lines.push(`Panel Mass: ${(panelMass * 1000).toFixed(1)} g`);
    lines.push('');
    lines.push('--- Resonance Analysis ---');
    lines.push(`Unbraced Panel Resonance (f₁₁): ${f11.toFixed(1)} Hz`);
    lines.push(`Target Minimum Resonance: ${fMax} Hz`);
    lines.push(`Braced Panel Resonance: ${currentResonance.toFixed(1)} Hz`);
    lines.push(`Flexural Rigidity (D): ${D.toFixed(2)} N·m`);
    lines.push('');
    lines.push('--- Bracing Requirements ---');
    lines.push(`Horizontal Braces Needed: ${bracesHorizontal}`);
    lines.push(`Vertical Braces Needed: ${bracesVertical}`);
    lines.push(`Total Braces: ${bracesHorizontal + bracesVertical}`);
    lines.push(`Effective Sub-Panel: ${(effectiveWidth * 1000).toFixed(0)}mm × ${(effectiveHeight * 1000).toFixed(0)}mm`);
    lines.push('');
    lines.push('--- Recommended Brace Dimensions ---');
    lines.push(`Brace Width: ${braceWidth}mm`);
    lines.push(`Brace Depth: ${braceDepth}mm`);
    lines.push(`Material: Same as panel (${mat.name}) or hardwood`);
    lines.push('');
    lines.push('--- Design Notes ---');
    if (f11 >= fMax) {
      lines.push('✓ Panel is stiff enough without bracing for the target frequency.');
    } else {
      lines.push(`✓ ${bracesHorizontal + bracesVertical} brace(s) will raise resonance above ${fMax} Hz.`);
    }
    lines.push('✓ Glue braces with wood glue and clamp until cured.');
    lines.push('✓ Consider window braces (with cutouts) to reduce added mass.');
    lines.push('✓ Avoid placing braces at driver mounting locations.');

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor={`${toolId}-width`} className="block text-sm font-medium text-gray-700 mb-1">Panel Width (mm)</label>
              <input id={`${toolId}-width`} type="number" value={panelWidth} onChange={(e) => setPanelWidth(e.target.value)} className="input-field" aria-label={`Panel width for ${toolName}`} />
            </div>
            <div>
              <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">Panel Height (mm)</label>
              <input id={`${toolId}-height`} type="number" value={panelHeight} onChange={(e) => setPanelHeight(e.target.value)} className="input-field" aria-label="Panel height" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor={`${toolId}-thickness`} className="block text-sm font-medium text-gray-700 mb-1">Panel Thickness (mm)</label>
              <input id={`${toolId}-thickness`} type="number" value={panelThickness} onChange={(e) => setPanelThickness(e.target.value)} className="input-field" aria-label="Panel thickness" />
            </div>
            <div>
              <label htmlFor={`${toolId}-material`} className="block text-sm font-medium text-gray-700 mb-1">Material</label>
              <select id={`${toolId}-material`} value={material} onChange={(e) => setMaterial(e.target.value)} className="input-field" aria-label="Panel material">
                {Object.entries(materials).map(([key, val]) => (
                  <option key={key} value={key}>{val.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-freq`} className="block text-sm font-medium text-gray-700 mb-1">Target Min Resonance (Hz)</label>
            <input id={`${toolId}-freq`} type="number" value={maxFrequency} onChange={(e) => setMaxFrequency(e.target.value)} className="input-field" aria-label="Target minimum resonance frequency" />
          </div>
          <button onClick={calculate} className="btn-primary w-full">Calculate Bracing</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Bracing Analysis</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
