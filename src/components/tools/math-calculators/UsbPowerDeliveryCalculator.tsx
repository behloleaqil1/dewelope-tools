'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * UsbPowerDeliveryCalculator - Calculate USB Power Delivery power profiles.
 * Supports USB PD 2.0/3.0/3.1 voltage and current combinations.
 */
export default function UsbPowerDeliveryCalculator({ toolId, toolName: _toolName }: { toolId: string; toolName: string }) {
  const [voltage, setVoltage] = useState('5');
  const [current, setCurrent] = useState('3');
  const [cableType, setCableType] = useState('type-c');
  const [output, setOutput] = useState('');

  const pdProfiles = [
    { voltage: 5, maxCurrent: 3, power: 15, spec: 'USB PD 2.0' },
    { voltage: 9, maxCurrent: 3, power: 27, spec: 'USB PD 2.0' },
    { voltage: 15, maxCurrent: 3, power: 45, spec: 'USB PD 2.0' },
    { voltage: 20, maxCurrent: 3, power: 60, spec: 'USB PD 2.0' },
    { voltage: 20, maxCurrent: 5, power: 100, spec: 'USB PD 3.0' },
    { voltage: 28, maxCurrent: 5, power: 140, spec: 'USB PD 3.1 EPR' },
    { voltage: 36, maxCurrent: 5, power: 180, spec: 'USB PD 3.1 EPR' },
    { voltage: 48, maxCurrent: 5, power: 240, spec: 'USB PD 3.1 EPR' },
  ];

  const calculate = () => {
    const v = parseFloat(voltage);
    const a = parseFloat(current);

    if (isNaN(v) || isNaN(a) || v <= 0 || a <= 0) {
      setOutput('Please enter valid voltage and current values.');
      return;
    }

    const power = v * a;
    const cableLimit = cableType === 'type-c' ? 240 : cableType === 'type-c-60w' ? 60 : 7.5;
    const withinCableLimit = power <= cableLimit;

    let matchedProfile = 'Custom (non-standard)';
    for (const p of pdProfiles) {
      if (p.voltage === v && a <= p.maxCurrent) {
        matchedProfile = `${p.spec} - ${p.power}W profile`;
        break;
      }
    }

    const result = `USB Power Delivery Calculation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Voltage:        ${v} V
Current:        ${a} A
Power:          ${power.toFixed(1)} W

Cable Type:     ${cableType === 'type-c' ? 'USB-C (240W capable)' : cableType === 'type-c-60w' ? 'USB-C (60W)' : 'USB-A'}
Cable Limit:    ${cableLimit} W
Within Limit:   ${withinCableLimit ? '✓ Yes' : '✗ No - exceeds cable rating'}

PD Profile:     ${matchedProfile}

Standard PD Profiles:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${pdProfiles.map(p => `  ${p.voltage}V @ ${p.maxCurrent}A = ${p.power}W (${p.spec})`).join('\n')}`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label htmlFor={`${toolId}-voltage`} className="block text-sm font-medium text-gray-700 mb-1">Voltage (V)</label>
            <select id={`${toolId}-voltage`} value={voltage} onChange={(e) => setVoltage(e.target.value)} aria-label="USB PD voltage" className="input-field">
              <option value="5">5V</option>
              <option value="9">9V</option>
              <option value="15">15V</option>
              <option value="20">20V</option>
              <option value="28">28V (EPR)</option>
              <option value="36">36V (EPR)</option>
              <option value="48">48V (EPR)</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-current`} className="block text-sm font-medium text-gray-700 mb-1">Current (A)</label>
            <input id={`${toolId}-current`} type="number" step="0.1" min="0.1" max="5" value={current} onChange={(e) => setCurrent(e.target.value)} aria-label="Current in amps" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-cable`} className="block text-sm font-medium text-gray-700 mb-1">Cable Type</label>
            <select id={`${toolId}-cable`} value={cableType} onChange={(e) => setCableType(e.target.value)} aria-label="Cable type" className="input-field">
              <option value="type-c">USB-C (240W EPR)</option>
              <option value="type-c-60w">USB-C (60W)</option>
              <option value="type-a">USB-A</option>
            </select>
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-3" aria-label="Calculate USB PD power">
          Calculate Power
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">USB PD Power Profile</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
