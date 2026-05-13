'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * FiberOpticLossCalculator - Calculate fiber optic link loss budget
 * from fiber length, attenuation coefficient, splice count, connector count, and margins.
 */
export default function FiberOpticLossCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [fiberLength, setFiberLength] = useState('5');
  const [attenuation, setAttenuation] = useState('0.35');
  const [spliceCount, setSpliceCount] = useState('2');
  const [spliceLoss, setSpliceLoss] = useState('0.1');
  const [connectorCount, setConnectorCount] = useState('4');
  const [connectorLoss, setConnectorLoss] = useState('0.5');
  const [safetyMargin, setSafetyMargin] = useState('3');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const length = parseFloat(fiberLength);
    const atten = parseFloat(attenuation);
    const splices = parseInt(spliceCount);
    const splLoss = parseFloat(spliceLoss);
    const connectors = parseInt(connectorCount);
    const connLoss = parseFloat(connectorLoss);
    const margin = parseFloat(safetyMargin);

    if (isNaN(length) || isNaN(atten) || isNaN(splices) || isNaN(splLoss) || isNaN(connectors) || isNaN(connLoss) || isNaN(margin)) {
      setOutput('Please enter valid numeric values.');
      return;
    }

    const fiberLoss = length * atten;
    const totalSpliceLoss = splices * splLoss;
    const totalConnectorLoss = connectors * connLoss;
    const totalLoss = fiberLoss + totalSpliceLoss + totalConnectorLoss + margin;

    const result = `Fiber Optic Link Loss Budget
════════════════════════════════════════

Fiber Loss:        ${length} km × ${atten} dB/km = ${fiberLoss.toFixed(2)} dB
Splice Loss:       ${splices} splices × ${splLoss} dB = ${totalSpliceLoss.toFixed(2)} dB
Connector Loss:    ${connectors} connectors × ${connLoss} dB = ${totalConnectorLoss.toFixed(2)} dB
Safety Margin:     ${margin.toFixed(2)} dB

────────────────────────────────────────
Total Link Loss:   ${totalLoss.toFixed(2)} dB
────────────────────────────────────────

Breakdown:
  • Fiber attenuation:  ${((fiberLoss / totalLoss) * 100).toFixed(1)}%
  • Splice losses:      ${((totalSpliceLoss / totalLoss) * 100).toFixed(1)}%
  • Connector losses:   ${((totalConnectorLoss / totalLoss) * 100).toFixed(1)}%
  • Safety margin:      ${((margin / totalLoss) * 100).toFixed(1)}%

Note: Typical transmitter power budget should exceed ${totalLoss.toFixed(2)} dB for reliable operation.`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-length`} className="block text-sm font-medium text-gray-700 mb-1">Fiber Length (km)</label>
            <input id={`${toolId}-length`} type="number" step="0.1" value={fiberLength} onChange={(e) => setFiberLength(e.target.value)} className="input-field" aria-label={`Fiber length for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-atten`} className="block text-sm font-medium text-gray-700 mb-1">Attenuation (dB/km)</label>
            <input id={`${toolId}-atten`} type="number" step="0.01" value={attenuation} onChange={(e) => setAttenuation(e.target.value)} className="input-field" aria-label="Attenuation coefficient" />
          </div>
          <div>
            <label htmlFor={`${toolId}-splices`} className="block text-sm font-medium text-gray-700 mb-1">Splice Count</label>
            <input id={`${toolId}-splices`} type="number" value={spliceCount} onChange={(e) => setSpliceCount(e.target.value)} className="input-field" aria-label="Number of splices" />
          </div>
          <div>
            <label htmlFor={`${toolId}-sploss`} className="block text-sm font-medium text-gray-700 mb-1">Splice Loss (dB each)</label>
            <input id={`${toolId}-sploss`} type="number" step="0.01" value={spliceLoss} onChange={(e) => setSpliceLoss(e.target.value)} className="input-field" aria-label="Loss per splice" />
          </div>
          <div>
            <label htmlFor={`${toolId}-conn`} className="block text-sm font-medium text-gray-700 mb-1">Connector Count</label>
            <input id={`${toolId}-conn`} type="number" value={connectorCount} onChange={(e) => setConnectorCount(e.target.value)} className="input-field" aria-label="Number of connectors" />
          </div>
          <div>
            <label htmlFor={`${toolId}-connloss`} className="block text-sm font-medium text-gray-700 mb-1">Connector Loss (dB each)</label>
            <input id={`${toolId}-connloss`} type="number" step="0.01" value={connectorLoss} onChange={(e) => setConnectorLoss(e.target.value)} className="input-field" aria-label="Loss per connector" />
          </div>
          <div>
            <label htmlFor={`${toolId}-margin`} className="block text-sm font-medium text-gray-700 mb-1">Safety Margin (dB)</label>
            <input id={`${toolId}-margin`} type="number" step="0.1" value={safetyMargin} onChange={(e) => setSafetyMargin(e.target.value)} className="input-field" aria-label="Safety margin" />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate Link Loss</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Link Loss Budget</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
