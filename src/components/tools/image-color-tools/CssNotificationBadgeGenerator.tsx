'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssNotificationBadgeGenerator - Generate CSS notification badge styles.
 */
export default function CssNotificationBadgeGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [bgColor, setBgColor] = useState('#ef4444');
  const [textColor, setTextColor] = useState('#ffffff');
  const [size, setSize] = useState('20');
  const [fontSize, setFontSize] = useState('12');
  const [position, setPosition] = useState('top-right');
  const [animated, setAnimated] = useState(false);
  const [output, setOutput] = useState('');

  const generate = () => {
    const sizeNum = parseInt(size) || 20;
    const fontNum = parseInt(fontSize) || 12;

    let positionCSS = '';
    switch (position) {
      case 'top-right':
        positionCSS = '  top: -${offset}px;\n  right: -${offset}px;'.replace(/\$\{offset\}/g, String(Math.round(sizeNum / 3)));
        break;
      case 'top-left':
        positionCSS = '  top: -${offset}px;\n  left: -${offset}px;'.replace(/\$\{offset\}/g, String(Math.round(sizeNum / 3)));
        break;
      case 'bottom-right':
        positionCSS = '  bottom: -${offset}px;\n  right: -${offset}px;'.replace(/\$\{offset\}/g, String(Math.round(sizeNum / 3)));
        break;
      case 'bottom-left':
        positionCSS = '  bottom: -${offset}px;\n  left: -${offset}px;'.replace(/\$\{offset\}/g, String(Math.round(sizeNum / 3)));
        break;
    }

    const animationCSS = animated
      ? `\n\n@keyframes badge-pulse {\n  0%, 100% { transform: scale(1); }\n  50% { transform: scale(1.2); }\n}\n\n.notification-badge--animated {\n  animation: badge-pulse 1.5s ease-in-out infinite;\n}`
      : '';

    const css = `.notification-badge-container {
  position: relative;
  display: inline-block;
}

.notification-badge {
  position: absolute;
${positionCSS}
  min-width: ${sizeNum}px;
  height: ${sizeNum}px;
  padding: 0 ${Math.round(sizeNum / 4)}px;
  background-color: ${bgColor};
  color: ${textColor};
  font-size: ${fontNum}px;
  font-weight: 600;
  line-height: ${sizeNum}px;
  text-align: center;
  border-radius: ${Math.round(sizeNum / 2)}px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 10;${animated ? '\n  animation: badge-pulse 1.5s ease-in-out infinite;' : ''}
}${animationCSS}`;

    const html = `<div class="notification-badge-container">
  <button>Notifications</button>
  <span class="notification-badge${animated ? ' notification-badge--animated' : ''}">3</span>
</div>`;

    setOutput(`/* CSS */\n${css}\n\n/* HTML */\n${html}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-bg`} className="block text-sm font-medium text-gray-700 mb-1">
                Background color
              </label>
              <input
                id={`${toolId}-bg`}
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                aria-label={`Badge background color for ${toolName}`}
                className="input-field h-10 w-full"
              />
            </div>
            <div>
              <label htmlFor={`${toolId}-text`} className="block text-sm font-medium text-gray-700 mb-1">
                Text color
              </label>
              <input
                id={`${toolId}-text`}
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                aria-label={`Badge text color for ${toolName}`}
                className="input-field h-10 w-full"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">
                Badge size (px)
              </label>
              <input
                id={`${toolId}-size`}
                type="number"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                min="12"
                max="48"
                aria-label={`Badge size for ${toolName}`}
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor={`${toolId}-font`} className="block text-sm font-medium text-gray-700 mb-1">
                Font size (px)
              </label>
              <input
                id={`${toolId}-font`}
                type="number"
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                min="8"
                max="24"
                aria-label={`Font size for ${toolName}`}
                className="input-field"
              />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-pos`} className="block text-sm font-medium text-gray-700 mb-1">
              Position
            </label>
            <select
              id={`${toolId}-pos`}
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              aria-label={`Badge position for ${toolName}`}
              className="input-field"
            >
              <option value="top-right">Top Right</option>
              <option value="top-left">Top Left</option>
              <option value="bottom-right">Bottom Right</option>
              <option value="bottom-left">Bottom Left</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={animated} onChange={(e) => setAnimated(e.target.checked)} />
            Pulse animation
          </label>
          <button onClick={generate} className="btn-primary">
            Generate Badge CSS
          </button>
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
