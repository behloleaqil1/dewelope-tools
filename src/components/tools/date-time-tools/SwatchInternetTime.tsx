'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SwatchInternetTime - Convert to Swatch Internet Time (.beats).
 * Swatch Internet Time divides the day into 1000 .beats (BMT timezone, UTC+1).
 */
export default function SwatchInternetTime({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mode, setMode] = useState<'live' | 'convert'>('live');
  const [inputTime, setInputTime] = useState('');
  const [inputTimezone, setInputTimezone] = useState('0');
  const [liveBeats, setLiveBeats] = useState('');
  const [convertResult, setConvertResult] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const calculateBeats = (date: Date): string => {
    const utcHours = date.getUTCHours();
    const utcMinutes = date.getUTCMinutes();
    const utcSeconds = date.getUTCSeconds();
    // BMT = UTC+1
    const bmtSeconds = ((utcHours + 1) * 3600 + utcMinutes * 60 + utcSeconds) % 86400;
    const beats = (bmtSeconds / 86.4).toFixed(2);
    return beats;
  };

  useEffect(() => {
    if (mode === 'live') {
      const update = () => {
        setLiveBeats(calculateBeats(new Date()));
      };
      update();
      intervalRef.current = setInterval(update, 864);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [mode]);

  const convert = () => {
    if (!inputTime) return;
    const [hours, minutes] = inputTime.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return;

    const tzOffset = parseFloat(inputTimezone);
    // Convert to UTC then to BMT (UTC+1)
    const totalMinutes = hours * 60 + minutes;
    const utcMinutes = ((totalMinutes - tzOffset * 60) % 1440 + 1440) % 1440;
    const bmtMinutes = (utcMinutes + 60) % 1440;
    const beats = ((bmtMinutes * 60) / 86.4).toFixed(2);

    setConvertResult(
      `Input: ${inputTime} (UTC${tzOffset >= 0 ? '+' : ''}${tzOffset})\n` +
      `Swatch Internet Time: @${beats} .beats\n\n` +
      `1 .beat = 1 minute 26.4 seconds\n` +
      `@000 = midnight BMT (UTC+1)\n` +
      `@500 = noon BMT`
    );
  };

  const beatsToTime = (beats: number): string => {
    const bmtSeconds = beats * 86.4;
    const h = Math.floor(bmtSeconds / 3600);
    const m = Math.floor((bmtSeconds % 3600) / 60);
    const s = Math.floor(bmtSeconds % 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')} BMT`;
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setMode('live')}
            className={`px-4 py-2 rounded text-sm font-medium ${mode === 'live' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Live Clock
          </button>
          <button
            onClick={() => setMode('convert')}
            className={`px-4 py-2 rounded text-sm font-medium ${mode === 'convert' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Convert Time
          </button>
        </div>

        {mode === 'convert' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor={`${toolId}-time`} className="block text-sm font-medium text-gray-700 mb-1">
                Time (HH:MM)
              </label>
              <input
                id={`${toolId}-time`}
                type="time"
                value={inputTime}
                onChange={(e) => setInputTime(e.target.value)}
                aria-label={`Time input for ${toolName}`}
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor={`${toolId}-tz`} className="block text-sm font-medium text-gray-700 mb-1">
                Timezone (UTC offset)
              </label>
              <select
                id={`${toolId}-tz`}
                value={inputTimezone}
                onChange={(e) => setInputTimezone(e.target.value)}
                aria-label="Timezone offset"
                className="input-field"
              >
                {Array.from({ length: 25 }, (_, i) => i - 12).map(offset => (
                  <option key={offset} value={offset}>
                    UTC{offset >= 0 ? '+' : ''}{offset}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={convert} disabled={!inputTime} className="btn-primary w-full">
                Convert
              </button>
            </div>
          </div>
        )}
      </InputArea>

      <OutputArea hasContent={mode === 'live' ? !!liveBeats : !!convertResult}>
        {mode === 'live' && liveBeats && (
          <div className="space-y-4 text-center">
            <div>
              <p className="text-sm text-gray-500 mb-1">Current Swatch Internet Time</p>
              <p className="text-5xl font-mono font-bold text-blue-600">@{liveBeats}</p>
              <p className="text-sm text-gray-500 mt-2">.beats</p>
            </div>
            <div className="text-sm text-gray-600">
              <p>Equivalent: {beatsToTime(parseFloat(liveBeats))}</p>
              <p className="mt-1 text-xs text-gray-400">Based on Biel Mean Time (BMT = UTC+1)</p>
            </div>
            <CopyToClipboard text={`@${liveBeats}`} />
          </div>
        )}
        {mode === 'convert' && convertResult && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded border">{convertResult}</pre>
            <CopyToClipboard text={convertResult} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
