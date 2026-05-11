'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PaceCalculator - Calculate running/walking pace from distance and time.
 * Supports min/km and min/mile output with speed in km/h and mph.
 */
export default function PaceCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [distance, setDistance] = useState('');
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'miles'>('km');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    pacePerKm: string;
    pacePerMile: string;
    speedKmh: string;
    speedMph: string;
    totalTime: string;
  } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};

    const dist = parseFloat(distance);
    if (!distance.trim() || isNaN(dist) || dist <= 0) {
      newErrors.distance = 'Please enter a valid positive distance';
    }

    const h = parseInt(hours || '0', 10);
    const m = parseInt(minutes || '0', 10);
    const s = parseInt(seconds || '0', 10);
    const totalSeconds = h * 3600 + m * 60 + s;

    if (totalSeconds <= 0) {
      newErrors.time = 'Please enter a valid time greater than zero';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});

    const distKm = distanceUnit === 'km' ? dist : dist * 1.60934;
    const distMiles = distanceUnit === 'miles' ? dist : dist / 1.60934;

    const totalMinutes = totalSeconds / 60;

    const pacePerKmMin = totalMinutes / distKm;
    const pacePerMileMin = totalMinutes / distMiles;

    const formatPace = (paceMin: number): string => {
      const mins = Math.floor(paceMin);
      const secs = Math.round((paceMin - mins) * 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const speedKmh = (distKm / (totalSeconds / 3600)).toFixed(2);
    const speedMph = (distMiles / (totalSeconds / 3600)).toFixed(2);

    const formatTime = (): string => {
      const parts: string[] = [];
      if (h > 0) parts.push(`${h}h`);
      if (m > 0) parts.push(`${m}m`);
      if (s > 0) parts.push(`${s}s`);
      return parts.join(' ') || '0s';
    };

    setResult({
      pacePerKm: formatPace(pacePerKmMin),
      pacePerMile: formatPace(pacePerMileMin),
      speedKmh,
      speedMph,
      totalTime: formatTime(),
    });
  };

  const copyText = result
    ? `Pace: ${result.pacePerKm} min/km | ${result.pacePerMile} min/mile\nSpeed: ${result.speedKmh} km/h | ${result.speedMph} mph\nDistance: ${distance} ${distanceUnit}\nTime: ${result.totalTime}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputArea error={errors.distance}>
          <label htmlFor={`${toolId}-distance`} className="block text-sm font-medium text-gray-700 mb-1">
            Distance
          </label>
          <div className="flex gap-2">
            <input
              id={`${toolId}-distance`}
              type="text"
              inputMode="decimal"
              value={distance}
              onChange={(e) => { setDistance(e.target.value); if (errors.distance) setErrors((prev) => ({ ...prev, distance: '' })); }}
              placeholder="e.g. 5"
              aria-label={`Distance for ${toolName}`}
              className="input-field flex-1"
            />
            <select
              value={distanceUnit}
              onChange={(e) => setDistanceUnit(e.target.value as 'km' | 'miles')}
              aria-label="Distance unit"
              className="input-field w-24"
            >
              <option value="km">km</option>
              <option value="miles">miles</option>
            </select>
          </div>
        </InputArea>

        <InputArea error={errors.time}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time (hh:mm:ss)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              value={hours}
              onChange={(e) => { setHours(e.target.value); if (errors.time) setErrors((prev) => ({ ...prev, time: '' })); }}
              placeholder="H"
              aria-label="Hours"
              className="input-field w-16 text-center"
            />
            <span className="self-center text-gray-500">:</span>
            <input
              type="number"
              min="0"
              max="59"
              value={minutes}
              onChange={(e) => { setMinutes(e.target.value); if (errors.time) setErrors((prev) => ({ ...prev, time: '' })); }}
              placeholder="M"
              aria-label="Minutes"
              className="input-field w-16 text-center"
            />
            <span className="self-center text-gray-500">:</span>
            <input
              type="number"
              min="0"
              max="59"
              value={seconds}
              onChange={(e) => { setSeconds(e.target.value); if (errors.time) setErrors((prev) => ({ ...prev, time: '' })); }}
              placeholder="S"
              aria-label="Seconds"
              className="input-field w-16 text-center"
            />
          </div>
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate pace" className="btn-primary">
        Calculate Pace
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.pacePerKm}</div>
                <div className="text-xs text-gray-500 mt-1">min/km</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">{result.pacePerMile}</div>
                <div className="text-xs text-gray-500 mt-1">min/mile</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-purple-600">{result.speedKmh}</div>
                <div className="text-xs text-gray-500 mt-1">km/h</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-orange-600">{result.speedMph}</div>
                <div className="text-xs text-gray-500 mt-1">mph</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
