'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * HydraulicCylinderCalculator - Calculate hydraulic cylinder force from pressure and bore.
 */
export default function HydraulicCylinderCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [pressure, setPressure] = useState('');
  const [pressureUnit, setPressureUnit] = useState('psi');
  const [bore, setBore] = useState('');
  const [boreUnit, setBoreUnit] = useState('inches');
  const [rodDiameter, setRodDiameter] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    let p = parseFloat(pressure);
    let d = parseFloat(bore);
    const rod = parseFloat(rodDiameter) || 0;

    if (isNaN(p) || p <= 0 || isNaN(d) || d <= 0) {
      setOutput('Please enter valid positive values for pressure and bore diameter.');
      return;
    }

    // Convert pressure to PSI
    if (pressureUnit === 'bar') p = p * 14.5038;
    else if (pressureUnit === 'mpa') p = p * 145.038;

    // Convert bore to inches
    if (boreUnit === 'mm') d = d / 25.4;

    const rodInches = boreUnit === 'mm' ? rod / 25.4 : rod;

    const boreArea = Math.PI * Math.pow(d / 2, 2);
    const rodArea = Math.PI * Math.pow(rodInches / 2, 2);
    const annularArea = boreArea - rodArea;

    const pushForce = p * boreArea;
    const pullForce = p * annularArea;

    const pushForceKN = pushForce * 0.00444822;
    const pullForceKN = pullForce * 0.00444822;

    const lines = [
      `Bore Diameter: ${bore} ${boreUnit}`,
      `Rod Diameter: ${rod || 'N/A'} ${rod ? boreUnit : ''}`,
      `Pressure: ${pressure} ${pressureUnit}`,
      ``,
      `Bore Area: ${boreArea.toFixed(4)} in²`,
      rod ? `Annular Area: ${annularArea.toFixed(4)} in²` : '',
      ``,
      `Push Force (extend): ${pushForce.toFixed(2)} lbs (${pushForceKN.toFixed(3)} kN)`,
      rod ? `Pull Force (retract): ${pullForce.toFixed(2)} lbs (${pullForceKN.toFixed(3)} kN)` : '',
      ``,
      `Formula: F = P × A`,
      `F = ${p.toFixed(2)} psi × ${boreArea.toFixed(4)} in² = ${pushForce.toFixed(2)} lbs`,
    ].filter(Boolean);

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-pressure`} className="block text-sm font-medium text-gray-700 mb-1">Pressure</label>
              <input id={`${toolId}-pressure`} type="number" value={pressure} onChange={e => setPressure(e.target.value)} placeholder="3000" step="any" min="0" aria-label={`Pressure for ${toolName}`} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-punit`} className="block text-sm font-medium text-gray-700 mb-1">Pressure Unit</label>
              <select id={`${toolId}-punit`} value={pressureUnit} onChange={e => setPressureUnit(e.target.value)} aria-label="Pressure unit" className="input-field">
                <option value="psi">PSI</option>
                <option value="bar">Bar</option>
                <option value="mpa">MPa</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-bore`} className="block text-sm font-medium text-gray-700 mb-1">Bore Diameter</label>
              <input id={`${toolId}-bore`} type="number" value={bore} onChange={e => setBore(e.target.value)} placeholder="4" step="any" min="0" aria-label="Bore diameter" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-bunit`} className="block text-sm font-medium text-gray-700 mb-1">Bore Unit</label>
              <select id={`${toolId}-bunit`} value={boreUnit} onChange={e => setBoreUnit(e.target.value)} aria-label="Bore unit" className="input-field">
                <option value="inches">Inches</option>
                <option value="mm">Millimeters</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-rod`} className="block text-sm font-medium text-gray-700 mb-1">Rod Diameter (optional)</label>
            <input id={`${toolId}-rod`} type="number" value={rodDiameter} onChange={e => setRodDiameter(e.target.value)} placeholder="2" step="any" min="0" aria-label="Rod diameter" className="input-field" />
          </div>
          <button onClick={calculate} className="btn-primary w-full">Calculate Force</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-md">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
