'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * NetworkTimeProtocolViewer - Show NTP-style time with precision display.
 */
export default function NetworkTimeProtocolViewer({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const formatNTPTime = () => {
    const now = new Date();
    // NTP epoch: Jan 1, 1900
    const ntpEpoch = new Date('1900-01-01T00:00:00Z');
    const ntpSeconds = Math.floor((now.getTime() - ntpEpoch.getTime()) / 1000);
    const fractional = (now.getMilliseconds() / 1000).toFixed(6).slice(2);

    const utcStr = now.toISOString();
    const unixTimestamp = Math.floor(now.getTime() / 1000);
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);

    const lines = [
      `NTP Timestamp: ${ntpSeconds}.${fractional}`,
      `NTP Seconds (since 1900-01-01): ${ntpSeconds}`,
      `Fractional Seconds: 0.${fractional}`,
      ``,
      `UTC Time: ${utcStr}`,
      `Unix Timestamp: ${unixTimestamp}`,
      `Day of Year: ${dayOfYear}`,
      ``,
      `Precision: millisecond (±1ms browser clock)`,
      `Stratum: N/A (local clock)`,
      `Reference: Browser Date API`,
    ];

    setOutput(lines.join('\n'));
  };

  const startClock = () => {
    setRunning(true);
    formatNTPTime();
    intervalRef.current = setInterval(formatNTPTime, 100);
  };

  const stopClock = () => {
    setRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            View the current time in NTP (Network Time Protocol) format with high-precision display. Shows NTP seconds since January 1, 1900.
          </p>
          <div className="flex gap-3">
            <button onClick={startClock} disabled={running} className="btn-primary flex-1" aria-label={`Start clock for ${toolName}`}>
              {running ? 'Running...' : 'Start Live Clock'}
            </button>
            <button onClick={stopClock} disabled={!running} className="btn-primary flex-1 bg-gray-600 hover:bg-gray-700">
              Stop
            </button>
          </div>
          <button onClick={formatNTPTime} className="btn-primary w-full bg-green-600 hover:bg-green-700">
            Snapshot Current Time
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">NTP Time Display</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-md">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
