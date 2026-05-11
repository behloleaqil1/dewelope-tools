'use client';

import { useState, useEffect } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * UnixEpochCountdown - Show live countdown to next Unix epoch milestones.
 * Tracks next billion seconds, next round timestamps, Y2K38 problem, etc.
 */
export default function UnixEpochCountdown({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const milestones = [
    { label: '2 Billion Seconds', epoch: 2000000000, description: 'Unix timestamp reaches 2,000,000,000' },
    { label: '2^31 - 1 (Y2K38)', epoch: 2147483647, description: 'Max 32-bit signed integer — Y2038 problem' },
    { label: '2.5 Billion Seconds', epoch: 2500000000, description: 'Unix timestamp reaches 2,500,000,000' },
    { label: '3 Billion Seconds', epoch: 3000000000, description: 'Unix timestamp reaches 3,000,000,000' },
    { label: '2^32 (Unsigned 32-bit)', epoch: 4294967296, description: 'Max unsigned 32-bit integer overflow' },
  ].filter((m) => m.epoch > now);

  const formatCountdown = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const parts: string[] = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    parts.push(`${secs}s`);
    return parts.join(' ');
  };

  const formatDate = (epoch: number) => {
    return new Date(epoch * 1000).toUTCString();
  };

  const copyText = `Current Unix Epoch: ${now}\n\nUpcoming Milestones:\n${milestones.map((m) => `${m.label} (${m.epoch}): ${formatCountdown(m.epoch - now)} away — ${formatDate(m.epoch)}`).join('\n')}`;

  return (
    <div className="space-y-4" data-tool-id={toolId} aria-label={toolName}>
      <div className="bg-gray-900 text-green-400 p-6 rounded-lg text-center">
        <div className="text-sm text-gray-400 mb-1">Current Unix Epoch</div>
        <div className="text-4xl font-mono font-bold">{now}</div>
        <div className="text-xs text-gray-500 mt-2">{new Date(now * 1000).toUTCString()}</div>
      </div>

      <OutputArea hasContent={milestones.length > 0}>
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Upcoming Milestones</label>
          {milestones.map((milestone) => {
            const remaining = milestone.epoch - now;
            const progress = Math.min(((now / milestone.epoch) * 100), 100);

            return (
              <div key={milestone.epoch} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium text-gray-800">{milestone.label}</div>
                    <div className="text-xs text-gray-500">{milestone.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm text-gray-600">{milestone.epoch.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{formatDate(milestone.epoch)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="font-mono text-sm font-medium text-green-700 whitespace-nowrap">
                    {formatCountdown(remaining)}
                  </div>
                </div>
              </div>
            );
          })}
          <CopyToClipboard text={copyText} />
        </div>
      </OutputArea>
    </div>
  );
}
