'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * FTestCalculator - Calculate F-test statistic for comparing two sample variances.
 */
export default function FTestCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [sample1, setSample1] = useState('');
  const [sample2, setSample2] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ fStat: number; df1: number; df2: number; var1: number; var2: number; formula: string } | null>(null);

  const parseNumbers = (text: string): number[] => {
    return text.split(/[,\s\n]+/).map((s) => parseFloat(s.trim())).filter((n) => !isNaN(n));
  };

  const variance = (data: number[]): number => {
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    return data.reduce((sum, x) => sum + (x - mean) ** 2, 0) / (data.length - 1);
  };

  const calculate = () => {
    setError('');
    setResult(null);

    const data1 = parseNumbers(sample1);
    const data2 = parseNumbers(sample2);

    if (data1.length < 2) { setError('Sample 1 needs at least 2 values.'); return; }
    if (data2.length < 2) { setError('Sample 2 needs at least 2 values.'); return; }

    const var1 = variance(data1);
    const var2 = variance(data2);

    if (var2 === 0) { setError('Sample 2 variance is zero; cannot compute F-ratio.'); return; }

    const fStat = var1 / var2;
    const df1 = data1.length - 1;
    const df2 = data2.length - 1;

    setResult({
      fStat,
      df1,
      df2,
      var1,
      var2,
      formula: `Variance₁ = ${var1.toFixed(6)} (n₁=${data1.length})\nVariance₂ = ${var2.toFixed(6)} (n₂=${data2.length})\nF = Var₁/Var₂ = ${var1.toFixed(4)}/${var2.toFixed(4)} = ${fStat.toFixed(6)}\ndf₁ = ${df1}, df₂ = ${df2}`,
    });
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="space-y-4">
          <div>
            <label htmlFor={`${toolId}-sample1`} className="block text-sm font-medium text-gray-700 mb-1">Sample 1 (comma or space separated)</label>
            <textarea id={`${toolId}-sample1`} value={sample1} onChange={(e) => setSample1(e.target.value)} placeholder="e.g. 23, 25, 28, 30, 22" rows={3} aria-label={`Sample 1 data for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-sample2`} className="block text-sm font-medium text-gray-700 mb-1">Sample 2 (comma or space separated)</label>
            <textarea id={`${toolId}-sample2`} value={sample2} onChange={(e) => setSample2(e.target.value)} placeholder="e.g. 20, 21, 24, 26, 23" rows={3} aria-label={`Sample 2 data for ${toolName}`} className="input-field" />
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} className="btn-primary" aria-label="Calculate F-test">Calculate</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xs text-gray-500">F-Statistic</div>
                <div className="text-lg font-bold text-blue-600">{result.fStat.toFixed(4)}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xs text-gray-500">df₁</div>
                <div className="text-lg font-bold text-blue-600">{result.df1}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xs text-gray-500">df₂</div>
                <div className="text-lg font-bold text-blue-600">{result.df2}</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono whitespace-pre-wrap">{result.formula}</div>
            <CopyToClipboard text={`F-Statistic: ${result.fStat.toFixed(6)}\ndf1: ${result.df1}\ndf2: ${result.df2}\n${result.formula}`} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
