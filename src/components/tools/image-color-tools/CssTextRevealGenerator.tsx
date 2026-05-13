'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssTextRevealGenerator - Generate CSS text reveal/unveil animation effects
 * with configurable direction, timing, and styling.
 */
export default function CssTextRevealGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [text, setText] = useState('Hello World');
  const [direction, setDirection] = useState('left');
  const [duration, setDuration] = useState('1.5');
  const [delay, setDelay] = useState('0.3');
  const [bgColor, setBgColor] = useState('#3b82f6');
  const [textColor, setTextColor] = useState('#1f2937');
  const [fontSize, setFontSize] = useState('48');
  const [output, setOutput] = useState('');

  const directions = [
    { value: 'left', label: 'Left to Right' },
    { value: 'right', label: 'Right to Left' },
    { value: 'top', label: 'Top to Bottom' },
    { value: 'bottom', label: 'Bottom to Top' },
  ];

  const generate = () => {
    const dur = parseFloat(duration);
    const del = parseFloat(delay);
    const size = parseInt(fontSize);

    if (isNaN(dur) || isNaN(del) || isNaN(size)) {
      setOutput('Please enter valid values.');
      return;
    }

    let transformFrom = '';
    let transformTo = '';
    switch (direction) {
      case 'left': transformFrom = 'translateX(-100%)'; transformTo = 'translateX(101%)'; break;
      case 'right': transformFrom = 'translateX(100%)'; transformTo = 'translateX(-101%)'; break;
      case 'top': transformFrom = 'translateY(-100%)'; transformTo = 'translateY(101%)'; break;
      case 'bottom': transformFrom = 'translateY(100%)'; transformTo = 'translateY(-101%)'; break;
    }

    const css = `/* Text Reveal Animation */
.text-reveal {
  position: relative;
  display: inline-block;
  overflow: hidden;
}

.text-reveal__content {
  font-size: ${size}px;
  color: ${textColor};
  font-weight: 700;
  opacity: 0;
  animation: textFadeIn 0.01s ${dur + del}s forwards;
}

.text-reveal::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${bgColor};
  transform: ${transformFrom};
  animation: revealSlide ${dur}s ${del}s cubic-bezier(0.77, 0, 0.175, 1) forwards;
}

@keyframes revealSlide {
  0% {
    transform: ${transformFrom};
  }
  50% {
    transform: translateX(0) translateY(0);
  }
  100% {
    transform: ${transformTo};
  }
}

@keyframes textFadeIn {
  to {
    opacity: 1;
  }
}`;

    const html = `<!-- HTML -->
<div class="text-reveal">
  <span class="text-reveal__content">${text}</span>
</div>`;

    setOutput(`${html}\n\n${css}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-text`} className="block text-sm font-medium text-gray-700 mb-1">Text to Reveal</label>
            <input id={`${toolId}-text`} type="text" value={text} onChange={(e) => setText(e.target.value)} aria-label={`Text content for ${toolName}`} className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-dir`} className="block text-sm font-medium text-gray-700 mb-1">Direction</label>
              <select id={`${toolId}-dir`} value={direction} onChange={(e) => setDirection(e.target.value)} aria-label="Reveal direction" className="input-field">
                {directions.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">Font Size (px)</label>
              <input id={`${toolId}-size`} type="number" min="12" max="200" value={fontSize} onChange={(e) => setFontSize(e.target.value)} aria-label="Font size" className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-dur`} className="block text-sm font-medium text-gray-700 mb-1">Duration (s)</label>
              <input id={`${toolId}-dur`} type="number" min="0.1" max="10" step="0.1" value={duration} onChange={(e) => setDuration(e.target.value)} aria-label="Animation duration" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-delay`} className="block text-sm font-medium text-gray-700 mb-1">Delay (s)</label>
              <input id={`${toolId}-delay`} type="number" min="0" max="10" step="0.1" value={delay} onChange={(e) => setDelay(e.target.value)} aria-label="Animation delay" className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-bg`} className="block text-sm font-medium text-gray-700 mb-1">Reveal Color</label>
              <input id={`${toolId}-bg`} type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} aria-label="Reveal background color" className="input-field h-10" />
            </div>
            <div>
              <label htmlFor={`${toolId}-tc`} className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
              <input id={`${toolId}-tc`} type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} aria-label="Text color" className="input-field h-10" />
            </div>
          </div>
          <button onClick={generate} className="btn-primary w-full">Generate Text Reveal CSS</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Code</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
