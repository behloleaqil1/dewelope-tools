'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TransformerCalculator - Calculate transformer turns ratio and voltages.
 * Computes turns ratio, secondary voltage/current, and apparent power.
 */
export default function TransformerCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [primaryVoltage, setPrimaryVoltage] = useState('');
  const [secondaryVoltage, setSecondaryVoltage] = useState('');
  const [primaryTurns, setPrimaryTurns] = useState('');
  const [secondaryTurns, setSecondaryTurns] = useState('');
  const [power, setPower] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const Vp = parseFloat(primaryVoltage);
    const Vs = parseFloat(secondaryVoltage);
    const Np = parseFloat(primaryTurns);
    const Ns = parseFloat(secondaryTurns);
    const P = parseFloat(power);

    const results: string[] = [];

    if (!isNaN(Vp) && !isNaN(Vs) && Vs > 0) {
      const ratio = Vp / Vs;
      results.push(`From Voltages:`);
      results.push(`  Turns Ratio (Np/Ns) = ${Vp} / ${Vs} = ${ratio.toFixed(4)}`);
      results.push(`  Type: ${ratio > 1 ? 'Step-down' : ratio < 1 ? 'Step-up' : 'Isolation'} transformer`);
      if (!isNaN(P) && P > 0) {
        const Ip = P / Vp;
        const Is = P / Vs;
        results.push(`  Primary Current: ${Ip.toFixed(4)} A`);
        results.push(`  Secondary Current: ${Is.toFixed(4)} A`);
      }
    }

    if (!isNaN(Np) && !isNaN(Ns) && Ns > 0) {
      const ratio = Np / Ns;
      results.push(`${results.length > 0 ? '\n' : ''}From Turns:`);
      results.push(`  Turns Ratio (Np/Ns) = ${Np} / ${Ns} = ${ratio.toFixed(4)}`);
      if (!isNaN(Vp) && isNaN(Vs)) {
        const calcVs = Vp * (Ns / Np);
        results.push(`  Calculated Secondary Voltage: ${calcVs.toFixed(4)} V`);
      }
      if (isNaN(Vp) && !isNaN(Vs)) {
        const calcVp = Vs * (Np / Ns);
        results.push(`  Calculated Primary Voltage: ${calcVp.toFixed(4)} V`);
      }
    }

    if (!isNaN(P) && P > 0) {
      results.push(`${results.length > 0 ? '\n' : ''}Power:`);
      results.push(`  Apparent Power: ${P} VA`);
      results.push(`  Power (kVA): ${(P / 1000).toFixed(4)} kVA`);
    }

    if (results.length === 0) {
      setOutput('Please enter at least primary and secondary voltage, or turns count.');
      return;
    }

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-vp`} className="block text-sm font-medium text-gray-700 mb-1">Primary Voltage (V)</label>
            <input id={`${toolId}-vp`} type="number" value={primaryVoltage} onChange={(e) => setPrimaryVoltage(e.target.value)} placeholder="e.g. 240" aria-label={`Primary voltage for ${toolName}`} className="input-field" step="any" min="0" />
          </div>
          <div>
            <label htmlFor={`${toolId}-vs`} className="block text-sm font-medium text-gray-700 mb-1">Secondary Voltage (V)</label>
            <input id={`${toolId}-vs`} type="number" value={secondaryVoltage} onChange={(e) => setSecondaryVoltage(e.target.value)} placeholder="e.g. 12" aria-label="Secondary voltage" className="input-field" step="any" min="0" />
          </div>
          <div>
            <label htmlFor={`${toolId}-np`} className="block text-sm font-medium text-gray-700 mb-1">Primary Turns</label>
            <input id={`${toolId}-np`} type="number" value={primaryTurns} onChange={(e) => setPrimaryTurns(e.target.value)} placeholder="e.g. 1000" aria-label="Primary turns" className="input-field" step="1" min="1" />
          </div>
          <div>
            <label htmlFor={`${toolId}-ns`} className="block text-sm font-medium text-gray-700 mb-1">Secondary Turns</label>
            <input id={`${toolId}-ns`} type="number" value={secondaryTurns} onChange={(e) => setSecondaryTurns(e.target.value)} placeholder="e.g. 50" aria-label="Secondary turns" className="input-field" step="1" min="1" />
          </div>
          <div className="md:col-span-2">
            <label htmlFor={`${toolId}-power`} className="block text-sm font-medium text-gray-700 mb-1">Power Rating (VA)</label>
            <input id={`${toolId}-power`} type="number" value={power} onChange={(e) => setPower(e.target.value)} placeholder="e.g. 500" aria-label="Power in VA" className="input-field" step="any" min="0" />
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
