'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * VoltageDividerCalculator - Calculate voltage divider output.
 * Uses the formula Vout = Vin * (R2 / (R1 + R2)).
 */
export default function VoltageDividerCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [vin, setVin] = useState('12');
  const [r1, setR1] = useState('10000');
  const [r2, setR2] = useState('10000');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const vinVal = parseFloat(vin);
    const r1Val = parseFloat(r1);
    const r2Val = parseFloat(r2);

    if (isNaN(vinVal) || isNaN(r1Val) || isNaN(r2Val)) {
      setOutput('Please enter valid numbers for all fields.');
      return;
    }

    if (r1Val + r2Val === 0) {
      setOutput('R1 + R2 cannot be zero.');
      return;
    }

    const vout = vinVal * (r2Val / (r1Val + r2Val));
    const current = vinVal / (r1Val + r2Val);
    const powerR1 = current * current * r1Val;
    const powerR2 = current * current * r2Val;
    const totalPower = powerR1 + powerR2;
    const ratio = r2Val / (r1Val + r2Val);

    const lines = [
      `Input Voltage (Vin): ${vinVal} V`,
      `R1: ${r1Val.toLocaleString()} Ω`,
      `R2: ${r2Val.toLocaleString()} Ω`,
      ``,
      `━━━ Results ━━━`,
      `Output Voltage (Vout): ${vout.toFixed(4)} V`,
      `Voltage Ratio: ${(ratio * 100).toFixed(2)}%`,
      `Current through divider: ${(current * 1000).toFixed(4)} mA`,
      ``,
      `━━━ Power Dissipation ━━━`,
      `Power in R1: ${(powerR1 * 1000).toFixed(4)} mW`,
      `Power in R2: ${(powerR2 * 1000).toFixed(4)} mW`,
      `Total Power: ${(totalPower * 1000).toFixed(4)} mW`,
      ``,
      `Formula: Vout = Vin × (R2 / (R1 + R2))`,
      `         ${vout.toFixed(4)} = ${vinVal} × (${r2Val} / (${r1Val} + ${r2Val}))`,
    ];

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor={`${toolId}-vin`} className="block text-sm font-medium text-gray-700 mb-1">Input Voltage (V)</label>
            <input id={`${toolId}-vin`} type="number" step="any" value={vin} onChange={(e) => setVin(e.target.value)} className="input-field" aria-label={`Input voltage for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-r1`} className="block text-sm font-medium text-gray-700 mb-1">R1 (Ω)</label>
            <input id={`${toolId}-r1`} type="number" step="any" value={r1} onChange={(e) => setR1(e.target.value)} className="input-field" aria-label="Resistor R1 in ohms" />
          </div>
          <div>
            <label htmlFor={`${toolId}-r2`} className="block text-sm font-medium text-gray-700 mb-1">R2 (Ω)</label>
            <input id={`${toolId}-r2`} type="number" step="any" value={r2} onChange={(e) => setR2(e.target.value)} className="input-field" aria-label="Resistor R2 in ohms" />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Voltage Divider Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
