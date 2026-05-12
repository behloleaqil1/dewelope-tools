'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function TemperatureFeelsLike({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [temp, setTemp] = useState('');
  const [wind, setWind] = useState('');
  const [humidity, setHumidity] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const t = parseFloat(temp), w = parseFloat(wind), h = parseFloat(humidity);
    if (isNaN(t)) { setOutput('Enter valid temperature in °F'); return; }
    let feelsLike: number;
    let method: string;
    if (t <= 50 && !isNaN(w) && w > 3) {
      feelsLike = 35.74 + 0.6215 * t - 35.75 * Math.pow(w, 0.16) + 0.4275 * t * Math.pow(w, 0.16);
      method = 'Wind Chill';
    } else if (t >= 80 && !isNaN(h)) {
      feelsLike = -42.379 + 2.04901523 * t + 10.14333127 * h - 0.22475541 * t * h - 0.00683783 * t * t - 0.05481717 * h * h + 0.00122874 * t * t * h + 0.00085282 * t * h * h - 0.00000199 * t * t * h * h;
      method = 'Heat Index';
    } else {
      feelsLike = t;
      method = 'Actual (no adjustment needed)';
    }
    const feelsC = (feelsLike - 32) * 5 / 9;
    setOutput(`Feels Like: ${feelsLike.toFixed(1)}°F (${feelsC.toFixed(1)}°C)\nMethod: ${method}\nActual Temp: ${t}°F\n${!isNaN(w) ? `Wind: ${w} mph\n` : ''}${!isNaN(h) ? `Humidity: ${h}%` : ''}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-temp`} className="block text-sm font-medium text-gray-700 mb-1">Temperature (°F)</label>
        <input id={`${toolId}-temp`} value={temp} onChange={(e) => setTemp(e.target.value)} placeholder="72" className="input-field" aria-label={`Temp for ${toolName}`} />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-wind`} className="block text-sm font-medium text-gray-700 mb-1">Wind Speed (mph)</label>
        <input id={`${toolId}-wind`} value={wind} onChange={(e) => setWind(e.target.value)} placeholder="10" className="input-field" aria-label={`Wind for ${toolName}`} />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-hum`} className="block text-sm font-medium text-gray-700 mb-1">Humidity (%)</label>
        <input id={`${toolId}-hum`} value={humidity} onChange={(e) => setHumidity(e.target.value)} placeholder="50" className="input-field" aria-label={`Humidity for ${toolName}`} />
      </InputArea>
      <button onClick={calculate} className="btn-primary">Calculate</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
