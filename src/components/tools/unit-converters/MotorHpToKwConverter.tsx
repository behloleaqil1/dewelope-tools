'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MotorHpToKwConverter - Convert motor power between HP, kW, and amps.
 * Supports single-phase and three-phase motor calculations.
 */
export default function MotorHpToKwConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('hp');
  const [voltage, setVoltage] = useState('230');
  const [phase, setPhase] = useState<'single' | 'three'>('three');
  const [efficiency, setEfficiency] = useState('0.85');
  const [powerFactor, setPowerFactor] = useState('0.8');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const val = parseFloat(value);
    const V = parseFloat(voltage);
    const eff = parseFloat(efficiency);
    const pf = parseFloat(powerFactor);

    if (isNaN(val) || val <= 0) {
      setOutput('Please enter a valid power value.');
      return;
    }

    const results: string[] = [];
    let kW: number;
    let hp: number;

    if (fromUnit === 'hp') {
      hp = val;
      kW = val * 0.7457;
    } else {
      kW = val;
      hp = val / 0.7457;
    }

    results.push(`Power Conversion:`);
    results.push(`  ${hp.toFixed(4)} HP = ${kW.toFixed(4)} kW`);
    results.push(`  ${(kW * 1000).toFixed(2)} W`);
    results.push(`  ${(hp * 550).toFixed(2)} ft·lbf/s`);

    if (!isNaN(V) && V > 0 && !isNaN(eff) && eff > 0 && !isNaN(pf) && pf > 0) {
      results.push(`\nElectrical Calculations (${phase === 'three' ? '3-phase' : 'Single-phase'}):`);
      results.push(`  Voltage: ${V} V`);
      results.push(`  Efficiency: ${(eff * 100).toFixed(1)}%`);
      results.push(`  Power Factor: ${pf}`);

      let amps: number;
      if (phase === 'three') {
        amps = (kW * 1000) / (Math.sqrt(3) * V * eff * pf);
      } else {
        amps = (kW * 1000) / (V * eff * pf);
      }

      results.push(`  Full Load Amps (FLA): ${amps.toFixed(2)} A`);
      results.push(`  Apparent Power: ${(kW / pf).toFixed(4)} kVA`);
      results.push(`  Reactive Power: ${(kW * Math.tan(Math.acos(pf))).toFixed(4)} kVAR`);
    }

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">Power Value *</label>
            <input id={`${toolId}-value`} type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 10" aria-label={`Power value for ${toolName}`} className="input-field" step="any" min="0" />
          </div>
          <div>
            <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
            <select id={`${toolId}-unit`} value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} aria-label="Power unit" className="input-field">
              <option value="hp">Horsepower (HP)</option>
              <option value="kw">Kilowatts (kW)</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-phase`} className="block text-sm font-medium text-gray-700 mb-1">Phase</label>
            <select id={`${toolId}-phase`} value={phase} onChange={(e) => setPhase(e.target.value as 'single' | 'three')} aria-label="Phase type" className="input-field">
              <option value="three">3-Phase</option>
              <option value="single">Single Phase</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-voltage`} className="block text-sm font-medium text-gray-700 mb-1">Voltage (V)</label>
            <input id={`${toolId}-voltage`} type="number" value={voltage} onChange={(e) => setVoltage(e.target.value)} placeholder="230" aria-label="Voltage" className="input-field" step="any" min="0" />
          </div>
          <div>
            <label htmlFor={`${toolId}-eff`} className="block text-sm font-medium text-gray-700 mb-1">Efficiency (0-1)</label>
            <input id={`${toolId}-eff`} type="number" value={efficiency} onChange={(e) => setEfficiency(e.target.value)} placeholder="0.85" aria-label="Motor efficiency" className="input-field" step="0.01" min="0" max="1" />
          </div>
          <div>
            <label htmlFor={`${toolId}-pf`} className="block text-sm font-medium text-gray-700 mb-1">Power Factor (0-1)</label>
            <input id={`${toolId}-pf`} type="number" value={powerFactor} onChange={(e) => setPowerFactor(e.target.value)} placeholder="0.8" aria-label="Power factor" className="input-field" step="0.01" min="0" max="1" />
          </div>
        </div>
        <button onClick={calculate} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Calculate</button>
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
