'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * InclinedPlaneCalculator - Calculate force on inclined plane.
 * Computes parallel force, normal force, and acceleration on an inclined surface.
 */
export default function InclinedPlaneCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mass, setMass] = useState('');
  const [angle, setAngle] = useState('');
  const [friction, setFriction] = useState('0');
  const [gravity, setGravity] = useState('9.81');
  const [output, setOutput] = useState<{
    weight: number;
    parallelForce: number;
    normalForce: number;
    frictionForce: number;
    netForce: number;
    acceleration: number;
  } | null>(null);

  const calculate = () => {
    const m = parseFloat(mass);
    const theta = parseFloat(angle);
    const mu = parseFloat(friction);
    const g = parseFloat(gravity);

    if (isNaN(m) || isNaN(theta) || isNaN(mu) || isNaN(g) || m <= 0 || theta <= 0 || theta >= 90) {
      return;
    }

    const rad = (theta * Math.PI) / 180;
    const weight = m * g;
    const parallelForce = weight * Math.sin(rad);
    const normalForce = weight * Math.cos(rad);
    const frictionForce = mu * normalForce;
    const netForce = parallelForce - frictionForce;
    const acceleration = netForce / m;

    setOutput({ weight, parallelForce, normalForce, frictionForce, netForce, acceleration });
  };

  const formatNum = (n: number) => n.toFixed(4);

  const outputText = output
    ? `Weight: ${formatNum(output.weight)} N\nParallel Force (mg·sinθ): ${formatNum(output.parallelForce)} N\nNormal Force (mg·cosθ): ${formatNum(output.normalForce)} N\nFriction Force (μ·N): ${formatNum(output.frictionForce)} N\nNet Force: ${formatNum(output.netForce)} N\nAcceleration: ${formatNum(output.acceleration)} m/s²`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-mass`} className="block text-sm font-medium text-gray-700 mb-1">
              Mass (kg) *
            </label>
            <input
              id={`${toolId}-mass`}
              type="number"
              value={mass}
              onChange={(e) => setMass(e.target.value)}
              placeholder="10"
              min="0.01"
              step="any"
              aria-label={`Mass input for ${toolName}`}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-angle`} className="block text-sm font-medium text-gray-700 mb-1">
              Angle (degrees) *
            </label>
            <input
              id={`${toolId}-angle`}
              type="number"
              value={angle}
              onChange={(e) => setAngle(e.target.value)}
              placeholder="30"
              min="0.1"
              max="89.9"
              step="any"
              aria-label="Incline angle in degrees"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-friction`} className="block text-sm font-medium text-gray-700 mb-1">
              Coefficient of Friction (μ)
            </label>
            <input
              id={`${toolId}-friction`}
              type="number"
              value={friction}
              onChange={(e) => setFriction(e.target.value)}
              placeholder="0"
              min="0"
              max="2"
              step="0.01"
              aria-label="Coefficient of friction"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-gravity`} className="block text-sm font-medium text-gray-700 mb-1">
              Gravity (m/s²)
            </label>
            <input
              id={`${toolId}-gravity`}
              type="number"
              value={gravity}
              onChange={(e) => setGravity(e.target.value)}
              placeholder="9.81"
              step="any"
              aria-label="Gravitational acceleration"
              className="input-field"
            />
          </div>
        </div>
        <button
          onClick={calculate}
          disabled={!mass || !angle}
          className="btn-primary mt-4"
        >
          Calculate Forces
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded p-3 border">
                <p className="text-xs text-gray-500">Weight (mg)</p>
                <p className="text-lg font-semibold text-gray-900">{formatNum(output.weight)} N</p>
              </div>
              <div className="bg-gray-50 rounded p-3 border">
                <p className="text-xs text-gray-500">Parallel Force (mg·sinθ)</p>
                <p className="text-lg font-semibold text-gray-900">{formatNum(output.parallelForce)} N</p>
              </div>
              <div className="bg-gray-50 rounded p-3 border">
                <p className="text-xs text-gray-500">Normal Force (mg·cosθ)</p>
                <p className="text-lg font-semibold text-gray-900">{formatNum(output.normalForce)} N</p>
              </div>
              <div className="bg-gray-50 rounded p-3 border">
                <p className="text-xs text-gray-500">Friction Force (μ·N)</p>
                <p className="text-lg font-semibold text-gray-900">{formatNum(output.frictionForce)} N</p>
              </div>
              <div className="bg-blue-50 rounded p-3 border border-blue-200">
                <p className="text-xs text-blue-600">Net Force</p>
                <p className="text-lg font-semibold text-blue-900">{formatNum(output.netForce)} N</p>
              </div>
              <div className="bg-blue-50 rounded p-3 border border-blue-200">
                <p className="text-xs text-blue-600">Acceleration</p>
                <p className="text-lg font-semibold text-blue-900">{formatNum(output.acceleration)} m/s²</p>
              </div>
            </div>
            {output.netForce <= 0 && (
              <p className="text-sm text-amber-600">⚠️ Object will not slide (friction ≥ parallel force)</p>
            )}
            <CopyToClipboard text={outputText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
