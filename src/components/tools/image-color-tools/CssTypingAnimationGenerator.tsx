'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssTypingAnimationGenerator - Generate CSS typewriter typing animation.
 * Creates pure CSS typing effect with customizable speed, cursor, and text.
 */
export default function CssTypingAnimationGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [text, setText] = useState('Hello, World!');
  const [duration, setDuration] = useState('3');
  const [cursorColor, setCursorColor] = useState('#000000');
  const [fontFamily, setFontFamily] = useState('monospace');
  const [fontSize, setFontSize] = useState('24');
  const [loop, setLoop] = useState(false);
  const [output, setOutput] = useState('');

  const generate = () => {
    const charCount = text.length;
    const steps = charCount;
    const typeDuration = parseFloat(duration) || 3;
    const blinkDuration = 0.7;

    const css = `.typing-container {
  font-family: ${fontFamily};
  font-size: ${fontSize}px;
  display: inline-block;
}

.typing-text {
  overflow: hidden;
  border-right: 3px solid ${cursorColor};
  white-space: nowrap;
  margin: 0 auto;
  letter-spacing: 0.05em;
  animation: 
    typing ${typeDuration}s steps(${steps}, end)${loop ? ' infinite' : ' forwards'},
    blink-caret ${blinkDuration}s step-end infinite;
}

@keyframes typing {
  from { width: 0 }
  to { width: ${charCount}ch }
}

@keyframes blink-caret {
  from, to { border-color: transparent }
  50% { border-color: ${cursorColor} }
}`;

    const html = `<div class="typing-container">
  <p class="typing-text">${text}</p>
</div>`;

    setOutput(`/* CSS Typing Animation */\n\n${css}\n\n/* HTML */\n${html}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-text`} className="block text-sm font-medium text-gray-700 mb-1">Text to Type</label>
            <input id={`${toolId}-text`} type="text" value={text} onChange={(e) => setText(e.target.value)} className="input-field" aria-label={`Text input for ${toolName}`} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-duration`} className="block text-sm font-medium text-gray-700 mb-1">Duration (seconds)</label>
              <input id={`${toolId}-duration`} type="number" value={duration} onChange={(e) => setDuration(e.target.value)} className="input-field" aria-label="Animation duration" />
            </div>
            <div>
              <label htmlFor={`${toolId}-font-size`} className="block text-sm font-medium text-gray-700 mb-1">Font Size (px)</label>
              <input id={`${toolId}-font-size`} type="number" value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="input-field" aria-label="Font size" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-cursor-color`} className="block text-sm font-medium text-gray-700 mb-1">Cursor Color</label>
              <input id={`${toolId}-cursor-color`} type="color" value={cursorColor} onChange={(e) => setCursorColor(e.target.value)} className="input-field h-10" aria-label="Cursor color" />
            </div>
            <div>
              <label htmlFor={`${toolId}-font`} className="block text-sm font-medium text-gray-700 mb-1">Font Family</label>
              <select id={`${toolId}-font`} value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className="input-field" aria-label="Font family">
                <option value="monospace">Monospace</option>
                <option value="'Courier New', monospace">Courier New</option>
                <option value="'Fira Code', monospace">Fira Code</option>
                <option value="sans-serif">Sans-serif</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input id={`${toolId}-loop`} type="checkbox" checked={loop} onChange={(e) => setLoop(e.target.checked)} className="rounded" aria-label="Loop animation" />
            <label htmlFor={`${toolId}-loop`} className="text-sm font-medium text-gray-700">Loop animation</label>
          </div>
          <button onClick={generate} className="btn-primary w-full">Generate CSS</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Code</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
