'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssTabsGenerator - Generate CSS tabs component styles with customizable
 * colors, border radius, tab count, and active state styling.
 */
export default function CssTabsGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [tabCount, setTabCount] = useState('4');
  const [bgColor, setBgColor] = useState('#f3f4f6');
  const [activeColor, setActiveColor] = useState('#3b82f6');
  const [textColor, setTextColor] = useState('#374151');
  const [activeTextColor, _setActiveTextColor] = useState('#ffffff');
  const [borderRadius, setBorderRadius] = useState('8');
  const [tabStyle, setTabStyle] = useState<'underline' | 'pill' | 'boxed'>('underline');
  const [output, setOutput] = useState('');

  const generate = () => {
    const count = parseInt(tabCount) || 4;

    let css = '';
    let html = '';

    if (tabStyle === 'underline') {
      css = `.tabs-container {
  display: flex;
  border-bottom: 2px solid ${bgColor};
  gap: 0;
}

.tab {
  padding: 12px 24px;
  cursor: pointer;
  border: none;
  background: transparent;
  color: ${textColor};
  font-size: 14px;
  font-weight: 500;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: all 0.2s ease;
}

.tab:hover {
  color: ${activeColor};
  border-bottom-color: ${activeColor}80;
}

.tab.active {
  color: ${activeColor};
  border-bottom-color: ${activeColor};
}

.tab-content {
  padding: 16px 0;
}`;
    } else if (tabStyle === 'pill') {
      css = `.tabs-container {
  display: flex;
  background: ${bgColor};
  border-radius: ${borderRadius}px;
  padding: 4px;
  gap: 4px;
}

.tab {
  padding: 10px 20px;
  cursor: pointer;
  border: none;
  background: transparent;
  color: ${textColor};
  font-size: 14px;
  font-weight: 500;
  border-radius: ${Math.max(0, parseInt(borderRadius) - 2)}px;
  transition: all 0.2s ease;
}

.tab:hover {
  background: ${activeColor}20;
}

.tab.active {
  background: ${activeColor};
  color: ${activeTextColor};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.tab-content {
  padding: 16px 0;
}`;
    } else {
      css = `.tabs-container {
  display: flex;
  gap: 0;
}

.tab {
  padding: 12px 24px;
  cursor: pointer;
  border: 1px solid ${bgColor};
  border-bottom: none;
  background: ${bgColor};
  color: ${textColor};
  font-size: 14px;
  font-weight: 500;
  border-radius: ${borderRadius}px ${borderRadius}px 0 0;
  transition: all 0.2s ease;
  margin-right: -1px;
}

.tab:hover {
  background: ${activeColor}10;
}

.tab.active {
  background: ${activeTextColor};
  color: ${activeColor};
  border-color: ${activeColor};
  position: relative;
  z-index: 1;
}

.tab-panel {
  border: 1px solid ${activeColor};
  border-radius: 0 ${borderRadius}px ${borderRadius}px ${borderRadius}px;
  padding: 16px;
}`;
    }

    // Generate HTML
    const tabNames = Array.from({ length: count }, (_, i) => `Tab ${i + 1}`);
    html = `<div class="tabs-container">\n`;
    tabNames.forEach((name, i) => {
      html += `  <button class="tab${i === 0 ? ' active' : ''}">${name}</button>\n`;
    });
    html += `</div>\n`;
    html += `<div class="${tabStyle === 'boxed' ? 'tab-panel' : 'tab-content'}">\n`;
    html += `  <p>Tab content goes here...</p>\n`;
    html += `</div>`;

    const fullOutput = `/* CSS Tabs - ${tabStyle} style */\n\n${css}\n\n/* HTML */\n${html}`;
    setOutput(fullOutput);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">
              Number of Tabs
            </label>
            <input
              id={`${toolId}-count`}
              type="number"
              value={tabCount}
              onChange={(e) => setTabCount(e.target.value)}
              min="2"
              max="10"
              aria-label={`Tab count for ${toolName}`}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-style`} className="block text-sm font-medium text-gray-700 mb-1">
              Tab Style
            </label>
            <select
              id={`${toolId}-style`}
              value={tabStyle}
              onChange={(e) => setTabStyle(e.target.value as 'underline' | 'pill' | 'boxed')}
              aria-label="Tab style"
              className="input-field"
            >
              <option value="underline">Underline</option>
              <option value="pill">Pill</option>
              <option value="boxed">Boxed</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-bg`} className="block text-sm font-medium text-gray-700 mb-1">
              Background Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-10 h-10 rounded cursor-pointer"
                aria-label="Background color picker"
              />
              <input
                id={`${toolId}-bg`}
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="input-field flex-1"
              />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-active`} className="block text-sm font-medium text-gray-700 mb-1">
              Active/Accent Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={activeColor}
                onChange={(e) => setActiveColor(e.target.value)}
                className="w-10 h-10 rounded cursor-pointer"
                aria-label="Active color picker"
              />
              <input
                id={`${toolId}-active`}
                type="text"
                value={activeColor}
                onChange={(e) => setActiveColor(e.target.value)}
                className="input-field flex-1"
              />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-text`} className="block text-sm font-medium text-gray-700 mb-1">
              Text Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-10 h-10 rounded cursor-pointer"
                aria-label="Text color picker"
              />
              <input
                id={`${toolId}-text`}
                type="text"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="input-field flex-1"
              />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-radius`} className="block text-sm font-medium text-gray-700 mb-1">
              Border Radius (px)
            </label>
            <input
              id={`${toolId}-radius`}
              type="number"
              value={borderRadius}
              onChange={(e) => setBorderRadius(e.target.value)}
              min="0"
              max="24"
              aria-label="Border radius"
              className="input-field"
            />
          </div>
        </div>
        <button
          onClick={generate}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Generate CSS Tabs
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated CSS & HTML</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-md overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
