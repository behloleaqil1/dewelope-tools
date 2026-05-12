'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssNavbarGenerator - Generate CSS navigation bar styles.
 * Customize colors, layout, font, and hover effects for horizontal or vertical navbars.
 */
export default function CssNavbarGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [bgColor, setBgColor] = useState('#333333');
  const [textColor, setTextColor] = useState('#ffffff');
  const [hoverBg, setHoverBg] = useState('#555555');
  const [hoverText, setHoverText] = useState('#ffffff');
  const [layout, setLayout] = useState<'horizontal' | 'vertical'>('horizontal');
  const [fontSize, setFontSize] = useState('16');
  const [padding, setPadding] = useState('14');
  const [borderRadius, setBorderRadius] = useState('0');
  const [items, setItems] = useState('Home, About, Services, Contact');
  const [output, setOutput] = useState('');

  const generate = () => {
    const navItems = items.split(',').map(i => i.trim()).filter(Boolean);

    const css = layout === 'horizontal'
      ? `.navbar {
  display: flex;
  background-color: ${bgColor};
  padding: 0;
  margin: 0;
  list-style: none;
  border-radius: ${borderRadius}px;
  overflow: hidden;
}

.navbar a {
  display: block;
  color: ${textColor};
  text-decoration: none;
  padding: ${padding}px ${parseInt(padding) + 6}px;
  font-size: ${fontSize}px;
  transition: background-color 0.3s, color 0.3s;
}

.navbar a:hover {
  background-color: ${hoverBg};
  color: ${hoverText};
}`
      : `.navbar {
  display: flex;
  flex-direction: column;
  background-color: ${bgColor};
  padding: 0;
  margin: 0;
  list-style: none;
  border-radius: ${borderRadius}px;
  overflow: hidden;
  width: 200px;
}

.navbar a {
  display: block;
  color: ${textColor};
  text-decoration: none;
  padding: ${padding}px ${parseInt(padding) + 6}px;
  font-size: ${fontSize}px;
  transition: background-color 0.3s, color 0.3s;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.navbar a:hover {
  background-color: ${hoverBg};
  color: ${hoverText};
}`;

    const html = `<nav>\n  <ul class="navbar">\n${navItems.map(item => `    <li><a href="#">${item}</a></li>`).join('\n')}\n  </ul>\n</nav>`;

    setOutput(`/* CSS */\n${css}\n\n/* HTML */\n${html}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor={`${toolId}-bg`} className="block text-sm font-medium text-gray-700 mb-1">Background</label>
            <input id={`${toolId}-bg`} type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="input-field h-10" aria-label={`Background color for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-text`} className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
            <input id={`${toolId}-text`} type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="input-field h-10" aria-label="Text color" />
          </div>
          <div>
            <label htmlFor={`${toolId}-hoverbg`} className="block text-sm font-medium text-gray-700 mb-1">Hover BG</label>
            <input id={`${toolId}-hoverbg`} type="color" value={hoverBg} onChange={(e) => setHoverBg(e.target.value)} className="input-field h-10" aria-label="Hover background color" />
          </div>
          <div>
            <label htmlFor={`${toolId}-hovertext`} className="block text-sm font-medium text-gray-700 mb-1">Hover Text</label>
            <input id={`${toolId}-hovertext`} type="color" value={hoverText} onChange={(e) => setHoverText(e.target.value)} className="input-field h-10" aria-label="Hover text color" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div>
            <label htmlFor={`${toolId}-layout`} className="block text-sm font-medium text-gray-700 mb-1">Layout</label>
            <select id={`${toolId}-layout`} value={layout} onChange={(e) => setLayout(e.target.value as typeof layout)} className="input-field" aria-label="Navbar layout">
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-font`} className="block text-sm font-medium text-gray-700 mb-1">Font Size (px)</label>
            <input id={`${toolId}-font`} type="number" min={10} max={32} value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="input-field" aria-label="Font size" />
          </div>
          <div>
            <label htmlFor={`${toolId}-pad`} className="block text-sm font-medium text-gray-700 mb-1">Padding (px)</label>
            <input id={`${toolId}-pad`} type="number" min={4} max={40} value={padding} onChange={(e) => setPadding(e.target.value)} className="input-field" aria-label="Padding" />
          </div>
          <div>
            <label htmlFor={`${toolId}-radius`} className="block text-sm font-medium text-gray-700 mb-1">Border Radius</label>
            <input id={`${toolId}-radius`} type="number" min={0} max={30} value={borderRadius} onChange={(e) => setBorderRadius(e.target.value)} className="input-field" aria-label="Border radius" />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor={`${toolId}-items`} className="block text-sm font-medium text-gray-700 mb-1">Nav Items (comma-separated)</label>
          <input id={`${toolId}-items`} type="text" value={items} onChange={(e) => setItems(e.target.value)} className="input-field" aria-label="Navigation items" />
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate Navbar</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">CSS Navbar Code</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
