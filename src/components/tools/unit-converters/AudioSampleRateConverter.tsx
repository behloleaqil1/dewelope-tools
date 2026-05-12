'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AudioSampleRateConverter - Convert between audio sample rates.
 * Calculates sample count, duration, and data rate conversions between common rates.
 */
export default function AudioSampleRateConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [samples, setSamples] = useState('44100');
  const [fromRate, setFromRate] = useState('44100');
  const [toRate, setToRate] = useState('48000');
  const [bitDepth, setBitDepth] = useState('16');
  const [channels, setChannels] = useState('2');
  const [output, setOutput] = useState('');

  const rates = [
    { value: '8000', label: '8 kHz (Telephone)' },
    { value: '11025', label: '11.025 kHz' },
    { value: '22050', label: '22.05 kHz' },
    { value: '44100', label: '44.1 kHz (CD)' },
    { value: '48000', label: '48 kHz (DVD/DAT)' },
    { value: '88200', label: '88.2 kHz' },
    { value: '96000', label: '96 kHz (Hi-Res)' },
    { value: '176400', label: '176.4 kHz' },
    { value: '192000', label: '192 kHz (Studio)' },
    { value: '352800', label: '352.8 kHz (DSD64 equiv)' },
    { value: '384000', label: '384 kHz' },
  ];

  const calculate = () => {
    const sampleCount = parseInt(samples);
    const from = parseInt(fromRate);
    const to = parseInt(toRate);
    const bits = parseInt(bitDepth);
    const ch = parseInt(channels);

    if (isNaN(sampleCount) || isNaN(from) || isNaN(to) || sampleCount <= 0 || from <= 0 || to <= 0) {
      setOutput('Please enter valid positive values.');
      return;
    }

    const durationSec = sampleCount / from;
    const newSampleCount = Math.round(durationSec * to);
    const ratio = to / from;

    const fromBitrate = (from * bits * ch) / 1000;
    const toBitrate = (to * bits * ch) / 1000;
    const fromFileSize = (sampleCount * bits * ch) / 8;
    const toFileSize = (newSampleCount * bits * ch) / 8;

    const formatSize = (bytes: number) => {
      if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(2)} GB`;
      if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(2)} MB`;
      if (bytes >= 1e3) return `${(bytes / 1e3).toFixed(2)} KB`;
      return `${bytes} bytes`;
    };

    const nyquistFrom = from / 2;
    const nyquistTo = to / 2;

    const lines: string[] = [];
    lines.push(`=== Audio Sample Rate Conversion ===`);
    lines.push(`From: ${(from / 1000).toFixed(3)} kHz → To: ${(to / 1000).toFixed(3)} kHz`);
    lines.push(`Ratio: ${ratio.toFixed(6)}x`);
    lines.push(``);
    lines.push(`--- Sample Conversion ---`);
    lines.push(`Input Samples: ${sampleCount.toLocaleString()}`);
    lines.push(`Output Samples: ${newSampleCount.toLocaleString()}`);
    lines.push(`Duration: ${durationSec.toFixed(6)} seconds`);
    lines.push(``);
    lines.push(`--- Audio Properties ---`);
    lines.push(`Bit Depth: ${bits}-bit | Channels: ${ch}`);
    lines.push(`Source Bitrate: ${fromBitrate.toFixed(1)} kbps`);
    lines.push(`Target Bitrate: ${toBitrate.toFixed(1)} kbps`);
    lines.push(``);
    lines.push(`--- File Size (uncompressed PCM) ---`);
    lines.push(`Source: ${formatSize(fromFileSize)}`);
    lines.push(`Target: ${formatSize(toFileSize)}`);
    lines.push(``);
    lines.push(`--- Nyquist Frequency ---`);
    lines.push(`Source max frequency: ${(nyquistFrom / 1000).toFixed(3)} kHz`);
    lines.push(`Target max frequency: ${(nyquistTo / 1000).toFixed(3)} kHz`);

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-samples`} className="block text-sm font-medium text-gray-700 mb-1">Number of Samples</label>
            <input id={`${toolId}-samples`} type="number" value={samples} onChange={(e) => setSamples(e.target.value)} className="input-field" aria-label={`Sample count for ${toolName}`} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-from`} className="block text-sm font-medium text-gray-700 mb-1">From Sample Rate</label>
              <select id={`${toolId}-from`} value={fromRate} onChange={(e) => setFromRate(e.target.value)} className="input-field" aria-label="Source sample rate">
                {rates.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor={`${toolId}-to`} className="block text-sm font-medium text-gray-700 mb-1">To Sample Rate</label>
              <select id={`${toolId}-to`} value={toRate} onChange={(e) => setToRate(e.target.value)} className="input-field" aria-label="Target sample rate">
                {rates.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-bits`} className="block text-sm font-medium text-gray-700 mb-1">Bit Depth</label>
              <select id={`${toolId}-bits`} value={bitDepth} onChange={(e) => setBitDepth(e.target.value)} className="input-field" aria-label="Bit depth">
                <option value="8">8-bit</option>
                <option value="16">16-bit (CD)</option>
                <option value="24">24-bit (Hi-Res)</option>
                <option value="32">32-bit (Float)</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${toolId}-ch`} className="block text-sm font-medium text-gray-700 mb-1">Channels</label>
              <select id={`${toolId}-ch`} value={channels} onChange={(e) => setChannels(e.target.value)} className="input-field" aria-label="Audio channels">
                <option value="1">Mono (1)</option>
                <option value="2">Stereo (2)</option>
                <option value="6">5.1 Surround (6)</option>
                <option value="8">7.1 Surround (8)</option>
              </select>
            </div>
          </div>
          <button onClick={calculate} className="btn-primary">Convert</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Conversion Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
