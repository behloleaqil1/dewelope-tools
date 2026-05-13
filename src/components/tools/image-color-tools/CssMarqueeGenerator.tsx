'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssMarqueeGenerator - Generate CSS marquee/scrolling text animations.
 * Creates pure CSS scrolling text without deprecated HTML marquee tag.
 */
export default function CssMarqueeGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [text, setText] = useState('');
  const [direction, setDirection] = useState('left');
  const [speed, setSpeed] = useState('10');
  const [fontSize, setFontSize] = useState('16');
  const [color, setColor] = useState('#333333');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [pauseOnHover, setPauseOnHover] = useState(true);
  const [gap, setGap] = useState('50');
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!text.trim()) {
      setOutput('');
      return;
    }

    const duration = speed;
    const isHorizontal = direction === 'left' || direction === 'right';
    const translateFrom = direction === 'left' ? '100%' : direction === 'right' ? '-100%' : direction === 'up' ? '100%' : '-100%';
    const translateTo = direction === 'left' ? '-100%' : direction === 'right' ? '100%' : direction === 'up' ? '-100%' : '100%';
    const transformProp = isHorizontal ? 'translateX' : 'translateY';

    let css = `/* CSS Marquee - Scrolling ${direction} */\n`;
    css += `.marquee-container {\n`;
    css += `  overflow: hidden;\n`;
    css += `  white-space: ${isHorizontal ? 'nowrap' : 'normal'};\n`;
    css += `  background-color: ${bgColor};\n`;
    css += `  padding: 10px 0;\n`;
    css += `  position: relative;\n`;
    css += `}\n\n`;
    css += `.marquee-content {\n`;
    css += `  display: inline-block;\n`;
    css += `  animation: marquee-scroll ${duration}s linear infinite;\n`;
    css += `  font-size: ${fontSize}px;\n`;
    css += `  color: ${color};\n`;
    css += `  padding-${isHorizontal ? 'left' : 'top'}: ${gap}px;\n`;
    css += `}\n\n`;
    if (pauseOnHover) {
      css += `.marquee-container:hover .marquee-content {\n`;
      css += `  animation-play-state: paused;\n`;
      css += `}\n\n`;
    }
    css += `@keyframes marquee-scroll {\n`;
    css += `  0% {\n`;
    css += `    transform: ${transformProp}(${translateFrom});\n`;
    css += `  }\n`;
    css += `  100% {\n`;
    css += `    transform: ${transformProp}(${translateTo});\n`;
    css += `  }\n`;
    css += `}\n`;

    let html = `\n<!-- HTML -->\n`;
    html += `<div class="marquee-container">\n`;
    html += `  <span class="marquee-content">${text}</span>\n`;
    html += `</div>\n`;

    setOutput(css + html);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-text`} className="block text-sm font-medium text-gray-700 mb-1">Marquee Text</label>
            <input
              id={`${toolId}-text`}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Your scrolling text here..."
              aria-label={`Text input for ${toolName}`}
              className="input-field"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-direction`} className="block text-sm font-medium text-gray-700 mb-1">Direction</label>
              <select id={`${toolId}-direction`} value={direction} onChange={(e) => setDirection(e.target.value)} className="input-field">
                <option value="left">Left</option>
                <option value="right">Right</option>
                <option value="up">Up</option>
                <option value="down">Down</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${toolId}-speed`} className="block text-sm font-medium text-gray-700 mb-1">Duration (seconds)</label>
              <input id={`${toolId}-speed`} type="number" min="1" max="60" value={speed} onChange={(e) => setSpeed(e.target.value)} className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor={`${toolId}-fontsize`} className="block text-sm font-medium text-gray-700 mb-1">Font Size (px)</label>
              <input id={`${toolId}-fontsize`} type="number" min="8" max="72" value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
              <input id={`${toolId}-color`} type="color" value={color} onChange={(e) => setColor(e.target.value)} className="input-field h-10" />
            </div>
            <div>
              <label htmlFor={`${toolId}-bgcolor`} className="block text-sm font-medium text-gray-700 mb-1">Background</label>
              <input id={`${toolId}-bgcolor`} type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="input-field h-10" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-gap`} className="block text-sm font-medium text-gray-700 mb-1">Gap (px)</label>
              <input id={`${toolId}-gap`} type="number" min="0" max="200" value={gap} onChange={(e) => setGap(e.target.value)} className="input-field" />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm pb-2">
                <input type="checkbox" checked={pauseOnHover} onChange={(e) => setPauseOnHover(e.target.checked)} />
                Pause on Hover
              </label>
            </div>
          </div>
          <button onClick={generate} className="btn-primary">Generate CSS Marquee</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated CSS & HTML</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
