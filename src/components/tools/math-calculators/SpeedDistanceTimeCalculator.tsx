'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SpeedDistanceTimeCalculator - Calculates speed, distance, or time given the other two.
 * Uses the formula: Distance = Speed × Time.
 */
export default function SpeedDistanceTimeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mode, setMode] = useState<'speed' | 'distance' | 'time'>('speed');
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [result, setResult] = useState<{ value: string; unit: string; formula: string } | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    setError('');
    setResult(null);

    const a = parseFloat(value1);
    const b = parseFloat(value2);

    if (isNaN(a) || isNaN(b)) {
      setError('Please enter valid numbers in both fields');
      return;
    }

    if (a <= 0 || b <= 0) {
      setError('Values must be greater than zero');
      return;
    }

    switch (mode) {
      case 'speed': {
        const speed = a / b;
        setResult({
          value: speed.toFixed(4),
          unit: 'units/hour',
          formula: `Speed = Distance ÷ Time = ${a} ÷ ${b} = ${speed.toFixed(4)}`,
        });
        break;
      }
      case 'distance': {
        const distance = a * b;
        setResult({
          value: distance.toFixed(4),
          unit: 'units',
          formula: `Distance = Speed × Time = ${a} × ${b} = ${distance.toFixed(4)}`,
        });
        break;
      }
      case 'time': {
        const time = a / b;
        setResult({
          value: time.toFixed(4),
          unit: 'hours',
          formula: `Time = Distance ÷ Speed = ${a} ÷ ${b} = ${time.toFixed(4)}`,
        });
        break;
      }
    }
  };

  const getLabels = (): [string, string] => {
    switch (mode) {
      case 'speed': return ['Distance', 'Time (hours)'];
      case 'distance': return ['Speed', 'Time (hours)'];
      case 'time': return ['Distance', 'Speed'];
    }
  };

  const [label1, label2] = getLabels();

  const copyText = result ? `${result.formula}\nResult: ${result.value} ${result.unit}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="flex gap-2 flex-wrap">
        {(['speed', 'distance', 'time'] as const).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setValue1(''); setValue2(''); setResult(null); setError(''); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === m ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            aria-label={`Calculate ${m}`}
          >
            Find {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      <InputArea error={error}>
        <label htmlFor={`${toolId}-v1`} className="block text-sm font-medium text-gray-700 mb-1">
          {label1}
        </label>
        <input
          id={`${toolId}-v1`}
          type="text"
          inputMode="decimal"
          value={value1}
          onChange={(e) => setValue1(e.target.value)}
          placeholder={`Enter ${label1.toLowerCase()}`}
          aria-label={`${label1} for ${toolName}`}
          className="input-field mb-3"
        />

        <label htmlFor={`${toolId}-v2`} className="block text-sm font-medium text-gray-700 mb-1">
          {label2}
        </label>
        <input
          id={`${toolId}-v2`}
          type="text"
          inputMode="decimal"
          value={value2}
          onChange={(e) => setValue2(e.target.value)}
          placeholder={`Enter ${label2.toLowerCase()}`}
          aria-label={`${label2} for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <button onClick={calculate} aria-label={`Calculate ${mode}`} className="btn-primary">
        Calculate {mode.charAt(0).toUpperCase() + mode.slice(1)}
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600">{result.value}</div>
              <div className="text-sm text-gray-500 mt-1">{result.unit}</div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              {result.formula}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
