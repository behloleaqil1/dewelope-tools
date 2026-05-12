'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * DecibelCalculator - Calculate decibel gain/loss from power or voltage ratio.
 */
export default function DecibelCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mode, setMode] = useState<'power' | 'voltage' | 'db-to-ratio'>('power');
  const [inputValue, setInputValue] = useState('');
  const [referenceValue, setReferenceValue] = useState('');
  const [dbValue, setDbValue] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    if (mode === 'power') {
      const p1 = parseFloat(inputValue);
      const p2 = parseFloat(referenceValue);
      if (isNaN(p1) || isNaN(p2) || p1 <= 0 || p2 <= 0) {
        setOutput('Error: Please enter valid positive power values.');
        return;
      }
      const db = 10 * Math.log10(p1 / p2);
      const ratio = p1 / p2;
      setOutput(`Power Ratio to Decibels
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
P₁ (output): ${p1}
P₂ (reference): ${p2}
Ratio (P₁/P₂): ${ratio.toFixed(6)}

dB = 10 × log₁₀(P₁/P₂)
dB = 10 × log₁₀(${ratio.toFixed(6)})
dB = ${db.toFixed(4)} dB

${db > 0 ? '📈 This is a GAIN of ' + db.toFixed(2) + ' dB' : db < 0 ? '📉 This is a LOSS of ' + Math.abs(db).toFixed(2) + ' dB' : '⚖️ No gain or loss (0 dB)'}`);
    } else if (mode === 'voltage') {
      const v1 = parseFloat(inputValue);
      const v2 = parseFloat(referenceValue);
      if (isNaN(v1) || isNaN(v2) || v1 <= 0 || v2 <= 0) {
        setOutput('Error: Please enter valid positive voltage values.');
        return;
      }
      const db = 20 * Math.log10(v1 / v2);
      const ratio = v1 / v2;
      setOutput(`Voltage Ratio to Decibels
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
V₁ (output): ${v1}
V₂ (reference): ${v2}
Ratio (V₁/V₂): ${ratio.toFixed(6)}

dB = 20 × log₁₀(V₁/V₂)
dB = 20 × log₁₀(${ratio.toFixed(6)})
dB = ${db.toFixed(4)} dB

${db > 0 ? '📈 This is a GAIN of ' + db.toFixed(2) + ' dB' : db < 0 ? '📉 This is a LOSS of ' + Math.abs(db).toFixed(2) + ' dB' : '⚖️ No gain or loss (0 dB)'}`);
    } else {
      const db = parseFloat(dbValue);
      if (isNaN(db)) {
        setOutput('Error: Please enter a valid dB value.');
        return;
      }
      const powerRatio = Math.pow(10, db / 10);
      const voltageRatio = Math.pow(10, db / 20);
      setOutput(`Decibels to Ratio
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Input: ${db} dB

Power Ratio: ${powerRatio.toFixed(6)}
  (10^(${db}/10) = ${powerRatio.toFixed(6)})

Voltage Ratio: ${voltageRatio.toFixed(6)}
  (10^(${db}/20) = ${voltageRatio.toFixed(6)})

Percentage:
  Power: ${((powerRatio - 1) * 100).toFixed(2)}% ${powerRatio >= 1 ? 'increase' : 'decrease'}
  Voltage: ${((voltageRatio - 1) * 100).toFixed(2)}% ${voltageRatio >= 1 ? 'increase' : 'decrease'}`);
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Calculation Mode</label>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setMode('power')} className={`px-3 py-1 rounded text-sm ${mode === 'power' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Power Ratio → dB</button>
            <button onClick={() => setMode('voltage')} className={`px-3 py-1 rounded text-sm ${mode === 'voltage' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Voltage Ratio → dB</button>
            <button onClick={() => setMode('db-to-ratio')} className={`px-3 py-1 rounded text-sm ${mode === 'db-to-ratio' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>dB → Ratio</button>
          </div>
        </div>

        {mode !== 'db-to-ratio' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor={`${toolId}-v1`} className="block text-sm font-medium text-gray-700 mb-1">{mode === 'power' ? 'Output Power (P₁)' : 'Output Voltage (V₁)'}</label>
              <input id={`${toolId}-v1`} type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="100" aria-label={`Output value for ${toolName}`} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-v2`} className="block text-sm font-medium text-gray-700 mb-1">{mode === 'power' ? 'Reference Power (P₂)' : 'Reference Voltage (V₂)'}</label>
              <input id={`${toolId}-v2`} type="number" value={referenceValue} onChange={(e) => setReferenceValue(e.target.value)} placeholder="10" aria-label="Reference value" className="input-field" />
            </div>
          </div>
        ) : (
          <div>
            <label htmlFor={`${toolId}-db`} className="block text-sm font-medium text-gray-700 mb-1">Decibel Value (dB)</label>
            <input id={`${toolId}-db`} type="number" value={dbValue} onChange={(e) => setDbValue(e.target.value)} placeholder="3" aria-label="Decibel value" className="input-field" />
          </div>
        )}

        <button onClick={calculate} className="btn-primary mt-4">Calculate</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
