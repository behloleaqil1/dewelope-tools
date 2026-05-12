'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SundialTimeCalculator - Calculate sundial shadow angle for a given time and latitude.
 * Uses the hour angle formula: tan(θ) = sin(latitude) × tan(hour_angle)
 */
export default function SundialTimeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [hour, setHour] = useState('14');
  const [minute, setMinute] = useState('30');
  const [latitude, setLatitude] = useState('40');
  const [longitude, setLongitude] = useState('-74');
  const [timezone, setTimezone] = useState('-5');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const h = parseInt(hour);
    const m = parseInt(minute);
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const tz = parseFloat(timezone);

    if (isNaN(h) || isNaN(m) || isNaN(lat) || isNaN(lng) || isNaN(tz)) {
      setOutput('Please enter valid values for all fields.');
      return;
    }

    // Convert clock time to solar time
    const clockDecimal = h + m / 60;
    // Equation of time approximation (simplified, using day 172 = summer solstice)
    const eot = 0; // simplified - could add day-of-year input for accuracy
    const longitudeCorrection = (lng - tz * 15) * 4 / 60; // in hours
    const solarTime = clockDecimal + longitudeCorrection + eot / 60;

    // Hour angle: 15° per hour from solar noon
    const hourAngle = (solarTime - 12) * 15;
    const hourAngleRad = hourAngle * Math.PI / 180;
    const latRad = lat * Math.PI / 180;

    // Shadow angle on horizontal sundial
    const shadowAngleRad = Math.atan(Math.sin(latRad) * Math.tan(hourAngleRad));
    const shadowAngle = shadowAngleRad * 180 / Math.PI;

    // Sun altitude (simplified)
    const declination = 23.44 * Math.sin((284 + 172) * 360 / 365 * Math.PI / 180);
    const decRad = declination * Math.PI / 180;
    const altitude = Math.asin(
      Math.sin(latRad) * Math.sin(decRad) +
      Math.cos(latRad) * Math.cos(decRad) * Math.cos(hourAngleRad)
    ) * 180 / Math.PI;

    const results = [
      `=== Sundial Shadow Calculation ===`,
      ``,
      `Input:`,
      `  Clock Time: ${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`,
      `  Latitude: ${lat}°`,
      `  Longitude: ${lng}°`,
      `  Timezone: UTC${tz >= 0 ? '+' : ''}${tz}`,
      ``,
      `Solar Calculations:`,
      `  Longitude Correction: ${longitudeCorrection.toFixed(2)} hours`,
      `  Solar Time: ${solarTime.toFixed(2)} (decimal hours)`,
      `  Hour Angle: ${hourAngle.toFixed(2)}°`,
      ``,
      `Sundial Results:`,
      `  Shadow Angle (from noon line): ${shadowAngle.toFixed(2)}°`,
      `  Direction: ${shadowAngle > 0 ? 'West of noon' : shadowAngle < 0 ? 'East of noon' : 'At noon line'}`,
      `  Approximate Sun Altitude: ${altitude.toFixed(2)}°`,
      ``,
      `Formula: tan(θ) = sin(φ) × tan(H)`,
      `  where φ = latitude, H = hour angle`,
      `  θ = arctan(sin(${lat}°) × tan(${hourAngle.toFixed(2)}°))`,
      `  θ = ${shadowAngle.toFixed(2)}°`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-hour`} className="block text-sm font-medium text-gray-700 mb-1">Hour (0-23)</label>
            <input id={`${toolId}-hour`} type="number" min="0" max="23" value={hour} onChange={(e) => setHour(e.target.value)} aria-label={`Hour for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-minute`} className="block text-sm font-medium text-gray-700 mb-1">Minute (0-59)</label>
            <input id={`${toolId}-minute`} type="number" min="0" max="59" value={minute} onChange={(e) => setMinute(e.target.value)} aria-label="Minute" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-lat`} className="block text-sm font-medium text-gray-700 mb-1">Latitude (°)</label>
            <input id={`${toolId}-lat`} type="number" step="0.1" value={latitude} onChange={(e) => setLatitude(e.target.value)} placeholder="40" aria-label="Latitude in degrees" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-lng`} className="block text-sm font-medium text-gray-700 mb-1">Longitude (°)</label>
            <input id={`${toolId}-lng`} type="number" step="0.1" value={longitude} onChange={(e) => setLongitude(e.target.value)} placeholder="-74" aria-label="Longitude in degrees" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-tz`} className="block text-sm font-medium text-gray-700 mb-1">Timezone (UTC offset)</label>
            <input id={`${toolId}-tz`} type="number" step="0.5" value={timezone} onChange={(e) => setTimezone(e.target.value)} placeholder="-5" aria-label="Timezone UTC offset" className="input-field" />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate Shadow Angle</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
