'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * HalfLifeCalculator - Calculate radioactive half-life decay over time.
 */
export default function HalfLifeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [initialAmount, setInitialAmount] = useState('');
  const [halfLife, setHalfLife] = useState('');
  const [halfLifeUnit, setHalfLifeUnit] = useState('years');
  const [elapsedTime, setElapsedTime] = useState('');
  const [elapsedUnit, setElapsedUnit] = useState('years');
  const [output, setOutput] = useState('');

  const convertToBaseUnit = (value: number, unit: string): number => {
    switch (unit) {
      case 'seconds': return value;
      case 'minutes': return value * 60;
      case 'hours': return value * 3600;
      case 'days': return value * 86400;
      case 'years': return value * 365.25 * 86400;
      default: return value;
    }
  };

  const calculate = () => {
    const N0 = parseFloat(initialAmount);
    const t_half = parseFloat(halfLife);
    const t = parseFloat(elapsedTime);

    if (isNaN(N0) || isNaN(t_half) || isNaN(t) || N0 <= 0 || t_half <= 0 || t < 0) {
      setOutput('Please enter valid positive values. Elapsed time can be 0.');
      return;
    }

    const t_halfSeconds = convertToBaseUnit(t_half, halfLifeUnit);
    const tSeconds = convertToBaseUnit(t, elapsedUnit);

    // N(t) = N0 * (1/2)^(t/t_half)
    const numHalfLives = tSeconds / t_halfSeconds;
    const remaining = N0 * Math.pow(0.5, numHalfLives);
    const decayed = N0 - remaining;
    const decayConstant = Math.LN2 / t_halfSeconds;
    const percentRemaining = (remaining / N0) * 100;

    let result = `Radioactive Decay Calculation\n`;
    result += `══════════════════════════════════\n\n`;
    result += `Input Parameters:\n`;
    result += `  Initial amount (N₀): ${N0}\n`;
    result += `  Half-life (t½): ${t_half} ${halfLifeUnit}\n`;
    result += `  Elapsed time (t): ${t} ${elapsedUnit}\n\n`;
    result += `Results:\n`;
    result += `  Number of half-lives elapsed: ${numHalfLives.toFixed(4)}\n`;
    result += `  Remaining amount: ${remaining.toFixed(6)}\n`;
    result += `  Decayed amount: ${decayed.toFixed(6)}\n`;
    result += `  Percent remaining: ${percentRemaining.toFixed(4)}%\n`;
    result += `  Decay constant (λ): ${decayConstant.toExponential(4)} /s\n\n`;
    result += `Formula:\n`;
    result += `  N(t) = N₀ × (½)^(t/t½)\n`;
    result += `  N(t) = ${N0} × (½)^(${numHalfLives.toFixed(4)})\n`;
    result += `  N(t) = ${remaining.toFixed(6)}\n\n`;
    result += `Decay Table:\n`;

    for (let i = 0; i <= Math.min(10, Math.ceil(numHalfLives) + 2); i++) {
      const amt = N0 * Math.pow(0.5, i);
      const marker = Math.abs(i - numHalfLives) < 0.01 ? ' ←' : '';
      result += `  ${i} half-lives: ${amt.toFixed(4)}${marker}\n`;
    }

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-amount`} className="block text-sm font-medium text-gray-700 mb-1">
              Initial Amount (N₀)
            </label>
            <input
              id={`${toolId}-amount`}
              type="number"
              value={initialAmount}
              onChange={(e) => setInitialAmount(e.target.value)}
              placeholder="e.g. 1000"
              aria-label={`Initial amount for ${toolName}`}
              className="input-field"
              min="0"
              step="any"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-halflife`} className="block text-sm font-medium text-gray-700 mb-1">
                Half-Life
              </label>
              <input
                id={`${toolId}-halflife`}
                type="number"
                value={halfLife}
                onChange={(e) => setHalfLife(e.target.value)}
                placeholder="e.g. 5730"
                aria-label="Half-life value"
                className="input-field"
                min="0"
                step="any"
              />
            </div>
            <div>
              <label htmlFor={`${toolId}-hlunit`} className="block text-sm font-medium text-gray-700 mb-1">
                Unit
              </label>
              <select
                id={`${toolId}-hlunit`}
                value={halfLifeUnit}
                onChange={(e) => setHalfLifeUnit(e.target.value)}
                aria-label="Half-life unit"
                className="input-field"
              >
                <option value="seconds">Seconds</option>
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
                <option value="years">Years</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-elapsed`} className="block text-sm font-medium text-gray-700 mb-1">
                Elapsed Time
              </label>
              <input
                id={`${toolId}-elapsed`}
                type="number"
                value={elapsedTime}
                onChange={(e) => setElapsedTime(e.target.value)}
                placeholder="e.g. 11460"
                aria-label="Elapsed time"
                className="input-field"
                min="0"
                step="any"
              />
            </div>
            <div>
              <label htmlFor={`${toolId}-etunit`} className="block text-sm font-medium text-gray-700 mb-1">
                Unit
              </label>
              <select
                id={`${toolId}-etunit`}
                value={elapsedUnit}
                onChange={(e) => setElapsedUnit(e.target.value)}
                aria-label="Elapsed time unit"
                className="input-field"
              >
                <option value="seconds">Seconds</option>
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
                <option value="years">Years</option>
              </select>
            </div>
          </div>
          <button onClick={calculate} className="btn-primary w-full">
            Calculate Decay
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
