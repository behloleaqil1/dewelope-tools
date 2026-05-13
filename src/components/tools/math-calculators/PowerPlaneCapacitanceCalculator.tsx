'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PowerPlaneCapacitanceCalculator - Calculate PCB power plane capacitance.
 * Estimates the inherent capacitance between power and ground planes in a PCB stackup.
 */
export default function PowerPlaneCapacitanceCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [planeArea, setPlaneArea] = useState('100');
  const [dielectricThickness, setDielectricThickness] = useState('0.1');
  const [dielectricConstant, setDielectricConstant] = useState('4.2');
  const [frequency, setFrequency] = useState('100');
  const [lossTangent, setLossTangent] = useState('0.02');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const area = parseFloat(planeArea);
    const thickness = parseFloat(dielectricThickness);
    const er = parseFloat(dielectricConstant);
    const freq = parseFloat(frequency) * 1e6;
    const tanD = parseFloat(lossTangent);

    if (isNaN(area) || isNaN(thickness) || isNaN(er) || isNaN(freq) || isNaN(tanD)) {
      setOutput('Please enter valid numeric values for all fields.');
      return;
    }

    const e0 = 8.854e-12; // F/m
    const areaM2 = area * 1e-4; // cm² to m²
    const thicknessM = thickness * 1e-3; // mm to m

    // Parallel plate capacitance
    const capacitance = (er * e0 * areaM2) / thicknessM;

    // Impedance at frequency
    const omega = 2 * Math.PI * freq;
    const impedance = 1 / (omega * capacitance);

    // ESR from loss tangent
    const esr = tanD / (omega * capacitance);

    // Resonant frequency with typical plane inductance
    const typicalInductance = 0.5e-9; // ~0.5nH typical
    const resonantFreq = 1 / (2 * Math.PI * Math.sqrt(typicalInductance * capacitance));

    // Energy stored
    const voltage = 3.3; // typical
    const energy = 0.5 * capacitance * voltage * voltage;

    const lines: string[] = [];
    lines.push('=== PCB Power Plane Capacitance Analysis ===');
    lines.push('');
    lines.push('Input Parameters:');
    lines.push(`  Plane Area: ${area} cm²`);
    lines.push(`  Dielectric Thickness: ${thickness} mm`);
    lines.push(`  Dielectric Constant (εr): ${er}`);
    lines.push(`  Analysis Frequency: ${(freq / 1e6).toFixed(1)} MHz`);
    lines.push(`  Loss Tangent (tan δ): ${tanD}`);
    lines.push('');
    lines.push('Results:');
    lines.push(`  Plane Capacitance: ${(capacitance * 1e9).toFixed(3)} nF (${(capacitance * 1e12).toFixed(1)} pF)`);
    lines.push(`  Impedance at ${(freq / 1e6).toFixed(0)} MHz: ${impedance < 1 ? (impedance * 1000).toFixed(3) + ' mΩ' : impedance.toFixed(4) + ' Ω'}`);
    lines.push(`  ESR (from tan δ): ${(esr * 1000).toFixed(3)} mΩ`);
    lines.push(`  Self-Resonant Freq (est.): ${(resonantFreq / 1e6).toFixed(1)} MHz`);
    lines.push(`  Energy at 3.3V: ${(energy * 1e6).toFixed(3)} µJ`);
    lines.push('');
    lines.push('Design Notes:');
    lines.push(`  • Plane capacitance is effective below ${(resonantFreq / 1e6).toFixed(0)} MHz`);
    lines.push('  • Thinner dielectric = more capacitance = lower impedance');
    lines.push('  • Use in conjunction with discrete decoupling capacitors');
    lines.push('  • Higher εr materials increase capacitance but may increase loss');

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-area`} className="block text-sm font-medium text-gray-700 mb-1">Plane Area (cm²)</label>
            <input id={`${toolId}-area`} type="number" step="1" value={planeArea} onChange={(e) => setPlaneArea(e.target.value)} className="input-field" aria-label={`Plane area for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-thickness`} className="block text-sm font-medium text-gray-700 mb-1">Dielectric Thickness (mm)</label>
            <input id={`${toolId}-thickness`} type="number" step="0.01" value={dielectricThickness} onChange={(e) => setDielectricThickness(e.target.value)} className="input-field" aria-label="Dielectric thickness" />
          </div>
          <div>
            <label htmlFor={`${toolId}-er`} className="block text-sm font-medium text-gray-700 mb-1">Dielectric Constant (εr)</label>
            <input id={`${toolId}-er`} type="number" step="0.1" value={dielectricConstant} onChange={(e) => setDielectricConstant(e.target.value)} className="input-field" aria-label="Dielectric constant" />
          </div>
          <div>
            <label htmlFor={`${toolId}-freq`} className="block text-sm font-medium text-gray-700 mb-1">Frequency (MHz)</label>
            <input id={`${toolId}-freq`} type="number" step="1" value={frequency} onChange={(e) => setFrequency(e.target.value)} className="input-field" aria-label="Analysis frequency" />
          </div>
          <div>
            <label htmlFor={`${toolId}-loss`} className="block text-sm font-medium text-gray-700 mb-1">Loss Tangent (tan δ)</label>
            <input id={`${toolId}-loss`} type="number" step="0.001" value={lossTangent} onChange={(e) => setLossTangent(e.target.value)} className="input-field" aria-label="Loss tangent" />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate Plane Capacitance</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Analysis Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
