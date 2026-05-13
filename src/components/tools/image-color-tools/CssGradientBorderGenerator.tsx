'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssGradientBorderGenerator - Generate CSS gradient border effects.
 * Creates gradient borders using border-image or background-clip techniques.
 */
export default function CssGradientBorderGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [color1, setColor1] = useState('#6366f1');
  const [color2, setColor2] = useState('#ec4899');
  const [color3, setColor3] = useState('#f59e0b');
  const [useThreeColors, setUseThreeColors] = useState(false);
  const [angle, setAngle] = useState('135');
  const [borderWidth, setBorderWidth] = useState('3');
  const [borderRadius, setBorderRadius] = useState('12');
  const [method, setMethod] = useState('border-image');
  const [output, setOutput] = useState('');

  const generate = () => {
    const colors = useThreeColors ? `${color1}, ${color2}, ${color3}` : `${color1}, ${color2}`;
    const gradient = `linear-gradient(${angle}deg, ${colors})`;

    let css = '';
    if (method === 'border-image') {
      css = `.gradient-border {
  border: ${borderWidth}px solid;
  border-image: ${gradient} 1;
  border-radius: ${borderRadius}px;
  /* Note: border-image doesn't work with border-radius in all browsers */
  /* Use the background-clip method for rounded corners */
}`;
    } else {
      css = `.gradient-border {
  position: relative;
  background: white;
  border-radius: ${borderRadius}px;
  padding: 1rem;
}

.gradient-border::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: ${borderRadius}px;
  padding: ${borderWidth}px;
  background: ${gradient};
  -webkit-mask: 
    linear-gradient(#fff 0 0) content-box, 
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}`;
    }

    setOutput(css);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-color1`} className="block text-sm font-medium text-gray-700 mb-1">Color 1</label>
            <div className="flex gap-2">
              <input id={`${toolId}-color1`} type="color" value={color1} onChange={(e) => setColor1(e.target.value)} className="w-10 h-10 rounded cursor-pointer" aria-label={`First color for ${toolName}`} />
              <input type="text" value={color1} onChange={(e) => setColor1(e.target.value)} className="input-field flex-1" />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-color2`} className="block text-sm font-medium text-gray-700 mb-1">Color 2</label>
            <div className="flex gap-2">
              <input id={`${toolId}-color2`} type="color" value={color2} onChange={(e) => setColor2(e.target.value)} className="w-10 h-10 rounded cursor-pointer" aria-label="Second color" />
              <input type="text" value={color2} onChange={(e) => setColor2(e.target.value)} className="input-field flex-1" />
            </div>
          </div>
          {useThreeColors && (
            <div>
              <label htmlFor={`${toolId}-color3`} className="block text-sm font-medium text-gray-700 mb-1">Color 3</label>
              <div className="flex gap-2">
                <input id={`${toolId}-color3`} type="color" value={color3} onChange={(e) => setColor3(e.target.value)} className="w-10 h-10 rounded cursor-pointer" aria-label="Third color" />
                <input type="text" value={color3} onChange={(e) => setColor3(e.target.value)} className="input-field flex-1" />
              </div>
            </div>
          )}
          <div>
            <label htmlFor={`${toolId}-angle`} className="block text-sm font-medium text-gray-700 mb-1">Angle (deg)</label>
            <input id={`${toolId}-angle`} type="number" min="0" max="360" value={angle} onChange={(e) => setAngle(e.target.value)} className="input-field" aria-label="Gradient angle" />
          </div>
          <div>
            <label htmlFor={`${toolId}-width`} className="block text-sm font-medium text-gray-700 mb-1">Border Width (px)</label>
            <input id={`${toolId}-width`} type="number" min="1" max="20" value={borderWidth} onChange={(e) => setBorderWidth(e.target.value)} className="input-field" aria-label="Border width" />
          </div>
          <div>
            <label htmlFor={`${toolId}-radius`} className="block text-sm font-medium text-gray-700 mb-1">Border Radius (px)</label>
            <input id={`${toolId}-radius`} type="number" min="0" max="100" value={borderRadius} onChange={(e) => setBorderRadius(e.target.value)} className="input-field" aria-label="Border radius" />
          </div>
          <div>
            <label htmlFor={`${toolId}-method`} className="block text-sm font-medium text-gray-700 mb-1">Method</label>
            <select id={`${toolId}-method`} value={method} onChange={(e) => setMethod(e.target.value)} className="input-field" aria-label="CSS method">
              <option value="border-image">border-image</option>
              <option value="mask">background + mask (rounded)</option>
            </select>
          </div>
          <div className="flex items-center">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={useThreeColors} onChange={(e) => setUseThreeColors(e.target.checked)} className="rounded" />
              Use 3 colors
            </label>
          </div>
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate CSS</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Preview</label>
            <div className="flex justify-center p-8">
              <div
                className="w-48 h-24 flex items-center justify-center text-sm text-gray-600"
                style={{
                  border: method === 'border-image' ? `${borderWidth}px solid` : 'none',
                  borderImage: method === 'border-image' ? `linear-gradient(${angle}deg, ${useThreeColors ? `${color1}, ${color2}, ${color3}` : `${color1}, ${color2}`}) 1` : undefined,
                  borderRadius: method === 'border-image' ? undefined : `${borderRadius}px`,
                  background: method === 'mask' ? 'white' : undefined,
                  boxShadow: method === 'mask' ? `inset 0 0 0 ${borderWidth}px ${color1}` : undefined,
                }}
              >
                Preview
              </div>
            </div>
            <label className="block text-sm font-medium text-gray-700">Generated CSS</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
