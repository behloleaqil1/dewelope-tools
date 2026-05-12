'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ElectricalWireAmpacity - Look up wire ampacity by gauge and insulation type.
 * Based on NEC (National Electrical Code) ampacity tables for copper conductors.
 */
export default function ElectricalWireAmpacity({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [gauge, setGauge] = useState('12');
  const [insulation, setInsulation] = useState('THHN');
  const [output, setOutput] = useState('');

  // Ampacity data based on NEC Table 310.16 (copper conductors at 30°C ambient)
  const ampacityTable: Record<string, Record<string, { ampacity: number; tempRating: string }>> = {
    '14': { 'TW': { ampacity: 15, tempRating: '60°C' }, 'THW': { ampacity: 15, tempRating: '75°C' }, 'THHN': { ampacity: 20, tempRating: '90°C' }, 'XHHW': { ampacity: 20, tempRating: '90°C' } },
    '12': { 'TW': { ampacity: 20, tempRating: '60°C' }, 'THW': { ampacity: 20, tempRating: '75°C' }, 'THHN': { ampacity: 25, tempRating: '90°C' }, 'XHHW': { ampacity: 25, tempRating: '90°C' } },
    '10': { 'TW': { ampacity: 30, tempRating: '60°C' }, 'THW': { ampacity: 30, tempRating: '75°C' }, 'THHN': { ampacity: 35, tempRating: '90°C' }, 'XHHW': { ampacity: 35, tempRating: '90°C' } },
    '8': { 'TW': { ampacity: 40, tempRating: '60°C' }, 'THW': { ampacity: 50, tempRating: '75°C' }, 'THHN': { ampacity: 55, tempRating: '90°C' }, 'XHHW': { ampacity: 55, tempRating: '90°C' } },
    '6': { 'TW': { ampacity: 55, tempRating: '60°C' }, 'THW': { ampacity: 65, tempRating: '75°C' }, 'THHN': { ampacity: 75, tempRating: '90°C' }, 'XHHW': { ampacity: 75, tempRating: '90°C' } },
    '4': { 'TW': { ampacity: 70, tempRating: '60°C' }, 'THW': { ampacity: 85, tempRating: '75°C' }, 'THHN': { ampacity: 95, tempRating: '90°C' }, 'XHHW': { ampacity: 95, tempRating: '90°C' } },
    '3': { 'TW': { ampacity: 85, tempRating: '60°C' }, 'THW': { ampacity: 100, tempRating: '75°C' }, 'THHN': { ampacity: 115, tempRating: '90°C' }, 'XHHW': { ampacity: 115, tempRating: '90°C' } },
    '2': { 'TW': { ampacity: 95, tempRating: '60°C' }, 'THW': { ampacity: 115, tempRating: '75°C' }, 'THHN': { ampacity: 130, tempRating: '90°C' }, 'XHHW': { ampacity: 130, tempRating: '90°C' } },
    '1': { 'TW': { ampacity: 110, tempRating: '60°C' }, 'THW': { ampacity: 130, tempRating: '75°C' }, 'THHN': { ampacity: 145, tempRating: '90°C' }, 'XHHW': { ampacity: 145, tempRating: '90°C' } },
    '1/0': { 'TW': { ampacity: 125, tempRating: '60°C' }, 'THW': { ampacity: 150, tempRating: '75°C' }, 'THHN': { ampacity: 170, tempRating: '90°C' }, 'XHHW': { ampacity: 170, tempRating: '90°C' } },
    '2/0': { 'TW': { ampacity: 145, tempRating: '60°C' }, 'THW': { ampacity: 175, tempRating: '75°C' }, 'THHN': { ampacity: 195, tempRating: '90°C' }, 'XHHW': { ampacity: 195, tempRating: '90°C' } },
    '3/0': { 'TW': { ampacity: 165, tempRating: '60°C' }, 'THW': { ampacity: 200, tempRating: '75°C' }, 'THHN': { ampacity: 225, tempRating: '90°C' }, 'XHHW': { ampacity: 225, tempRating: '90°C' } },
    '4/0': { 'TW': { ampacity: 195, tempRating: '60°C' }, 'THW': { ampacity: 230, tempRating: '75°C' }, 'THHN': { ampacity: 260, tempRating: '90°C' }, 'XHHW': { ampacity: 260, tempRating: '90°C' } },
  };

  const gaugeOptions = ['14', '12', '10', '8', '6', '4', '3', '2', '1', '1/0', '2/0', '3/0', '4/0'];
  const insulationOptions = ['TW', 'THW', 'THHN', 'XHHW'];

  const lookup = () => {
    const data = ampacityTable[gauge]?.[insulation];
    if (!data) {
      setOutput('No data available for this combination.');
      return;
    }

    const lines = [
      `Wire Gauge: AWG ${gauge}`,
      `Insulation Type: ${insulation}`,
      `Temperature Rating: ${data.tempRating}`,
      `Ampacity: ${data.ampacity} A`,
      ``,
      `Conductor: Copper`,
      `Ambient Temperature: 30°C (86°F)`,
      `Reference: NEC Table 310.16`,
      ``,
      `Common uses for AWG ${gauge}:`,
    ];

    const uses: Record<string, string> = {
      '14': '  • 15A circuits, lighting, general outlets',
      '12': '  • 20A circuits, kitchen outlets, bathrooms',
      '10': '  • 30A circuits, dryers, water heaters',
      '8': '  • 40-50A circuits, ranges, large appliances',
      '6': '  • 50-65A circuits, large AC units, sub-panels',
      '4': '  • 70-95A circuits, sub-panels, feeders',
      '3': '  • 85-115A circuits, service entrance',
      '2': '  • 95-130A circuits, service entrance',
      '1': '  • 110-145A circuits, service entrance',
      '1/0': '  • 125-170A circuits, main service',
      '2/0': '  • 145-195A circuits, main service',
      '3/0': '  • 165-225A circuits, commercial',
      '4/0': '  • 195-260A circuits, commercial/industrial',
    };

    lines.push(uses[gauge] || '  • Various applications');

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-gauge`} className="block text-sm font-medium text-gray-700 mb-1">Wire Gauge (AWG)</label>
            <select id={`${toolId}-gauge`} value={gauge} onChange={(e) => setGauge(e.target.value)} aria-label={`Wire gauge for ${toolName}`} className="input-field">
              {gaugeOptions.map(g => <option key={g} value={g}>AWG {g}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-insulation`} className="block text-sm font-medium text-gray-700 mb-1">Insulation Type</label>
            <select id={`${toolId}-insulation`} value={insulation} onChange={(e) => setInsulation(e.target.value)} aria-label="Insulation type" className="input-field">
              {insulationOptions.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
        </div>
        <button onClick={lookup} className="btn-primary mt-4">Look Up Ampacity</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Ampacity Information</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
