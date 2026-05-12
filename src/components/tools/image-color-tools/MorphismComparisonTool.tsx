'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MorphismComparisonTool - Compare neumorphism, glassmorphism, and claymorphism side by side.
 * Generates CSS for all three styles with customizable parameters.
 */
export default function MorphismComparisonTool({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [bgColor, setBgColor] = useState('#e0e5ec');
  const [cardColor, setCardColor] = useState('#e0e5ec');
  const [accentColor, setAccentColor] = useState('#6366f1');
  const [borderRadius, setBorderRadius] = useState(16);
  const [intensity, setIntensity] = useState(50);
  const [showCode, setShowCode] = useState(false);

  const neuCSS = `background: ${cardColor};
border-radius: ${borderRadius}px;
box-shadow: ${Math.round(intensity * 0.12)}px ${Math.round(intensity * 0.12)}px ${Math.round(intensity * 0.24)}px rgba(0, 0, 0, ${(intensity * 0.003).toFixed(2)}),
  -${Math.round(intensity * 0.12)}px -${Math.round(intensity * 0.12)}px ${Math.round(intensity * 0.24)}px rgba(255, 255, 255, ${(intensity * 0.014).toFixed(2)});`;

  const glassCSS = `background: rgba(255, 255, 255, ${(intensity * 0.004 + 0.05).toFixed(2)});
border-radius: ${borderRadius}px;
backdrop-filter: blur(${Math.round(intensity * 0.2)}px);
-webkit-backdrop-filter: blur(${Math.round(intensity * 0.2)}px);
border: 1px solid rgba(255, 255, 255, ${(intensity * 0.004).toFixed(2)});
box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);`;

  const clayCSS = `background: ${accentColor};
border-radius: ${borderRadius}px;
box-shadow: inset 0 -${Math.round(intensity * 0.08)}px ${Math.round(intensity * 0.16)}px rgba(0, 0, 0, ${(intensity * 0.003).toFixed(2)}),
  0 ${Math.round(intensity * 0.12)}px ${Math.round(intensity * 0.24)}px rgba(0, 0, 0, ${(intensity * 0.004).toFixed(2)}),
  inset 0 ${Math.round(intensity * 0.04)}px ${Math.round(intensity * 0.08)}px rgba(255, 255, 255, ${(intensity * 0.005).toFixed(2)});`;

  const allCSS = `/* Neumorphism */\n.neumorphism {\n  ${neuCSS.split('\n').join('\n  ')}\n}\n\n/* Glassmorphism */\n.glassmorphism {\n  ${glassCSS.split('\n').join('\n  ')}\n}\n\n/* Claymorphism */\n.claymorphism {\n  ${clayCSS.split('\n').join('\n  ')}\n}`;

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor={`${toolId}-bg`} className="block text-sm font-medium text-gray-700 mb-1">Background</label>
            <input id={`${toolId}-bg`} type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-10 rounded cursor-pointer" aria-label={`Background color for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-card`} className="block text-sm font-medium text-gray-700 mb-1">Card Color</label>
            <input id={`${toolId}-card`} type="color" value={cardColor} onChange={(e) => setCardColor(e.target.value)} className="w-full h-10 rounded cursor-pointer" aria-label={`Card color for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-accent`} className="block text-sm font-medium text-gray-700 mb-1">Accent (Clay)</label>
            <input id={`${toolId}-accent`} type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="w-full h-10 rounded cursor-pointer" aria-label={`Accent color for ${toolName}`} />
          </div>
        </div>
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-radius`} className="block text-sm font-medium text-gray-700 mb-1">
          Border Radius: {borderRadius}px
        </label>
        <input id={`${toolId}-radius`} type="range" min="0" max="50" value={borderRadius} onChange={(e) => setBorderRadius(parseInt(e.target.value))} className="w-full" aria-label={`Border radius for ${toolName}`} />
        <label htmlFor={`${toolId}-intensity`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">
          Intensity: {intensity}%
        </label>
        <input id={`${toolId}-intensity`} type="range" min="10" max="100" value={intensity} onChange={(e) => setIntensity(parseInt(e.target.value))} className="w-full" aria-label={`Intensity for ${toolName}`} />
      </InputArea>

      <OutputArea hasContent={true}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 rounded-lg" style={{ background: bgColor }}>
            {/* Neumorphism */}
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-full h-32 flex items-center justify-center text-sm font-medium text-gray-600"
                style={{
                  background: cardColor,
                  borderRadius: `${borderRadius}px`,
                  boxShadow: `${Math.round(intensity * 0.12)}px ${Math.round(intensity * 0.12)}px ${Math.round(intensity * 0.24)}px rgba(0,0,0,${(intensity * 0.003).toFixed(2)}), -${Math.round(intensity * 0.12)}px -${Math.round(intensity * 0.12)}px ${Math.round(intensity * 0.24)}px rgba(255,255,255,${(intensity * 0.014).toFixed(2)})`,
                }}
              >
                Neumorphism
              </div>
              <span className="text-xs text-gray-500">Soft UI / Raised</span>
            </div>

            {/* Glassmorphism */}
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-full h-32 flex items-center justify-center text-sm font-medium text-gray-700"
                style={{
                  background: `rgba(255,255,255,${(intensity * 0.004 + 0.05).toFixed(2)})`,
                  borderRadius: `${borderRadius}px`,
                  backdropFilter: `blur(${Math.round(intensity * 0.2)}px)`,
                  WebkitBackdropFilter: `blur(${Math.round(intensity * 0.2)}px)`,
                  border: `1px solid rgba(255,255,255,${(intensity * 0.004).toFixed(2)})`,
                  boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
                }}
              >
                Glassmorphism
              </div>
              <span className="text-xs text-gray-500">Frosted Glass</span>
            </div>

            {/* Claymorphism */}
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-full h-32 flex items-center justify-center text-sm font-medium text-white"
                style={{
                  background: accentColor,
                  borderRadius: `${borderRadius}px`,
                  boxShadow: `inset 0 -${Math.round(intensity * 0.08)}px ${Math.round(intensity * 0.16)}px rgba(0,0,0,${(intensity * 0.003).toFixed(2)}), 0 ${Math.round(intensity * 0.12)}px ${Math.round(intensity * 0.24)}px rgba(0,0,0,${(intensity * 0.004).toFixed(2)}), inset 0 ${Math.round(intensity * 0.04)}px ${Math.round(intensity * 0.08)}px rgba(255,255,255,${(intensity * 0.005).toFixed(2)})`,
                }}
              >
                Claymorphism
              </div>
              <span className="text-xs text-gray-500">Clay / 3D Soft</span>
            </div>
          </div>

          <button onClick={() => setShowCode(!showCode)} className="text-sm text-blue-600 hover:text-blue-800">
            {showCode ? 'Hide CSS Code' : 'Show CSS Code'}
          </button>

          {showCode && (
            <div className="space-y-2">
              <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{allCSS}</pre>
              <CopyToClipboard text={allCSS} />
            </div>
          )}
        </div>
      </OutputArea>
    </div>
  );
}
