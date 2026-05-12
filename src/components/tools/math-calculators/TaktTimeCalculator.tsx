'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TaktTimeCalculator - Calculate Takt time for manufacturing.
 * Takt Time = Available Production Time / Customer Demand
 */
export default function TaktTimeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [availableTime, setAvailableTime] = useState('');
  const [timeUnit, setTimeUnit] = useState<'minutes' | 'hours' | 'seconds'>('minutes');
  const [demand, setDemand] = useState('');
  const [demandPeriod, setDemandPeriod] = useState<'shift' | 'day' | 'week'>('shift');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ taktTime: number; unit: string; piecesPerHour: number; piecesPerMinute: number } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const time = parseFloat(availableTime);
    const qty = parseFloat(demand);

    if (isNaN(time) || time <= 0) newErrors.availableTime = 'Enter valid available time';
    if (isNaN(qty) || qty <= 0) newErrors.demand = 'Enter valid customer demand';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});

    // Convert time to seconds
    let timeInSeconds = time;
    if (timeUnit === 'minutes') timeInSeconds = time * 60;
    else if (timeUnit === 'hours') timeInSeconds = time * 3600;

    const taktSeconds = timeInSeconds / qty;
    const piecesPerHour = 3600 / taktSeconds;
    const piecesPerMinute = 60 / taktSeconds;

    let displayTakt: number;
    let displayUnit: string;
    if (taktSeconds >= 3600) {
      displayTakt = taktSeconds / 3600;
      displayUnit = 'hours';
    } else if (taktSeconds >= 60) {
      displayTakt = taktSeconds / 60;
      displayUnit = 'minutes';
    } else {
      displayTakt = taktSeconds;
      displayUnit = 'seconds';
    }

    setResult({ taktTime: displayTakt, unit: displayUnit, piecesPerHour, piecesPerMinute });
  };

  const copyText = result
    ? `Takt Time: ${result.taktTime.toFixed(2)} ${result.unit}\nPieces per hour: ${result.piecesPerHour.toFixed(2)}\nPieces per minute: ${result.piecesPerMinute.toFixed(4)}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea error={errors.availableTime}>
          <label htmlFor={`${toolId}-time`} className="block text-sm font-medium text-gray-700 mb-1">
            Available Production Time
          </label>
          <div className="flex gap-2">
            <input
              id={`${toolId}-time`}
              type="text"
              inputMode="decimal"
              value={availableTime}
              onChange={(e) => { setAvailableTime(e.target.value); if (errors.availableTime) setErrors(prev => ({ ...prev, availableTime: '' })); }}
              placeholder="e.g. 480"
              aria-label={`Available time for ${toolName}`}
              className="input-field flex-1"
            />
            <select
              value={timeUnit}
              onChange={(e) => setTimeUnit(e.target.value as 'minutes' | 'hours' | 'seconds')}
              className="input-field w-32"
              aria-label="Time unit"
            >
              <option value="seconds">Seconds</option>
              <option value="minutes">Minutes</option>
              <option value="hours">Hours</option>
            </select>
          </div>
        </InputArea>

        <InputArea error={errors.demand}>
          <label htmlFor={`${toolId}-demand`} className="block text-sm font-medium text-gray-700 mb-1">
            Customer Demand (units per period)
          </label>
          <div className="flex gap-2">
            <input
              id={`${toolId}-demand`}
              type="text"
              inputMode="numeric"
              value={demand}
              onChange={(e) => { setDemand(e.target.value); if (errors.demand) setErrors(prev => ({ ...prev, demand: '' })); }}
              placeholder="e.g. 240"
              aria-label={`Customer demand for ${toolName}`}
              className="input-field flex-1"
            />
            <select
              value={demandPeriod}
              onChange={(e) => setDemandPeriod(e.target.value as 'shift' | 'day' | 'week')}
              className="input-field w-32"
              aria-label="Demand period"
            >
              <option value="shift">Per shift</option>
              <option value="day">Per day</option>
              <option value="week">Per week</option>
            </select>
          </div>
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate Takt time" className="btn-primary">
        Calculate Takt Time
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {result.taktTime.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500 mt-1">Takt Time ({result.unit}/piece)</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {result.piecesPerHour.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500 mt-1">Pieces/Hour</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {result.piecesPerMinute.toFixed(4)}
                </div>
                <div className="text-xs text-gray-500 mt-1">Pieces/Minute</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              Takt Time = Available Time / Customer Demand
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
