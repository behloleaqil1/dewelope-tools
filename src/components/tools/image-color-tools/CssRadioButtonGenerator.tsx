'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssRadioButtonGenerator - Generate custom CSS radio button styles.
 */
export default function CssRadioButtonGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [size, setSize] = useState(20);
  const [borderColor, setBorderColor] = useState('#6b7280');
  const [checkedColor, setCheckedColor] = useState('#3b82f6');
  const [dotColor, setDotColor] = useState('#ffffff');
  const [borderWidth, setBorderWidth] = useState(2);
  const [dotScale, setDotScale] = useState(50);
  const [transition, setTransition] = useState(200);
  const [output, setOutput] = useState('');

  const generate = () => {
    const dotSize = Math.round(size * (dotScale / 100));
    const css = `/* Custom Radio Button Styles */
.custom-radio {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  gap: 8px;
  font-size: 14px;
}

.custom-radio input[type="radio"] {
  appearance: none;
  -webkit-appearance: none;
  width: ${size}px;
  height: ${size}px;
  border: ${borderWidth}px solid ${borderColor};
  border-radius: 50%;
  outline: none;
  cursor: pointer;
  position: relative;
  transition: all ${transition}ms ease;
}

.custom-radio input[type="radio"]::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  width: ${dotSize}px;
  height: ${dotSize}px;
  border-radius: 50%;
  background-color: ${dotColor};
  transition: transform ${transition}ms ease;
}

.custom-radio input[type="radio"]:checked {
  border-color: ${checkedColor};
  background-color: ${checkedColor};
}

.custom-radio input[type="radio"]:checked::after {
  transform: translate(-50%, -50%) scale(1);
}

.custom-radio input[type="radio"]:focus-visible {
  box-shadow: 0 0 0 3px ${checkedColor}40;
}

.custom-radio input[type="radio"]:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}`;

    const html = `<!-- HTML Usage -->
<label class="custom-radio">
  <input type="radio" name="option" value="1" />
  <span>Option 1</span>
</label>
<label class="custom-radio">
  <input type="radio" name="option" value="2" />
  <span>Option 2</span>
</label>
<label class="custom-radio">
  <input type="radio" name="option" value="3" />
  <span>Option 3</span>
</label>`;

    setOutput(css + '\n\n' + html);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">Size (px)</label>
            <input id={`${toolId}-size`} type="number" min={12} max={48} value={size} onChange={(e) => setSize(parseInt(e.target.value) || 20)} className="input-field" aria-label={`Radio button size for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-border-width`} className="block text-sm font-medium text-gray-700 mb-1">Border Width (px)</label>
            <input id={`${toolId}-border-width`} type="number" min={1} max={6} value={borderWidth} onChange={(e) => setBorderWidth(parseInt(e.target.value) || 2)} className="input-field" aria-label="Border width" />
          </div>
          <div>
            <label htmlFor={`${toolId}-border-color`} className="block text-sm font-medium text-gray-700 mb-1">Border Color</label>
            <div className="flex gap-2">
              <input id={`${toolId}-border-color`} type="color" value={borderColor} onChange={(e) => setBorderColor(e.target.value)} className="h-10 w-12 rounded cursor-pointer" aria-label="Border color" />
              <input type="text" value={borderColor} onChange={(e) => setBorderColor(e.target.value)} className="input-field flex-1 font-mono" />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-checked-color`} className="block text-sm font-medium text-gray-700 mb-1">Checked Color</label>
            <div className="flex gap-2">
              <input id={`${toolId}-checked-color`} type="color" value={checkedColor} onChange={(e) => setCheckedColor(e.target.value)} className="h-10 w-12 rounded cursor-pointer" aria-label="Checked color" />
              <input type="text" value={checkedColor} onChange={(e) => setCheckedColor(e.target.value)} className="input-field flex-1 font-mono" />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-dot-color`} className="block text-sm font-medium text-gray-700 mb-1">Dot Color</label>
            <div className="flex gap-2">
              <input id={`${toolId}-dot-color`} type="color" value={dotColor} onChange={(e) => setDotColor(e.target.value)} className="h-10 w-12 rounded cursor-pointer" aria-label="Dot color" />
              <input type="text" value={dotColor} onChange={(e) => setDotColor(e.target.value)} className="input-field flex-1 font-mono" />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-dot-scale`} className="block text-sm font-medium text-gray-700 mb-1">Dot Scale (%)</label>
            <input id={`${toolId}-dot-scale`} type="number" min={20} max={90} value={dotScale} onChange={(e) => setDotScale(parseInt(e.target.value) || 50)} className="input-field" aria-label="Dot scale percentage" />
          </div>
          <div>
            <label htmlFor={`${toolId}-transition`} className="block text-sm font-medium text-gray-700 mb-1">Transition (ms)</label>
            <input id={`${toolId}-transition`} type="number" min={0} max={1000} value={transition} onChange={(e) => setTransition(parseInt(e.target.value) || 200)} className="input-field" aria-label="Transition duration" />
          </div>
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate CSS</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated CSS & HTML</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
