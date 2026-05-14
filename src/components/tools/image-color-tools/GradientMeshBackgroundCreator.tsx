'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * GradientMeshBackgroundCreator - Multi-point gradient mesh background.
 */
export default function GradientMeshBackgroundCreator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [color1, setColor1] = useState('#667eea');
  const [color2, setColor2] = useState('#764ba2');
  const [color3, setColor3] = useState('#f093fb');
  const [color4, setColor4] = useState('#f5576c');
  const [output, setOutput] = useState('');

  function generate() {
    const css = `background-color: ${color1};
background-image:
  radial-gradient(at 40% 20%, ${color1} 0px, transparent 50%),
  radial-gradient(at 80% 0%, ${color2} 0px, transparent 50%),
  radial-gradient(at 0% 50%, ${color3} 0px, transparent 50%),
  radial-gradient(at 80% 50%, ${color4} 0px, transparent 50%),
  radial-gradient(at 0% 100%, ${color2} 0px, transparent 50%),
  radial-gradient(at 80% 100%, ${color1} 0px, transparent 50%);`;
    setOutput(css);
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-2">Mesh Colors</label>
        <div className="flex gap-3 flex-wrap">
          {[
            { val: color1, set: setColor1, label: 'Color 1' },
            { val: color2, set: setColor2, label: 'Color 2' },
            { val: color3, set: setColor3, label: 'Color 3' },
            { val: color4, set: setColor4, label: 'Color 4' },
          ].map((c, i) => (
            <div key={i}>
              <input type="color" value={c.val} onChange={(e) => c.set(e.target.value)} aria-label={`${c.label} for ${toolName}`} className="w-10 h-10 rounded border border-gray-300 cursor-pointer" />
              <div className="text-xs text-gray-500 text-center mt-1">{c.label}</div>
            </div>
          ))}
        </div>
      </InputArea>

      <button onClick={generate} aria-label="Generate gradient mesh" className="btn-primary">Generate Mesh</button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <div className="h-40 rounded-lg border border-gray-200" style={{
              backgroundColor: color1,
              backgroundImage: `radial-gradient(at 40% 20%, ${color1} 0px, transparent 50%), radial-gradient(at 80% 0%, ${color2} 0px, transparent 50%), radial-gradient(at 0% 50%, ${color3} 0px, transparent 50%), radial-gradient(at 80% 50%, ${color4} 0px, transparent 50%)`
            }} />
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
