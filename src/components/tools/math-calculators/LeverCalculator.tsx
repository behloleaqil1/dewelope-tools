'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * LeverCalculator - Calculate lever force/distance (moment balance).
 * Solves for unknown force or distance using the lever principle: F1 × d1 = F2 × d2.
 */
export default function LeverCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [leverClass, setLeverClass] = useState('1');
  const [effortForce, setEffortForce] = useState('');
  const [effortDistance, setEffortDistance] = useState('');
  const [loadForce, setLoadForce] = useState('');
  const [loadDistance, setLoadDistance] = useState('');
  const [solveFor, setSolveFor] = useState('effort-force');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const ef = parseFloat(effortForce);
    const ed = parseFloat(effortDistance);
    const lf = parseFloat(loadForce);
    const ld = parseFloat(loadDistance);

    const results: string[] = [];
    results.push('=== Lever Calculator ===');
    results.push('');
    results.push(`Lever Class: ${leverClass === '1' ? 'First (fulcrum between effort & load)' : leverClass === '2' ? 'Second (load between fulcrum & effort)' : 'Third (effort between fulcrum & load)'}`);
    results.push('');
    results.push('Principle: Effort × Effort Arm = Load × Load Arm');
    results.push('');

    let solved: number;

    switch (solveFor) {
      case 'effort-force':
        if (isNaN(lf) || isNaN(ld) || isNaN(ed) || ed === 0) {
          setOutput('Please enter valid Load Force, Load Distance, and Effort Distance.');
          return;
        }
        solved = (lf * ld) / ed;
        results.push(`Given:`);
        results.push(`  Load Force: ${lf} N`);
        results.push(`  Load Arm: ${ld} m`);
        results.push(`  Effort Arm: ${ed} m`);
        results.push('');
        results.push(`Solution:`);
        results.push(`  Effort Force = (${lf} × ${ld}) / ${ed}`);
        results.push(`  Effort Force = ${solved.toFixed(4)} N`);
        break;
      case 'effort-distance':
        if (isNaN(lf) || isNaN(ld) || isNaN(ef) || ef === 0) {
          setOutput('Please enter valid Load Force, Load Distance, and Effort Force.');
          return;
        }
        solved = (lf * ld) / ef;
        results.push(`Given:`);
        results.push(`  Load Force: ${lf} N`);
        results.push(`  Load Arm: ${ld} m`);
        results.push(`  Effort Force: ${ef} N`);
        results.push('');
        results.push(`Solution:`);
        results.push(`  Effort Arm = (${lf} × ${ld}) / ${ef}`);
        results.push(`  Effort Arm = ${solved.toFixed(4)} m`);
        break;
      case 'load-force':
        if (isNaN(ef) || isNaN(ed) || isNaN(ld) || ld === 0) {
          setOutput('Please enter valid Effort Force, Effort Distance, and Load Distance.');
          return;
        }
        solved = (ef * ed) / ld;
        results.push(`Given:`);
        results.push(`  Effort Force: ${ef} N`);
        results.push(`  Effort Arm: ${ed} m`);
        results.push(`  Load Arm: ${ld} m`);
        results.push('');
        results.push(`Solution:`);
        results.push(`  Load Force = (${ef} × ${ed}) / ${ld}`);
        results.push(`  Load Force = ${solved.toFixed(4)} N`);
        break;
      case 'load-distance':
        if (isNaN(ef) || isNaN(ed) || isNaN(lf) || lf === 0) {
          setOutput('Please enter valid Effort Force, Effort Distance, and Load Force.');
          return;
        }
        solved = (ef * ed) / lf;
        results.push(`Given:`);
        results.push(`  Effort Force: ${ef} N`);
        results.push(`  Effort Arm: ${ed} m`);
        results.push(`  Load Force: ${lf} N`);
        results.push('');
        results.push(`Solution:`);
        results.push(`  Load Arm = (${ef} × ${ed}) / ${lf}`);
        results.push(`  Load Arm = ${solved.toFixed(4)} m`);
        break;
      default:
        setOutput('Invalid solve option.');
        return;
    }

    results.push('');
    const maEf = !isNaN(ef) && ef > 0 && !isNaN(lf) ? lf / ef : null;
    const maEd = !isNaN(ed) && !isNaN(ld) && ld > 0 ? ed / ld : null;
    if (maEf !== null) results.push(`Mechanical Advantage (force): ${maEf.toFixed(4)}`);
    if (maEd !== null) results.push(`Mechanical Advantage (distance): ${maEd.toFixed(4)}`);

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-class`} className="block text-sm font-medium text-gray-700 mb-1">
              Lever Class
            </label>
            <select
              id={`${toolId}-class`}
              value={leverClass}
              onChange={(e) => setLeverClass(e.target.value)}
              className="input-field"
              aria-label={`Lever class for ${toolName}`}
            >
              <option value="1">Class 1 (fulcrum in middle)</option>
              <option value="2">Class 2 (load in middle)</option>
              <option value="3">Class 3 (effort in middle)</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-solve`} className="block text-sm font-medium text-gray-700 mb-1">
              Solve For
            </label>
            <select
              id={`${toolId}-solve`}
              value={solveFor}
              onChange={(e) => setSolveFor(e.target.value)}
              className="input-field"
              aria-label="Solve for"
            >
              <option value="effort-force">Effort Force</option>
              <option value="effort-distance">Effort Arm Distance</option>
              <option value="load-force">Load Force</option>
              <option value="load-distance">Load Arm Distance</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-ef`} className="block text-sm font-medium text-gray-700 mb-1">
              Effort Force (N)
            </label>
            <input
              id={`${toolId}-ef`}
              type="number"
              step="any"
              value={effortForce}
              onChange={(e) => setEffortForce(e.target.value)}
              placeholder="e.g. 50"
              className="input-field"
              aria-label="Effort force"
              disabled={solveFor === 'effort-force'}
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-ed`} className="block text-sm font-medium text-gray-700 mb-1">
              Effort Arm Distance (m)
            </label>
            <input
              id={`${toolId}-ed`}
              type="number"
              step="any"
              value={effortDistance}
              onChange={(e) => setEffortDistance(e.target.value)}
              placeholder="e.g. 2"
              className="input-field"
              aria-label="Effort arm distance"
              disabled={solveFor === 'effort-distance'}
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-lf`} className="block text-sm font-medium text-gray-700 mb-1">
              Load Force (N)
            </label>
            <input
              id={`${toolId}-lf`}
              type="number"
              step="any"
              value={loadForce}
              onChange={(e) => setLoadForce(e.target.value)}
              placeholder="e.g. 200"
              className="input-field"
              aria-label="Load force"
              disabled={solveFor === 'load-force'}
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-ld`} className="block text-sm font-medium text-gray-700 mb-1">
              Load Arm Distance (m)
            </label>
            <input
              id={`${toolId}-ld`}
              type="number"
              step="any"
              value={loadDistance}
              onChange={(e) => setLoadDistance(e.target.value)}
              placeholder="e.g. 0.5"
              className="input-field"
              aria-label="Load arm distance"
              disabled={solveFor === 'load-distance'}
            />
          </div>
        </div>

        <button
          onClick={calculate}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Calculate
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
