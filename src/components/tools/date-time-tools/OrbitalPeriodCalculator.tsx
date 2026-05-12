'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * OrbitalPeriodCalculator - Calculate orbital period from altitude/mass.
 * Uses Kepler's third law: T = 2π√(a³/GM) where a is semi-major axis.
 */
export default function OrbitalPeriodCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [altitude, setAltitude] = useState('400');
  const [centralBody, setCentralBody] = useState('earth');
  const [customMass, setCustomMass] = useState('');
  const [customRadius, setCustomRadius] = useState('');
  const [output, setOutput] = useState('');

  const bodies: Record<string, { name: string; mass: number; radius: number }> = {
    earth: { name: 'Earth', mass: 5.972e24, radius: 6371000 },
    moon: { name: 'Moon', mass: 7.342e22, radius: 1737400 },
    mars: { name: 'Mars', mass: 6.417e23, radius: 3389500 },
    jupiter: { name: 'Jupiter', mass: 1.898e27, radius: 69911000 },
    sun: { name: 'Sun', mass: 1.989e30, radius: 696340000 },
    venus: { name: 'Venus', mass: 4.867e24, radius: 6051800 },
    saturn: { name: 'Saturn', mass: 5.683e26, radius: 58232000 },
  };

  const G = 6.674e-11; // gravitational constant

  const calculate = () => {
    const alt = parseFloat(altitude);
    if (isNaN(alt) || alt < 0) {
      setOutput('Please enter a valid altitude (≥ 0 km).');
      return;
    }

    let mass: number;
    let radius: number;
    let bodyName: string;

    if (centralBody === 'custom') {
      mass = parseFloat(customMass);
      radius = parseFloat(customRadius) * 1000; // km to m
      bodyName = 'Custom Body';
      if (isNaN(mass) || isNaN(radius) || mass <= 0 || radius <= 0) {
        setOutput('Please enter valid mass (kg) and radius (km) for custom body.');
        return;
      }
    } else {
      const body = bodies[centralBody];
      mass = body.mass;
      radius = body.radius;
      bodyName = body.name;
    }

    const altMeters = alt * 1000; // km to m
    const semiMajorAxis = radius + altMeters;

    // Kepler's third law: T = 2π√(a³/(GM))
    const period = 2 * Math.PI * Math.sqrt(Math.pow(semiMajorAxis, 3) / (G * mass));

    // Orbital velocity: v = √(GM/a)
    const velocity = Math.sqrt((G * mass) / semiMajorAxis);

    const hours = Math.floor(period / 3600);
    const minutes = Math.floor((period % 3600) / 60);
    const seconds = period % 60;

    const days = period / 86400;
    const years = period / (365.25 * 86400);

    const lines = [
      `=== Orbital Period Calculator ===`,
      ``,
      `Central Body: ${bodyName}`,
      `  Mass: ${mass.toExponential(4)} kg`,
      `  Radius: ${(radius / 1000).toLocaleString()} km`,
      ``,
      `Orbit Altitude: ${alt.toLocaleString()} km`,
      `Semi-major Axis: ${(semiMajorAxis / 1000).toLocaleString(undefined, { maximumFractionDigits: 2 })} km`,
      ``,
      `--- Results ---`,
      `Orbital Period: ${hours}h ${minutes}m ${seconds.toFixed(1)}s`,
      `  = ${period.toFixed(2)} seconds`,
      `  = ${(period / 60).toFixed(4)} minutes`,
      `  = ${days.toFixed(6)} days`,
      years > 0.01 ? `  = ${years.toFixed(6)} years` : '',
      ``,
      `Orbital Velocity: ${velocity.toFixed(2)} m/s (${(velocity / 1000).toFixed(4)} km/s)`,
      `Orbits per Day: ${(86400 / period).toFixed(4)}`,
      ``,
      `--- Formula ---`,
      `T = 2π√(a³/GM)`,
      `T = 2π√((${(semiMajorAxis / 1000).toFixed(1)} km)³ / (G × ${mass.toExponential(3)} kg))`,
      `T = ${period.toFixed(2)} s`,
    ].filter(Boolean);

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-body`} className="block text-sm font-medium text-gray-700 mb-1">Central Body</label>
            <select id={`${toolId}-body`} value={centralBody} onChange={(e) => setCentralBody(e.target.value)} className="input-field" aria-label={`Central body for ${toolName}`}>
              {Object.entries(bodies).map(([key, val]) => (
                <option key={key} value={key}>{val.name} (R={( val.radius / 1000).toLocaleString()} km)</option>
              ))}
              <option value="custom">Custom Body</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-alt`} className="block text-sm font-medium text-gray-700 mb-1">Orbit Altitude (km above surface)</label>
            <input id={`${toolId}-alt`} type="number" value={altitude} onChange={(e) => setAltitude(e.target.value)} className="input-field" aria-label="Orbit altitude in km" />
          </div>
        </div>
        {centralBody === 'custom' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div>
              <label htmlFor={`${toolId}-mass`} className="block text-sm font-medium text-gray-700 mb-1">Body Mass (kg)</label>
              <input id={`${toolId}-mass`} type="number" value={customMass} onChange={(e) => setCustomMass(e.target.value)} placeholder="e.g. 5.972e24" className="input-field" aria-label="Custom body mass" />
            </div>
            <div>
              <label htmlFor={`${toolId}-radius`} className="block text-sm font-medium text-gray-700 mb-1">Body Radius (km)</label>
              <input id={`${toolId}-radius`} type="number" value={customRadius} onChange={(e) => setCustomRadius(e.target.value)} placeholder="e.g. 6371" className="input-field" aria-label="Custom body radius" />
            </div>
          </div>
        )}
        <button onClick={calculate} className="btn-primary mt-4">Calculate Orbital Period</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Orbital Period Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
