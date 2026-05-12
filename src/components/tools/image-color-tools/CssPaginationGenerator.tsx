'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssPaginationGenerator - Generate CSS pagination component styles.
 * Customize colors, spacing, border radius, hover/active states, and get ready-to-use CSS + HTML.
 */
export default function CssPaginationGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [bgColor, setBgColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#333333');
  const [activeBg, setActiveBg] = useState('#007bff');
  const [activeText, setActiveText] = useState('#ffffff');
  const [hoverBg, setHoverBg] = useState('#e9ecef');
  const [borderColor, setBorderColor] = useState('#dee2e6');
  const [borderRadius, setBorderRadius] = useState('4');
  const [fontSize, setFontSize] = useState('14');
  const [padding, setPadding] = useState('8');
  const [gap, setGap] = useState('4');
  const [output, setOutput] = useState('');

  const generate = () => {
    const css = `.pagination {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: ${gap}px;
}

.pagination li a,
.pagination li span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: ${parseInt(padding) * 2 + parseInt(fontSize) + 4}px;
  padding: ${padding}px ${parseInt(padding) + 4}px;
  font-size: ${fontSize}px;
  color: ${textColor};
  background-color: ${bgColor};
  border: 1px solid ${borderColor};
  border-radius: ${borderRadius}px;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.pagination li a:hover {
  background-color: ${hoverBg};
}

.pagination li.active a,
.pagination li.active span {
  background-color: ${activeBg};
  color: ${activeText};
  border-color: ${activeBg};
  cursor: default;
}

.pagination li.disabled a,
.pagination li.disabled span {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}`;

    const html = `<nav aria-label="Pagination">
  <ul class="pagination">
    <li><a href="#">&laquo;</a></li>
    <li><a href="#">1</a></li>
    <li class="active"><span>2</span></li>
    <li><a href="#">3</a></li>
    <li><a href="#">4</a></li>
    <li><a href="#">5</a></li>
    <li><a href="#">&raquo;</a></li>
  </ul>
</nav>`;

    setOutput(`/* CSS */\n${css}\n\n/* HTML */\n${html}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor={`${toolId}-bg`} className="block text-sm font-medium text-gray-700 mb-1">Background</label>
            <input id={`${toolId}-bg`} type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} aria-label={`Background color for ${toolName}`} className="input-field h-10" />
          </div>
          <div>
            <label htmlFor={`${toolId}-text`} className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
            <input id={`${toolId}-text`} type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} aria-label="Text color" className="input-field h-10" />
          </div>
          <div>
            <label htmlFor={`${toolId}-active-bg`} className="block text-sm font-medium text-gray-700 mb-1">Active BG</label>
            <input id={`${toolId}-active-bg`} type="color" value={activeBg} onChange={(e) => setActiveBg(e.target.value)} aria-label="Active background" className="input-field h-10" />
          </div>
          <div>
            <label htmlFor={`${toolId}-active-text`} className="block text-sm font-medium text-gray-700 mb-1">Active Text</label>
            <input id={`${toolId}-active-text`} type="color" value={activeText} onChange={(e) => setActiveText(e.target.value)} aria-label="Active text color" className="input-field h-10" />
          </div>
          <div>
            <label htmlFor={`${toolId}-hover`} className="block text-sm font-medium text-gray-700 mb-1">Hover BG</label>
            <input id={`${toolId}-hover`} type="color" value={hoverBg} onChange={(e) => setHoverBg(e.target.value)} aria-label="Hover background" className="input-field h-10" />
          </div>
          <div>
            <label htmlFor={`${toolId}-border`} className="block text-sm font-medium text-gray-700 mb-1">Border Color</label>
            <input id={`${toolId}-border`} type="color" value={borderColor} onChange={(e) => setBorderColor(e.target.value)} aria-label="Border color" className="input-field h-10" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div>
            <label htmlFor={`${toolId}-radius`} className="block text-sm font-medium text-gray-700 mb-1">Border Radius (px)</label>
            <input id={`${toolId}-radius`} type="number" min="0" value={borderRadius} onChange={(e) => setBorderRadius(e.target.value)} aria-label="Border radius" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-font`} className="block text-sm font-medium text-gray-700 mb-1">Font Size (px)</label>
            <input id={`${toolId}-font`} type="number" min="8" value={fontSize} onChange={(e) => setFontSize(e.target.value)} aria-label="Font size" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-padding`} className="block text-sm font-medium text-gray-700 mb-1">Padding (px)</label>
            <input id={`${toolId}-padding`} type="number" min="0" value={padding} onChange={(e) => setPadding(e.target.value)} aria-label="Padding" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-gap`} className="block text-sm font-medium text-gray-700 mb-1">Gap (px)</label>
            <input id={`${toolId}-gap`} type="number" min="0" value={gap} onChange={(e) => setGap(e.target.value)} aria-label="Gap between items" className="input-field" />
          </div>
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate Pagination CSS</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated CSS + HTML</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded max-h-96 overflow-y-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
