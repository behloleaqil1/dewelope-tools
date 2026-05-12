'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CentripetalForceCalculator - Calculate centripetal force for circular motion.
 * F = mv²/r or F = mω²r
 */
export default function CentripetalForceCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mass, setMass] = useState('');
  const [velocity, setVelocity] = useState('');
  const [radius, setRadius] = useState('');
  const [mode, setMode] = useState<'velocity' | 'angular'>('velocity');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const m = parseFloat(mass);
    const r = parseFloat(radius);

    if (isNaN(m) || isNaN(r) || m <= 0 || r <= 0) {
      setOutput('Error: Mass and radius must be positive numbers.');
      return;
    }

    const v = parseFloat(velocity);
    if (isNaN(v) || v <= 0) {
      setOutput(`Error: ${mode === 'velocity' ? 'Velocity' : 'Angular velocity'} must be a positive number.`);
      return;
    }

    let force: number;
    let acceleration: number;
    let period: number;
    let angularVel: number;
    let linearVel: number;

    if (mode === 'velocity') {
      linearVel = v;
      force = (m * v * v) / r;
      acceleration = (v * v) / r;
      angularVel = v / r;
      period = (2 * Math.PI * r) / v;
    } else {
      angularVel = v;
      linearVel = v * r;
      force = m * v * v * r;
      acceleration = v * v * r;
      period = (2 * Math.PI) / v;
    }

    const frequency = 1 / period;

    const lines: string[] = [];
    lines.push('═══ Centripetal Force Results ═══');
    lines.push('');
    lines.push(`Mass: ${m} kg`);
    lines.push(`Radius: ${r} m`);
    lines.push(`${mode === 'velocity' ? 'Linear velocity' : 'Angular velocity'}: ${v} ${mode === 'velocity' ? 'm/s' : 'rad/s'}`);
    lines.push('');
    lines.push('─── Results ───');
    lines.push(`Centripetal force: ${force.toFixed(4)} N`);
    lines.push(`Centripetal acceleration: ${acceleration.toFixed(4)} m/s²`);
    lines.push(`Linear velocity: ${linearVel.toFixed(4)} m/s`);
    lines.push(`Angular velocity: ${angularVel.toFixed(4)} rad/s`);
    lines.push(`Period: ${period.toFixed(4)} s`);
    lines.push(`Frequency: ${frequency.toFixed(4)} Hz`);
    lines.push('');
    lines.push('─── Formulas ───');
    lines.push('F = mv²/r (using linear velocity)');
    lines.push('F = mω²r (using angular velocity)');
    lines.push('a = v²/r = ω²r');
    lines.push('T = 2πr/v = 2π/ω');

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="mb-4">
          <label htmlFor={`${toolId}-mode`} className="block text-sm font-medium text-gray-700 mb-1">Input Mode</label>
          <select id={`${toolId}-mode`} value={mode} onChange={(e) => setMode(e.target.value as 'velocity' | 'angular')} className="input-field w-64" aria-label="Input mode">
            <option value="velocity">Linear Velocity (m/s)</option>
            <option value="angular">Angular Velocity (rad/s)</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor={`${toolId}-mass`} className="block text-sm font-medium text-gray-700 mb-1">Mass (kg)</label>
            <input id={`${toolId}-mass`} type="number" value={mass} onChange={(e) => setMass(e.target.value)} placeholder="10" className="input-field" aria-label={`Mass for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-velocity`} className="block text-sm font-medium text-gray-700 mb-1">{mode === 'velocity' ? 'Velocity (m/s)' : 'Angular Velocity (rad/s)'}</label>
            <input id={`${toolId}-velocity`} type="number" value={velocity} onChange={(e) => setVelocity(e.target.value)} placeholder={mode === 'velocity' ? '20' : '3.14'} className="input-field" aria-label="Velocity" />
          </div>
          <div>
            <label htmlFor={`${toolId}-radius`} className="block text-sm font-medium text-gray-700 mb-1">Radius (m)</label>
            <input id={`${toolId}-radius`} type="number" value={radius} onChange={(e) => setRadius(e.target.value)} placeholder="5" className="input-field" aria-label="Radius" />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate Centripetal Force</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Centripetal Force Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
