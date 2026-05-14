'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AngularVelocityCalculator - Calculates angular velocity using ω = Δθ/Δt
 */
export default function AngularVelocityCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [angleChange, setAngleChange] = useState('');
  const [timeChange, setTimeChange] = useState('');
  const [angleUnit, setAngleUnit] = useState<'rad' | 'deg'>('rad');
  const [result, setResult] = useState<{ omega: number; rpm: number; formula: string } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function calculate() {
    setError(undefined);
    setResult(null);

    const theta = parseFloat(angleChange);
    const dt = parseFloat(timeChange);

    if (isNaN(theta) || isNaN(dt)) {
      setError('Please enter valid numeric values');
      return;
    }
    if (dt <= 0) {
      setError('Time interval must be positive');
      return;
    }

    let thetaRad = theta;
    if (angleUnit === 'deg') {
      thetaRad = (theta * Math.PI) / 180;
    }

    const omega = thetaRad / dt;
    const rpm = (omega * 60) / (2 * Math.PI);
    const formula = `ω = Δθ/Δt = ${thetaRad.toFixed(4)} rad / ${dt} s = ${omega.toFixed(4)} rad/s`;

    setResult({ omega, rpm, formula });
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-angle`} className="block text-sm font-medium text-gray-700 mb-1">Angular Displacement</label>
        <div className="flex gap-2">
          <input id={`${toolId}-angle`} type="number" value={angleChange} onChange={(e) => setAngleChange(e.target.value)} placeholder="Enter angle change" aria-label={`Angular displacement input for ${toolName}`} className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <select value={angleUnit} onChange={(e) => setAngleUnit(e.target.value as 'rad' | 'deg')} aria-label={`Angle unit for ${toolName}`} className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="rad">Radians</option>
            <option value="deg">Degrees</option>
          </select>
        </div>
        <label htmlFor={`${toolId}-time`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Time Interval (s)</label>
        <input id={`${toolId}-time`} type="number" value={timeChange} onChange={(e) => setTimeChange(e.target.value)} placeholder="Enter time in seconds" aria-label={`Time interval input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </InputArea>

      <button onClick={calculate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Calculate</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="text-lg font-semibold text-gray-800">Angular Velocity: {result.omega.toFixed(4)} rad/s</div>
            <div className="text-md text-gray-700">RPM: {result.rpm.toFixed(2)}</div>
            <div className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-200 font-mono">{result.formula}</div>
            <CopyToClipboard text={`ω = ${result.omega.toFixed(4)} rad/s (${result.rpm.toFixed(2)} RPM)`} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
