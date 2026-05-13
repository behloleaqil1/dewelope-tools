'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SchmittTriggerCalculator - Calculate Schmitt trigger threshold voltages (VTH, VTL) and hysteresis.
 * Supports inverting and non-inverting configurations.
 */
export default function SchmittTriggerCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [config, setConfig] = useState<'inverting' | 'non-inverting'>('inverting');
  const [vcc, setVcc] = useState('');
  const [r1, setR1] = useState('');
  const [r2, setR2] = useState('');
  const [vref, setVref] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const vccVal = parseFloat(vcc);
    const r1Val = parseFloat(r1);
    const r2Val = parseFloat(r2);
    const vrefVal = vref ? parseFloat(vref) : vccVal / 2;

    if (isNaN(vccVal) || isNaN(r1Val) || isNaN(r2Val) || r1Val <= 0 || r2Val <= 0) {
      setOutput('Please enter valid positive values for Vcc, R1, and R2.');
      return;
    }

    // Standard formulas for op-amp Schmitt trigger
    const vthFinal = vccVal * r1Val / (r1Val + r2Val);
    const vtlFinal = -vccVal * r1Val / (r1Val + r2Val);
    const hysteresis = vthFinal - vtlFinal;

    // For single-supply
    const vthSingle = vccVal * r1Val / (r1Val + r2Val);
    const vtlSingle = 0;
    const hysteresisSingle = vthSingle;

    const results = [
      `=== Schmitt Trigger Calculator (${config}) ===`,
      ``,
      `Input Values:`,
      `  Vcc = ${vccVal} V`,
      `  R1 = ${r1Val} Ω`,
      `  R2 = ${r2Val} Ω`,
      `  Vref = ${vrefVal.toFixed(3)} V`,
      ``,
      `--- Dual Supply Results ---`,
      `  Upper Threshold (VTH) = ${vthFinal.toFixed(4)} V`,
      `  Lower Threshold (VTL) = ${vtlFinal.toFixed(4)} V`,
      `  Hysteresis = ${hysteresis.toFixed(4)} V`,
      ``,
      `--- Single Supply (0 to Vcc) ---`,
      `  Upper Threshold (VTH) = ${vthSingle.toFixed(4)} V`,
      `  Lower Threshold (VTL) = ${vtlSingle.toFixed(4)} V`,
      `  Hysteresis = ${hysteresisSingle.toFixed(4)} V`,
      ``,
      `Ratio R1/R2 = ${(r1Val / r2Val).toFixed(4)}`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-config`} className="block text-sm font-medium text-gray-700 mb-1">Configuration</label>
            <select id={`${toolId}-config`} value={config} onChange={(e) => setConfig(e.target.value as 'inverting' | 'non-inverting')} className="input-field" aria-label={`Configuration for ${toolName}`}>
              <option value="inverting">Inverting</option>
              <option value="non-inverting">Non-Inverting</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-vcc`} className="block text-sm font-medium text-gray-700 mb-1">Supply Voltage Vcc (V)</label>
              <input id={`${toolId}-vcc`} type="number" value={vcc} onChange={(e) => setVcc(e.target.value)} placeholder="5" className="input-field" aria-label="Supply voltage" />
            </div>
            <div>
              <label htmlFor={`${toolId}-vref`} className="block text-sm font-medium text-gray-700 mb-1">Reference Voltage (V, optional)</label>
              <input id={`${toolId}-vref`} type="number" value={vref} onChange={(e) => setVref(e.target.value)} placeholder="Vcc/2" className="input-field" aria-label="Reference voltage" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-r1`} className="block text-sm font-medium text-gray-700 mb-1">R1 (Ω)</label>
              <input id={`${toolId}-r1`} type="number" value={r1} onChange={(e) => setR1(e.target.value)} placeholder="10000" className="input-field" aria-label="Resistor R1" />
            </div>
            <div>
              <label htmlFor={`${toolId}-r2`} className="block text-sm font-medium text-gray-700 mb-1">R2 (Ω)</label>
              <input id={`${toolId}-r2`} type="number" value={r2} onChange={(e) => setR2(e.target.value)} placeholder="47000" className="input-field" aria-label="Resistor R2" />
            </div>
          </div>
          <button onClick={calculate} className="btn-primary">Calculate Thresholds</button>
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
