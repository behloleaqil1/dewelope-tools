'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AmplifierGainCalculator - Calculate amplifier gain in dB from input/output values.
 * Supports voltage gain, power gain, and current gain calculations.
 */
export default function AmplifierGainCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [gainType, setGainType] = useState<'voltage' | 'power' | 'current'>('voltage');
  const [inputValue, setInputValue] = useState('');
  const [outputValue, setOutputValue] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const vIn = parseFloat(inputValue);
    const vOut = parseFloat(outputValue);

    if (isNaN(vIn) || isNaN(vOut) || vIn <= 0 || vOut <= 0) {
      setOutput('Please enter valid positive values for input and output.');
      return;
    }

    const ratio = vOut / vIn;
    let gainDb: number;
    let formula: string;
    let unitLabel: string;

    switch (gainType) {
      case 'voltage':
        gainDb = 20 * Math.log10(ratio);
        formula = '20 × log₁₀(Vout / Vin)';
        unitLabel = 'V';
        break;
      case 'power':
        gainDb = 10 * Math.log10(ratio);
        formula = '10 × log₁₀(Pout / Pin)';
        unitLabel = 'W';
        break;
      case 'current':
        gainDb = 20 * Math.log10(ratio);
        formula = '20 × log₁₀(Iout / Iin)';
        unitLabel = 'A';
        break;
    }

    const lines = [
      '═══ Amplifier Gain Calculation ═══',
      '',
      `Gain Type: ${gainType.charAt(0).toUpperCase() + gainType.slice(1)} Gain`,
      `Input: ${vIn} ${unitLabel}`,
      `Output: ${vOut} ${unitLabel}`,
      '',
      `Linear Gain (ratio): ${ratio.toFixed(6)}`,
      `Gain in dB: ${gainDb.toFixed(4)} dB`,
      '',
      '═══ Formula ═══',
      '',
      `Gain (dB) = ${formula}`,
      `Gain (dB) = ${gainType === 'power' ? '10' : '20'} × log₁₀(${vOut} / ${vIn})`,
      `Gain (dB) = ${gainType === 'power' ? '10' : '20'} × log₁₀(${ratio.toFixed(6)})`,
      `Gain (dB) = ${gainDb.toFixed(4)} dB`,
      '',
      '═══ Classification ═══',
      '',
      gainDb > 0 ? '• Amplification (gain > 0 dB)' : gainDb < 0 ? '• Attenuation (gain < 0 dB)' : '• Unity gain (0 dB)',
      `• ${Math.abs(gainDb) > 20 ? 'High' : Math.abs(gainDb) > 6 ? 'Moderate' : 'Low'} ${gainDb >= 0 ? 'gain' : 'attenuation'}`,
    ];

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">
              Gain Type
            </label>
            <select
              id={`${toolId}-type`}
              value={gainType}
              onChange={(e) => setGainType(e.target.value as 'voltage' | 'power' | 'current')}
              className="input-field"
              aria-label={`Gain type for ${toolName}`}
            >
              <option value="voltage">Voltage Gain (20 log)</option>
              <option value="power">Power Gain (10 log)</option>
              <option value="current">Current Gain (20 log)</option>
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-in`} className="block text-sm font-medium text-gray-700 mb-1">
                Input Value ({gainType === 'voltage' ? 'V' : gainType === 'power' ? 'W' : 'A'})
              </label>
              <input
                id={`${toolId}-in`}
                type="number"
                step="any"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="e.g. 0.1"
                className="input-field"
                aria-label="Input value"
              />
            </div>
            <div>
              <label htmlFor={`${toolId}-out`} className="block text-sm font-medium text-gray-700 mb-1">
                Output Value ({gainType === 'voltage' ? 'V' : gainType === 'power' ? 'W' : 'A'})
              </label>
              <input
                id={`${toolId}-out`}
                type="number"
                step="any"
                value={outputValue}
                onChange={(e) => setOutputValue(e.target.value)}
                placeholder="e.g. 5"
                className="input-field"
                aria-label="Output value"
              />
            </div>
          </div>
          <button onClick={calculate} className="btn-primary" aria-label="Calculate amplifier gain">
            Calculate Gain
          </button>
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
