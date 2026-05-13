'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CurrentDividerCalculator - Calculate current divider output for parallel resistor circuits.
 * Computes branch currents given total current and resistor values.
 */
export default function CurrentDividerCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [totalCurrent, setTotalCurrent] = useState('');
  const [resistors, setResistors] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const iTotal = parseFloat(totalCurrent);
    if (isNaN(iTotal) || iTotal <= 0) {
      setOutput('Please enter a valid positive total current.');
      return;
    }

    const rValues = resistors.split(',').map((r) => parseFloat(r.trim())).filter((r) => !isNaN(r) && r > 0);
    if (rValues.length < 2) {
      setOutput('Please enter at least 2 resistor values separated by commas.');
      return;
    }

    // Calculate total conductance (1/Rtotal = sum of 1/Ri)
    const totalConductance = rValues.reduce((sum, r) => sum + 1 / r, 0);
    const rParallel = 1 / totalConductance;

    // Current through each resistor: Ix = Itotal * (Rparallel / Rx)
    // Or equivalently: Ix = Itotal * (1/Rx) / (sum of 1/Ri)
    const branchCurrents = rValues.map((r) => iTotal * (1 / r) / totalConductance);

    const results = [
      `=== Current Divider Calculator ===`,
      ``,
      `Total Current (I_total) = ${iTotal} A`,
      `Number of branches = ${rValues.length}`,
      ``,
      `--- Resistor Values ---`,
      ...rValues.map((r, i) => `  R${i + 1} = ${r} Ω`),
      ``,
      `--- Branch Currents ---`,
      ...branchCurrents.map((current, i) => `  I${i + 1} = ${current.toFixed(6)} A (${(current * 1000).toFixed(4)} mA)`),
      ``,
      `--- Summary ---`,
      `  Equivalent Parallel Resistance = ${rParallel.toFixed(4)} Ω`,
      `  Total Voltage (V = I × R_parallel) = ${(iTotal * rParallel).toFixed(4)} V`,
      `  Sum of branch currents = ${branchCurrents.reduce((s, c) => s + c, 0).toFixed(6)} A`,
      ``,
      `Formula: I_x = I_total × (R_parallel / R_x)`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-current`} className="block text-sm font-medium text-gray-700 mb-1">Total Current (A)</label>
            <input id={`${toolId}-current`} type="number" value={totalCurrent} onChange={(e) => setTotalCurrent(e.target.value)} placeholder="0.01" className="input-field" aria-label={`Total current for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-resistors`} className="block text-sm font-medium text-gray-700 mb-1">Resistor Values (Ω, comma-separated)</label>
            <input id={`${toolId}-resistors`} type="text" value={resistors} onChange={(e) => setResistors(e.target.value)} placeholder="1000, 2200, 4700" className="input-field" aria-label="Resistor values" />
          </div>
          <button onClick={calculate} className="btn-primary">Calculate Branch Currents</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
