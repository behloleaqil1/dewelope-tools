'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function MapScaleConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mapDist, setMapDist] = useState('');
  const [scale, setScale] = useState('50000');
  const [mapUnit, setMapUnit] = useState('cm');
  const [result, setResult] = useState('');

  const convert = () => {
    const dist = parseFloat(mapDist);
    const s = parseFloat(scale);
    if (isNaN(dist) || isNaN(s)) return;
    let mapCm = dist;
    if (mapUnit === 'mm') mapCm = dist / 10;
    else if (mapUnit === 'in') mapCm = dist * 2.54;
    const realCm = mapCm * s;
    const realM = realCm / 100;
    const realKm = realM / 1000;
    const realMiles = realKm * 0.621371;
    setResult(`Map Scale: 1:${s.toLocaleString()}\nMap Distance: ${dist} ${mapUnit}\n\nReal Distance:\n${realCm.toLocaleString()} cm\n${realM.toLocaleString()} m\n${realKm.toFixed(3)} km\n${realMiles.toFixed(3)} miles`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-dist`} className="block text-sm font-medium text-gray-700 mb-1">Distance on Map</label>
        <div className="flex gap-2">
          <input id={`${toolId}-dist`} type="text" inputMode="decimal" value={mapDist} onChange={(e) => setMapDist(e.target.value)} placeholder="e.g. 5" aria-label={`Map distance for ${toolName}`} className="input-field flex-1" />
          <select value={mapUnit} onChange={(e) => setMapUnit(e.target.value)} aria-label="Map unit" className="input-field w-24">
            <option value="cm">cm</option>
            <option value="mm">mm</option>
            <option value="in">inches</option>
          </select>
        </div>
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-scale`} className="block text-sm font-medium text-gray-700 mb-1">Scale (1:X)</label>
        <input id={`${toolId}-scale`} type="text" inputMode="decimal" value={scale} onChange={(e) => setScale(e.target.value)} placeholder="50000" aria-label={`Scale for ${toolName}`} className="input-field" />
      </InputArea>
      <button onClick={convert} className="btn-primary" aria-label="Convert">Convert</button>
      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
