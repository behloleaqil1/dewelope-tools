'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface ReadingStats {
  wordCount: number;
  characterCount: number;
  readingTime: string;
  speakingTime: string;
}

/**
 * ReadingTimeCalculator - Calculates reading and speaking time for text.
 * Uses 200 WPM for reading and 130 WPM for speaking as averages.
 */
export default function ReadingTimeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [text, setText] = useState('');
  const [stats, setStats] = useState<ReadingStats | null>(null);

  const READING_WPM = 200;
  const SPEAKING_WPM = 130;

  const calculate = () => {
    if (!text.trim()) {
      setStats(null);
      return;
    }

    const words = text.trim().split(/\s+/).filter((w) => w.length > 0);
    const wordCount = words.length;
    const characterCount = text.length;

    const readingMinutes = wordCount / READING_WPM;
    const speakingMinutes = wordCount / SPEAKING_WPM;

    setStats({
      wordCount,
      characterCount,
      readingTime: formatTime(readingMinutes),
      speakingTime: formatTime(speakingMinutes),
    });
  };

  const formatTime = (minutes: number): string => {
    if (minutes < 1) {
      const seconds = Math.ceil(minutes * 60);
      return `${seconds} sec`;
    }
    const mins = Math.floor(minutes);
    const secs = Math.round((minutes - mins) * 60);
    if (secs === 0) {
      return `${mins} min`;
    }
    return `${mins} min ${secs} sec`;
  };

  const copyText = stats
    ? `Word Count: ${stats.wordCount}\nCharacter Count: ${stats.characterCount}\nReading Time (${READING_WPM} WPM): ${stats.readingTime}\nSpeaking Time (${SPEAKING_WPM} WPM): ${stats.speakingTime}`
    : '';

  return (
    <div className="space-y-6" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea>
          <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700">
            Enter or Paste Text
          </label>
          <textarea
            id={`${toolId}-input`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your article, essay, or any text here..."
            aria-label={`Text input for ${toolName}`}
            className="input-field h-48 resize-y"
          />
        </InputArea>

        <button onClick={calculate} className="btn-primary" aria-label="Calculate reading time">
          Calculate
        </button>
      </div>

      <OutputArea hasContent={stats !== null}>
        {stats && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">Reading & Speaking Time</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="py-3 px-4 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500">Word Count</div>
                <div className="text-lg font-semibold text-gray-800">{stats.wordCount.toLocaleString()}</div>
              </div>
              <div className="py-3 px-4 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500">Character Count</div>
                <div className="text-lg font-semibold text-gray-800">{stats.characterCount.toLocaleString()}</div>
              </div>
              <div className="py-3 px-4 bg-indigo-50 rounded-lg border border-indigo-100">
                <div className="text-xs text-indigo-600">Reading Time ({READING_WPM} WPM)</div>
                <div className="text-lg font-semibold text-indigo-800">{stats.readingTime}</div>
              </div>
              <div className="py-3 px-4 bg-indigo-50 rounded-lg border border-indigo-100">
                <div className="text-xs text-indigo-600">Speaking Time ({SPEAKING_WPM} WPM)</div>
                <div className="text-lg font-semibold text-indigo-800">{stats.speakingTime}</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
