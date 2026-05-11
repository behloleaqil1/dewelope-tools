'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * NumberSequenceGenerator - Generates number sequences (arithmetic, geometric, fibonacci).
 * Configurable start, step/ratio, and count.
 */
export default function NumberSequenceGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [seqType, setSeqType] = useState<'arithmetic' | 'geometric' | 'fibonacci'>('arithmetic');
  const [start, setStart] = useState('1');
  const [step, setStep] = useState('1');
  const [count, setCount] = useState('10');
  const [result, setResult] = useState<number[]>([]);
  const [error, setError] = useState('');

  const generate = () => {
    setError('');
    setResult([]);

    const n = parseInt(count);
    if (isNaN(n) || n < 1 || n > 1000) {
      setError('Count must be between 1 and 1000');
      return;
    }

    const startNum = parseFloat(start);
    if (isNaN(startNum)) {
      setError('Please enter a valid start number');
      return;
    }

    const stepNum = parseFloat(step);
    if (isNaN(stepNum) && seqType !== 'fibonacci') {
      setError('Please enter a valid step/ratio');
      return;
    }

    const sequence: number[] = [];

    switch (seqType) {
      case 'arithmetic':
        for (let i = 0; i < n; i++) {
          sequence.push(startNum + i * stepNum);
        }
        break;
      case 'geometric':
        if (stepNum === 0) {
          setError('Ratio cannot be zero for geometric sequence');
          return;
        }
        for (let i = 0; i < n; i++) {
          sequence.push(startNum * Math.pow(stepNum, i));
        }
        break;
      case 'fibonacci': {
        const secondNum = stepNum || 1;
        if (n >= 1) sequence.push(startNum);
        if (n >= 2) sequence.push(secondNum);
        for (let i = 2; i < n; i++) {
          sequence.push(sequence[i - 1] + sequence[i - 2]);
        }
        break;
      }
    }

    setResult(sequence);
  };

  const getStepLabel = (): string => {
    switch (seqType) {
      case 'arithmetic': return 'Common Difference (d)';
      case 'geometric': return 'Common Ratio (r)';
      case 'fibonacci': return 'Second Number';
    }
  };

  const copyText = result.join(', ');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="flex gap-2 flex-wrap">
        {(['arithmetic', 'geometric', 'fibonacci'] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setSeqType(t); setResult([]); setError(''); }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${seqType === t ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            aria-label={`Sequence type: ${t}`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <InputArea error={error}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label htmlFor={`${toolId}-start`} className="block text-sm font-medium text-gray-700 mb-1">
              {seqType === 'fibonacci' ? 'First Number' : 'Start (a₁)'}
            </label>
            <input
              id={`${toolId}-start`}
              type="text"
              inputMode="decimal"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              placeholder="1"
              aria-label={`Start value for ${toolName}`}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-step`} className="block text-sm font-medium text-gray-700 mb-1">
              {getStepLabel()}
            </label>
            <input
              id={`${toolId}-step`}
              type="text"
              inputMode="decimal"
              value={step}
              onChange={(e) => setStep(e.target.value)}
              placeholder={seqType === 'geometric' ? '2' : '1'}
              aria-label={`Step value for ${toolName}`}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">
              Count
            </label>
            <input
              id={`${toolId}-count`}
              type="text"
              inputMode="numeric"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              placeholder="10"
              aria-label={`Count for ${toolName}`}
              className="input-field"
            />
          </div>
        </div>
      </InputArea>

      <button onClick={generate} aria-label="Generate sequence" className="btn-primary">
        Generate Sequence
      </button>

      <OutputArea hasContent={result.length > 0}>
        {result.length > 0 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              {seqType.charAt(0).toUpperCase() + seqType.slice(1)} Sequence ({result.length} terms)
            </label>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 font-mono text-sm break-all max-h-64 overflow-y-auto">
              {result.map((n, i) => (
                <span key={i}>
                  {i > 0 && <span className="text-gray-400">, </span>}
                  <span className="text-gray-800">{Number.isInteger(n) ? n : n.toFixed(4)}</span>
                </span>
              ))}
            </div>
            <div className="text-xs text-gray-500">
              Sum: {result.reduce((a, b) => a + b, 0).toFixed(4)} • Min: {Math.min(...result)} • Max: {Math.max(...result).toFixed(4)}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
