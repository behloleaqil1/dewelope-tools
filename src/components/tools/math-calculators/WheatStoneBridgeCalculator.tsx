'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function WheatStoneBridgeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [r1, setR1] = useState('');
  const [r2, setR2] = useState('');
  const [r3, setR3] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const R1 = parseFloat(r1);
    const R2 = parseFloat(r2);
    const R3 = parseFloat(r3);

    if (isNaN(R1) || isNaN(R2) || isNaN(R3)) {
      setOutput('Please enter valid numbers for R1, R2, and R3.');
      return;
    }

    if (R1 === 0) {
      setOutput('R1 cannot be zero (division by zero).');
      return;
    }

    // Wheatstone bridge balance condition: R1/R2 = R3/Rx => Rx = (R2 * R3) / R1
    const Rx = (R2 * R3) / R1;

    const results = [
      `Wheatstone Bridge Calculator`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      ``,
      `Known Resistances:`,
      `  R1 = ${R1} Ω`,
      `  R2 = ${R2} Ω`,
      `  R3 = ${R3} Ω`,
      ``,
      `Balance Condition: R1/R2 = R3/Rx`,
      ``,
      `Unknown Resistance:`,
      `  Rx = (R2 × R3) / R1`,
      `  Rx = (${R2} × ${R3}) / ${R1}`,
      `  Rx = ${Rx.toFixed(4)} Ω`,
      ``,
      `Ratio: R1/R2 = ${(R1 / R2).toFixed(4)}`,
      `Ratio: R3/Rx = ${(R3 / Rx).toFixed(4)}`,
      ``,
      `Bridge is balanced when galvanometer reads zero.`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Enter three known resistances to find the unknown Rx using the Wheatstone bridge balance condition.</p>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor={`${toolId}-r1`} className="block text-sm font-medium text-gray-700 mb-1">R1 (Ω)</label>
              <input id={`${toolId}-r1`} type="number" value={r1} onChange={(e) => setR1(e.target.value)} className="input-field" placeholder="100" aria-label={`R1 resistance for ${toolName}`} />
            </div>
            <div>
              <label htmlFor={`${toolId}-r2`} className="block text-sm font-medium text-gray-700 mb-1">R2 (Ω)</label>
              <input id={`${toolId}-r2`} type="number" value={r2} onChange={(e) => setR2(e.target.value)} className="input-field" placeholder="200" aria-label="R2 resistance" />
            </div>
            <div>
              <label htmlFor={`${toolId}-r3`} className="block text-sm font-medium text-gray-700 mb-1">R3 (Ω)</label>
              <input id={`${toolId}-r3`} type="number" value={r3} onChange={(e) => setR3(e.target.value)} className="input-field" placeholder="300" aria-label="R3 resistance" />
            </div>
          </div>
          <button onClick={calculate} className="btn-primary">Calculate Rx</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
