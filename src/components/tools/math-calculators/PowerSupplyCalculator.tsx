'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PowerSupplyCalculator - Calculate total power supply wattage needed.
 * Add components with their power draw to determine PSU requirements.
 */
export default function PowerSupplyCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [components, setComponents] = useState([
    { name: 'CPU', watts: '125' },
    { name: 'GPU', watts: '300' },
    { name: 'RAM', watts: '10' },
    { name: 'Storage (SSD/HDD)', watts: '10' },
    { name: 'Motherboard', watts: '50' },
    { name: 'Fans/Cooling', watts: '20' },
  ]);
  const [headroom, setHeadroom] = useState('20');
  const [output, setOutput] = useState('');

  const updateComponent = (index: number, field: 'name' | 'watts', value: string) => {
    const updated = [...components];
    updated[index] = { ...updated[index], [field]: value };
    setComponents(updated);
  };

  const addComponent = () => {
    setComponents([...components, { name: '', watts: '0' }]);
  };

  const removeComponent = (index: number) => {
    setComponents(components.filter((_, i) => i !== index));
  };

  const calculate = () => {
    const headroomPct = parseFloat(headroom) || 20;
    let totalWatts = 0;
    const breakdown: string[] = [];

    components.forEach(comp => {
      const watts = parseFloat(comp.watts) || 0;
      totalWatts += watts;
      if (comp.name && watts > 0) {
        breakdown.push(`  ${comp.name}: ${watts} W`);
      }
    });

    const recommended = Math.ceil(totalWatts * (1 + headroomPct / 100));
    const psuSizes = [300, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 1000, 1200, 1500, 2000];
    const suggestedPsu = psuSizes.find(s => s >= recommended) || psuSizes[psuSizes.length - 1];

    const lines = [
      `━━━ Component Power Draw ━━━`,
      ...breakdown,
      ``,
      `━━━ Summary ━━━`,
      `Total Component Draw: ${totalWatts} W`,
      `Headroom: ${headroomPct}%`,
      `Recommended Minimum: ${recommended} W`,
      `Suggested PSU Size: ${suggestedPsu} W`,
      ``,
      `━━━ Efficiency Notes ━━━`,
      `At 50% load (optimal efficiency): ${suggestedPsu / 2} W draw`,
      `80+ Gold efficiency at 50%: ~90% (${Math.round(suggestedPsu * 0.5 / 0.9)} W from wall)`,
    ];

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-2">Components</label>
        <div className="space-y-2">
          {components.map((comp, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input type="text" value={comp.name} onChange={(e) => updateComponent(i, 'name', e.target.value)} placeholder="Component name" className="input-field flex-1" aria-label={`Component ${i + 1} name for ${toolName}`} />
              <input type="number" value={comp.watts} onChange={(e) => updateComponent(i, 'watts', e.target.value)} placeholder="Watts" className="input-field w-24" aria-label={`Component ${i + 1} watts`} />
              <span className="text-sm text-gray-500">W</span>
              <button onClick={() => removeComponent(i)} className="text-red-500 hover:text-red-700 text-sm px-2" aria-label={`Remove component ${i + 1}`}>✕</button>
            </div>
          ))}
        </div>
        <button onClick={addComponent} className="text-sm text-blue-600 hover:text-blue-800 mt-2">+ Add Component</button>
        <div className="mt-4">
          <label htmlFor={`${toolId}-headroom`} className="block text-sm font-medium text-gray-700 mb-1">Headroom %</label>
          <input id={`${toolId}-headroom`} type="number" min={0} max={100} value={headroom} onChange={(e) => setHeadroom(e.target.value)} className="input-field w-32" aria-label="Headroom percentage" />
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate PSU Requirement</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Power Supply Recommendation</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
