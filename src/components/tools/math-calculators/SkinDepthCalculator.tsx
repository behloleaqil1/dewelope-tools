'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SkinDepthCalculator - Calculate electromagnetic skin depth.
 * δ = √(2ρ / (ωμ)) = √(2ρ / (2πfμ₀μᵣ))
 */
export default function SkinDepthCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [frequency, setFrequency] = useState('1000000');
  const [resistivity, setResistivity] = useState('1.68e-8');
  const [relPermeability, setRelPermeability] = useState('1');
  const [material, setMaterial] = useState('custom');
  const [output, setOutput] = useState('');

  const materials: Record<string, { resistivity: number; permeability: number; label: string }> = {
    copper: { resistivity: 1.68e-8, permeability: 0.999994, label: 'Copper' },
    aluminum: { resistivity: 2.65e-8, permeability: 1.000022, label: 'Aluminum' },
    gold: { resistivity: 2.44e-8, permeability: 1.0, label: 'Gold' },
    silver: { resistivity: 1.59e-8, permeability: 0.99998, label: 'Silver' },
    iron: { resistivity: 9.7e-8, permeability: 200, label: 'Iron (approx)' },
    custom: { resistivity: 1.68e-8, permeability: 1, label: 'Custom' },
  };

  const handleMaterial = (mat: string) => {
    setMaterial(mat);
    if (mat !== 'custom') {
      setResistivity(materials[mat].resistivity.toExponential(2));
      setRelPermeability(materials[mat].permeability.toString());
    }
  };

  const calculate = () => {
    const f = parseFloat(frequency);
    const rho = parseFloat(resistivity);
    const mu_r = parseFloat(relPermeability);

    if (isNaN(f) || isNaN(rho) || isNaN(mu_r) || f <= 0 || rho <= 0 || mu_r <= 0) {
      setOutput('Please enter valid positive values for all fields.');
      return;
    }

    const mu0 = 4 * Math.PI * 1e-7; // permeability of free space
    const omega = 2 * Math.PI * f;
    const mu = mu0 * mu_r;
    const delta = Math.sqrt((2 * rho) / (omega * mu));

    const results = [
      `=== Skin Depth Calculation ===`,
      ``,
      `Input Parameters:`,
      `  Frequency: ${f.toExponential(3)} Hz (${(f / 1e6).toFixed(3)} MHz)`,
      `  Resistivity (ρ): ${rho.toExponential(3)} Ω·m`,
      `  Relative Permeability (μᵣ): ${mu_r}`,
      `  Material: ${materials[material]?.label || 'Custom'}`,
      ``,
      `Results:`,
      `  Skin Depth (δ): ${delta.toExponential(4)} m`,
      `  Skin Depth: ${(delta * 1000).toFixed(6)} mm`,
      `  Skin Depth: ${(delta * 1e6).toFixed(3)} μm`,
      ``,
      `Formula: δ = √(2ρ / (2πfμ₀μᵣ))`,
      `  δ = √(2 × ${rho.toExponential(3)} / (2π × ${f.toExponential(3)} × ${mu.toExponential(3)}))`,
      `  δ = ${delta.toExponential(4)} m`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-material`} className="block text-sm font-medium text-gray-700 mb-1">Material Preset</label>
            <select id={`${toolId}-material`} value={material} onChange={(e) => handleMaterial(e.target.value)} aria-label={`Material selection for ${toolName}`} className="input-field">
              {Object.entries(materials).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-freq`} className="block text-sm font-medium text-gray-700 mb-1">Frequency (Hz)</label>
            <input id={`${toolId}-freq`} type="text" value={frequency} onChange={(e) => setFrequency(e.target.value)} placeholder="1000000" aria-label="Frequency in Hz" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-rho`} className="block text-sm font-medium text-gray-700 mb-1">Resistivity (Ω·m)</label>
            <input id={`${toolId}-rho`} type="text" value={resistivity} onChange={(e) => setResistivity(e.target.value)} placeholder="1.68e-8" aria-label="Resistivity" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-perm`} className="block text-sm font-medium text-gray-700 mb-1">Relative Permeability (μᵣ)</label>
            <input id={`${toolId}-perm`} type="text" value={relPermeability} onChange={(e) => setRelPermeability(e.target.value)} placeholder="1" aria-label="Relative permeability" className="input-field" />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate Skin Depth</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
