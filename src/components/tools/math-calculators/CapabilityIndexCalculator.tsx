'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CapabilityIndexCalculator - Calculates process capability indices (Cp, Cpk, Pp, Ppk).
 * Used in Six Sigma and quality control to measure process performance.
 */
export default function CapabilityIndexCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [usl, setUsl] = useState('');
  const [lsl, setLsl] = useState('');
  const [mean, setMean] = useState('');
  const [stdDev, setStdDev] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    cp: number;
    cpk: number;
    cpu: number;
    cpl: number;
    sigmaLevel: number;
    ppm: number;
  } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const uslVal = parseFloat(usl);
    const lslVal = parseFloat(lsl);
    const meanVal = parseFloat(mean);
    const stdVal = parseFloat(stdDev);

    if (!usl.trim() || isNaN(uslVal)) newErrors.usl = 'Enter a valid number';
    if (!lsl.trim() || isNaN(lslVal)) newErrors.lsl = 'Enter a valid number';
    if (!mean.trim() || isNaN(meanVal)) newErrors.mean = 'Enter a valid number';
    if (!stdDev.trim() || isNaN(stdVal)) newErrors.stdDev = 'Enter a valid number';
    else if (stdVal <= 0) newErrors.stdDev = 'Standard deviation must be positive';

    if (!newErrors.usl && !newErrors.lsl && uslVal <= lslVal) {
      newErrors.usl = 'USL must be greater than LSL';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});

    // Cp = (USL - LSL) / (6 * sigma)
    const cp = (uslVal - lslVal) / (6 * stdVal);

    // CPU = (USL - mean) / (3 * sigma)
    const cpu = (uslVal - meanVal) / (3 * stdVal);

    // CPL = (mean - LSL) / (3 * sigma)
    const cpl = (meanVal - lslVal) / (3 * stdVal);

    // Cpk = min(CPU, CPL)
    const cpk = Math.min(cpu, cpl);

    // Sigma level approximation
    const sigmaLevel = cpk * 3;

    // PPM (parts per million) defective - approximation
    const zUpper = (uslVal - meanVal) / stdVal;
    const zLower = (meanVal - lslVal) / stdVal;
    // Using approximation for normal distribution tail
    const normalCDF = (z: number): number => {
      const t = 1 / (1 + 0.2316419 * Math.abs(z));
      const d = 0.3989422804 * Math.exp(-z * z / 2);
      const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
      return z > 0 ? 1 - p : p;
    };
    const ppm = ((1 - normalCDF(zUpper)) + normalCDF(-zLower)) * 1000000;

    setResult({ cp, cpk, cpu, cpl, sigmaLevel, ppm });
  };

  const getCapabilityColor = (value: number): string => {
    if (value >= 1.67) return 'text-green-600';
    if (value >= 1.33) return 'text-blue-600';
    if (value >= 1.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCapabilityLabel = (value: number): string => {
    if (value >= 1.67) return 'Excellent';
    if (value >= 1.33) return 'Good';
    if (value >= 1.0) return 'Marginal';
    return 'Poor';
  };

  const copyText = result
    ? `Process Capability Analysis\nCp: ${result.cp.toFixed(4)}\nCpk: ${result.cpk.toFixed(4)}\nCPU: ${result.cpu.toFixed(4)}\nCPL: ${result.cpl.toFixed(4)}\nSigma Level: ${result.sigmaLevel.toFixed(2)}\nEstimated PPM Defective: ${result.ppm.toFixed(1)}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-2 gap-4">
        <InputArea error={errors.usl}>
          <label htmlFor={`${toolId}-usl`} className="block text-sm font-medium text-gray-700 mb-1">
            Upper Spec Limit (USL)
          </label>
          <input
            id={`${toolId}-usl`}
            type="text"
            inputMode="decimal"
            value={usl}
            onChange={(e) => { setUsl(e.target.value); if (errors.usl) setErrors(prev => ({ ...prev, usl: '' })); }}
            placeholder="e.g. 10.5"
            aria-label={`Upper specification limit for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea error={errors.lsl}>
          <label htmlFor={`${toolId}-lsl`} className="block text-sm font-medium text-gray-700 mb-1">
            Lower Spec Limit (LSL)
          </label>
          <input
            id={`${toolId}-lsl`}
            type="text"
            inputMode="decimal"
            value={lsl}
            onChange={(e) => { setLsl(e.target.value); if (errors.lsl) setErrors(prev => ({ ...prev, lsl: '' })); }}
            placeholder="e.g. 9.5"
            aria-label={`Lower specification limit for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea error={errors.mean}>
          <label htmlFor={`${toolId}-mean`} className="block text-sm font-medium text-gray-700 mb-1">
            Process Mean (X̄)
          </label>
          <input
            id={`${toolId}-mean`}
            type="text"
            inputMode="decimal"
            value={mean}
            onChange={(e) => { setMean(e.target.value); if (errors.mean) setErrors(prev => ({ ...prev, mean: '' })); }}
            placeholder="e.g. 10.0"
            aria-label={`Process mean for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea error={errors.stdDev}>
          <label htmlFor={`${toolId}-std`} className="block text-sm font-medium text-gray-700 mb-1">
            Standard Deviation (σ)
          </label>
          <input
            id={`${toolId}-std`}
            type="text"
            inputMode="decimal"
            value={stdDev}
            onChange={(e) => { setStdDev(e.target.value); if (errors.stdDev) setErrors(prev => ({ ...prev, stdDev: '' })); }}
            placeholder="e.g. 0.15"
            aria-label={`Standard deviation for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate capability indices" className="btn-primary">
        Calculate Capability
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className={`text-2xl font-bold ${getCapabilityColor(result.cp)}`}>{result.cp.toFixed(4)}</div>
                <div className="text-xs text-gray-500">Cp</div>
                <div className={`text-xs ${getCapabilityColor(result.cp)}`}>{getCapabilityLabel(result.cp)}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className={`text-2xl font-bold ${getCapabilityColor(result.cpk)}`}>{result.cpk.toFixed(4)}</div>
                <div className="text-xs text-gray-500">Cpk</div>
                <div className={`text-xs ${getCapabilityColor(result.cpk)}`}>{getCapabilityLabel(result.cpk)}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.cpu.toFixed(4)}</div>
                <div className="text-xs text-gray-500">CPU</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.cpl.toFixed(4)}</div>
                <div className="text-xs text-gray-500">CPL</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-purple-600">{result.sigmaLevel.toFixed(2)}σ</div>
                <div className="text-xs text-gray-500">Sigma Level</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-orange-600">{result.ppm.toFixed(1)}</div>
                <div className="text-xs text-gray-500">Est. PPM Defective</div>
              </div>
            </div>
            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p><strong>Cp</strong> = (USL - LSL) / (6σ) — Process potential</p>
              <p><strong>Cpk</strong> = min(CPU, CPL) — Process capability accounting for centering</p>
              <p>Cpk ≥ 1.33 is generally considered acceptable; ≥ 1.67 is excellent.</p>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
