'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * WifiChannelOverlapCalculator - Calculate WiFi channel overlap/interference.
 */
export default function WifiChannelOverlapCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [channel1, setChannel1] = useState('1');
  const [channel2, setChannel2] = useState('6');
  const [band, setBand] = useState('2.4');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const ch1 = parseInt(channel1);
    const ch2 = parseInt(channel2);

    if (isNaN(ch1) || isNaN(ch2)) {
      setOutput('Please enter valid channel numbers.');
      return;
    }

    if (band === '2.4') {
      const channelWidth = 22; // MHz
      const channelSpacing = 5; // MHz between adjacent channels
      const freq1 = 2412 + (ch1 - 1) * channelSpacing;
      const freq2 = 2412 + (ch2 - 1) * channelSpacing;
      const separation = Math.abs(freq1 - freq2);
      const overlap = Math.max(0, channelWidth - separation);
      const overlapPercent = Math.round((overlap / channelWidth) * 100);
      const nonOverlapping = [1, 6, 11];
      const isNonOverlapping = nonOverlapping.includes(ch1) && nonOverlapping.includes(ch2) && ch1 !== ch2;

      const lines: string[] = [
        `=== WiFi 2.4 GHz Channel Overlap ===`,
        ``,
        `Channel ${ch1}: ${freq1} MHz (center)`,
        `Channel ${ch2}: ${freq2} MHz (center)`,
        `Channel Width: ${channelWidth} MHz each`,
        ``,
        `Frequency Separation: ${separation} MHz`,
        `Overlap: ${overlap} MHz (${overlapPercent}%)`,
        ``,
        overlap > 0 ? `⚠️ These channels OVERLAP and will cause interference.` : `✅ These channels do NOT overlap.`,
        ``,
        `Non-overlapping channels: ${isNonOverlapping ? 'Yes (1, 6, 11 set)' : 'No'}`,
        ``,
        `Recommendation: ${overlap > 0 ? 'Use channels 1, 6, or 11 to avoid interference.' : 'Good channel selection!'}`,
      ];
      setOutput(lines.join('\n'));
    } else {
      const freq1 = 5000 + ch1 * 5;
      const freq2 = 5000 + ch2 * 5;
      const separation = Math.abs(freq1 - freq2);
      const channelWidth = 20;
      const overlap = Math.max(0, channelWidth - separation);

      const lines: string[] = [
        `=== WiFi 5 GHz Channel Overlap ===`,
        ``,
        `Channel ${ch1}: ${freq1} MHz (center)`,
        `Channel ${ch2}: ${freq2} MHz (center)`,
        `Channel Width: ${channelWidth} MHz (standard)`,
        ``,
        `Frequency Separation: ${separation} MHz`,
        `Overlap: ${overlap} MHz`,
        ``,
        overlap > 0 ? `⚠️ These channels overlap.` : `✅ No overlap — 5 GHz channels are non-overlapping by design.`,
      ];
      setOutput(lines.join('\n'));
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-band`} className="block text-sm font-medium text-gray-700 mb-1">WiFi Band</label>
            <select id={`${toolId}-band`} value={band} onChange={(e) => setBand(e.target.value)} aria-label={`WiFi band for ${toolName}`} className="input-field">
              <option value="2.4">2.4 GHz</option>
              <option value="5">5 GHz</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-ch1`} className="block text-sm font-medium text-gray-700 mb-1">Channel 1</label>
              <input id={`${toolId}-ch1`} type="number" value={channel1} onChange={(e) => setChannel1(e.target.value)} aria-label="First channel number" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-ch2`} className="block text-sm font-medium text-gray-700 mb-1">Channel 2</label>
              <input id={`${toolId}-ch2`} type="number" value={channel2} onChange={(e) => setChannel2(e.target.value)} aria-label="Second channel number" className="input-field" />
            </div>
          </div>
          <button onClick={calculate} className="btn-primary">Calculate Overlap</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Channel Overlap Analysis</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
