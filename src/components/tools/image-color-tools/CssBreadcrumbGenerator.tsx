'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssBreadcrumbGenerator - Generate CSS breadcrumb navigation styles.
 * Creates customizable breadcrumb CSS with various separator styles and themes.
 */
export default function CssBreadcrumbGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [items, setItems] = useState('Home, Products, Category, Item');
  const [separator, setSeparator] = useState('/');
  const [bgColor, setBgColor] = useState('#f3f4f6');
  const [textColor, setTextColor] = useState('#374151');
  const [activeColor, setActiveColor] = useState('#2563eb');
  const [fontSize, setFontSize] = useState('14');
  const [padding] = useState('8');
  const [borderRadius, setBorderRadius] = useState('4');
  const [output, setOutput] = useState('');

  const generate = () => {
    const itemList = items.split(',').map(i => i.trim()).filter(Boolean);
    if (itemList.length === 0) {
      setOutput('');
      return;
    }

    const css = `.breadcrumb {
  display: flex;
  align-items: center;
  list-style: none;
  padding: ${padding}px ${parseInt(padding) * 2}px;
  margin: 0;
  background-color: ${bgColor};
  border-radius: ${borderRadius}px;
  font-size: ${fontSize}px;
}

.breadcrumb-item {
  color: ${textColor};
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb-item:hover {
  color: ${activeColor};
  text-decoration: underline;
}

.breadcrumb-item.active {
  color: ${activeColor};
  font-weight: 600;
  pointer-events: none;
}

.breadcrumb-item + .breadcrumb-item::before {
  content: "${separator}";
  padding: 0 8px;
  color: ${textColor};
  opacity: 0.5;
}`;

    const html = `<nav aria-label="Breadcrumb">
  <ol class="breadcrumb">
${itemList.map((item, i) => {
  const isLast = i === itemList.length - 1;
  return `    <li class="breadcrumb-item${isLast ? ' active' : ''}"${isLast ? ' aria-current="page"' : ''}>
      ${isLast ? item : `<a href="#">${item}</a>`}
    </li>`;
}).join('\n')}
  </ol>
</nav>`;

    setOutput(`/* CSS */\n${css}\n\n/* HTML */\n${html}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label htmlFor={`${toolId}-items`} className="block text-sm font-medium text-gray-700 mb-1">Breadcrumb Items (comma-separated)</label>
            <input id={`${toolId}-items`} type="text" value={items} onChange={(e) => setItems(e.target.value)} placeholder="Home, Products, Category, Item" aria-label={`Breadcrumb items for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-separator`} className="block text-sm font-medium text-gray-700 mb-1">Separator</label>
            <select id={`${toolId}-separator`} value={separator} onChange={(e) => setSeparator(e.target.value)} aria-label="Separator character" className="input-field">
              <option value="/">/</option>
              <option value="›">›</option>
              <option value="»">»</option>
              <option value=">">{'>'}</option>
              <option value="→">→</option>
              <option value="·">·</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-fontsize`} className="block text-sm font-medium text-gray-700 mb-1">Font Size (px)</label>
            <input id={`${toolId}-fontsize`} type="number" value={fontSize} onChange={(e) => setFontSize(e.target.value)} aria-label="Font size" className="input-field" min="10" max="24" />
          </div>
          <div>
            <label htmlFor={`${toolId}-bg`} className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
            <input id={`${toolId}-bg`} type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} aria-label="Background color" className="input-field h-10" />
          </div>
          <div>
            <label htmlFor={`${toolId}-text`} className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
            <input id={`${toolId}-text`} type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} aria-label="Text color" className="input-field h-10" />
          </div>
          <div>
            <label htmlFor={`${toolId}-active`} className="block text-sm font-medium text-gray-700 mb-1">Active Color</label>
            <input id={`${toolId}-active`} type="color" value={activeColor} onChange={(e) => setActiveColor(e.target.value)} aria-label="Active color" className="input-field h-10" />
          </div>
          <div>
            <label htmlFor={`${toolId}-radius`} className="block text-sm font-medium text-gray-700 mb-1">Border Radius (px)</label>
            <input id={`${toolId}-radius`} type="number" value={borderRadius} onChange={(e) => setBorderRadius(e.target.value)} aria-label="Border radius" className="input-field" min="0" max="20" />
          </div>
        </div>
        <button onClick={generate} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Generate</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated CSS & HTML</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto max-h-96">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
