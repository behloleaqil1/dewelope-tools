'use client';

import { useState, useEffect, useRef } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface CountdownValues {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  targetYear: number;
}

/**
 * CountdownToNewYear - Live countdown to next New Year's Eve.
 */
export default function CountdownToNewYear({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [countdown, setCountdown] = useState<CountdownValues | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function getNextNewYear(): Date {
    const now = new Date();
    const year = now.getFullYear();
    const nextYear = new Date(year + 1, 0, 1, 0, 0, 0, 0);
    return nextYear;
  }

  function calculateCountdown(): CountdownValues {
    const now = new Date();
    const target = getNextNewYear();
    const diff = target.getTime() - now.getTime();

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, targetYear: now.getFullYear() + 1 };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, targetYear: target.getFullYear() };
  }

  useEffect(() => {
    setCountdown(calculateCountdown());
    intervalRef.current = setInterval(() => {
      setCountdown(calculateCountdown());
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copyText = countdown
    ? `Countdown to New Year ${countdown.targetYear}: ${countdown.days} days, ${countdown.hours} hours, ${countdown.minutes} minutes, ${countdown.seconds} seconds`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId} aria-label={toolName}>
      <OutputArea hasContent={countdown !== null}>
        {countdown && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-1">
                🎆 Countdown to New Year {countdown.targetYear} 🎆
              </h3>
              <p className="text-sm text-gray-500">January 1, {countdown.targetYear} at midnight</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gradient-to-b from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 text-center">
                <div className="text-3xl sm:text-4xl font-bold text-blue-700">{countdown.days}</div>
                <div className="text-xs text-blue-500 mt-1 font-medium">Days</div>
              </div>
              <div className="bg-gradient-to-b from-green-50 to-green-100 p-4 rounded-lg border border-green-200 text-center">
                <div className="text-3xl sm:text-4xl font-bold text-green-700">{String(countdown.hours).padStart(2, '0')}</div>
                <div className="text-xs text-green-500 mt-1 font-medium">Hours</div>
              </div>
              <div className="bg-gradient-to-b from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200 text-center">
                <div className="text-3xl sm:text-4xl font-bold text-purple-700">{String(countdown.minutes).padStart(2, '0')}</div>
                <div className="text-xs text-purple-500 mt-1 font-medium">Minutes</div>
              </div>
              <div className="bg-gradient-to-b from-red-50 to-red-100 p-4 rounded-lg border border-red-200 text-center">
                <div className="text-3xl sm:text-4xl font-bold text-red-700">{String(countdown.seconds).padStart(2, '0')}</div>
                <div className="text-xs text-red-500 mt-1 font-medium">Seconds</div>
              </div>
            </div>

            <div className="text-center bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 font-mono">
                {countdown.days}d {String(countdown.hours).padStart(2, '0')}h {String(countdown.minutes).padStart(2, '0')}m {String(countdown.seconds).padStart(2, '0')}s remaining
              </p>
            </div>

            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
