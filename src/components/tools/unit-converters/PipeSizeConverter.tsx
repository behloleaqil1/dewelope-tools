'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PipeSizeConverter - Convert pipe sizes between NPS, DN, and actual dimensions.
 * Shows outer diameter, wall thickness, and inner diameter for standard pipe sizes.
 */
export default function PipeSizeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selectedSize, setSelectedSize] = useState('');
  const [output, setOutput] = useState('');

  // Standard pipe sizes: NPS, DN (mm), OD (inches), OD (mm)
  const pipeSizes = [
    { nps: '1/8', dn: 6, odIn: 0.405, odMm: 10.3 },
    { nps: '1/4', dn: 8, odIn: 0.540, odMm: 13.7 },
    { nps: '3/8', dn: 10, odIn: 0.675, odMm: 17.1 },
    { nps: '1/2', dn: 15, odIn: 0.840, odMm: 21.3 },
    { nps: '3/4', dn: 20, odIn: 1.050, odMm: 26.7 },
    { nps: '1', dn: 25, odIn: 1.315, odMm: 33.4 },
    { nps: '1-1/4', dn: 32, odIn: 1.660, odMm: 42.2 },
    { nps: '1-1/2', dn: 40, odIn: 1.900, odMm: 48.3 },
    { nps: '2', dn: 50, odIn: 2.375, odMm: 60.3 },
    { nps: '2-1/2', dn: 65, odIn: 2.875, odMm: 73.0 },
    { nps: '3', dn: 80, odIn: 3.500, odMm: 88.9 },
    { nps: '3-1/2', dn: 90, odIn: 4.000, odMm: 101.6 },
    { nps: '4', dn: 100, odIn: 4.500, odMm: 114.3 },
    { nps: '5', dn: 125, odIn: 5.563, odMm: 141.3 },
    { nps: '6', dn: 150, odIn: 6.625, odMm: 168.3 },
    { nps: '8', dn: 200, odIn: 8.625, odMm: 219.1 },
    { nps: '10', dn: 250, odIn: 10.750, odMm: 273.0 },
    { nps: '12', dn: 300, odIn: 12.750, odMm: 323.8 },
    { nps: '14', dn: 350, odIn: 14.000, odMm: 355.6 },
    { nps: '16', dn: 400, odIn: 16.000, odMm: 406.4 },
    { nps: '18', dn: 450, odIn: 18.000, odMm: 457.2 },
    { nps: '20', dn: 500, odIn: 20.000, odMm: 508.0 },
    { nps: '24', dn: 600, odIn: 24.000, odMm: 609.6 },
  ];

  // Common schedules with wall thickness multipliers
  const schedules = [
    { name: 'Sch 5', factor: 0.035 },
    { name: 'Sch 10', factor: 0.049 },
    { name: 'Sch 40 (Std)', factor: 0.091 },
    { name: 'Sch 80 (XS)', factor: 0.120 },
    { name: 'Sch 160', factor: 0.165 },
  ];

  const convert = () => {
    if (selectedSize === 'all') {
      const lines: string[] = [
        'Standard Pipe Size Reference Table',
        '===================================',
        '',
        'NPS     | DN (mm) | OD (in)  | OD (mm)',
        '--------+---------+----------+---------',
      ];

      for (const pipe of pipeSizes) {
        lines.push(`${pipe.nps.padEnd(7)} | ${String(pipe.dn).padEnd(7)} | ${pipe.odIn.toFixed(3).padEnd(8)} | ${pipe.odMm.toFixed(1)}`);
      }

      setOutput(lines.join('\n'));
      return;
    }

    const pipe = pipeSizes.find((p) => p.nps === selectedSize);
    if (!pipe) {
      setOutput('Please select a pipe size.');
      return;
    }

    const lines: string[] = [
      `Pipe Size: NPS ${pipe.nps} / DN ${pipe.dn}`,
      `==========================================`,
      '',
      `Outer Diameter:`,
      `  ${pipe.odIn.toFixed(3)} inches`,
      `  ${pipe.odMm.toFixed(1)} mm`,
      '',
      `Schedule Details:`,
      `${'Schedule'.padEnd(16)} | ${'Wall (in)'.padEnd(10)} | ${'Wall (mm)'.padEnd(10)} | ${'ID (in)'.padEnd(10)} | ID (mm)`,
      `${'-'.repeat(16)}-+-${'-'.repeat(10)}-+-${'-'.repeat(10)}-+-${'-'.repeat(10)}-+-${'-'.repeat(10)}`,
    ];

    for (const sch of schedules) {
      const wallIn = pipe.odIn * sch.factor;
      const wallMm = wallIn * 25.4;
      const idIn = pipe.odIn - 2 * wallIn;
      const idMm = idIn * 25.4;
      lines.push(`${sch.name.padEnd(16)} | ${wallIn.toFixed(3).padEnd(10)} | ${wallMm.toFixed(2).padEnd(10)} | ${idIn.toFixed(3).padEnd(10)} | ${idMm.toFixed(2)}`);
    }

    lines.push('');
    lines.push('Note: Wall thicknesses are approximate. Refer to ASME B36.10M for exact values.');

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">
          Select Pipe Size (NPS)
        </label>
        <select
          id={`${toolId}-size`}
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
          aria-label={`Pipe size for ${toolName}`}
          className="input-field"
        >
          <option value="">-- Select a size --</option>
          <option value="all">All Sizes (Reference Table)</option>
          {pipeSizes.map((p) => (
            <option key={p.nps} value={p.nps}>
              NPS {p.nps} / DN {p.dn}
            </option>
          ))}
        </select>
      </InputArea>

      <button onClick={convert} aria-label="Convert pipe size" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Pipe Size Details</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
