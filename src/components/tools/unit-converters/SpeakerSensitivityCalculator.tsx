'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SpeakerSensitivityCalculator - Calculate speaker SPL from sensitivity and power.
 * Uses the formula SPL = Sensitivity + 10·log10(Power) to determine output level.
 */
export default function SpeakerSensitivityCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [sensitivity, setSensitivity] = useState('');
  const [power, setPower] = useState('');
  const [distance, setDistance] = useState('1');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const sens = parseFloat(sensitivity);
    const pwr = parseFloat(power);
    const dist = parseFloat(distance);

    if (isNaN(sens) || isNaN(pwr)) {
      setOutput('Please enter valid sensitivity and power values.');
      return;
    }

    if (pwr <= 0) {
      setOutput('Power must be a positive value.');
      return;
    }

    if (dist <= 0) {
      setOutput('Distance must be a positive value.');
      return;
    }

    // SPL at 1 meter = Sensitivity + 10·log10(Power)
    const splAt1m = sens + 10 * Math.log10(pwr);

    // SPL at distance (inverse square law): SPL = SPL_1m - 20·log10(distance)
    const splAtDist = splAt1m - 20 * Math.log10(dist);

    // Power needed for various SPL targets
    const targets = [80, 85, 90, 95, 100, 105, 110];
    const powerForTargets = targets.map(target => {
      const needed = Math.pow(10, (target - sens) / 10);
      return { spl: target, power: needed };
    });

    // Doubling power adds 3 dB
    const splDouble = sens + 10 * Math.log10(pwr * 2);

    const lines = [
      '═══ Speaker SPL Calculator ═══',
      '',
      `Sensitivity:  ${sens} dB (1W/1m)`,
      `Power Input:  ${pwr} W`,
      `Distance:     ${dist} m`,
      '',
      '── Results ──',
      `  SPL at 1 meter:        ${splAt1m.toFixed(1)} dB`,
      `  SPL at ${dist} meter${dist !== 1 ? 's' : ''}:      ${splAtDist.toFixed(1)} dB`,
      `  SPL with 2× power:     ${splDouble.toFixed(1)} dB (+3 dB)`,
      '',
      '── Power Required for Target SPL (at 1m) ──',
      ...powerForTargets.map(t =>
        `  ${t.spl} dB SPL: ${t.power >= 1 ? t.power.toFixed(1) + ' W' : (t.power * 1000).toFixed(1) + ' mW'}${t.power > pwr ? ' ⚠️ exceeds input' : ' ✓'}`
      ),
      '',
      '── Formulas ──',
      `  SPL = Sensitivity + 10·log₁₀(Power)`,
      `  SPL = ${sens} + 10·log₁₀(${pwr}) = ${splAt1m.toFixed(1)} dB`,
      `  SPL at distance = SPL₁ₘ - 20·log₁₀(d)`,
      '',
      '── Notes ──',
      '• Sensitivity is measured at 1W input, 1m distance.',
      '• Every doubling of power adds +3 dB SPL.',
      '• Every doubling of distance reduces SPL by -6 dB.',
      '• Typical home listening: 70-85 dB. Concert: 100-115 dB.',
    ];

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-sensitivity`} className="block text-sm font-medium text-gray-700 mb-1">
              Speaker Sensitivity (dB @ 1W/1m)
            </label>
            <input
              id={`${toolId}-sensitivity`}
              type="number"
              step="any"
              value={sensitivity}
              onChange={(e) => setSensitivity(e.target.value)}
              placeholder="e.g. 87"
              className="input-field"
              aria-label={`Speaker sensitivity for ${toolName}`}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-power`} className="block text-sm font-medium text-gray-700 mb-1">
                Amplifier Power (Watts)
              </label>
              <input
                id={`${toolId}-power`}
                type="number"
                step="any"
                value={power}
                onChange={(e) => setPower(e.target.value)}
                placeholder="e.g. 50"
                className="input-field"
                aria-label="Amplifier power in watts"
              />
            </div>
            <div>
              <label htmlFor={`${toolId}-distance`} className="block text-sm font-medium text-gray-700 mb-1">
                Listening Distance (meters)
              </label>
              <input
                id={`${toolId}-distance`}
                type="number"
                step="any"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="e.g. 3"
                className="input-field"
                aria-label="Listening distance in meters"
              />
            </div>
          </div>
          <button onClick={calculate} className="btn-primary" aria-label="Calculate speaker SPL">
            Calculate SPL
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Speaker SPL Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
