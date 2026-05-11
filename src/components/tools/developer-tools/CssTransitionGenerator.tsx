'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function CssTransitionGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [property, setProperty] = useState('all');
  const [duration, setDuration] = useState('0.3');
  const [timing, setTiming] = useState('ease');
  const [delay, setDelay] = useState('0');

  const css = `transition: ${property} ${duration}s ${timing}${parseFloat(delay) > 0 ? ` ${delay}s` : ''};`;

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-1">Property</label>
        <select value={property} onChange={(e) => setProperty(e.target.value)} aria-label={`Property for ${toolName}`} className="input-field">
          <option value="all">all</option><option value="opacity">opacity</option><option value="transform">transform</option>
          <option value="background-color">background-color</option><option value="color">color</option><option value="width">width</option><option value="height">height</option>
        </select>
        <label className="block text-sm font-medium text-gray-700 mb-1 mt-3">Duration (s)</label>
        <input type="number" step="0.1" min="0" value={duration} onChange={(e) => setDuration(e.target.value)} className="input-field" aria-label="Duration" />
        <label className="block text-sm font-medium text-gray-700 mb-1 mt-3">Timing Function</label>
        <select value={timing} onChange={(e) => setTiming(e.target.value)} className="input-field" aria-label="Timing function">
          <option value="ease">ease</option><option value="linear">linear</option><option value="ease-in">ease-in</option>
          <option value="ease-out">ease-out</option><option value="ease-in-out">ease-in-out</option>
        </select>
        <label className="block text-sm font-medium text-gray-700 mb-1 mt-3">Delay (s)</label>
        <input type="number" step="0.1" min="0" value={delay} onChange={(e) => setDelay(e.target.value)} className="input-field" aria-label="Delay" />
      </InputArea>
      <OutputArea hasContent={true}>
        <div className="space-y-2">
          <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{css}</pre>
          <div className="h-16 bg-blue-500 rounded transition-all hover:bg-green-500 hover:scale-105" style={{ transition: `${property} ${duration}s ${timing} ${delay}s` }}>
            <span className="text-white text-sm p-2 block">Hover me to preview</span>
          </div>
          <CopyToClipboard text={css} />
        </div>
      </OutputArea>
    </div>
  );
}
