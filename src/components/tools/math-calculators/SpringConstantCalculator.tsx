'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SpringConstantCalculator - Calculate spring constant using Hooke's Law (F = kx).
 * Solves for any one of: spring constant (k), force (F), or displacement (x).
 */
export default function SpringConstantCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [solveFor, setSolveFor] = useState<'k' | 'F' | 'x'>('k');
  const [force, setForce] = useState('');
  const [displacement, setDisplacement] = useState('');
  const [springConstant, setSpringConstant] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const results: string[] = [];

    if (solveFor === 'k') {
      const F = parseFloat(force);
      const x = parseFloat(displacement);
      if (isNaN(F) || isNaN(x) || x === 0) {
        setOutput('Error: Please enter valid force and non-zero displacement values.');
        return;
      }
      const k = F / x;
      results.push('Hooke\'s Law: F = kx');
      results.push(`Solving for k: k = F / x`);
      results.push('');
      results.push(`Force (F) = ${F} N`);
      results.push(`Displacement (x) = ${x} m`);
      results.push('');
      results.push(`Spring Constant (k) = ${k.toFixed(4)} N/m`);
      results.push(`                     = ${(k / 1000).toFixed(4)} kN/m`);
      if (Math.abs(k) < 1000) {
        results.push(`                     = ${(k * 1000).toFixed(4)} mN/m`);
      }
    } else if (solveFor === 'F') {
      const k = parseFloat(springConstant);
      const x = parseFloat(displacement);
      if (isNaN(k) || isNaN(x)) {
        setOutput('Error: Please enter valid spring constant and displacement values.');
        return;
      }
      const F = k * x;
      results.push('Hooke\'s Law: F = kx');
      results.push(`Solving for F: F = k × x`);
      results.push('');
      results.push(`Spring Constant (k) = ${k} N/m`);
      results.push(`Displacement (x) = ${x} m`);
      results.push('');
      results.push(`Force (F) = ${F.toFixed(4)} N`);
      results.push(`          = ${(F / 9.80665).toFixed(4)} kgf`);
      results.push(`          = ${(F * 0.224809).toFixed(4)} lbf`);
    } else {
      const k = parseFloat(springConstant);
      const F = parseFloat(force);
      if (isNaN(k) || isNaN(F) || k === 0) {
        setOutput('Error: Please enter valid force and non-zero spring constant values.');
        return;
      }
      const x = F / k;
      results.push('Hooke\'s Law: F = kx');
      results.push(`Solving for x: x = F / k`);
      results.push('');
      results.push(`Force (F) = ${F} N`);
      results.push(`Spring Constant (k) = ${k} N/m`);
      results.push('');
      results.push(`Displacement (x) = ${x.toFixed(6)} m`);
      results.push(`                  = ${(x * 100).toFixed(4)} cm`);
      results.push(`                  = ${(x * 1000).toFixed(4)} mm`);
    }

    results.push('');
    results.push('Note: Hooke\'s Law applies within the elastic limit of the spring.');
    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Solve for</label>
            <select
              value={solveFor}
              onChange={(e) => setSolveFor(e.target.value as 'k' | 'F' | 'x')}
              aria-label={`Solve for selection for ${toolName}`}
              className="input-field w-full"
            >
              <option value="k">Spring Constant (k)</option>
              <option value="F">Force (F)</option>
              <option value="x">Displacement (x)</option>
            </select>
          </div>
          {solveFor !== 'F' && (
            <div>
              <label htmlFor={`${toolId}-force`} className="block text-sm font-medium text-gray-700 mb-1">
                Force (N)
              </label>
              <input
                id={`${toolId}-force`}
                type="number"
                step="any"
                value={force}
                onChange={(e) => setForce(e.target.value)}
                placeholder="Enter force in Newtons"
                aria-label="Force in Newtons"
                className="input-field w-full"
              />
            </div>
          )}
          {solveFor !== 'x' && (
            <div>
              <label htmlFor={`${toolId}-disp`} className="block text-sm font-medium text-gray-700 mb-1">
                Displacement (m)
              </label>
              <input
                id={`${toolId}-disp`}
                type="number"
                step="any"
                value={displacement}
                onChange={(e) => setDisplacement(e.target.value)}
                placeholder="Enter displacement in meters"
                aria-label="Displacement in meters"
                className="input-field w-full"
              />
            </div>
          )}
          {solveFor !== 'k' && (
            <div>
              <label htmlFor={`${toolId}-k`} className="block text-sm font-medium text-gray-700 mb-1">
                Spring Constant (N/m)
              </label>
              <input
                id={`${toolId}-k`}
                type="number"
                step="any"
                value={springConstant}
                onChange={(e) => setSpringConstant(e.target.value)}
                placeholder="Enter spring constant in N/m"
                aria-label="Spring constant in N/m"
                className="input-field w-full"
              />
            </div>
          )}
          <button onClick={calculate} className="btn-primary text-sm">
            Calculate
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
