'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * WaterClockCalculator - Calculate water clock (clepsydra) flow rate for timekeeping.
 * Computes flow rate, orifice size, and water volume needed for a given time period.
 */
export default function WaterClockCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [duration, setDuration] = useState('60');
  const [durationUnit, setDurationUnit] = useState('minutes');
  const [vesselVolume, setVesselVolume] = useState('1000');
  const [volumeUnit, setVolumeUnit] = useState('mL');
  const [waterHead, setWaterHead] = useState('20');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const dur = parseFloat(duration);
    const vol = parseFloat(vesselVolume);
    const head = parseFloat(waterHead);

    if (isNaN(dur) || isNaN(vol) || isNaN(head) || dur <= 0 || vol <= 0 || head <= 0) {
      setOutput('Please enter valid positive values for all fields.');
      return;
    }

    // Convert duration to seconds
    let durationSec = dur;
    if (durationUnit === 'minutes') durationSec = dur * 60;
    else if (durationUnit === 'hours') durationSec = dur * 3600;

    // Convert volume to mL
    let volumeML = vol;
    if (volumeUnit === 'L') volumeML = vol * 1000;
    else if (volumeUnit === 'cups') volumeML = vol * 236.588;

    // Flow rate needed
    const flowRateMLperSec = volumeML / durationSec;
    const flowRateMLperMin = flowRateMLperSec * 60;

    // Torricelli's theorem: v = sqrt(2*g*h)
    // Q = A * v => A = Q / v
    const g = 9.81; // m/s²
    const headM = head / 100; // cm to m
    const velocity = Math.sqrt(2 * g * headM); // m/s

    // Flow rate in m³/s
    const flowRateM3perSec = volumeML / (durationSec * 1e6);

    // Orifice area in m²
    const orificeArea = flowRateM3perSec / (0.6 * velocity); // Cd ≈ 0.6 for sharp-edged orifice
    const orificeDiameter = Math.sqrt(4 * orificeArea / Math.PI) * 1000; // mm

    // Time marks
    const markInterval = durationSec / 12; // 12 divisions

    const lines: string[] = [];
    lines.push(`=== Water Clock (Clepsydra) Calculator ===`);
    lines.push(``);
    lines.push(`--- Input Parameters ---`);
    lines.push(`Total Duration: ${dur} ${durationUnit} (${durationSec.toFixed(1)} seconds)`);
    lines.push(`Vessel Volume: ${vol} ${volumeUnit} (${volumeML.toFixed(1)} mL)`);
    lines.push(`Water Head Height: ${head} cm`);
    lines.push(``);
    lines.push(`--- Flow Requirements ---`);
    lines.push(`Required Flow Rate: ${flowRateMLperSec.toFixed(4)} mL/s`);
    lines.push(`Required Flow Rate: ${flowRateMLperMin.toFixed(3)} mL/min`);
    lines.push(`Required Flow Rate: ${(flowRateMLperSec * 3600 / 1000).toFixed(4)} L/hr`);
    lines.push(``);
    lines.push(`--- Orifice Design (Cd = 0.6) ---`);
    lines.push(`Exit Velocity (Torricelli): ${(velocity * 100).toFixed(2)} cm/s`);
    lines.push(`Required Orifice Area: ${(orificeArea * 1e6).toFixed(4)} mm²`);
    lines.push(`Required Orifice Diameter: ${orificeDiameter.toFixed(3)} mm`);
    lines.push(``);
    lines.push(`--- Time Markings (12 divisions) ---`);
    const volumePerMark = volumeML / 12;
    for (let i = 1; i <= 12; i++) {
      const timeMark = (markInterval * i);
      const timeStr = timeMark >= 3600
        ? `${(timeMark / 3600).toFixed(2)} hr`
        : timeMark >= 60
        ? `${(timeMark / 60).toFixed(1)} min`
        : `${timeMark.toFixed(0)} sec`;
      lines.push(`  Mark ${i.toString().padStart(2)}: ${timeStr} — ${(volumePerMark * i).toFixed(1)} mL drained`);
    }
    lines.push(``);
    lines.push(`Note: Actual flow rate decreases as water level drops.`);
    lines.push(`For constant flow, use a conical vessel or float-valve regulator.`);

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-duration`} className="block text-sm font-medium text-gray-700 mb-1">Time Duration</label>
              <input id={`${toolId}-duration`} type="number" value={duration} onChange={(e) => setDuration(e.target.value)} className="input-field" aria-label={`Duration for ${toolName}`} />
            </div>
            <div>
              <label htmlFor={`${toolId}-dunit`} className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select id={`${toolId}-dunit`} value={durationUnit} onChange={(e) => setDurationUnit(e.target.value)} className="input-field" aria-label="Duration unit">
                <option value="seconds">Seconds</option>
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-volume`} className="block text-sm font-medium text-gray-700 mb-1">Vessel Volume</label>
              <input id={`${toolId}-volume`} type="number" value={vesselVolume} onChange={(e) => setVesselVolume(e.target.value)} className="input-field" aria-label="Vessel volume" />
            </div>
            <div>
              <label htmlFor={`${toolId}-vunit`} className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select id={`${toolId}-vunit`} value={volumeUnit} onChange={(e) => setVolumeUnit(e.target.value)} className="input-field" aria-label="Volume unit">
                <option value="mL">mL</option>
                <option value="L">Liters</option>
                <option value="cups">Cups</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-head`} className="block text-sm font-medium text-gray-700 mb-1">Water Head Height (cm)</label>
            <input id={`${toolId}-head`} type="number" value={waterHead} onChange={(e) => setWaterHead(e.target.value)} className="input-field" aria-label="Water head height in cm" />
          </div>
          <button onClick={calculate} className="btn-primary">Calculate</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Water Clock Design</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
