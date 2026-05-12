'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PneumaticCylinderCalculator - Calculate pneumatic cylinder force from pressure and bore diameter.
 * F = P × A where A = π × (d/2)²
 */
export default function PneumaticCylinderCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [pressure, setPressure] = useState('6');
  const [pressureUnit, setPressureUnit] = useState<'bar' | 'psi' | 'kPa'>('bar');
  const [boreDiameter, setBoreDiameter] = useState('50');
  const [boreUnit, setBoreUnit] = useState<'mm' | 'in'>('mm');
  const [rodDiameter, setRodDiameter] = useState('20');
  const [rodUnit, setRodUnit] = useState<'mm' | 'in'>('mm');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const p = parseFloat(pressure);
    const bore = parseFloat(boreDiameter);
    const rod = parseFloat(rodDiameter);

    if (isNaN(p) || isNaN(bore) || p <= 0 || bore <= 0) {
      setOutput('Please enter valid positive numbers for pressure and bore diameter.');
      return;
    }

    // Convert pressure to Pa
    let pressurePa: number;
    if (pressureUnit === 'bar') pressurePa = p * 100000;
    else if (pressureUnit === 'psi') pressurePa = p * 6894.76;
    else pressurePa = p * 1000;

    // Convert bore to meters
    let boreM: number;
    if (boreUnit === 'mm') boreM = bore / 1000;
    else boreM = bore * 0.0254;

    // Piston area
    const pistonArea = Math.PI * Math.pow(boreM / 2, 2);
    const pushForce = pressurePa * pistonArea;

    const results = [
      `═══ Input Parameters ═══`,
      `Pressure: ${p} ${pressureUnit} (${(pressurePa / 1000).toFixed(2)} kPa)`,
      `Bore Diameter: ${bore} ${boreUnit} (${(boreM * 1000).toFixed(2)} mm)`,
      ``,
      `═══ Piston Area ═══`,
      `A = π × (d/2)²`,
      `A = π × (${(boreM * 1000).toFixed(2)}/2)² mm²`,
      `A = ${(pistonArea * 1e6).toFixed(2)} mm² (${(pistonArea * 1e4).toFixed(4)} cm²)`,
      ``,
      `═══ Push Force (Extend) ═══`,
      `F = P × A`,
      `F = ${pushForce.toFixed(2)} N`,
      `F = ${(pushForce / 1000).toFixed(4)} kN`,
      `F = ${(pushForce / 9.81).toFixed(2)} kgf`,
      `F = ${(pushForce * 0.2248).toFixed(2)} lbf`,
    ];

    if (!isNaN(rod) && rod > 0) {
      let rodM: number;
      if (rodUnit === 'mm') rodM = rod / 1000;
      else rodM = rod * 0.0254;

      const annularArea = Math.PI * (Math.pow(boreM / 2, 2) - Math.pow(rodM / 2, 2));
      const pullForce = pressurePa * annularArea;

      results.push(``);
      results.push(`═══ Pull Force (Retract) ═══`);
      results.push(`Rod Diameter: ${rod} ${rodUnit} (${(rodM * 1000).toFixed(2)} mm)`);
      results.push(`Annular Area: ${(annularArea * 1e6).toFixed(2)} mm²`);
      results.push(`F_pull = ${pullForce.toFixed(2)} N`);
      results.push(`F_pull = ${(pullForce / 1000).toFixed(4)} kN`);
      results.push(`F_pull = ${(pullForce / 9.81).toFixed(2)} kgf`);
      results.push(`F_pull = ${(pullForce * 0.2248).toFixed(2)} lbf`);
      results.push(``);
      results.push(`Force Ratio (Pull/Push): ${((pullForce / pushForce) * 100).toFixed(1)}%`);
    }

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-pressure`} className="block text-sm font-medium text-gray-700 mb-1">Supply Pressure</label>
            <div className="flex gap-2">
              <input id={`${toolId}-pressure`} type="number" value={pressure} onChange={(e) => setPressure(e.target.value)} className="input-field flex-1" aria-label={`Supply pressure for ${toolName}`} />
              <select value={pressureUnit} onChange={(e) => setPressureUnit(e.target.value as 'bar' | 'psi' | 'kPa')} className="input-field w-20" aria-label="Pressure unit">
                <option value="bar">bar</option>
                <option value="psi">PSI</option>
                <option value="kPa">kPa</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-bore`} className="block text-sm font-medium text-gray-700 mb-1">Bore Diameter</label>
            <div className="flex gap-2">
              <input id={`${toolId}-bore`} type="number" value={boreDiameter} onChange={(e) => setBoreDiameter(e.target.value)} className="input-field flex-1" aria-label="Bore diameter" />
              <select value={boreUnit} onChange={(e) => setBoreUnit(e.target.value as 'mm' | 'in')} className="input-field w-20" aria-label="Bore unit">
                <option value="mm">mm</option>
                <option value="in">in</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-rod`} className="block text-sm font-medium text-gray-700 mb-1">Rod Diameter (optional)</label>
            <div className="flex gap-2">
              <input id={`${toolId}-rod`} type="number" value={rodDiameter} onChange={(e) => setRodDiameter(e.target.value)} className="input-field flex-1" aria-label="Rod diameter" />
              <select value={rodUnit} onChange={(e) => setRodUnit(e.target.value as 'mm' | 'in')} className="input-field w-20" aria-label="Rod unit">
                <option value="mm">mm</option>
                <option value="in">in</option>
              </select>
            </div>
            <p className="text-xs text-gray-500 mt-1">For retract force calculation</p>
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate Force</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
