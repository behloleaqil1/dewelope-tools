'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PendulumClockCalculator - Calculate pendulum length for a desired period.
 * Uses the formula: T = 2π√(L/g), so L = g(T/(2π))²
 * where T = period, L = length, g = gravitational acceleration.
 */
export default function PendulumClockCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mode, setMode] = useState<'lengthFromPeriod' | 'periodFromLength'>('lengthFromPeriod');
  const [period, setPeriod] = useState('');
  const [length, setLength] = useState('');
  const [gravity, setGravity] = useState('9.80665');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const g = parseFloat(gravity);
    if (isNaN(g) || g <= 0) {
      setOutput('Error: Gravity must be a positive number.');
      return;
    }

    let result = '';

    if (mode === 'lengthFromPeriod') {
      const T = parseFloat(period);
      if (isNaN(T) || T <= 0) {
        setOutput('Error: Please enter a valid period greater than 0.');
        return;
      }

      // L = g * (T / (2π))²
      const L = g * Math.pow(T / (2 * Math.PI), 2);
      const frequency = 1 / T;
      const beatsPerMinute = 60 / T;

      result = `=== Pendulum Length Calculation ===\n\n`;
      result += `Input:\n`;
      result += `  Desired Period (T): ${T} seconds\n`;
      result += `  Gravity (g): ${g} m/s²\n\n`;
      result += `Results:\n`;
      result += `  Pendulum Length: ${L.toFixed(6)} m\n`;
      result += `  Pendulum Length: ${(L * 100).toFixed(4)} cm\n`;
      result += `  Pendulum Length: ${(L * 1000).toFixed(2)} mm\n`;
      if (L > 0.3) {
        result += `  Pendulum Length: ${(L * 3.28084).toFixed(4)} ft\n`;
      }
      result += `  Frequency: ${frequency.toFixed(6)} Hz\n`;
      result += `  Beats per minute: ${beatsPerMinute.toFixed(2)}\n\n`;
      result += `Formula:\n`;
      result += `  T = 2π√(L/g)\n`;
      result += `  L = g × (T / 2π)²\n`;
      result += `  L = ${g} × (${T} / ${(2 * Math.PI).toFixed(5)})²\n`;
      result += `  L = ${L.toFixed(6)} m\n\n`;
      result += `Note: A seconds pendulum (T=2s) has L ≈ 0.9937 m\n`;
      result += `This is the classic grandfather clock pendulum.\n`;
    } else {
      const L = parseFloat(length);
      if (isNaN(L) || L <= 0) {
        setOutput('Error: Please enter a valid length greater than 0.');
        return;
      }

      // T = 2π√(L/g)
      const T = 2 * Math.PI * Math.sqrt(L / g);
      const frequency = 1 / T;
      const beatsPerMinute = 60 / T;

      result = `=== Pendulum Period Calculation ===\n\n`;
      result += `Input:\n`;
      result += `  Pendulum Length (L): ${L} m (${(L * 100).toFixed(2)} cm)\n`;
      result += `  Gravity (g): ${g} m/s²\n\n`;
      result += `Results:\n`;
      result += `  Period (T): ${T.toFixed(6)} seconds\n`;
      result += `  Frequency: ${frequency.toFixed(6)} Hz\n`;
      result += `  Beats per minute: ${beatsPerMinute.toFixed(2)}\n`;
      result += `  Half-period (tick or tock): ${(T / 2).toFixed(6)} s\n\n`;
      result += `Formula:\n`;
      result += `  T = 2π√(L/g)\n`;
      result += `  T = 2π√(${L} / ${g})\n`;
      result += `  T = ${T.toFixed(6)} s\n`;
    }

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="mb-4">
          <label htmlFor={`${toolId}-mode`} className="block text-sm font-medium text-gray-700 mb-1">
            Calculation Mode
          </label>
          <select
            id={`${toolId}-mode`}
            value={mode}
            onChange={(e) => setMode(e.target.value as 'lengthFromPeriod' | 'periodFromLength')}
            aria-label={`Calculation mode for ${toolName}`}
            className="input-field"
          >
            <option value="lengthFromPeriod">Find Length from Period</option>
            <option value="periodFromLength">Find Period from Length</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mode === 'lengthFromPeriod' ? (
            <div>
              <label htmlFor={`${toolId}-period`} className="block text-sm font-medium text-gray-700 mb-1">
                Desired Period (seconds)
              </label>
              <input
                id={`${toolId}-period`}
                type="number"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="2"
                step="0.001"
                aria-label="Period in seconds"
                className="input-field"
              />
            </div>
          ) : (
            <div>
              <label htmlFor={`${toolId}-length`} className="block text-sm font-medium text-gray-700 mb-1">
                Pendulum Length (meters)
              </label>
              <input
                id={`${toolId}-length`}
                type="number"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="0.9937"
                step="0.001"
                aria-label="Length in meters"
                className="input-field"
              />
            </div>
          )}
          <div>
            <label htmlFor={`${toolId}-gravity`} className="block text-sm font-medium text-gray-700 mb-1">
              Gravity (m/s²)
            </label>
            <input
              id={`${toolId}-gravity`}
              type="number"
              value={gravity}
              onChange={(e) => setGravity(e.target.value)}
              placeholder="9.80665"
              step="0.001"
              aria-label="Gravitational acceleration"
              className="input-field"
            />
          </div>
        </div>
        <button
          onClick={calculate}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Calculate
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-md">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
