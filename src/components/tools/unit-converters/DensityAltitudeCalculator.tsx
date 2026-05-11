'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * DensityAltitudeCalculator - Calculate density altitude from pressure altitude, temperature, and humidity.
 * Used in aviation to determine aircraft performance.
 */
export default function DensityAltitudeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [temperature, setTemperature] = useState('');
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');
  const [dewpoint, setDewpoint] = useState('');
  const [altimeterSetting, setAltimeterSetting] = useState('29.92');
  const [fieldElevation, setFieldElevation] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ densityAltitude: number; pressureAltitude: number; standardTemp: number; tempDeviation: number } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};

    const elev = parseFloat(fieldElevation);
    if (isNaN(elev)) newErrors.fieldElevation = 'Enter a valid field elevation in feet';

    const temp = parseFloat(temperature);
    if (isNaN(temp)) newErrors.temperature = 'Enter a valid temperature';

    const altimeter = parseFloat(altimeterSetting);
    if (isNaN(altimeter) || altimeter < 25 || altimeter > 35) newErrors.altimeterSetting = 'Enter a valid altimeter setting (inHg)';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});

    // Convert temperature to Celsius if needed
    const tempC = tempUnit === 'F' ? (temp - 32) * 5 / 9 : temp;

    // Pressure altitude = Field Elevation + (29.92 - altimeter) × 1000
    const pressureAltitude = elev + (29.92 - altimeter) * 1000;

    // Standard temperature at pressure altitude: 15 - (2 × PA/1000)
    const standardTemp = 15 - (2 * pressureAltitude / 1000);
    const tempDeviation = tempC - standardTemp;

    // Density altitude = Pressure Altitude + (120 × (OAT - ISA temp))
    let densityAltitude = pressureAltitude + (120 * tempDeviation);

    // Humidity correction if dewpoint provided
    const dp = parseFloat(dewpoint);
    if (!isNaN(dp)) {
      const dpC = tempUnit === 'F' ? (dp - 32) * 5 / 9 : dp;
      // Approximate humidity correction
      const vaporPressure = 6.11 * Math.pow(10, (7.5 * dpC) / (237.3 + dpC));
      const satVaporPressure = 6.11 * Math.pow(10, (7.5 * tempC) / (237.3 + tempC));
      const relativeHumidity = (vaporPressure / satVaporPressure) * 100;
      // Add ~60ft per 10% humidity above 0%
      densityAltitude += (relativeHumidity / 10) * 60;
    }

    setResult({
      densityAltitude: Math.round(densityAltitude),
      pressureAltitude: Math.round(pressureAltitude),
      standardTemp: Math.round(standardTemp * 10) / 10,
      tempDeviation: Math.round(tempDeviation * 10) / 10,
    });
  };

  const copyText = result
    ? `Density Altitude: ${result.densityAltitude} ft\nPressure Altitude: ${result.pressureAltitude} ft\nStandard Temp (ISA): ${result.standardTemp}°C\nTemp Deviation: ${result.tempDeviation > 0 ? '+' : ''}${result.tempDeviation}°C`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea error={errors.fieldElevation}>
          <label htmlFor={`${toolId}-elev`} className="block text-sm font-medium text-gray-700 mb-1">Field Elevation (ft)</label>
          <input
            id={`${toolId}-elev`}
            type="text"
            inputMode="decimal"
            value={fieldElevation}
            onChange={(e) => { setFieldElevation(e.target.value); if (errors.fieldElevation) setErrors((prev) => ({ ...prev, fieldElevation: '' })); }}
            placeholder="e.g. 5000"
            aria-label={`Field elevation for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea error={errors.temperature}>
          <label htmlFor={`${toolId}-temp`} className="block text-sm font-medium text-gray-700 mb-1">Outside Air Temperature (OAT)</label>
          <div className="flex gap-2">
            <input
              id={`${toolId}-temp`}
              type="text"
              inputMode="decimal"
              value={temperature}
              onChange={(e) => { setTemperature(e.target.value); if (errors.temperature) setErrors((prev) => ({ ...prev, temperature: '' })); }}
              placeholder="e.g. 30"
              aria-label="Outside air temperature"
              className="input-field flex-1"
            />
            <select value={tempUnit} onChange={(e) => setTempUnit(e.target.value as 'C' | 'F')} className="input-field w-16 text-sm" aria-label="Temperature unit">
              <option value="C">°C</option>
              <option value="F">°F</option>
            </select>
          </div>
        </InputArea>

        <InputArea error={errors.altimeterSetting}>
          <label htmlFor={`${toolId}-altimeter`} className="block text-sm font-medium text-gray-700 mb-1">Altimeter Setting (inHg)</label>
          <input
            id={`${toolId}-altimeter`}
            type="text"
            inputMode="decimal"
            value={altimeterSetting}
            onChange={(e) => { setAltimeterSetting(e.target.value); if (errors.altimeterSetting) setErrors((prev) => ({ ...prev, altimeterSetting: '' })); }}
            placeholder="29.92"
            aria-label="Altimeter setting"
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-dewpoint`} className="block text-sm font-medium text-gray-700 mb-1">Dewpoint (optional, same unit as OAT)</label>
          <input
            id={`${toolId}-dewpoint`}
            type="text"
            inputMode="decimal"
            value={dewpoint}
            onChange={(e) => setDewpoint(e.target.value)}
            placeholder="e.g. 15"
            aria-label="Dewpoint temperature"
            className="input-field"
          />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate density altitude" className="btn-primary">
        Calculate Density Altitude
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-3xl font-bold text-blue-600">{result.densityAltitude.toLocaleString()} ft</div>
              <div className="text-xs text-gray-500 mt-1">Density Altitude</div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.pressureAltitude.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Pressure Alt (ft)</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.standardTemp}°C</div>
                <div className="text-xs text-gray-500">ISA Temp</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className={`text-lg font-bold ${result.tempDeviation > 0 ? 'text-red-600' : 'text-blue-600'}`}>
                  {result.tempDeviation > 0 ? '+' : ''}{result.tempDeviation}°C
                </div>
                <div className="text-xs text-gray-500">Temp Deviation</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
