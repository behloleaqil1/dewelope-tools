'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SatelliteFootprintCalculator - Calculate satellite ground coverage area
 * based on orbital altitude, antenna beamwidth, and elevation angle.
 */
export default function SatelliteFootprintCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [altitude, setAltitude] = useState('550');
  const [beamwidth, setBeamwidth] = useState('45');
  const [elevationAngle, setElevationAngle] = useState('10');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const h = parseFloat(altitude);
    const bw = parseFloat(beamwidth);
    const elev = parseFloat(elevationAngle);

    if (isNaN(h) || isNaN(bw) || isNaN(elev) || h <= 0 || bw <= 0 || bw > 180 || elev < 0 || elev > 90) {
      setOutput('Please enter valid values. Altitude > 0, Beamwidth 0-180°, Elevation 0-90°.');
      return;
    }

    const R = 6371; // Earth radius in km
    const halfBeam = (bw / 2) * (Math.PI / 180);
    const elevRad = elev * (Math.PI / 180);

    // Nadir angle from satellite
    const nadirAngle = Math.asin((R / (R + h)) * Math.cos(elevRad));
    const centralAngle = (Math.PI / 2) - elevRad - nadirAngle;

    // Footprint radius on Earth surface
    const footprintRadius = R * centralAngle;

    // Beam-limited footprint
    const beamFootprintRadius = h * Math.tan(halfBeam);

    // Use the smaller of the two
    const effectiveRadius = Math.min(footprintRadius, beamFootprintRadius);
    const area = Math.PI * effectiveRadius * effectiveRadius;

    // Slant range
    const slantRange = Math.sqrt(h * h + 2 * R * h * (1 - Math.cos(centralAngle)));

    let result = `=== Satellite Footprint Calculation ===\n\n`;
    result += `Orbital Altitude: ${h} km\n`;
    result += `Antenna Beamwidth: ${bw}°\n`;
    result += `Minimum Elevation Angle: ${elev}°\n\n`;
    result += `--- Results ---\n`;
    result += `Geometric Footprint Radius: ${footprintRadius.toFixed(2)} km\n`;
    result += `Beam-Limited Radius: ${beamFootprintRadius.toFixed(2)} km\n`;
    result += `Effective Coverage Radius: ${effectiveRadius.toFixed(2)} km\n`;
    result += `Coverage Area: ${area.toFixed(2)} km²\n`;
    result += `Coverage Area: ${(area / 1e6).toFixed(4)} million km²\n`;
    result += `Slant Range: ${slantRange.toFixed(2)} km\n`;
    result += `Central Angle: ${(centralAngle * 180 / Math.PI).toFixed(2)}°\n`;
    result += `\n--- Context ---\n`;
    result += `Earth Surface Area: ~510.1 million km²\n`;
    result += `Coverage Fraction: ${((area / 510100000) * 100).toFixed(4)}%\n`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-2">{toolName}</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label htmlFor={`${toolId}-alt`} className="block text-xs text-gray-600 mb-1">Altitude (km)</label>
            <input id={`${toolId}-alt`} type="number" value={altitude} onChange={(e) => setAltitude(e.target.value)} className="input-field" aria-label="Orbital altitude in km" />
          </div>
          <div>
            <label htmlFor={`${toolId}-bw`} className="block text-xs text-gray-600 mb-1">Beamwidth (°)</label>
            <input id={`${toolId}-bw`} type="number" value={beamwidth} onChange={(e) => setBeamwidth(e.target.value)} className="input-field" aria-label="Antenna beamwidth in degrees" />
          </div>
          <div>
            <label htmlFor={`${toolId}-elev`} className="block text-xs text-gray-600 mb-1">Min Elevation (°)</label>
            <input id={`${toolId}-elev`} type="number" value={elevationAngle} onChange={(e) => setElevationAngle(e.target.value)} className="input-field" aria-label="Minimum elevation angle in degrees" />
          </div>
        </div>
        <button onClick={calculate} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors" aria-label="Calculate satellite footprint">
          Calculate Footprint
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded border">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
