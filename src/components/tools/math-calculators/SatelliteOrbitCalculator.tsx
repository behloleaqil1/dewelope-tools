'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SatelliteOrbitCalculator - Calculate satellite orbital parameters including
 * period, velocity, altitude effects, and ground track repeat.
 */
export default function SatelliteOrbitCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [altitude, setAltitude] = useState('400');
  const [inclination, setInclination] = useState('51.6');
  const [eccentricity, setEccentricity] = useState('0');
  const [orbitType, setOrbitType] = useState('leo');
  const [output, setOutput] = useState('');

  const orbitTypes = [
    { value: 'leo', label: 'Low Earth Orbit (LEO)' },
    { value: 'meo', label: 'Medium Earth Orbit (MEO)' },
    { value: 'geo', label: 'Geostationary (GEO)' },
    { value: 'sso', label: 'Sun-Synchronous (SSO)' },
    { value: 'heo', label: 'Highly Elliptical (HEO)' },
  ];

  const calculate = () => {
    const alt = parseFloat(altitude);
    const inc = parseFloat(inclination);
    const ecc = parseFloat(eccentricity);

    if (isNaN(alt) || isNaN(inc) || isNaN(ecc) || alt < 0) {
      setOutput('Please enter valid orbital parameters.');
      return;
    }

    const G = 6.674e-11; // gravitational constant
    const M = 5.972e24; // Earth mass (kg)
    const R = 6371; // Earth radius (km)
    const mu = G * M; // standard gravitational parameter

    const semiMajorAxis = (R + alt) * 1000; // meters
    const period = 2 * Math.PI * Math.sqrt(Math.pow(semiMajorAxis, 3) / mu);
    const periodMin = period / 60;
    const periodHrs = period / 3600;

    const velocity = Math.sqrt(mu / semiMajorAxis);
    const velocityKms = velocity / 1000;

    // Apogee and perigee for elliptical orbits
    const apogee = semiMajorAxis * (1 + ecc) / 1000 - R;
    const perigee = semiMajorAxis * (1 - ecc) / 1000 - R;

    // Orbital energy
    const specificEnergy = -mu / (2 * semiMajorAxis);

    // Ground track repeat
    const orbitsPerDay = 86400 / period;
    const groundTrackRepeat = Math.round(orbitsPerDay);

    // Visibility from ground (simplified)
    const horizonAngle = Math.acos(R / (R + alt)) * (180 / Math.PI);
    const footprintRadius = R * horizonAngle * (Math.PI / 180);

    // Atmospheric drag estimate (very simplified)
    const dragLife = alt < 200 ? '< 1 week' :
                    alt < 300 ? '~months' :
                    alt < 400 ? '~1-2 years' :
                    alt < 600 ? '~5-10 years' :
                    alt < 800 ? '~25+ years' : '> 100 years';

    const results = [
      `=== Satellite Orbital Parameters ===`,
      ``,
      `Input:`,
      `  Altitude: ${alt} km`,
      `  Inclination: ${inc}°`,
      `  Eccentricity: ${ecc}`,
      `  Orbit Type: ${orbitTypes.find(o => o.value === orbitType)?.label}`,
      ``,
      `Orbital Elements:`,
      `  Semi-major Axis: ${(semiMajorAxis / 1000).toFixed(2)} km`,
      `  Apogee Altitude: ${apogee.toFixed(2)} km`,
      `  Perigee Altitude: ${perigee.toFixed(2)} km`,
      ``,
      `Dynamics:`,
      `  Orbital Period: ${periodMin.toFixed(2)} min (${periodHrs.toFixed(4)} hrs)`,
      `  Orbital Velocity: ${velocityKms.toFixed(3)} km/s (${(velocityKms * 3600).toFixed(0)} km/h)`,
      `  Orbits per Day: ${orbitsPerDay.toFixed(3)}`,
      `  Specific Energy: ${(specificEnergy / 1e6).toFixed(3)} MJ/kg`,
      ``,
      `Coverage:`,
      `  Horizon Angle: ${horizonAngle.toFixed(2)}°`,
      `  Footprint Radius: ${footprintRadius.toFixed(1)} km`,
      `  Ground Track Repeat: ~${groundTrackRepeat} orbits/day`,
      ``,
      `Lifetime:`,
      `  Estimated Orbital Decay: ${dragLife}`,
      ``,
      `Notes:`,
      `  - GEO altitude is ~35,786 km (period = 24 hrs)`,
      `  - ISS orbits at ~408 km, 51.6° inclination`,
      `  - Values assume spherical Earth model`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-alt`} className="block text-sm font-medium text-gray-700 mb-1">Altitude (km)</label>
              <input id={`${toolId}-alt`} type="number" min="0" max="100000" value={altitude} onChange={(e) => setAltitude(e.target.value)} aria-label={`Orbital altitude for ${toolName}`} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-inc`} className="block text-sm font-medium text-gray-700 mb-1">Inclination (°)</label>
              <input id={`${toolId}-inc`} type="number" min="0" max="180" step="0.1" value={inclination} onChange={(e) => setInclination(e.target.value)} aria-label="Orbital inclination" className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-ecc`} className="block text-sm font-medium text-gray-700 mb-1">Eccentricity</label>
              <input id={`${toolId}-ecc`} type="number" min="0" max="0.99" step="0.01" value={eccentricity} onChange={(e) => setEccentricity(e.target.value)} aria-label="Orbital eccentricity" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">Orbit Type</label>
              <select id={`${toolId}-type`} value={orbitType} onChange={(e) => setOrbitType(e.target.value)} aria-label="Orbit type" className="input-field">
                {orbitTypes.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
          <button onClick={calculate} className="btn-primary w-full">Calculate Orbital Parameters</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Orbital Parameters</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
