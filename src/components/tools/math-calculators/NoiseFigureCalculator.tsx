'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * NoiseFigureCalculator - Calculate cascaded noise figure for RF receiver chains.
 */
export default function NoiseFigureCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [stages, setStages] = useState([
    { name: 'LNA', noiseFigure: '1.5', gain: '20' },
    { name: 'Filter', noiseFigure: '2.0', gain: '-1' },
    { name: 'Mixer', noiseFigure: '8.0', gain: '6' },
  ]);
  const [output, setOutput] = useState('');

  const addStage = () => {
    setStages([...stages, { name: `Stage ${stages.length + 1}`, noiseFigure: '3.0', gain: '10' }]);
  };

  const removeStage = (index: number) => {
    if (stages.length > 1) {
      setStages(stages.filter((_, i) => i !== index));
    }
  };

  const updateStage = (index: number, field: string, value: string) => {
    const updated = [...stages];
    updated[index] = { ...updated[index], [field]: value };
    setStages(updated);
  };

  const calculate = () => {
    const parsedStages = stages.map((s) => ({
      name: s.name,
      nf: parseFloat(s.noiseFigure),
      gain: parseFloat(s.gain),
    }));

    if (parsedStages.some((s) => isNaN(s.nf) || isNaN(s.gain))) {
      setOutput('Please enter valid numeric values for all stages.');
      return;
    }

    // Convert NF from dB to linear
    const nfLinear = parsedStages.map((s) => Math.pow(10, s.nf / 10));
    const gainLinear = parsedStages.map((s) => Math.pow(10, s.gain / 10));

    // Friis formula: F_total = F1 + (F2-1)/G1 + (F3-1)/(G1*G2) + ...
    let cascadedNF = nfLinear[0];
    let cumulativeGain = gainLinear[0];

    for (let i = 1; i < parsedStages.length; i++) {
      cascadedNF += (nfLinear[i] - 1) / cumulativeGain;
      cumulativeGain *= gainLinear[i];
    }

    const cascadedNFdB = 10 * Math.log10(cascadedNF);
    const totalGaindB = parsedStages.reduce((sum, s) => sum + s.gain, 0);

    let result = `Cascaded Noise Figure Analysis\n`;
    result += `══════════════════════════════════\n\n`;
    result += `Stages:\n`;
    parsedStages.forEach((s, i) => {
      result += `  ${i + 1}. ${s.name}: NF = ${s.nf.toFixed(2)} dB, Gain = ${s.gain.toFixed(2)} dB\n`;
    });
    result += `\n`;
    result += `Results:\n`;
    result += `  Cascaded Noise Figure: ${cascadedNFdB.toFixed(3)} dB (${cascadedNF.toFixed(4)} linear)\n`;
    result += `  Total System Gain: ${totalGaindB.toFixed(2)} dB\n`;
    result += `  Noise Temperature: ${((cascadedNF - 1) * 290).toFixed(1)} K (at T₀ = 290K)\n\n`;
    result += `Formula (Friis):\n`;
    result += `  F_total = F₁ + (F₂-1)/G₁ + (F₃-1)/(G₁·G₂) + ...\n`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Receiver Chain Stages</label>
          {stages.map((stage, i) => (
            <div key={i} className="grid grid-cols-4 gap-2 items-end">
              <div>
                <input
                  type="text"
                  value={stage.name}
                  onChange={(e) => updateStage(i, 'name', e.target.value)}
                  placeholder="Stage name"
                  aria-label={`Stage ${i + 1} name for ${toolName}`}
                  className="input-field text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">NF (dB)</label>
                <input
                  type="number"
                  value={stage.noiseFigure}
                  onChange={(e) => updateStage(i, 'noiseFigure', e.target.value)}
                  placeholder="NF dB"
                  aria-label={`Stage ${i + 1} noise figure`}
                  className="input-field text-sm"
                  step="any"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">Gain (dB)</label>
                <input
                  type="number"
                  value={stage.gain}
                  onChange={(e) => updateStage(i, 'gain', e.target.value)}
                  placeholder="Gain dB"
                  aria-label={`Stage ${i + 1} gain`}
                  className="input-field text-sm"
                  step="any"
                />
              </div>
              <button
                onClick={() => removeStage(i)}
                className="text-red-500 hover:text-red-700 text-sm px-2 py-1"
                aria-label={`Remove stage ${i + 1}`}
              >
                ✕
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <button onClick={addStage} className="btn-secondary flex-1">
              + Add Stage
            </button>
            <button onClick={calculate} className="btn-primary flex-1">
              Calculate
            </button>
          </div>
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
