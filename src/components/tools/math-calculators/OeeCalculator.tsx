'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * OeeCalculator - Calculate Overall Equipment Effectiveness (OEE).
 * OEE = Availability × Performance × Quality
 */
export default function OeeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [plannedTime, setPlannedTime] = useState('');
  const [runTime, setRunTime] = useState('');
  const [idealCycleTime, setIdealCycleTime] = useState('');
  const [totalCount, setTotalCount] = useState('');
  const [goodCount, setGoodCount] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ availability: number; performance: number; quality: number; oee: number } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const planned = parseFloat(plannedTime);
    const run = parseFloat(runTime);
    const ideal = parseFloat(idealCycleTime);
    const total = parseFloat(totalCount);
    const good = parseFloat(goodCount);

    if (isNaN(planned) || planned <= 0) newErrors.plannedTime = 'Enter valid planned production time';
    if (isNaN(run) || run < 0) newErrors.runTime = 'Enter valid run time';
    if (isNaN(ideal) || ideal <= 0) newErrors.idealCycleTime = 'Enter valid ideal cycle time';
    if (isNaN(total) || total < 0) newErrors.totalCount = 'Enter valid total count';
    if (isNaN(good) || good < 0) newErrors.goodCount = 'Enter valid good count';

    if (!isNaN(run) && !isNaN(planned) && run > planned) newErrors.runTime = 'Run time cannot exceed planned time';
    if (!isNaN(good) && !isNaN(total) && good > total) newErrors.goodCount = 'Good count cannot exceed total count';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});
    const availability = (run / planned) * 100;
    const performance = ((ideal * total) / run) * 100;
    const quality = (good / total) * 100;
    const oee = (availability / 100) * (performance / 100) * (quality / 100) * 100;

    setResult({ availability, performance, quality, oee });
  };

  const getOeeClass = (value: number) => {
    if (value >= 85) return 'text-green-600';
    if (value >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const copyText = result
    ? `OEE: ${result.oee.toFixed(2)}%\nAvailability: ${result.availability.toFixed(2)}%\nPerformance: ${result.performance.toFixed(2)}%\nQuality: ${result.quality.toFixed(2)}%`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea error={errors.plannedTime}>
          <label htmlFor={`${toolId}-planned`} className="block text-sm font-medium text-gray-700 mb-1">
            Planned Production Time (minutes)
          </label>
          <input
            id={`${toolId}-planned`}
            type="text"
            inputMode="decimal"
            value={plannedTime}
            onChange={(e) => { setPlannedTime(e.target.value); if (errors.plannedTime) setErrors(prev => ({ ...prev, plannedTime: '' })); }}
            placeholder="e.g. 480"
            aria-label={`Planned production time for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea error={errors.runTime}>
          <label htmlFor={`${toolId}-run`} className="block text-sm font-medium text-gray-700 mb-1">
            Actual Run Time (minutes)
          </label>
          <input
            id={`${toolId}-run`}
            type="text"
            inputMode="decimal"
            value={runTime}
            onChange={(e) => { setRunTime(e.target.value); if (errors.runTime) setErrors(prev => ({ ...prev, runTime: '' })); }}
            placeholder="e.g. 420"
            aria-label={`Run time for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea error={errors.idealCycleTime}>
          <label htmlFor={`${toolId}-cycle`} className="block text-sm font-medium text-gray-700 mb-1">
            Ideal Cycle Time (minutes per piece)
          </label>
          <input
            id={`${toolId}-cycle`}
            type="text"
            inputMode="decimal"
            value={idealCycleTime}
            onChange={(e) => { setIdealCycleTime(e.target.value); if (errors.idealCycleTime) setErrors(prev => ({ ...prev, idealCycleTime: '' })); }}
            placeholder="e.g. 1.0"
            aria-label={`Ideal cycle time for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea error={errors.totalCount}>
          <label htmlFor={`${toolId}-total`} className="block text-sm font-medium text-gray-700 mb-1">
            Total Pieces Produced
          </label>
          <input
            id={`${toolId}-total`}
            type="text"
            inputMode="numeric"
            value={totalCount}
            onChange={(e) => { setTotalCount(e.target.value); if (errors.totalCount) setErrors(prev => ({ ...prev, totalCount: '' })); }}
            placeholder="e.g. 400"
            aria-label={`Total count for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea error={errors.goodCount}>
          <label htmlFor={`${toolId}-good`} className="block text-sm font-medium text-gray-700 mb-1">
            Good Pieces (no defects)
          </label>
          <input
            id={`${toolId}-good`}
            type="text"
            inputMode="numeric"
            value={goodCount}
            onChange={(e) => { setGoodCount(e.target.value); if (errors.goodCount) setErrors(prev => ({ ...prev, goodCount: '' })); }}
            placeholder="e.g. 380"
            aria-label={`Good count for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate OEE" className="btn-primary">
        Calculate OEE
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center col-span-2">
                <div className={`text-3xl font-bold ${getOeeClass(result.oee)}`}>
                  {result.oee.toFixed(2)}%
                </div>
                <div className="text-xs text-gray-500 mt-1">Overall Equipment Effectiveness (OEE)</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.availability.toFixed(2)}%</div>
                <div className="text-xs text-gray-500 mt-1">Availability</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.performance.toFixed(2)}%</div>
                <div className="text-xs text-gray-500 mt-1">Performance</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center col-span-2">
                <div className="text-xl font-bold text-blue-600">{result.quality.toFixed(2)}%</div>
                <div className="text-xs text-gray-500 mt-1">Quality</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              OEE = Availability × Performance × Quality = {result.availability.toFixed(1)}% × {result.performance.toFixed(1)}% × {result.quality.toFixed(1)}% = {result.oee.toFixed(2)}%
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
