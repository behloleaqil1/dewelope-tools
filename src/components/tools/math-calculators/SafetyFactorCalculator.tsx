'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SafetyFactorCalculator - Calculate engineering safety factor.
 * Safety Factor = Material Strength / Design Load (or actual stress).
 */
export default function SafetyFactorCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [materialStrength, setMaterialStrength] = useState('');
  const [designLoad, setDesignLoad] = useState('');
  const [unit, setUnit] = useState('MPa');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const strength = parseFloat(materialStrength);
    const load = parseFloat(designLoad);

    if (isNaN(strength) || isNaN(load) || strength <= 0 || load <= 0) {
      setOutput('Please enter valid positive numbers for both fields.');
      return;
    }

    const safetyFactor = strength / load;

    let assessment = '';
    if (safetyFactor < 1) {
      assessment = '⚠️ FAILURE - Design load exceeds material strength!';
    } else if (safetyFactor < 1.5) {
      assessment = '⚠️ Marginal - Very low safety margin, not recommended for most applications.';
    } else if (safetyFactor < 2) {
      assessment = '⚡ Acceptable for controlled, well-understood static loads.';
    } else if (safetyFactor < 4) {
      assessment = '✅ Good - Typical range for general engineering applications.';
    } else if (safetyFactor < 8) {
      assessment = '✅ Conservative - Suitable for dynamic loads or uncertain conditions.';
    } else {
      assessment = '🔒 Very conservative - May be over-designed unless required by code.';
    }

    const lines = [
      `Safety Factor (FoS): ${safetyFactor.toFixed(4)}`,
      ``,
      `Material Strength: ${strength} ${unit}`,
      `Design Load / Actual Stress: ${load} ${unit}`,
      ``,
      `Formula: FoS = Material Strength / Design Load`,
      `         FoS = ${strength} / ${load} = ${safetyFactor.toFixed(4)}`,
      ``,
      `Assessment: ${assessment}`,
      ``,
      `Common Safety Factor Guidelines:`,
      `  • Static loads, ductile materials: 1.5 - 2.0`,
      `  • Dynamic loads: 2.0 - 4.0`,
      `  • Impact/shock loads: 4.0 - 8.0`,
      `  • Human safety critical: 5.0 - 10.0`,
    ];

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">
          Unit
        </label>
        <select
          id={`${toolId}-unit`}
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          aria-label="Stress unit"
          className="input-field mb-3"
        >
          <option value="MPa">MPa</option>
          <option value="ksi">ksi</option>
          <option value="psi">psi</option>
          <option value="GPa">GPa</option>
          <option value="N/mm²">N/mm²</option>
        </select>
        <label htmlFor={`${toolId}-strength`} className="block text-sm font-medium text-gray-700 mb-1">
          Material Strength ({unit})
        </label>
        <input
          id={`${toolId}-strength`}
          type="number"
          value={materialStrength}
          onChange={(e) => setMaterialStrength(e.target.value)}
          placeholder="e.g., 250"
          aria-label={`Material strength for ${toolName}`}
          className="input-field mb-3"
          min="0"
          step="any"
        />
        <label htmlFor={`${toolId}-load`} className="block text-sm font-medium text-gray-700 mb-1">
          Design Load / Actual Stress ({unit})
        </label>
        <input
          id={`${toolId}-load`}
          type="number"
          value={designLoad}
          onChange={(e) => setDesignLoad(e.target.value)}
          placeholder="e.g., 100"
          aria-label={`Design load for ${toolName}`}
          className="input-field"
          min="0"
          step="any"
        />
        <button onClick={calculate} className="btn-primary mt-2">
          Calculate Safety Factor
        </button>
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
