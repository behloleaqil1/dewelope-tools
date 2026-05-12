'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * DopplerEffectCalculator - Calculate the observed frequency shift due to the Doppler effect.
 * Uses the formula: f_observed = f_source * (v + v_observer) / (v + v_source)
 */
export default function DopplerEffectCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [sourceFreq, setSourceFreq] = useState('440');
  const [waveSpeed, setWaveSpeed] = useState('343');
  const [observerSpeed, setObserverSpeed] = useState('0');
  const [sourceSpeed, setSourceSpeed] = useState('30');
  const [observerApproaching, setObserverApproaching] = useState(true);
  const [sourceApproaching, setSourceApproaching] = useState(true);
  const [output, setOutput] = useState('');

  const calculate = () => {
    const f0 = parseFloat(sourceFreq);
    const v = parseFloat(waveSpeed);
    const vObs = parseFloat(observerSpeed);
    const vSrc = parseFloat(sourceSpeed);

    if (isNaN(f0) || isNaN(v) || isNaN(vObs) || isNaN(vSrc)) {
      setOutput('Please enter valid numbers for all fields.');
      return;
    }

    if (v <= 0) {
      setOutput('Wave speed must be positive.');
      return;
    }

    // Sign convention: approaching = positive contribution
    const vObsSign = observerApproaching ? vObs : -vObs;
    const vSrcSign = sourceApproaching ? -vSrc : vSrc;

    const denominator = v + vSrcSign;
    if (denominator <= 0) {
      setOutput('Source speed exceeds wave speed (sonic boom condition). Cannot calculate.');
      return;
    }

    const fObserved = f0 * (v + vObsSign) / denominator;
    const shift = fObserved - f0;
    const shiftPercent = ((shift / f0) * 100);

    const results = [
      `Source Frequency: ${f0.toFixed(2)} Hz`,
      `Wave Speed: ${v.toFixed(2)} m/s`,
      `Observer Speed: ${vObs.toFixed(2)} m/s (${observerApproaching ? 'approaching' : 'receding'})`,
      `Source Speed: ${vSrc.toFixed(2)} m/s (${sourceApproaching ? 'approaching' : 'receding'})`,
      ``,
      `═══ Results ═══`,
      `Observed Frequency: ${fObserved.toFixed(4)} Hz`,
      `Frequency Shift: ${shift >= 0 ? '+' : ''}${shift.toFixed(4)} Hz`,
      `Shift Percentage: ${shiftPercent >= 0 ? '+' : ''}${shiftPercent.toFixed(2)}%`,
      ``,
      `Formula: f = f₀ × (v + v_observer) / (v - v_source)`,
      `f = ${f0} × (${v} ${vObsSign >= 0 ? '+' : '-'} ${Math.abs(vObsSign).toFixed(2)}) / (${v} ${vSrcSign >= 0 ? '+' : '-'} ${Math.abs(vSrcSign).toFixed(2)})`,
      `f = ${f0} × ${(v + vObsSign).toFixed(2)} / ${denominator.toFixed(2)}`,
      `f = ${fObserved.toFixed(4)} Hz`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-freq`} className="block text-sm font-medium text-gray-700 mb-1">Source Frequency (Hz)</label>
            <input id={`${toolId}-freq`} type="number" value={sourceFreq} onChange={(e) => setSourceFreq(e.target.value)} className="input-field" aria-label={`Source frequency for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-wave`} className="block text-sm font-medium text-gray-700 mb-1">Wave Speed (m/s)</label>
            <input id={`${toolId}-wave`} type="number" value={waveSpeed} onChange={(e) => setWaveSpeed(e.target.value)} className="input-field" aria-label="Wave speed" />
            <p className="text-xs text-gray-500 mt-1">343 m/s for sound in air at 20°C</p>
          </div>
          <div>
            <label htmlFor={`${toolId}-obs`} className="block text-sm font-medium text-gray-700 mb-1">Observer Speed (m/s)</label>
            <input id={`${toolId}-obs`} type="number" value={observerSpeed} onChange={(e) => setObserverSpeed(e.target.value)} className="input-field" aria-label="Observer speed" />
            <label className="flex items-center mt-1 text-xs text-gray-600">
              <input type="checkbox" checked={observerApproaching} onChange={(e) => setObserverApproaching(e.target.checked)} className="mr-1" />
              Approaching source
            </label>
          </div>
          <div>
            <label htmlFor={`${toolId}-src`} className="block text-sm font-medium text-gray-700 mb-1">Source Speed (m/s)</label>
            <input id={`${toolId}-src`} type="number" value={sourceSpeed} onChange={(e) => setSourceSpeed(e.target.value)} className="input-field" aria-label="Source speed" />
            <label className="flex items-center mt-1 text-xs text-gray-600">
              <input type="checkbox" checked={sourceApproaching} onChange={(e) => setSourceApproaching(e.target.checked)} className="mr-1" />
              Approaching observer
            </label>
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate Doppler Shift</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
