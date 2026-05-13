'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssTextClipAnimationGenerator - Generate CSS text clip path animation.
 */
export default function CssTextClipAnimationGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [text, setText] = useState('Hello World');
  const [gradientStart, setGradientStart] = useState('#ff6b6b');
  const [gradientEnd, setGradientEnd] = useState('#4ecdc4');
  const [duration, setDuration] = useState('3');
  const [direction, setDirection] = useState('left');
  const [output, setOutput] = useState('');

  const generate = () => {
    const css = `.text-clip-animation {
  font-size: 4rem;
  font-weight: bold;
  background: linear-gradient(to ${direction}, ${gradientStart}, ${gradientEnd});
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% auto;
  animation: textClipShift ${duration}s ease-in-out infinite alternate;
}

@keyframes textClipShift {
  0% {
    background-position: 0% center;
  }
  100% {
    background-position: 100% center;
  }
}`;

    const html = `<h1 class="text-clip-animation">${text}</h1>`;

    const lines: string[] = [
      `=== CSS Text Clip Animation ===`,
      ``,
      `HTML:`,
      html,
      ``,
      `CSS:`,
      css,
      ``,
      `Preview text: "${text}"`,
      `Gradient: ${gradientStart} → ${gradientEnd}`,
      `Direction: to ${direction}`,
      `Duration: ${duration}s (infinite alternate)`,
    ];
    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-text`} className="block text-sm font-medium text-gray-700 mb-1">Preview Text</label>
            <input id={`${toolId}-text`} type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Hello World" aria-label={`Preview text for ${toolName}`} className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-start`} className="block text-sm font-medium text-gray-700 mb-1">Gradient Start</label>
              <input id={`${toolId}-start`} type="color" value={gradientStart} onChange={(e) => setGradientStart(e.target.value)} aria-label="Gradient start color" className="input-field h-10" />
            </div>
            <div>
              <label htmlFor={`${toolId}-end`} className="block text-sm font-medium text-gray-700 mb-1">Gradient End</label>
              <input id={`${toolId}-end`} type="color" value={gradientEnd} onChange={(e) => setGradientEnd(e.target.value)} aria-label="Gradient end color" className="input-field h-10" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-duration`} className="block text-sm font-medium text-gray-700 mb-1">Duration (s)</label>
              <input id={`${toolId}-duration`} type="number" min="0.5" step="0.5" value={duration} onChange={(e) => setDuration(e.target.value)} aria-label="Animation duration" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-dir`} className="block text-sm font-medium text-gray-700 mb-1">Direction</label>
              <select id={`${toolId}-dir`} value={direction} onChange={(e) => setDirection(e.target.value)} aria-label="Gradient direction" className="input-field">
                <option value="left">To Left</option>
                <option value="right">To Right</option>
                <option value="top">To Top</option>
                <option value="bottom">To Bottom</option>
              </select>
            </div>
          </div>
          <button onClick={generate} className="btn-primary">Generate Animation CSS</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <div className="p-4 bg-gray-900 rounded-lg mb-3">
              <span className="text-3xl font-bold" style={{ background: `linear-gradient(to ${direction}, ${gradientStart}, ${gradientEnd})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{text}</span>
            </div>
            <label className="block text-sm font-medium text-gray-700">Generated Code</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
