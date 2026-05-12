'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MaterialStrengthCalculator - Calculate stress, strain, and Young's modulus.
 * Supports calculation of any one value given the other two.
 */
export default function MaterialStrengthCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [calcMode, setCalcMode] = useState<'stress' | 'strain' | 'modulus'>('stress');
  const [force, setForce] = useState('');
  const [area, setArea] = useState('');
  const [deltaL, setDeltaL] = useState('');
  const [originalL, setOriginalL] = useState('');
  const [stress, setStress] = useState('');
  const [strain, setStrain] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const lines: string[] = [];

    if (calcMode === 'stress') {
      const f = parseFloat(force);
      const a = parseFloat(area);
      if (isNaN(f) || isNaN(a) || a <= 0) {
        setOutput('Please enter valid Force (N) and Area (m²) values.');
        return;
      }
      const sigma = f / a;
      lines.push(`Stress (σ) = Force / Area`);
      lines.push(`σ = ${f} N / ${a} m²`);
      lines.push(`σ = ${sigma.toExponential(4)} Pa`);
      lines.push(`σ = ${(sigma / 1e6).toFixed(4)} MPa`);
      lines.push(`σ = ${(sigma / 1e9).toFixed(6)} GPa`);
    } else if (calcMode === 'strain') {
      const dl = parseFloat(deltaL);
      const ol = parseFloat(originalL);
      if (isNaN(dl) || isNaN(ol) || ol <= 0) {
        setOutput('Please enter valid ΔL and original length values.');
        return;
      }
      const eps = dl / ol;
      lines.push(`Strain (ε) = ΔL / L₀`);
      lines.push(`ε = ${dl} / ${ol}`);
      lines.push(`ε = ${eps.toExponential(6)} (dimensionless)`);
      lines.push(`ε = ${(eps * 100).toFixed(6)}%`);
    } else {
      const s = parseFloat(stress);
      const e = parseFloat(strain);
      if (isNaN(s) || isNaN(e) || e === 0) {
        setOutput('Please enter valid stress (Pa) and strain values.');
        return;
      }
      const E = s / e;
      lines.push(`Young's Modulus (E) = Stress / Strain`);
      lines.push(`E = ${s} Pa / ${e}`);
      lines.push(`E = ${E.toExponential(4)} Pa`);
      lines.push(`E = ${(E / 1e9).toFixed(4)} GPa`);
      lines.push(``);
      lines.push(`Common Material Reference:`);
      lines.push(`  • Steel: ~200 GPa`);
      lines.push(`  • Aluminum: ~69 GPa`);
      lines.push(`  • Copper: ~117 GPa`);
      lines.push(`  • Concrete: ~30 GPa`);
      lines.push(`  • Wood: ~12 GPa`);
    }

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-2">Calculate</label>
        <select
          value={calcMode}
          onChange={(e) => setCalcMode(e.target.value as 'stress' | 'strain' | 'modulus')}
          aria-label={`Calculation mode for ${toolName}`}
          className="input-field mb-3"
        >
          <option value="stress">Stress (σ = F / A)</option>
          <option value="strain">Strain (ε = ΔL / L₀)</option>
          <option value="modulus">Young&apos;s Modulus (E = σ / ε)</option>
        </select>

        {calcMode === 'stress' && (
          <>
            <label htmlFor={`${toolId}-force`} className="block text-sm font-medium text-gray-700 mb-1">
              Force (N)
            </label>
            <input
              id={`${toolId}-force`}
              type="number"
              value={force}
              onChange={(e) => setForce(e.target.value)}
              placeholder="e.g., 10000"
              aria-label="Force in Newtons"
              className="input-field mb-3"
              step="any"
            />
            <label htmlFor={`${toolId}-area`} className="block text-sm font-medium text-gray-700 mb-1">
              Cross-sectional Area (m²)
            </label>
            <input
              id={`${toolId}-area`}
              type="number"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="e.g., 0.001"
              aria-label="Cross-sectional area in square meters"
              className="input-field"
              step="any"
            />
          </>
        )}

        {calcMode === 'strain' && (
          <>
            <label htmlFor={`${toolId}-deltaL`} className="block text-sm font-medium text-gray-700 mb-1">
              Change in Length ΔL (m)
            </label>
            <input
              id={`${toolId}-deltaL`}
              type="number"
              value={deltaL}
              onChange={(e) => setDeltaL(e.target.value)}
              placeholder="e.g., 0.002"
              aria-label="Change in length"
              className="input-field mb-3"
              step="any"
            />
            <label htmlFor={`${toolId}-originalL`} className="block text-sm font-medium text-gray-700 mb-1">
              Original Length L₀ (m)
            </label>
            <input
              id={`${toolId}-originalL`}
              type="number"
              value={originalL}
              onChange={(e) => setOriginalL(e.target.value)}
              placeholder="e.g., 1.0"
              aria-label="Original length"
              className="input-field"
              step="any"
            />
          </>
        )}

        {calcMode === 'modulus' && (
          <>
            <label htmlFor={`${toolId}-stress`} className="block text-sm font-medium text-gray-700 mb-1">
              Stress (Pa)
            </label>
            <input
              id={`${toolId}-stress`}
              type="number"
              value={stress}
              onChange={(e) => setStress(e.target.value)}
              placeholder="e.g., 200000000"
              aria-label="Stress in Pascals"
              className="input-field mb-3"
              step="any"
            />
            <label htmlFor={`${toolId}-strain`} className="block text-sm font-medium text-gray-700 mb-1">
              Strain (dimensionless)
            </label>
            <input
              id={`${toolId}-strain`}
              type="number"
              value={strain}
              onChange={(e) => setStrain(e.target.value)}
              placeholder="e.g., 0.001"
              aria-label="Strain value"
              className="input-field"
              step="any"
            />
          </>
        )}

        <button onClick={calculate} className="btn-primary mt-2">
          Calculate
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
