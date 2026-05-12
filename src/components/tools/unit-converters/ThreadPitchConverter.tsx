'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ThreadPitchConverter - Convert thread pitch between metric (mm) and imperial (TPI).
 * Metric pitch (mm per thread) = 25.4 / TPI, and TPI = 25.4 / pitch (mm).
 */
export default function ThreadPitchConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mode, setMode] = useState<'metricToTpi' | 'tpiToMetric'>('metricToTpi');
  const [inputValue, setInputValue] = useState('');
  const [output, setOutput] = useState('');

  const commonMetric = [
    { size: 'M3', pitch: 0.5 },
    { size: 'M4', pitch: 0.7 },
    { size: 'M5', pitch: 0.8 },
    { size: 'M6', pitch: 1.0 },
    { size: 'M8', pitch: 1.25 },
    { size: 'M10', pitch: 1.5 },
    { size: 'M12', pitch: 1.75 },
    { size: 'M16', pitch: 2.0 },
    { size: 'M20', pitch: 2.5 },
    { size: 'M24', pitch: 3.0 },
  ];

  const commonImperial = [
    { size: '#4-40', tpi: 40 },
    { size: '#6-32', tpi: 32 },
    { size: '#8-32', tpi: 32 },
    { size: '#10-24', tpi: 24 },
    { size: '#10-32', tpi: 32 },
    { size: '1/4-20', tpi: 20 },
    { size: '5/16-18', tpi: 18 },
    { size: '3/8-16', tpi: 16 },
    { size: '1/2-13', tpi: 13 },
    { size: '3/4-10', tpi: 10 },
  ];

  const convert = () => {
    const val = parseFloat(inputValue);
    if (isNaN(val) || val <= 0) {
      setOutput('Please enter a valid positive number.');
      return;
    }

    const lines: string[] = [];

    if (mode === 'metricToTpi') {
      const tpi = 25.4 / val;
      lines.push(`Metric Pitch: ${val} mm`);
      lines.push(`Imperial TPI: ${tpi.toFixed(4)} threads per inch`);
      lines.push(`Nearest whole TPI: ${Math.round(tpi)}`);
      lines.push(``);
      lines.push(`Formula: TPI = 25.4 / pitch(mm)`);
      lines.push(`         TPI = 25.4 / ${val} = ${tpi.toFixed(4)}`);
      lines.push(``);
      lines.push(`Common Metric Thread Pitches:`);
      commonMetric.forEach((t) => {
        lines.push(`  ${t.size}: ${t.pitch} mm → ${(25.4 / t.pitch).toFixed(1)} TPI`);
      });
    } else {
      const pitch = 25.4 / val;
      lines.push(`Imperial TPI: ${val} threads per inch`);
      lines.push(`Metric Pitch: ${pitch.toFixed(4)} mm`);
      lines.push(``);
      lines.push(`Formula: Pitch(mm) = 25.4 / TPI`);
      lines.push(`         Pitch = 25.4 / ${val} = ${pitch.toFixed(4)} mm`);
      lines.push(``);
      lines.push(`Common Imperial Thread Sizes:`);
      commonImperial.forEach((t) => {
        lines.push(`  ${t.size}: ${t.tpi} TPI → ${(25.4 / t.tpi).toFixed(3)} mm`);
      });
    }

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-2">Conversion Direction</label>
        <div className="flex gap-4 mb-3">
          <label className="flex items-center gap-1 text-sm">
            <input
              type="radio"
              name={`${toolId}-mode`}
              checked={mode === 'metricToTpi'}
              onChange={() => setMode('metricToTpi')}
            />
            Metric (mm) → TPI
          </label>
          <label className="flex items-center gap-1 text-sm">
            <input
              type="radio"
              name={`${toolId}-mode`}
              checked={mode === 'tpiToMetric'}
              onChange={() => setMode('tpiToMetric')}
            />
            TPI → Metric (mm)
          </label>
        </div>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          {mode === 'metricToTpi' ? 'Thread Pitch (mm)' : 'Threads Per Inch (TPI)'}
        </label>
        <input
          id={`${toolId}-input`}
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={mode === 'metricToTpi' ? 'e.g., 1.25' : 'e.g., 20'}
          aria-label={`Input for ${toolName}`}
          className="input-field"
          min="0"
          step="any"
        />
        <button onClick={convert} className="btn-primary mt-2">
          Convert
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
