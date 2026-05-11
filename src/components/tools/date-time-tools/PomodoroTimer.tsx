'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

type Phase = 'work' | 'break';

/**
 * PomodoroTimer - A configurable Pomodoro technique timer.
 * Default: 25 min work, 5 min break. Start/pause/reset controls.
 * Visual indicator for work vs break phase with session counter.
 */
export default function PomodoroTimer({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>('work');
  const [sessions, setSessions] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  useEffect(() => {
    if (isRunning && secondsLeft <= 0) {
      clearTimer();
      if (phase === 'work') {
        setSessions((s) => s + 1);
        setPhase('break');
        setSecondsLeft(breakMinutes * 60);
        // Auto-start break
        startInterval();
      } else {
        setPhase('work');
        setSecondsLeft(workMinutes * 60);
        // Auto-start work
        startInterval();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, isRunning]);

  const startInterval = () => {
    clearTimer();
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);
  };

  const handleStart = () => {
    if (!isRunning) {
      setIsRunning(true);
      startInterval();
    }
  };

  const handlePause = () => {
    if (isRunning) {
      clearTimer();
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    clearTimer();
    setIsRunning(false);
    setPhase('work');
    setSecondsLeft(workMinutes * 60);
    setSessions(0);
  };

  const handleWorkChange = (value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 1 && num <= 120) {
      setWorkMinutes(num);
      if (!isRunning && phase === 'work') {
        setSecondsLeft(num * 60);
      }
    }
  };

  const handleBreakChange = (value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 1 && num <= 60) {
      setBreakMinutes(num);
      if (!isRunning && phase === 'break') {
        setSecondsLeft(num * 60);
      }
    }
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const displayTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalSeconds = phase === 'work' ? workMinutes * 60 : breakMinutes * 60;
  const progress = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;

  return (
    <div className="space-y-6" data-tool-id={toolId}>
      {/* Configuration */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor={`${toolId}-work`} className="block text-sm font-medium text-gray-700 mb-1">
            Work (minutes)
          </label>
          <input
            id={`${toolId}-work`}
            type="number"
            min={1}
            max={120}
            value={workMinutes}
            onChange={(e) => handleWorkChange(e.target.value)}
            disabled={isRunning}
            aria-label={`Work duration for ${toolName}`}
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor={`${toolId}-break`} className="block text-sm font-medium text-gray-700 mb-1">
            Break (minutes)
          </label>
          <input
            id={`${toolId}-break`}
            type="number"
            min={1}
            max={60}
            value={breakMinutes}
            onChange={(e) => handleBreakChange(e.target.value)}
            disabled={isRunning}
            aria-label={`Break duration for ${toolName}`}
            className="input-field"
          />
        </div>
      </div>

      {/* Timer display */}
      <div className="text-center py-8">
        <div
          className={`inline-block px-4 py-1 rounded-full text-xs font-semibold mb-4 ${
            phase === 'work'
              ? 'bg-red-100 text-red-700'
              : 'bg-green-100 text-green-700'
          }`}
        >
          {phase === 'work' ? '🔴 Work' : '🟢 Break'}
        </div>

        <div
          className="text-6xl sm:text-7xl font-mono font-bold text-gray-800 tracking-tight"
          aria-label={`Time remaining: ${minutes} minutes ${seconds} seconds`}
          aria-live="polite"
          aria-atomic="true"
        >
          {displayTime}
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-xs mx-auto mt-4 bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-1000 ${
              phase === 'work' ? 'bg-red-500' : 'bg-green-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="text-sm text-gray-500 mt-3">
          Sessions completed: <span className="font-semibold text-gray-700">{sessions}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        {!isRunning ? (
          <button
            onClick={handleStart}
            aria-label={`Start ${toolName}`}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 min-h-[44px] font-medium transition-colors"
          >
            {secondsLeft < totalSeconds ? 'Resume' : 'Start'}
          </button>
        ) : (
          <button
            onClick={handlePause}
            aria-label={`Pause ${toolName}`}
            className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 min-h-[44px] font-medium transition-colors"
          >
            Pause
          </button>
        )}
        <button
          onClick={handleReset}
          aria-label={`Reset ${toolName}`}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 min-h-[44px] font-medium transition-colors"
        >
          Reset
        </button>
      </div>

      <OutputArea hasContent={sessions > 0}>
        {sessions > 0 && (
          <div className="space-y-3">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-800">
                {sessions} session{sessions !== 1 ? 's' : ''} completed
              </div>
              <div className="text-sm text-gray-500">
                Total focus time: {sessions * workMinutes} minutes
              </div>
            </div>
            <CopyToClipboard
              text={`Pomodoro Sessions: ${sessions}\nTotal Focus Time: ${sessions * workMinutes} minutes\nWork Duration: ${workMinutes} min\nBreak Duration: ${breakMinutes} min`}
            />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
