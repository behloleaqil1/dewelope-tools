'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssDropdownMenuGenerator - Generate CSS dropdown menu styles.
 * Creates complete CSS and HTML for customizable dropdown menus.
 */
export default function CssDropdownMenuGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [bgColor, setBgColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#333333');
  const [hoverBg, setHoverBg] = useState('#f0f0f0');
  const [borderRadius, setBorderRadius] = useState('8');
  const [shadow, setShadow] = useState<'sm' | 'md' | 'lg'>('md');
  const [width, setWidth] = useState('200');
  const [animation, setAnimation] = useState<'fade' | 'slide' | 'none'>('fade');
  const [items, setItems] = useState('Dashboard\nProfile\nSettings\n---\nLogout');
  const [output, setOutput] = useState('');

  const generate = () => {
    const shadowMap = {
      sm: '0 1px 3px rgba(0,0,0,0.12)',
      md: '0 4px 12px rgba(0,0,0,0.15)',
      lg: '0 8px 24px rgba(0,0,0,0.2)',
    };

    const animationCss = animation === 'fade'
      ? `  opacity: 0;\n  visibility: hidden;\n  transition: opacity 0.2s ease, visibility 0.2s;\n`
      : animation === 'slide'
        ? `  opacity: 0;\n  visibility: hidden;\n  transform: translateY(-8px);\n  transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;\n`
        : `  display: none;\n`;

    const animationShow = animation === 'fade'
      ? `  opacity: 1;\n  visibility: visible;\n`
      : animation === 'slide'
        ? `  opacity: 1;\n  visibility: visible;\n  transform: translateY(0);\n`
        : `  display: block;\n`;

    const css = `.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-toggle {
  padding: 8px 16px;
  background: ${bgColor};
  color: ${textColor};
  border: 1px solid #ddd;
  border-radius: ${borderRadius}px;
  cursor: pointer;
  font-size: 14px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  min-width: ${width}px;
  background: ${bgColor};
  border-radius: ${borderRadius}px;
  box-shadow: ${shadowMap[shadow]};
  z-index: 1000;
  padding: 4px 0;
${animationCss}}

.dropdown:hover .dropdown-menu,
.dropdown-toggle:focus + .dropdown-menu {
${animationShow}}

.dropdown-item {
  display: block;
  padding: 8px 16px;
  color: ${textColor};
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.15s;
}

.dropdown-item:hover {
  background: ${hoverBg};
}

.dropdown-divider {
  height: 1px;
  margin: 4px 0;
  background: #e5e5e5;
}`;

    const menuItems = items
      .split('\n')
      .filter((l) => l.trim())
      .map((item) => {
        if (item.trim() === '---') return '    <div class="dropdown-divider"></div>';
        return `    <a href="#" class="dropdown-item">${item.trim()}</a>`;
      });

    const html = `<div class="dropdown">
  <button class="dropdown-toggle">Menu</button>
  <div class="dropdown-menu">
${menuItems.join('\n')}
  </div>
</div>`;

    setOutput(`/* CSS */\n${css}\n\n/* HTML */\n${html}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-bg`} className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
              <input id={`${toolId}-bg`} type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="input-field h-10" aria-label={`Background color for ${toolName}`} />
            </div>
            <div>
              <label htmlFor={`${toolId}-text`} className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
              <input id={`${toolId}-text`} type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="input-field h-10" aria-label="Text color" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-hover`} className="block text-sm font-medium text-gray-700 mb-1">Hover Background</label>
              <input id={`${toolId}-hover`} type="color" value={hoverBg} onChange={(e) => setHoverBg(e.target.value)} className="input-field h-10" aria-label="Hover background color" />
            </div>
            <div>
              <label htmlFor={`${toolId}-radius`} className="block text-sm font-medium text-gray-700 mb-1">Border Radius (px)</label>
              <input id={`${toolId}-radius`} type="number" value={borderRadius} onChange={(e) => setBorderRadius(e.target.value)} className="input-field" aria-label="Border radius" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-shadow`} className="block text-sm font-medium text-gray-700 mb-1">Shadow</label>
              <select id={`${toolId}-shadow`} value={shadow} onChange={(e) => setShadow(e.target.value as 'sm' | 'md' | 'lg')} className="input-field" aria-label="Shadow size">
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${toolId}-anim`} className="block text-sm font-medium text-gray-700 mb-1">Animation</label>
              <select id={`${toolId}-anim`} value={animation} onChange={(e) => setAnimation(e.target.value as 'fade' | 'slide' | 'none')} className="input-field" aria-label="Animation type">
                <option value="fade">Fade</option>
                <option value="slide">Slide Down</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-width`} className="block text-sm font-medium text-gray-700 mb-1">Min Width (px)</label>
            <input id={`${toolId}-width`} type="number" value={width} onChange={(e) => setWidth(e.target.value)} className="input-field" aria-label="Minimum width" />
          </div>
          <div>
            <label htmlFor={`${toolId}-items`} className="block text-sm font-medium text-gray-700 mb-1">Menu Items (one per line, --- for divider)</label>
            <textarea id={`${toolId}-items`} value={items} onChange={(e) => setItems(e.target.value)} className="input-field h-28 resize-y font-mono" aria-label="Menu items" />
          </div>
          <button onClick={generate} className="btn-primary">Generate Dropdown CSS</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Code</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
