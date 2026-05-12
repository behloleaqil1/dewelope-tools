'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AudioBitDepthConverter - Convert between audio bit depths and calculate dynamic range.
 */
export default function AudioBitDepthConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [sourceBitDepth, setSourceBitDepth] = useState('16');
  const [targetBitDepth, setTargetBitDepth] = useState('24');
  const [sampleRate, setSampleRate] = useState('44100');
  const [channels, setChannels] = useState('2');
  const [durationSec, setDurationSec] = useState('60');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const srcBits = parseInt(sourceBitDepth);
    const tgtBits = parseInt(targetBitDepth);
    const rate = parseInt(sampleRate);
    const ch = parseInt(channels);
    const dur = parseFloat(durationSec);

    if (isNaN(srcBits) || isNaN(tgtBits) || isNaN(rate) || isNaN(ch) || isNaN(dur)) {
      setOutput('Error: Please enter valid numeric values.');
      return;
    }

    // Dynamic range = ~6.02 dB per bit + 1.76 dB
    const srcDynamicRange = srcBits * 6.02 + 1.76;
    const tgtDynamicRange = tgtBits * 6.02 + 1.76;

    // Signal-to-noise ratio (theoretical max)
    const srcSNR = srcBits * 6.02;
    const tgtSNR = tgtBits * 6.02;

    // File size calculations (uncompressed PCM)
    const srcFileSize = (rate * srcBits * ch * dur) / 8;
    const tgtFileSize = (rate * tgtBits * ch * dur) / 8;

    // Quantization levels
    const srcLevels = Math.pow(2, srcBits);
    const tgtLevels = Math.pow(2, tgtBits);

    // Bitrate
    const srcBitrate = (rate * srcBits * ch) / 1000;
    const tgtBitrate = (rate * tgtBits * ch) / 1000;

    const formatSize = (bytes: number): string => {
      if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(2)} GB`;
      if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(2)} MB`;
      if (bytes >= 1024) return `${(bytes / 1024).toFixed(2)} KB`;
      return `${bytes} bytes`;
    };

    const results = [
      `=== Audio Bit Depth Conversion ===`,
      ``,
      `Source: ${srcBits}-bit → Target: ${tgtBits}-bit`,
      `Sample Rate: ${rate} Hz | Channels: ${ch} | Duration: ${dur}s`,
      ``,
      `--- Source (${srcBits}-bit) ---`,
      `Dynamic Range: ${srcDynamicRange.toFixed(2)} dB`,
      `SNR (theoretical): ${srcSNR.toFixed(2)} dB`,
      `Quantization Levels: ${srcLevels.toLocaleString()}`,
      `Bitrate: ${srcBitrate.toFixed(1)} kbps`,
      `File Size: ${formatSize(srcFileSize)}`,
      ``,
      `--- Target (${tgtBits}-bit) ---`,
      `Dynamic Range: ${tgtDynamicRange.toFixed(2)} dB`,
      `SNR (theoretical): ${tgtSNR.toFixed(2)} dB`,
      `Quantization Levels: ${tgtLevels.toLocaleString()}`,
      `Bitrate: ${tgtBitrate.toFixed(1)} kbps`,
      `File Size: ${formatSize(tgtFileSize)}`,
      ``,
      `--- Comparison ---`,
      `Dynamic Range Gain: ${(tgtDynamicRange - srcDynamicRange).toFixed(2)} dB`,
      `Resolution Increase: ${(tgtLevels / srcLevels).toFixed(0)}x more levels`,
      `File Size Change: ${((tgtFileSize / srcFileSize - 1) * 100).toFixed(1)}%`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-src`} className="block text-sm font-medium text-gray-700 mb-1">Source Bit Depth</label>
              <select id={`${toolId}-src`} value={sourceBitDepth} onChange={(e) => setSourceBitDepth(e.target.value)} aria-label={`Source bit depth for ${toolName}`} className="input-field">
                <option value="8">8-bit</option>
                <option value="16">16-bit</option>
                <option value="24">24-bit</option>
                <option value="32">32-bit</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${toolId}-tgt`} className="block text-sm font-medium text-gray-700 mb-1">Target Bit Depth</label>
              <select id={`${toolId}-tgt`} value={targetBitDepth} onChange={(e) => setTargetBitDepth(e.target.value)} aria-label="Target bit depth" className="input-field">
                <option value="8">8-bit</option>
                <option value="16">16-bit</option>
                <option value="24">24-bit</option>
                <option value="32">32-bit</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor={`${toolId}-rate`} className="block text-sm font-medium text-gray-700 mb-1">Sample Rate (Hz)</label>
              <input id={`${toolId}-rate`} type="number" value={sampleRate} onChange={(e) => setSampleRate(e.target.value)} placeholder="44100" aria-label="Sample rate" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-ch`} className="block text-sm font-medium text-gray-700 mb-1">Channels</label>
              <input id={`${toolId}-ch`} type="number" value={channels} onChange={(e) => setChannels(e.target.value)} placeholder="2" aria-label="Number of channels" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-dur`} className="block text-sm font-medium text-gray-700 mb-1">Duration (s)</label>
              <input id={`${toolId}-dur`} type="number" value={durationSec} onChange={(e) => setDurationSec(e.target.value)} placeholder="60" aria-label="Duration in seconds" className="input-field" />
            </div>
          </div>
          <button onClick={calculate} className="btn-primary">Calculate</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Bit Depth Comparison</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
