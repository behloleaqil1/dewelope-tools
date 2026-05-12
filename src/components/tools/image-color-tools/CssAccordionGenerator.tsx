'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssAccordionGenerator - Generate CSS accordion component styles.
 */
export default function CssAccordionGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [itemCount, setItemCount] = useState('3');
  const [borderRadius, setBorderRadius] = useState('8');
  const [bgColor, setBgColor] = useState('#f8f9fa');
  const [headerColor, setHeaderColor] = useState('#343a40');
  const [accentColor, setAccentColor] = useState('#007bff');
  const [animated, setAnimated] = useState(true);
  const [output, setOutput] = useState('');

  const generate = () => {
    const count = parseInt(itemCount) || 3;
    const radius = parseInt(borderRadius) || 8;

    let css = `/* CSS Accordion Styles */\n`;
    css += `.accordion {\n`;
    css += `  width: 100%;\n`;
    css += `  max-width: 600px;\n`;
    css += `  margin: 0 auto;\n`;
    css += `  border-radius: ${radius}px;\n`;
    css += `  overflow: hidden;\n`;
    css += `  border: 1px solid #e0e0e0;\n`;
    css += `}\n\n`;

    css += `.accordion-item {\n`;
    css += `  border-bottom: 1px solid #e0e0e0;\n`;
    css += `}\n\n`;

    css += `.accordion-item:last-child {\n`;
    css += `  border-bottom: none;\n`;
    css += `}\n\n`;

    css += `.accordion-header {\n`;
    css += `  display: flex;\n`;
    css += `  justify-content: space-between;\n`;
    css += `  align-items: center;\n`;
    css += `  padding: 16px 20px;\n`;
    css += `  background-color: ${bgColor};\n`;
    css += `  color: ${headerColor};\n`;
    css += `  cursor: pointer;\n`;
    css += `  font-weight: 600;\n`;
    css += `  user-select: none;\n`;
    if (animated) {
      css += `  transition: background-color 0.2s ease;\n`;
    }
    css += `}\n\n`;

    css += `.accordion-header:hover {\n`;
    css += `  background-color: ${accentColor}20;\n`;
    css += `}\n\n`;

    css += `.accordion-header::after {\n`;
    css += `  content: '+';\n`;
    css += `  font-size: 1.2em;\n`;
    css += `  font-weight: bold;\n`;
    css += `  color: ${accentColor};\n`;
    if (animated) {
      css += `  transition: transform 0.3s ease;\n`;
    }
    css += `}\n\n`;

    css += `.accordion-item.active .accordion-header::after {\n`;
    css += `  content: '−';\n`;
    if (animated) {
      css += `  transform: rotate(180deg);\n`;
    }
    css += `}\n\n`;

    css += `.accordion-content {\n`;
    css += `  max-height: 0;\n`;
    css += `  overflow: hidden;\n`;
    css += `  padding: 0 20px;\n`;
    css += `  background-color: #ffffff;\n`;
    if (animated) {
      css += `  transition: max-height 0.3s ease, padding 0.3s ease;\n`;
    }
    css += `}\n\n`;

    css += `.accordion-item.active .accordion-content {\n`;
    css += `  max-height: 500px;\n`;
    css += `  padding: 16px 20px;\n`;
    css += `}\n`;

    css += `\n/* HTML Structure */\n`;
    css += `/*\n<div class="accordion">\n`;
    for (let i = 1; i <= count; i++) {
      css += `  <div class="accordion-item">\n`;
      css += `    <div class="accordion-header">Section ${i}</div>\n`;
      css += `    <div class="accordion-content">\n`;
      css += `      <p>Content for section ${i}</p>\n`;
      css += `    </div>\n`;
      css += `  </div>\n`;
    }
    css += `</div>\n*/\n`;

    setOutput(css);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">
                Number of Items
              </label>
              <input
                id={`${toolId}-count`}
                type="number"
                value={itemCount}
                onChange={(e) => setItemCount(e.target.value)}
                min="1"
                max="20"
                aria-label={`Item count for ${toolName}`}
                className="input-field"
              />
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
                max="50"
                aria-label="Border radius"
                className="input-field"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor={`${toolId}-bg`} className="block text-sm font-medium text-gray-700 mb-1">
                Background
              </label>
              <input
                id={`${toolId}-bg`}
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                aria-label="Background color"
                className="input-field h-10"
              />
            </div>
            <div>
              <label htmlFor={`${toolId}-header`} className="block text-sm font-medium text-gray-700 mb-1">
                Header Color
              </label>
              <input
                id={`${toolId}-header`}
                type="color"
                value={headerColor}
                onChange={(e) => setHeaderColor(e.target.value)}
                aria-label="Header text color"
                className="input-field h-10"
              />
            </div>
            <div>
              <label htmlFor={`${toolId}-accent`} className="block text-sm font-medium text-gray-700 mb-1">
                Accent Color
              </label>
              <input
                id={`${toolId}-accent`}
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                aria-label="Accent color"
                className="input-field h-10"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              id={`${toolId}-animated`}
              type="checkbox"
              checked={animated}
              onChange={(e) => setAnimated(e.target.checked)}
              aria-label="Enable animations"
              className="rounded"
            />
            <label htmlFor={`${toolId}-animated`} className="text-sm text-gray-700">
              Enable animations/transitions
            </label>
          </div>
          <button onClick={generate} className="btn-primary w-full">
            Generate Accordion CSS
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated CSS</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto max-h-96 overflow-y-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
