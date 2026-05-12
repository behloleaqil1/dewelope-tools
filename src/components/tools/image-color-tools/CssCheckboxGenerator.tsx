'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssCheckboxGenerator - Generate custom CSS checkbox styles.
 */
export default function CssCheckboxGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [size, setSize] = useState('20');
  const [borderRadius, setBorderRadius] = useState('4');
  const [borderColor, setBorderColor] = useState('#6b7280');
  const [checkedColor, setCheckedColor] = useState('#3b82f6');
  const [checkmarkColor, setCheckmarkColor] = useState('#ffffff');
  const [style, setStyle] = useState('checkmark');
  const [output, setOutput] = useState('');

  const generate = () => {
    const s = parseInt(size) || 20;
    const br = parseInt(borderRadius) || 4;

    let checkmarkCSS = '';
    if (style === 'checkmark') {
      checkmarkCSS = `  content: "";
  width: ${Math.round(s * 0.3)}px;
  height: ${Math.round(s * 0.55)}px;
  border: solid ${checkmarkColor};
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);`;
    } else if (style === 'cross') {
      checkmarkCSS = `  content: "✕";
  color: ${checkmarkColor};
  font-size: ${Math.round(s * 0.7)}px;
  line-height: 1;`;
    } else {
      checkmarkCSS = `  content: "";
  width: ${Math.round(s * 0.5)}px;
  height: ${Math.round(s * 0.5)}px;
  background: ${checkmarkColor};
  border-radius: 50%;`;
    }

    const css = `.custom-checkbox {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  gap: 8px;
}

.custom-checkbox input {
  display: none;
}

.custom-checkbox .checkmark {
  width: ${s}px;
  height: ${s}px;
  border: 2px solid ${borderColor};
  border-radius: ${br}px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.custom-checkbox input:checked + .checkmark {
  background: ${checkedColor};
  border-color: ${checkedColor};
}

.custom-checkbox input:checked + .checkmark::after {
${checkmarkCSS}
}`;

    const html = `<label class="custom-checkbox">
  <input type="checkbox" />
  <span class="checkmark"></span>
  Label text
</label>`;

    setOutput(`/* CSS */\n${css}\n\n/* HTML */\n${html}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">Size (px)</label>
              <input id={`${toolId}-size`} type="number" value={size} onChange={e => setSize(e.target.value)} min="12" max="48" aria-label={`Checkbox size for ${toolName}`} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-radius`} className="block text-sm font-medium text-gray-700 mb-1">Border Radius (px)</label>
              <input id={`${toolId}-radius`} type="number" value={borderRadius} onChange={e => setBorderRadius(e.target.value)} min="0" max="50" aria-label="Border radius" className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor={`${toolId}-border`} className="block text-sm font-medium text-gray-700 mb-1">Border</label>
              <input id={`${toolId}-border`} type="color" value={borderColor} onChange={e => setBorderColor(e.target.value)} aria-label="Border color" className="input-field h-10" />
            </div>
            <div>
              <label htmlFor={`${toolId}-checked`} className="block text-sm font-medium text-gray-700 mb-1">Checked BG</label>
              <input id={`${toolId}-checked`} type="color" value={checkedColor} onChange={e => setCheckedColor(e.target.value)} aria-label="Checked background color" className="input-field h-10" />
            </div>
            <div>
              <label htmlFor={`${toolId}-mark`} className="block text-sm font-medium text-gray-700 mb-1">Mark Color</label>
              <input id={`${toolId}-mark`} type="color" value={checkmarkColor} onChange={e => setCheckmarkColor(e.target.value)} aria-label="Checkmark color" className="input-field h-10" />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-style`} className="block text-sm font-medium text-gray-700 mb-1">Check Style</label>
            <select id={`${toolId}-style`} value={style} onChange={e => setStyle(e.target.value)} aria-label="Check style" className="input-field">
              <option value="checkmark">Checkmark (✓)</option>
              <option value="cross">Cross (✕)</option>
              <option value="dot">Dot (●)</option>
            </select>
          </div>
          <button onClick={generate} className="btn-primary w-full">Generate CSS Checkbox</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Code</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-md overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
