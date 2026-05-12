'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ChainSizeConverter - Convert chain/sprocket sizes between ANSI and ISO standards.
 * Provides conversion between ANSI roller chain numbers and ISO chain designations.
 */
export default function ChainSizeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selectedChain, setSelectedChain] = useState('25');
  const [output, setOutput] = useState('');

  const chainData: Record<string, { ansi: string; iso: string; pitch: number; pitchUnit: string; rollerDia: number; innerWidth: number; tensileStrength: number }> = {
    '25': { ansi: '25', iso: '04C', pitch: 6.35, pitchUnit: 'mm', rollerDia: 3.30, innerWidth: 3.18, tensileStrength: 3.5 },
    '35': { ansi: '35', iso: '06C', pitch: 9.525, pitchUnit: 'mm', rollerDia: 5.08, innerWidth: 4.77, tensileStrength: 7.9 },
    '40': { ansi: '40', iso: '08A', pitch: 12.70, pitchUnit: 'mm', rollerDia: 7.92, innerWidth: 7.85, tensileStrength: 14.1 },
    '41': { ansi: '41', iso: '085', pitch: 12.70, pitchUnit: 'mm', rollerDia: 7.77, innerWidth: 6.25, tensileStrength: 6.7 },
    '50': { ansi: '50', iso: '10A', pitch: 15.875, pitchUnit: 'mm', rollerDia: 10.16, innerWidth: 9.40, tensileStrength: 22.2 },
    '60': { ansi: '60', iso: '12A', pitch: 19.05, pitchUnit: 'mm', rollerDia: 11.91, innerWidth: 12.57, tensileStrength: 31.8 },
    '80': { ansi: '80', iso: '16A', pitch: 25.40, pitchUnit: 'mm', rollerDia: 15.88, innerWidth: 15.75, tensileStrength: 56.7 },
    '100': { ansi: '100', iso: '20A', pitch: 31.75, pitchUnit: 'mm', rollerDia: 19.05, innerWidth: 18.90, tensileStrength: 88.5 },
    '120': { ansi: '120', iso: '24A', pitch: 38.10, pitchUnit: 'mm', rollerDia: 22.23, innerWidth: 25.22, tensileStrength: 127.0 },
    '140': { ansi: '140', iso: '28A', pitch: 44.45, pitchUnit: 'mm', rollerDia: 25.40, innerWidth: 25.22, tensileStrength: 172.4 },
    '160': { ansi: '160', iso: '32A', pitch: 50.80, pitchUnit: 'mm', rollerDia: 28.58, innerWidth: 31.55, tensileStrength: 226.8 },
    '200': { ansi: '200', iso: '40A', pitch: 63.50, pitchUnit: 'mm', rollerDia: 39.68, innerWidth: 37.85, tensileStrength: 355.6 },
  };

  const convert = () => {
    const chain = chainData[selectedChain];
    if (!chain) {
      setOutput('Chain data not found.');
      return;
    }

    const pitchInches = chain.pitch / 25.4;
    const rollerInches = chain.rollerDia / 25.4;
    const widthInches = chain.innerWidth / 25.4;

    const results: string[] = [];
    results.push('=== Chain Size Conversion ===');
    results.push('');
    results.push(`ANSI Number: ${chain.ansi}`);
    results.push(`ISO Designation: ${chain.iso}`);
    results.push('');
    results.push('--- Dimensions ---');
    results.push(`Pitch: ${chain.pitch} mm (${pitchInches.toFixed(4)} in)`);
    results.push(`Roller Diameter: ${chain.rollerDia} mm (${rollerInches.toFixed(4)} in)`);
    results.push(`Inner Width: ${chain.innerWidth} mm (${widthInches.toFixed(4)} in)`);
    results.push('');
    results.push('--- Strength ---');
    results.push(`Min. Tensile Strength: ${chain.tensileStrength} kN`);
    results.push(`Min. Tensile Strength: ${(chain.tensileStrength * 224.809).toFixed(0)} lbf`);
    results.push('');
    results.push('--- Notes ---');
    results.push(`ANSI pitch number = pitch in 1/8 inch increments`);
    results.push(`Chain ${chain.ansi}: ${chain.pitch} mm = ${(chain.pitch / 25.4 * 8).toFixed(0)}/8 inch`);

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-chain`} className="block text-sm font-medium text-gray-700 mb-1">
          Select ANSI Chain Number
        </label>
        <select
          id={`${toolId}-chain`}
          value={selectedChain}
          onChange={(e) => setSelectedChain(e.target.value)}
          className="input-field"
          aria-label={`Chain selection for ${toolName}`}
        >
          {Object.keys(chainData).map((key) => (
            <option key={key} value={key}>ANSI #{key} (ISO {chainData[key].iso})</option>
          ))}
        </select>

        <button
          onClick={convert}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Convert
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Chain Specifications</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
