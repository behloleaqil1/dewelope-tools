'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * FastenerTorqueSpecLookup - Look up torque specs for common bolt sizes.
 * Provides recommended torque values for SAE and Metric fasteners by grade.
 */
export default function FastenerTorqueSpecLookup({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [standard, setStandard] = useState('sae');
  const [size, setSize] = useState('');
  const [grade, setGrade] = useState('');
  const [condition, setCondition] = useState('dry');
  const [output, setOutput] = useState('');

  const saeSpecs: Record<string, Record<string, { ftLbs: number; nm: number }>> = {
    '1/4-20': { '2': { ftLbs: 4, nm: 5.4 }, '5': { ftLbs: 8, nm: 10.8 }, '8': { ftLbs: 12, nm: 16.3 } },
    '5/16-18': { '2': { ftLbs: 8, nm: 10.8 }, '5': { ftLbs: 17, nm: 23 }, '8': { ftLbs: 24, nm: 32.5 } },
    '3/8-16': { '2': { ftLbs: 15, nm: 20.3 }, '5': { ftLbs: 31, nm: 42 }, '8': { ftLbs: 44, nm: 59.7 } },
    '7/16-14': { '2': { ftLbs: 24, nm: 32.5 }, '5': { ftLbs: 49, nm: 66.4 }, '8': { ftLbs: 70, nm: 94.9 } },
    '1/2-13': { '2': { ftLbs: 37, nm: 50.2 }, '5': { ftLbs: 75, nm: 101.7 }, '8': { ftLbs: 105, nm: 142.4 } },
    '9/16-12': { '2': { ftLbs: 53, nm: 71.9 }, '5': { ftLbs: 110, nm: 149.1 }, '8': { ftLbs: 155, nm: 210.2 } },
    '5/8-11': { '2': { ftLbs: 74, nm: 100.3 }, '5': { ftLbs: 150, nm: 203.4 }, '8': { ftLbs: 210, nm: 284.7 } },
    '3/4-10': { '2': { ftLbs: 120, nm: 162.7 }, '5': { ftLbs: 270, nm: 366.1 }, '8': { ftLbs: 380, nm: 515.2 } },
  };

  const metricSpecs: Record<string, Record<string, { nm: number; ftLbs: number }>> = {
    'M6': { '8.8': { nm: 10, ftLbs: 7.4 }, '10.9': { nm: 14, ftLbs: 10.3 }, '12.9': { nm: 17, ftLbs: 12.5 } },
    'M8': { '8.8': { nm: 25, ftLbs: 18.4 }, '10.9': { nm: 35, ftLbs: 25.8 }, '12.9': { nm: 41, ftLbs: 30.2 } },
    'M10': { '8.8': { nm: 49, ftLbs: 36.1 }, '10.9': { nm: 69, ftLbs: 50.9 }, '12.9': { nm: 83, ftLbs: 61.2 } },
    'M12': { '8.8': { nm: 86, ftLbs: 63.4 }, '10.9': { nm: 120, ftLbs: 88.5 }, '12.9': { nm: 144, ftLbs: 106.2 } },
    'M14': { '8.8': { nm: 135, ftLbs: 99.6 }, '10.9': { nm: 190, ftLbs: 140.1 }, '12.9': { nm: 228, ftLbs: 168.2 } },
    'M16': { '8.8': { nm: 210, ftLbs: 154.9 }, '10.9': { nm: 295, ftLbs: 217.6 }, '12.9': { nm: 354, ftLbs: 261.1 } },
    'M18': { '8.8': { nm: 290, ftLbs: 213.9 }, '10.9': { nm: 410, ftLbs: 302.4 }, '12.9': { nm: 490, ftLbs: 361.4 } },
    'M20': { '8.8': { nm: 410, ftLbs: 302.4 }, '10.9': { nm: 580, ftLbs: 427.8 }, '12.9': { nm: 690, ftLbs: 508.9 } },
  };

  const lookup = () => {
    if (!size) {
      setOutput('Please select a bolt size.');
      return;
    }
    if (!grade) {
      setOutput('Please select a grade/class.');
      return;
    }

    const specs = standard === 'sae' ? saeSpecs : metricSpecs;
    const sizeData = specs[size];

    if (!sizeData || !sizeData[grade]) {
      setOutput('No data available for this size/grade combination.');
      return;
    }

    const spec = sizeData[grade];
    const lubFactor = condition === 'lubricated' ? 0.75 : condition === 'plated' ? 0.85 : 1.0;

    const results: string[] = [];
    results.push('=== Fastener Torque Specification ===');
    results.push('');
    results.push(`Standard: ${standard === 'sae' ? 'SAE (Imperial)' : 'Metric (ISO)'}`);
    results.push(`Size: ${size}`);
    results.push(`Grade/Class: ${grade}`);
    results.push(`Condition: ${condition.charAt(0).toUpperCase() + condition.slice(1)}`);
    results.push('');
    results.push('--- Recommended Torque ---');
    const adjNm = (spec.nm * lubFactor).toFixed(1);
    const adjFtLbs = (spec.ftLbs * lubFactor).toFixed(1);
    results.push(`  ${adjNm} N·m (${adjFtLbs} ft·lbs)`);
    results.push('');
    if (lubFactor !== 1.0) {
      results.push(`Base torque (dry): ${spec.nm} N·m (${spec.ftLbs} ft·lbs)`);
      results.push(`Reduction factor: ${(lubFactor * 100).toFixed(0)}% (${condition})`);
      results.push('');
    }
    results.push('--- All Grades for This Size ---');
    Object.entries(sizeData).forEach(([g, s]) => {
      const adj = (s.nm * lubFactor).toFixed(1);
      results.push(`  Grade ${g}: ${adj} N·m (${(s.ftLbs * lubFactor).toFixed(1)} ft·lbs)`);
    });
    results.push('');
    results.push('Note: Values are for general-purpose applications.');
    results.push('Always consult manufacturer specs for critical applications.');

    setOutput(results.join('\n'));
  };

  const sizeOptions = standard === 'sae' ? Object.keys(saeSpecs) : Object.keys(metricSpecs);
  const gradeOptions = standard === 'sae' ? ['2', '5', '8'] : ['8.8', '10.9', '12.9'];

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-std`} className="block text-sm font-medium text-gray-700 mb-1">
              Standard
            </label>
            <select
              id={`${toolId}-std`}
              value={standard}
              onChange={(e) => { setStandard(e.target.value); setSize(''); setGrade(''); }}
              className="input-field"
              aria-label={`Fastener standard for ${toolName}`}
            >
              <option value="sae">SAE (Imperial)</option>
              <option value="metric">Metric (ISO)</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">
              Bolt Size
            </label>
            <select
              id={`${toolId}-size`}
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="input-field"
              aria-label="Bolt size"
            >
              <option value="">Select size...</option>
              {sizeOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-grade`} className="block text-sm font-medium text-gray-700 mb-1">
              Grade/Class
            </label>
            <select
              id={`${toolId}-grade`}
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="input-field"
              aria-label="Bolt grade"
            >
              <option value="">Select grade...</option>
              {gradeOptions.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-cond`} className="block text-sm font-medium text-gray-700 mb-1">
              Thread Condition
            </label>
            <select
              id={`${toolId}-cond`}
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="input-field"
              aria-label="Thread condition"
            >
              <option value="dry">Dry (as-received)</option>
              <option value="plated">Plated/Cadmium</option>
              <option value="lubricated">Lubricated</option>
            </select>
          </div>
        </div>

        <button
          onClick={lookup}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Look Up Torque
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Torque Specification</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
