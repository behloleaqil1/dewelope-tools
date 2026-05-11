'use client';

import { useState, useRef, useCallback } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const SAMPLE_TEXTS = [
  'The quick brown fox jumps over the lazy dog. Programming is the art of telling another human what one wants the computer to do. Every great developer you know got there by solving problems they were unqualified to solve until they actually did it. The best error message is the one that never shows up.',
  'Technology is best when it brings people together. Innovation distinguishes between a leader and a follower. The advance of technology is based on making it fit in so that you do not really even notice it. Any sufficiently advanced technology is indistinguishable from magic.',
  'Code is like humor. When you have to explain it, it is bad. First solve the problem then write the code. Experience is the name everyone gives to their mistakes. The only way to learn a new programming language is by writing programs in it.',
];

/**
 * TypingSpeedTest - Measures typing speed (WPM), accuracy, and time elapsed.
 * Starts timing on first keystroke and ends when the text is fully typed.
 */
export default function TypingSpeedTest({ toolId, toolName: _toolName }: { toolId: string; toolName: string }) {
  const [sampleText, setSampleText] = useState(SAMPLE_TEXTS[0]);
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [elapsed, setElapsed] = useState(0);

  const startTimer = useCallback(() => {
    const start = Date.now();
    setStartTime(start);
    setIsActive(true);
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setEndTime(Date.now());
    setIsActive(false);
    setIsComplete(true);
  }, []);

  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value;

    // Don't allow typing beyond the sample text length
    if (value.length > sampleText.length) return;

    if (!startTime && value.length === 1) {
      startTimer();
    }

    setUserInput(value);

    // Check if complete
    if (value.length === sampleText.length) {
      stopTimer();
    }
  }

  function handleReset() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setIsActive(false);
    setIsComplete(false);
    setElapsed(0);
  }

  function handleNewText() {
    handleReset();
    const currentIdx = SAMPLE_TEXTS.indexOf(sampleText);
    const nextIdx = (currentIdx + 1) % SAMPLE_TEXTS.length;
    setSampleText(SAMPLE_TEXTS[nextIdx]);
  }

  // Calculate stats
  const timeInSeconds = endTime && startTime ? (endTime - startTime) / 1000 : elapsed;
  const timeInMinutes = timeInSeconds / 60;

  const wordsTyped = userInput.trim().split(/\s+/).filter(Boolean).length;
  const wpm = timeInMinutes > 0 ? Math.round(wordsTyped / timeInMinutes) : 0;

  let correctChars = 0;
  for (let i = 0; i < userInput.length; i++) {
    if (userInput[i] === sampleText[i]) {
      correctChars++;
    }
  }
  const accuracy = userInput.length > 0 ? Math.round((correctChars / userInput.length) * 100) : 100;

  const copyText = isComplete
    ? `WPM: ${wpm}\nAccuracy: ${accuracy}%\nTime: ${timeInSeconds.toFixed(1)}s\nCharacters: ${userInput.length}`
    : '';

  return (
    <div className="space-y-5" data-tool-id={toolId}>
      {/* Sample text display */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Type this text:</h3>
        <p className="text-base leading-relaxed font-mono" aria-label="Text to type">
          {sampleText.split('').map((char, idx) => {
            let color = 'text-gray-600';
            if (idx < userInput.length) {
              color = userInput[idx] === char ? 'text-green-600' : 'text-red-500 bg-red-50';
            } else if (idx === userInput.length) {
              color = 'text-gray-800 bg-yellow-100';
            }
            return (
              <span key={idx} className={color}>
                {char}
              </span>
            );
          })}
        </p>
      </div>

      {/* Typing area */}
      <div>
        <label htmlFor={`${toolId}-typing`} className="block text-sm font-medium text-gray-700 mb-1">
          Start typing here:
        </label>
        <textarea
          id={`${toolId}-typing`}
          value={userInput}
          onChange={handleInputChange}
          disabled={isComplete}
          placeholder="Start typing to begin the test..."
          aria-label="Typing input area for speed test"
          className="input-field h-32 resize-none font-mono text-sm"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </div>

      {/* Live stats */}
      {(isActive || isComplete) && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-center">
            <div className="text-xs text-blue-500">WPM</div>
            <div className="text-lg font-bold text-blue-700">{wpm}</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg border border-green-100 text-center">
            <div className="text-xs text-green-500">Accuracy</div>
            <div className="text-lg font-bold text-green-700">{accuracy}%</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg border border-purple-100 text-center">
            <div className="text-xs text-purple-500">Time</div>
            <div className="text-lg font-bold text-purple-700">{timeInSeconds.toFixed(0)}s</div>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 text-center">
            <div className="text-xs text-orange-500">Characters</div>
            <div className="text-lg font-bold text-orange-700">{userInput.length}/{sampleText.length}</div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={handleReset}
          aria-label="Reset typing test"
          className="btn-primary"
        >
          Reset
        </button>
        <button
          onClick={handleNewText}
          aria-label="Get new text for typing test"
          className="btn-primary"
        >
          New Text
        </button>
      </div>

      <OutputArea hasContent={isComplete}>
        {isComplete && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Final Results</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-center">
                <div className="text-sm text-gray-500">WPM</div>
                <div className="text-2xl font-bold text-gray-800">{wpm}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-center">
                <div className="text-sm text-gray-500">Accuracy</div>
                <div className="text-2xl font-bold text-gray-800">{accuracy}%</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-center">
                <div className="text-sm text-gray-500">Time</div>
                <div className="text-2xl font-bold text-gray-800">{timeInSeconds.toFixed(1)}s</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-center">
                <div className="text-sm text-gray-500">Characters</div>
                <div className="text-2xl font-bold text-gray-800">{userInput.length}</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
