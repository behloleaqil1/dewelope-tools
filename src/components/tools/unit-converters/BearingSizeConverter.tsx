'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface BearingData {
  designation: string;
  bore: number;
  od: number;
  width: number;
  type: string;
}

const BEARING_DATABASE: BearingData[] = [
  { designation: '6000', bore: 10, od: 26, width: 8, type: 'Deep Groove Ball' },
  { designation: '6001', bore: 12, od: 28, width: 8, type: 'Deep Groove Ball' },
  { designation: '6002', bore: 15, od: 32, width: 9, type: 'Deep Groove Ball' },
  { designation: '6003', bore: 17, od: 35, width: 10, type: 'Deep Groove Ball' },
  { designation: '6004', bore: 20, od: 42, width: 12, type: 'Deep Groove Ball' },
  { designation: '6005', bore: 25, od: 47, width: 12, type: 'Deep Groove Ball' },
  { designation: '6006', bore: 30, od: 55, width: 13, type: 'Deep Groove Ball' },
  { designation: '6007', bore: 35, od: 62, width: 14, type: 'Deep Groove Ball' },
  { designation: '6008', bore: 40, od: 68, width: 15, type: 'Deep Groove Ball' },
  { designation: '6009', bore: 45, od: 75, width: 16, type: 'Deep Groove Ball' },
  { designation: '6010', bore: 50, od: 80, width: 16, type: 'Deep Groove Ball' },
  { designation: '6200', bore: 10, od: 30, width: 9, type: 'Deep Groove Ball' },
  { designation: '6201', bore: 12, od: 32, width: 10, type: 'Deep Groove Ball' },
  { designation: '6202', bore: 15, od: 35, width: 11, type: 'Deep Groove Ball' },
  { designation: '6203', bore: 17, od: 40, width: 12, type: 'Deep Groove Ball' },
  { designation: '6204', bore: 20, od: 47, width: 14, type: 'Deep Groove Ball' },
  { designation: '6205', bore: 25, od: 52, width: 15, type: 'Deep Groove Ball' },
  { designation: '6206', bore: 30, od: 62, width: 16, type: 'Deep Groove Ball' },
  { designation: '6207', bore: 35, od: 72, width: 17, type: 'Deep Groove Ball' },
  { designation: '6208', bore: 40, od: 80, width: 18, type: 'Deep Groove Ball' },
  { designation: '6209', bore: 45, od: 85, width: 19, type: 'Deep Groove Ball' },
  { designation: '6210', bore: 50, od: 90, width: 20, type: 'Deep Groove Ball' },
  { designation: '6300', bore: 10, od: 35, width: 11, type: 'Deep Groove Ball' },
  { designation: '6301', bore: 12, od: 37, width: 12, type: 'Deep Groove Ball' },
  { designation: '6302', bore: 15, od: 42, width: 13, type: 'Deep Groove Ball' },
  { designation: '6303', bore: 17, od: 47, width: 14, type: 'Deep Groove Ball' },
  { designation: '6304', bore: 20, od: 52, width: 15, type: 'Deep Groove Ball' },
  { designation: '6305', bore: 25, od: 62, width: 17, type: 'Deep Groove Ball' },
  { designation: '6306', bore: 30, od: 72, width: 19, type: 'Deep Groove Ball' },
  { designation: '608', bore: 8, od: 22, width: 7, type: 'Deep Groove Ball (Miniature)' },
  { designation: '625', bore: 5, od: 16, width: 5, type: 'Deep Groove Ball (Miniature)' },
  { designation: '626', bore: 6, od: 19, width: 6, type: 'Deep Groove Ball (Miniature)' },
  { designation: '627', bore: 7, od: 22, width: 7, type: 'Deep Groove Ball (Miniature)' },
  { designation: '628', bore: 8, od: 24, width: 8, type: 'Deep Groove Ball (Miniature)' },
  { designation: '629', bore: 9, od: 26, width: 8, type: 'Deep Groove Ball (Miniature)' },
];

/**
 * BearingSizeConverter - Convert bearing designations to dimensions (ID, OD, width).
 * Looks up standard bearing designations and shows bore diameter, outer diameter, and width.
 */
export default function BearingSizeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [designation, setDesignation] = useState('');
  const [output, setOutput] = useState('');

  const lookup = () => {
    const query = designation.trim().toUpperCase();
    if (!query) {
      setOutput('');
      return;
    }

    const matches = BEARING_DATABASE.filter(b =>
      b.designation.toUpperCase().includes(query) || query.includes(b.designation.toUpperCase())
    );

    if (matches.length === 0) {
      setOutput(`No bearing found for designation "${designation.trim()}".\n\nSupported series: 6000, 6200, 6300, 608, 625-629.\nTry entering just the number (e.g., 6205, 608).`);
      return;
    }

    const results = matches.map(b => {
      const lines: string[] = [];
      lines.push(`Bearing: ${b.designation}`);
      lines.push(`Type: ${b.type}`);
      lines.push(`Bore Diameter (ID): ${b.bore} mm (${(b.bore / 25.4).toFixed(4)} in)`);
      lines.push(`Outer Diameter (OD): ${b.od} mm (${(b.od / 25.4).toFixed(4)} in)`);
      lines.push(`Width (B): ${b.width} mm (${(b.width / 25.4).toFixed(4)} in)`);
      return lines.join('\n');
    });

    setOutput(results.join('\n\n---\n\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
              Bearing Designation
            </label>
            <input
              id={`${toolId}-input`}
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="e.g., 6205, 608, 6300"
              aria-label={`Bearing designation for ${toolName}`}
              className="input-field w-full"
            />
          </div>
          <button onClick={lookup} className="btn-primary text-sm">
            Look Up Dimensions
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Bearing Dimensions</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
