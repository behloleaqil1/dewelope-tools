'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * BandwidthCalculator - Calculate download/upload time from file size and speed.
 */
export default function BandwidthCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [fileSize, setFileSize] = useState('');
  const [fileSizeUnit, setFileSizeUnit] = useState('MB');
  const [speed, setSpeed] = useState('');
  const [speedUnit, setSpeedUnit] = useState('Mbps');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ seconds: number; formatted: string } | null>(null);

  const SIZE_TO_BYTES: Record<string, number> = {
    B: 1,
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024,
    TB: 1024 * 1024 * 1024 * 1024,
  };

  const SPEED_TO_BPS: Record<string, number> = {
    bps: 1,
    Kbps: 1000,
    Mbps: 1000000,
    Gbps: 1000000000,
  };

  function calculate() {
    const newErrors: Record<string, string> = {};
    const size = parseFloat(fileSize);
    const spd = parseFloat(speed);

    if (!fileSize.trim() || isNaN(size) || size <= 0) {
      newErrors.fileSize = 'Please enter a valid file size';
    }
    if (!speed.trim() || isNaN(spd) || spd <= 0) {
      newErrors.speed = 'Please enter a valid speed';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});

    const bytes = size * SIZE_TO_BYTES[fileSizeUnit];
    const bits = bytes * 8;
    const bitsPerSecond = spd * SPEED_TO_BPS[speedUnit];
    const seconds = bits / bitsPerSecond;

    let formatted: string;
    if (seconds < 1) {
      formatted = `${(seconds * 1000).toFixed(0)} ms`;
    } else if (seconds < 60) {
      formatted = `${seconds.toFixed(2)} seconds`;
    } else if (seconds < 3600) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      formatted = `${mins} min ${secs} sec`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = Math.floor(seconds % 60);
      formatted = `${hours} hr ${mins} min ${secs} sec`;
    }

    setResult({ seconds, formatted });
  }

  const copyText = result
    ? `File Size: ${fileSize} ${fileSizeUnit}\nSpeed: ${speed} ${speedUnit}\nTransfer Time: ${result.formatted} (${result.seconds.toFixed(4)} seconds)`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea error={errors.fileSize}>
          <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">
            File Size
          </label>
          <div className="flex gap-2">
            <input
              id={`${toolId}-size`}
              type="text"
              inputMode="decimal"
              value={fileSize}
              onChange={(e) => {
                setFileSize(e.target.value);
                if (errors.fileSize) setErrors((prev) => ({ ...prev, fileSize: '' }));
              }}
              placeholder="e.g. 700"
              aria-label={`File size for ${toolName}`}
              className="input-field flex-1"
            />
            <select
              value={fileSizeUnit}
              onChange={(e) => setFileSizeUnit(e.target.value)}
              aria-label="File size unit"
              className="input-field w-24 text-sm"
            >
              <option value="B">B</option>
              <option value="KB">KB</option>
              <option value="MB">MB</option>
              <option value="GB">GB</option>
              <option value="TB">TB</option>
            </select>
          </div>
        </InputArea>

        <InputArea error={errors.speed}>
          <label htmlFor={`${toolId}-speed`} className="block text-sm font-medium text-gray-700 mb-1">
            Connection Speed
          </label>
          <div className="flex gap-2">
            <input
              id={`${toolId}-speed`}
              type="text"
              inputMode="decimal"
              value={speed}
              onChange={(e) => {
                setSpeed(e.target.value);
                if (errors.speed) setErrors((prev) => ({ ...prev, speed: '' }));
              }}
              placeholder="e.g. 100"
              aria-label={`Connection speed for ${toolName}`}
              className="input-field flex-1"
            />
            <select
              value={speedUnit}
              onChange={(e) => setSpeedUnit(e.target.value)}
              aria-label="Speed unit"
              className="input-field w-24 text-sm"
            >
              <option value="bps">bps</option>
              <option value="Kbps">Kbps</option>
              <option value="Mbps">Mbps</option>
              <option value="Gbps">Gbps</option>
            </select>
          </div>
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate transfer time" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600">{result.formatted}</div>
              <div className="text-xs text-gray-500 mt-1">Estimated Transfer Time</div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              {fileSize} {fileSizeUnit} at {speed} {speedUnit} = {result.seconds.toFixed(4)} seconds
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
