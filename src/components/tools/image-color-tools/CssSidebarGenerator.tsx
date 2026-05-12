'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssSidebarGenerator - Generate CSS sidebar layout styles.
 */
export default function CssSidebarGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [width, setWidth] = useState('250');
  const [bgColor, setBgColor] = useState('#1a202c');
  const [textColor, setTextColor] = useState('#e2e8f0');
  const [linkColor, setLinkColor] = useState('#63b3ed');
  const [linkHoverColor, setLinkHoverColor] = useState('#90cdf4');
  const [position, setPosition] = useState<'left' | 'right'>('left');
  const [padding, setPadding] = useState('20');
  const [fontSize, setFontSize] = useState('14');
  const [output, setOutput] = useState('');

  const generate = () => {
    const css = `.sidebar {
  position: fixed;
  top: 0;
  ${position}: 0;
  width: ${width}px;
  height: 100vh;
  background-color: ${bgColor};
  color: ${textColor};
  padding: ${padding}px;
  font-size: ${fontSize}px;
  overflow-y: auto;
  z-index: 1000;
  transition: transform 0.3s ease;
}

.sidebar-header {
  padding-bottom: ${padding}px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: ${padding}px;
}

.sidebar-nav {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-nav li {
  margin-bottom: 4px;
}

.sidebar-nav a {
  display: block;
  padding: 10px ${Math.round(parseInt(padding) * 0.75)}px;
  color: ${linkColor};
  text-decoration: none;
  border-radius: 6px;
  transition: background-color 0.2s, color 0.2s;
}

.sidebar-nav a:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: ${linkHoverColor};
}

.sidebar-nav a.active {
  background-color: rgba(99, 179, 237, 0.15);
  color: ${linkHoverColor};
  font-weight: 500;
}

.main-content {
  margin-${position}: ${width}px;
  padding: ${padding}px;
}

/* Responsive: collapse sidebar on mobile */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(${position === 'left' ? '-100%' : '100%'});
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .main-content {
    margin-${position}: 0;
  }
}`;

    const html = `<!-- Sidebar HTML -->
<aside class="sidebar">
  <div class="sidebar-header">
    <h2>Menu</h2>
  </div>
  <nav>
    <ul class="sidebar-nav">
      <li><a href="#" class="active">Dashboard</a></li>
      <li><a href="#">Projects</a></li>
      <li><a href="#">Settings</a></li>
      <li><a href="#">Profile</a></li>
    </ul>
  </nav>
</aside>

<main class="main-content">
  <!-- Your page content here -->
</main>`;

    setOutput(`/* CSS Sidebar Styles */\n${css}\n\n${html}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-width`} className="block text-sm font-medium text-gray-700 mb-1">Width (px)</label>
            <input id={`${toolId}-width`} type="number" value={width} onChange={(e) => setWidth(e.target.value)} aria-label={`Sidebar width for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-position`} className="block text-sm font-medium text-gray-700 mb-1">Position</label>
            <select id={`${toolId}-position`} value={position} onChange={(e) => setPosition(e.target.value as 'left' | 'right')} aria-label="Sidebar position" className="input-field">
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-bg`} className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
            <div className="flex gap-2">
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-10 w-12 rounded cursor-pointer" />
              <input id={`${toolId}-bg`} type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} aria-label="Background color" className="input-field flex-1" />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-text`} className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
            <div className="flex gap-2">
              <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="h-10 w-12 rounded cursor-pointer" />
              <input id={`${toolId}-text`} type="text" value={textColor} onChange={(e) => setTextColor(e.target.value)} aria-label="Text color" className="input-field flex-1" />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-link`} className="block text-sm font-medium text-gray-700 mb-1">Link Color</label>
            <div className="flex gap-2">
              <input type="color" value={linkColor} onChange={(e) => setLinkColor(e.target.value)} className="h-10 w-12 rounded cursor-pointer" />
              <input id={`${toolId}-link`} type="text" value={linkColor} onChange={(e) => setLinkColor(e.target.value)} aria-label="Link color" className="input-field flex-1" />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-hover`} className="block text-sm font-medium text-gray-700 mb-1">Link Hover Color</label>
            <div className="flex gap-2">
              <input type="color" value={linkHoverColor} onChange={(e) => setLinkHoverColor(e.target.value)} className="h-10 w-12 rounded cursor-pointer" />
              <input id={`${toolId}-hover`} type="text" value={linkHoverColor} onChange={(e) => setLinkHoverColor(e.target.value)} aria-label="Link hover color" className="input-field flex-1" />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-padding`} className="block text-sm font-medium text-gray-700 mb-1">Padding (px)</label>
            <input id={`${toolId}-padding`} type="number" value={padding} onChange={(e) => setPadding(e.target.value)} aria-label="Padding" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-font`} className="block text-sm font-medium text-gray-700 mb-1">Font Size (px)</label>
            <input id={`${toolId}-font`} type="number" value={fontSize} onChange={(e) => setFontSize(e.target.value)} aria-label="Font size" className="input-field" />
          </div>
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate Sidebar</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated CSS & HTML</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg overflow-auto max-h-96">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
