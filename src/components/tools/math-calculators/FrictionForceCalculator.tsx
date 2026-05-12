'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * FrictionForceCalculator - Calculate friction force (static and kinetic).
 * Computes static and kinetic friction forces given normal force and coefficients.
 */
export default function FrictionForceCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mode, setMode] = useState<'fromNormal' | 'fromMass'>('fromMass');
  const [mass, setMass] = useState('');
  const [normalForce, setNormalForce] = useState('');
  const [staticCoeff, setStaticCoeff] = useState('');
  const [kineticCoeff, setKineticCoeff] = useState('');
  const [gravity, setGravity] = useState('9.81');
  const [appliedForce, setAppliedForce] = useState('');
  const [output, setOutput] = useState<{
    normal: number;
    staticFriction: number;
    kineticFriction: number;
    willMove: boolean;
    netForce: number;
  } | null>(null);

  const calculate = () => {
    const muS = parseFloat(staticCoeff);
    const muK = parseFloat(kineticCoeff);
    const g = parseFloat(gravity);
    const applied = parseFloat(appliedForce) || 0;

    let N: number;
    if (mode === 'fromMass') {
      const m = parseFloat(mass);
      if (isNaN(m) || m <= 0) return;
      N = m * g;
    } else {
      N = parseFloat(normalForce);
      if (isNaN(N) || N <= 0) return;
    }

    if (isNaN(muS) || isNaN(muK) || muS < 0 || muK < 0) return;

    const staticFriction = muS * N;
    const kineticFriction = muK * N;
    const willMove = applied > staticFriction;
    const netForce = willMove ? applied - kineticFriction : 0;

    setOutput({ normal: N, staticFriction, kineticFriction, willMove, netForce });
  };

  const formatNum = (n: number) => n.toFixed(4);

  const outputText = output
    ? `Normal Force: ${formatNum(output.normal)} N\nMax Static Friction (μs·N): ${formatNum(output.staticFriction)} N\nKinetic Friction (μk·N): ${formatNum(output.kineticFriction)} N\nWill Move: ${output.willMove ? 'Yes' : 'No'}\nNet Force: ${formatNum(output.netForce)} N`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Input Mode</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name={`${toolId}-mode`}
                checked={mode === 'fromMass'}
                onChange={() => setMode('fromMass')}
                className="text-blue-600"
              />
              From Mass
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name={`${toolId}-mode`}
                checked={mode === 'fromNormal'}
                onChange={() => setMode('fromNormal')}
                className="text-blue-600"
              />
              From Normal Force
            </label>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mode === 'fromMass' ? (
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
                aria-label={`Mass for ${toolName}`}
                className="input-field"
              />
            </div>
          ) : (
            <div>
              <label htmlFor={`${toolId}-normal`} className="block text-sm font-medium text-gray-700 mb-1">
                Normal Force (N) *
              </label>
              <input
                id={`${toolId}-normal`}
                type="number"
                value={normalForce}
                onChange={(e) => setNormalForce(e.target.value)}
                placeholder="98.1"
                min="0.01"
                step="any"
                aria-label="Normal force"
                className="input-field"
              />
            </div>
          )}
          <div>
            <label htmlFor={`${toolId}-static`} className="block text-sm font-medium text-gray-700 mb-1">
              Static Coefficient (μs) *
            </label>
            <input
              id={`${toolId}-static`}
              type="number"
              value={staticCoeff}
              onChange={(e) => setStaticCoeff(e.target.value)}
              placeholder="0.5"
              min="0"
              max="3"
              step="0.01"
              aria-label="Static friction coefficient"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-kinetic`} className="block text-sm font-medium text-gray-700 mb-1">
              Kinetic Coefficient (μk) *
            </label>
            <input
              id={`${toolId}-kinetic`}
              type="number"
              value={kineticCoeff}
              onChange={(e) => setKineticCoeff(e.target.value)}
              placeholder="0.3"
              min="0"
              max="3"
              step="0.01"
              aria-label="Kinetic friction coefficient"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-applied`} className="block text-sm font-medium text-gray-700 mb-1">
              Applied Force (N, optional)
            </label>
            <input
              id={`${toolId}-applied`}
              type="number"
              value={appliedForce}
              onChange={(e) => setAppliedForce(e.target.value)}
              placeholder="50"
              min="0"
              step="any"
              aria-label="Applied force"
              className="input-field"
            />
          </div>
          {mode === 'fromMass' && (
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
          )}
        </div>
        <button
          onClick={calculate}
          disabled={mode === 'fromMass' ? !mass || !staticCoeff || !kineticCoeff : !normalForce || !staticCoeff || !kineticCoeff}
          className="btn-primary mt-4"
        >
          Calculate Friction
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded p-3 border">
                <p className="text-xs text-gray-500">Normal Force</p>
                <p className="text-lg font-semibold text-gray-900">{formatNum(output.normal)} N</p>
              </div>
              <div className="bg-gray-50 rounded p-3 border">
                <p className="text-xs text-gray-500">Max Static Friction (μs·N)</p>
                <p className="text-lg font-semibold text-gray-900">{formatNum(output.staticFriction)} N</p>
              </div>
              <div className="bg-gray-50 rounded p-3 border">
                <p className="text-xs text-gray-500">Kinetic Friction (μk·N)</p>
                <p className="text-lg font-semibold text-gray-900">{formatNum(output.kineticFriction)} N</p>
              </div>
              {appliedForce && (
                <>
                  <div className={`rounded p-3 border ${output.willMove ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                    <p className="text-xs text-gray-500">Object Will Move?</p>
                    <p className={`text-lg font-semibold ${output.willMove ? 'text-green-700' : 'text-amber-700'}`}>
                      {output.willMove ? 'Yes' : 'No'}
                    </p>
                  </div>
                  {output.willMove && (
                    <div className="bg-blue-50 rounded p-3 border border-blue-200">
                      <p className="text-xs text-blue-600">Net Force (while moving)</p>
                      <p className="text-lg font-semibold text-blue-900">{formatNum(output.netForce)} N</p>
                    </div>
                  )}
                </>
              )}
            </div>
            <p className="text-xs text-gray-500">Note: μs is typically greater than μk for the same surfaces.</p>
            <CopyToClipboard text={outputText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
