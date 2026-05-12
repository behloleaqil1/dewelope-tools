'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ProjectileMotionCalculator - Calculate projectile trajectory (range, height, time).
 */
export default function ProjectileMotionCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [velocity, setVelocity] = useState('');
  const [angle, setAngle] = useState('');
  const [height, setHeight] = useState('0');
  const [gravity, setGravity] = useState('9.81');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const v = parseFloat(velocity);
    const theta = parseFloat(angle);
    const h0 = parseFloat(height) || 0;
    const g = parseFloat(gravity) || 9.81;

    if (isNaN(v) || isNaN(theta) || v <= 0 || theta <= 0 || theta >= 90) {
      setOutput('Error: Please enter valid velocity (>0) and angle (0-90°).');
      return;
    }

    const rad = (theta * Math.PI) / 180;
    const vx = v * Math.cos(rad);
    const vy = v * Math.sin(rad);

    // Time of flight (accounting for initial height)
    const timeOfFlight = (vy + Math.sqrt(vy * vy + 2 * g * h0)) / g;

    // Maximum height
    const maxHeight = h0 + (vy * vy) / (2 * g);

    // Range
    const range = vx * timeOfFlight;

    // Time to max height
    const timeToMax = vy / g;

    const lines: string[] = [];
    lines.push('═══ Projectile Motion Results ═══');
    lines.push('');
    lines.push(`Initial velocity: ${v} m/s`);
    lines.push(`Launch angle: ${theta}°`);
    lines.push(`Initial height: ${h0} m`);
    lines.push(`Gravity: ${g} m/s²`);
    lines.push('');
    lines.push('─── Results ───');
    lines.push(`Horizontal range: ${range.toFixed(4)} m`);
    lines.push(`Maximum height: ${maxHeight.toFixed(4)} m`);
    lines.push(`Total time of flight: ${timeOfFlight.toFixed(4)} s`);
    lines.push(`Time to max height: ${timeToMax.toFixed(4)} s`);
    lines.push('');
    lines.push('─── Velocity Components ───');
    lines.push(`Horizontal (vx): ${vx.toFixed(4)} m/s`);
    lines.push(`Vertical (vy): ${vy.toFixed(4)} m/s`);
    lines.push('');
    lines.push('─── Formulas Used ───');
    lines.push(`Range = vx × t`);
    lines.push(`Max Height = h₀ + vy² / (2g)`);
    lines.push(`Time = (vy + √(vy² + 2gh₀)) / g`);

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-velocity`} className="block text-sm font-medium text-gray-700 mb-1">Initial Velocity (m/s)</label>
            <input id={`${toolId}-velocity`} type="number" value={velocity} onChange={(e) => setVelocity(e.target.value)} placeholder="50" className="input-field" aria-label={`Velocity for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-angle`} className="block text-sm font-medium text-gray-700 mb-1">Launch Angle (degrees)</label>
            <input id={`${toolId}-angle`} type="number" value={angle} onChange={(e) => setAngle(e.target.value)} placeholder="45" className="input-field" aria-label="Launch angle" />
          </div>
          <div>
            <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">Initial Height (m)</label>
            <input id={`${toolId}-height`} type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="0" className="input-field" aria-label="Initial height" />
          </div>
          <div>
            <label htmlFor={`${toolId}-gravity`} className="block text-sm font-medium text-gray-700 mb-1">Gravity (m/s²)</label>
            <input id={`${toolId}-gravity`} type="number" value={gravity} onChange={(e) => setGravity(e.target.value)} placeholder="9.81" className="input-field" aria-label="Gravity" />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate Trajectory</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Projectile Motion Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
