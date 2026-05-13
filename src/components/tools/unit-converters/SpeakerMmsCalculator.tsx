'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SpeakerMmsCalculator - Calculate speaker moving mass (Mms) from cone, surround, and voice coil parameters.
 */
export default function SpeakerMmsCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [coneMass, setConeMass] = useState('10');
  const [surroundMass, setSurroundMass] = useState('2');
  const [voiceCoilMass, setVoiceCoilMass] = useState('5');
  const [spiderMass, setSpiderMass] = useState('1.5');
  const [airLoadMass, setAirLoadMass] = useState('0.5');
  const [glueMass, setGlueMass] = useState('0.3');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const cone = parseFloat(coneMass);
    const surround = parseFloat(surroundMass);
    const voiceCoil = parseFloat(voiceCoilMass);
    const spider = parseFloat(spiderMass);
    const airLoad = parseFloat(airLoadMass);
    const glue = parseFloat(glueMass);

    if ([cone, surround, voiceCoil, spider, airLoad, glue].some(v => isNaN(v) || v < 0)) {
      setOutput('Please enter valid non-negative numbers.');
      return;
    }

    const mms = cone + surround + voiceCoil + spider + airLoad + glue;
    const mmd = cone + surround + voiceCoil + spider + glue; // Without air load

    let category = '';
    if (mms < 5) category = 'Tweeter range';
    else if (mms < 20) category = 'Midrange driver';
    else if (mms < 50) category = 'Mid-woofer';
    else if (mms < 150) category = 'Woofer';
    else category = 'Subwoofer';

    const results = [
      `Moving Mass Breakdown:`,
      `  Cone: ${cone.toFixed(2)} g`,
      `  Surround: ${surround.toFixed(2)} g`,
      `  Voice Coil: ${voiceCoil.toFixed(2)} g`,
      `  Spider: ${spider.toFixed(2)} g`,
      `  Air Load: ${airLoad.toFixed(2)} g`,
      `  Glue/Lead Wires: ${glue.toFixed(2)} g`,
      ``,
      `Mms (total moving mass): ${mms.toFixed(2)} g`,
      `Mmd (diaphragm mass, no air): ${mmd.toFixed(2)} g`,
      ``,
      `Driver Category: ${category}`,
      ``,
      `Note: Lower Mms = faster transient response.`,
      `Higher Mms = lower resonant frequency (Fs).`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-cone`} className="block text-sm font-medium text-gray-700 mb-1">Cone Mass (g)</label>
              <input id={`${toolId}-cone`} type="number" step="0.1" value={coneMass} onChange={(e) => setConeMass(e.target.value)} className="input-field" aria-label={`Cone mass for ${toolName}`} />
            </div>
            <div>
              <label htmlFor={`${toolId}-surround`} className="block text-sm font-medium text-gray-700 mb-1">Surround Mass (g)</label>
              <input id={`${toolId}-surround`} type="number" step="0.1" value={surroundMass} onChange={(e) => setSurroundMass(e.target.value)} className="input-field" aria-label="Surround mass" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-vc`} className="block text-sm font-medium text-gray-700 mb-1">Voice Coil Mass (g)</label>
              <input id={`${toolId}-vc`} type="number" step="0.1" value={voiceCoilMass} onChange={(e) => setVoiceCoilMass(e.target.value)} className="input-field" aria-label="Voice coil mass" />
            </div>
            <div>
              <label htmlFor={`${toolId}-spider`} className="block text-sm font-medium text-gray-700 mb-1">Spider Mass (g)</label>
              <input id={`${toolId}-spider`} type="number" step="0.1" value={spiderMass} onChange={(e) => setSpiderMass(e.target.value)} className="input-field" aria-label="Spider mass" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-air`} className="block text-sm font-medium text-gray-700 mb-1">Air Load Mass (g)</label>
              <input id={`${toolId}-air`} type="number" step="0.1" value={airLoadMass} onChange={(e) => setAirLoadMass(e.target.value)} className="input-field" aria-label="Air load mass" />
            </div>
            <div>
              <label htmlFor={`${toolId}-glue`} className="block text-sm font-medium text-gray-700 mb-1">Glue/Wires Mass (g)</label>
              <input id={`${toolId}-glue`} type="number" step="0.1" value={glueMass} onChange={(e) => setGlueMass(e.target.value)} className="input-field" aria-label="Glue and lead wires mass" />
            </div>
          </div>
          <button onClick={calculate} className="btn-primary">Calculate Mms</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Speaker Moving Mass (Mms)</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
