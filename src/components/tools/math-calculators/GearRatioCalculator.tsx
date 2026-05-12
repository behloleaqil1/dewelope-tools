'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * GearRatioCalculator - Calculate gear ratios and output speed/torque.
 * Computes gear ratio, output RPM, and torque multiplication for gear pairs.
 */
export default function GearRatioCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [drivingTeeth, setDrivingTeeth] = useState('');
  const [drivenTeeth, setDrivenTeeth] = useState('');
  const [inputRpm, setInputRpm] = useState('');
  const [inputTorque, setInputTorque] = useState('');
  const [efficiency, setEfficiency] = useState('95');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const driving = parseFloat(drivingTeeth);
    const driven = parseFloat(drivenTeeth);
    const rpm = parseFloat(inputRpm);
    const torque = parseFloat(inputTorque);
    const eff = parseFloat(efficiency) / 100;

    if (isNaN(driving) || isNaN(driven) || driving <= 0 || driven <= 0) {
      setOutput('Please enter valid positive values for gear teeth.');
      return;
    }

    const gearRatio = driven / driving;
    const results: string[] = [];

    results.push('=== Gear Ratio Calculation ===');
    results.push('');
    results.push(`Driving Gear: ${driving} teeth`);
    results.push(`Driven Gear: ${driven} teeth`);
    results.push(`Gear Ratio: ${gearRatio.toFixed(4)}:1`);
    results.push(`Ratio (fraction): ${driven}/${driving}`);
    results.push('');

    if (gearRatio > 1) {
      results.push('Type: Speed reduction / Torque multiplication');
    } else if (gearRatio < 1) {
      results.push('Type: Speed increase / Torque reduction');
    } else {
      results.push('Type: 1:1 (no change)');
    }
    results.push('');

    if (!isNaN(rpm) && rpm > 0) {
      const outputRpm = rpm / gearRatio;
      results.push(`Input Speed: ${rpm} RPM`);
      results.push(`Output Speed: ${outputRpm.toFixed(2)} RPM`);
      results.push('');
    }

    if (!isNaN(torque) && torque > 0) {
      const outputTorque = torque * gearRatio * eff;
      results.push(`Input Torque: ${torque} N·m`);
      results.push(`Efficiency: ${(eff * 100).toFixed(1)}%`);
      results.push(`Output Torque: ${outputTorque.toFixed(4)} N·m`);
      results.push('');
    }

    results.push('--- Gear Train Info ---');
    results.push(`Mechanical Advantage: ${gearRatio.toFixed(4)}`);
    results.push(`Velocity Ratio: ${(1 / gearRatio).toFixed(4)}`);

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-driving`} className="block text-sm font-medium text-gray-700 mb-1">
              Driving Gear Teeth
            </label>
            <input
              id={`${toolId}-driving`}
              type="number"
              min="1"
              value={drivingTeeth}
              onChange={(e) => setDrivingTeeth(e.target.value)}
              placeholder="e.g. 20"
              className="input-field"
              aria-label={`Driving gear teeth for ${toolName}`}
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-driven`} className="block text-sm font-medium text-gray-700 mb-1">
              Driven Gear Teeth
            </label>
            <input
              id={`${toolId}-driven`}
              type="number"
              min="1"
              value={drivenTeeth}
              onChange={(e) => setDrivenTeeth(e.target.value)}
              placeholder="e.g. 60"
              className="input-field"
              aria-label="Driven gear teeth"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-rpm`} className="block text-sm font-medium text-gray-700 mb-1">
              Input Speed (RPM) - optional
            </label>
            <input
              id={`${toolId}-rpm`}
              type="number"
              min="0"
              value={inputRpm}
              onChange={(e) => setInputRpm(e.target.value)}
              placeholder="e.g. 1500"
              className="input-field"
              aria-label="Input RPM"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-torque`} className="block text-sm font-medium text-gray-700 mb-1">
              Input Torque (N·m) - optional
            </label>
            <input
              id={`${toolId}-torque`}
              type="number"
              min="0"
              step="any"
              value={inputTorque}
              onChange={(e) => setInputTorque(e.target.value)}
              placeholder="e.g. 10"
              className="input-field"
              aria-label="Input torque"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-eff`} className="block text-sm font-medium text-gray-700 mb-1">
              Efficiency (%)
            </label>
            <input
              id={`${toolId}-eff`}
              type="number"
              min="1"
              max="100"
              value={efficiency}
              onChange={(e) => setEfficiency(e.target.value)}
              className="input-field"
              aria-label="Gear efficiency percentage"
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
