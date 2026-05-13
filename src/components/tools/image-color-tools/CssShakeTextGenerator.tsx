'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssShakeTextGenerator - Generate CSS shaking text animation with configurable
 * text, intensity, speed, and color.
 */
export default function CssShakeTextGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [text, setText] = useState('Shake Me!');
  const [color, setColor] = useState('#e74c3c');
  const [intensity, setIntensity] = useState('5');
  const [duration, setDuration] = useState('0.5');
  const [fontSize, setFontSize] = useState('48');
  const [shakeType, setShakeType] = useState('horizontal');
  const [output, setOutput] = useState('');

  const generate = () => {
    const intensityNum = parseInt(intensity);
    const durationNum = parseFloat(duration);
    const fontSizeNum = parseInt(fontSize);

    if (!text.trim()) {
      setOutput('Please enter text to animate.');
      return;
    }

    let keyframes = '';
    if (shakeType === 'horizontal') {
      keyframes = `@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-${intensityNum}px); }
  20%, 40%, 60%, 80% { transform: translateX(${intensityNum}px); }
}`;
    } else if (shakeType === 'vertical') {
      keyframes = `@keyframes shake {
  0%, 100% { transform: translateY(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateY(-${intensityNum}px); }
  20%, 40%, 60%, 80% { transform: translateY(${intensityNum}px); }
}`;
    } else if (shakeType === 'rotate') {
      keyframes = `@keyframes shake {
  0%, 100% { transform: rotate(0deg); }
  10%, 30%, 50%, 70%, 90% { transform: rotate(-${intensityNum}deg); }
  20%, 40%, 60%, 80% { transform: rotate(${intensityNum}deg); }
}`;
    } else {
      keyframes = `@keyframes shake {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  10% { transform: translate(-${intensityNum}px, -${intensityNum}px) rotate(-${intensityNum}deg); }
  20% { transform: translate(${intensityNum}px, -${intensityNum}px) rotate(${intensityNum}deg); }
  30% { transform: translate(-${intensityNum}px, ${intensityNum}px) rotate(0deg); }
  40% { transform: translate(${intensityNum}px, ${intensityNum}px) rotate(${intensityNum}deg); }
  50% { transform: translate(-${intensityNum}px, 0) rotate(-${intensityNum}deg); }
  60% { transform: translate(${intensityNum}px, 0) rotate(0deg); }
  70% { transform: translate(0, -${intensityNum}px) rotate(${intensityNum}deg); }
  80% { transform: translate(0, ${intensityNum}px) rotate(-${intensityNum}deg); }
  90% { transform: translate(-${intensityNum}px, -${intensityNum}px) rotate(0deg); }
}`;
    }

    const css = `${keyframes}

.shake-text {
  display: inline-block;
  font-size: ${fontSizeNum}px;
  color: ${color};
  animation: shake ${durationNum}s ease-in-out infinite;
  font-weight: bold;
}

.shake-text:hover {
  animation-play-state: paused;
}`;

    const html = `<span class="shake-text">${text}</span>`;

    const result = `<!-- HTML -->
${html}

/* CSS */
${css}`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-text`} className="block text-sm font-medium text-gray-700 mb-1">
              Text
            </label>
            <input
              id={`${toolId}-text`}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="input-field"
              aria-label={`Text input for ${toolName}`}
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <input
              id={`${toolId}-color`}
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="input-field h-10"
              aria-label="Text color"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">
              Shake Type
            </label>
            <select
              id={`${toolId}-type`}
              value={shakeType}
              onChange={(e) => setShakeType(e.target.value)}
              className="input-field"
              aria-label="Shake type"
            >
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
              <option value="rotate">Rotate</option>
              <option value="crazy">Crazy (All Directions)</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-intensity`} className="block text-sm font-medium text-gray-700 mb-1">
              Intensity (px/deg)
            </label>
            <input
              id={`${toolId}-intensity`}
              type="number"
              min="1"
              max="50"
              value={intensity}
              onChange={(e) => setIntensity(e.target.value)}
              className="input-field"
              aria-label="Shake intensity"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-duration`} className="block text-sm font-medium text-gray-700 mb-1">
              Duration (seconds)
            </label>
            <input
              id={`${toolId}-duration`}
              type="number"
              min="0.1"
              max="5"
              step="0.1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="input-field"
              aria-label="Animation duration"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-fontsize`} className="block text-sm font-medium text-gray-700 mb-1">
              Font Size (px)
            </label>
            <input
              id={`${toolId}-fontsize`}
              type="number"
              min="12"
              max="200"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="input-field"
              aria-label="Font size"
            />
          </div>
        </div>
        <button
          onClick={generate}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Generate Shake Text CSS
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Code</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-md">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
