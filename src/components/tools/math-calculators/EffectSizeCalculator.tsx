'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface EffectSizeResult {
  cohensD: number;
  interpretation: string;
  pooledSD: number;
  meanDiff: number;
}

/**
 * EffectSizeCalculator - Calculate Cohen's d effect size.
 * Measures the standardized difference between two group means.
 */
export default function EffectSizeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mean1, setMean1] = useState('');
  const [mean2, setMean2] = useState('');
  const [sd1, setSd1] = useState('');
  const [sd2, setSd2] = useState('');
  const [n1, setN1] = useState('');
  const [n2, setN2] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<EffectSizeResult | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const m1 = parseFloat(mean1);
    const m2 = parseFloat(mean2);
    const s1 = parseFloat(sd1);
    const s2 = parseFloat(sd2);
    const size1 = parseInt(n1) || 0;
    const size2 = parseInt(n2) || 0;

    if (isNaN(m1)) newErrors.mean1 = 'Enter a valid number';
    if (isNaN(m2)) newErrors.mean2 = 'Enter a valid number';
    if (isNaN(s1) || s1 <= 0) newErrors.sd1 = 'Enter a positive number';
    if (isNaN(s2) || s2 <= 0) newErrors.sd2 = 'Enter a positive number';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});

    // Calculate pooled standard deviation
    let pooledSD: number;
    if (size1 > 0 && size2 > 0) {
      // Weighted pooled SD
      pooledSD = Math.sqrt(((size1 - 1) * s1 * s1 + (size2 - 1) * s2 * s2) / (size1 + size2 - 2));
    } else {
      // Simple pooled SD (equal sample sizes assumed)
      pooledSD = Math.sqrt((s1 * s1 + s2 * s2) / 2);
    }

    const meanDiff = m1 - m2;
    const cohensD = pooledSD > 0 ? meanDiff / pooledSD : 0;
    const absD = Math.abs(cohensD);

    let interpretation: string;
    if (absD < 0.2) interpretation = 'Negligible';
    else if (absD < 0.5) interpretation = 'Small';
    else if (absD < 0.8) interpretation = 'Medium';
    else interpretation = 'Large';

    setResult({ cohensD, interpretation, pooledSD, meanDiff });
  };

  const copyText = result
    ? `Cohen's d Effect Size\nd = ${result.cohensD.toFixed(4)}\nInterpretation: ${result.interpretation}\nMean Difference: ${result.meanDiff.toFixed(4)}\nPooled SD: ${result.pooledSD.toFixed(4)}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputArea error={errors.mean1}>
          <label htmlFor={`${toolId}-m1`} className="block text-sm font-medium text-gray-700 mb-1">Group 1 Mean</label>
          <input id={`${toolId}-m1`} type="text" inputMode="decimal" value={mean1} onChange={(e) => { setMean1(e.target.value); if (errors.mean1) setErrors((p) => ({ ...p, mean1: '' })); }} placeholder="e.g. 75.5" aria-label={`Group 1 mean for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea error={errors.mean2}>
          <label htmlFor={`${toolId}-m2`} className="block text-sm font-medium text-gray-700 mb-1">Group 2 Mean</label>
          <input id={`${toolId}-m2`} type="text" inputMode="decimal" value={mean2} onChange={(e) => { setMean2(e.target.value); if (errors.mean2) setErrors((p) => ({ ...p, mean2: '' })); }} placeholder="e.g. 70.2" aria-label={`Group 2 mean for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea error={errors.sd1}>
          <label htmlFor={`${toolId}-sd1`} className="block text-sm font-medium text-gray-700 mb-1">Group 1 SD</label>
          <input id={`${toolId}-sd1`} type="text" inputMode="decimal" value={sd1} onChange={(e) => { setSd1(e.target.value); if (errors.sd1) setErrors((p) => ({ ...p, sd1: '' })); }} placeholder="e.g. 10" aria-label={`Group 1 standard deviation for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea error={errors.sd2}>
          <label htmlFor={`${toolId}-sd2`} className="block text-sm font-medium text-gray-700 mb-1">Group 2 SD</label>
          <input id={`${toolId}-sd2`} type="text" inputMode="decimal" value={sd2} onChange={(e) => { setSd2(e.target.value); if (errors.sd2) setErrors((p) => ({ ...p, sd2: '' })); }} placeholder="e.g. 12" aria-label={`Group 2 standard deviation for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-n1`} className="block text-sm font-medium text-gray-700 mb-1">Group 1 Size (optional)</label>
          <input id={`${toolId}-n1`} type="text" inputMode="numeric" value={n1} onChange={(e) => setN1(e.target.value)} placeholder="e.g. 30" aria-label={`Group 1 size for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-n2`} className="block text-sm font-medium text-gray-700 mb-1">Group 2 Size (optional)</label>
          <input id={`${toolId}-n2`} type="text" inputMode="numeric" value={n2} onChange={(e) => setN2(e.target.value)} placeholder="e.g. 30" aria-label={`Group 2 size for ${toolName}`} className="input-field" />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate effect size" className="btn-primary">
        Calculate Cohen&apos;s d
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.cohensD.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Cohen&apos;s d</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className={`text-xl font-bold ${Math.abs(result.cohensD) >= 0.8 ? 'text-red-600' : Math.abs(result.cohensD) >= 0.5 ? 'text-orange-600' : Math.abs(result.cohensD) >= 0.2 ? 'text-yellow-600' : 'text-green-600'}`}>
                  {result.interpretation}
                </div>
                <div className="text-xs text-gray-500 mt-1">Effect Size</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-700">{result.meanDiff.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Mean Difference</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-700">{result.pooledSD.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Pooled SD</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <strong>Interpretation guide:</strong> |d| &lt; 0.2 = Negligible, 0.2-0.5 = Small, 0.5-0.8 = Medium, &gt; 0.8 = Large
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
