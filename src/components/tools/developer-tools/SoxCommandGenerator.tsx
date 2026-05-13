'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SoxCommandGenerator - Generate SoX audio processing commands.
 * Supports effects like trim, fade, reverb, pitch shift, normalize, and format conversion.
 */
export default function SoxCommandGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [inputFile, setInputFile] = useState('input.wav');
  const [outputFile, setOutputFile] = useState('output.wav');
  const [effect, setEffect] = useState('trim');
  const [trimStart, setTrimStart] = useState('0');
  const [trimEnd, setTrimEnd] = useState('30');
  const [fadeIn, setFadeIn] = useState('2');
  const [fadeOut, setFadeOut] = useState('2');
  const [rate, setRate] = useState('44100');
  const [channels, setChannels] = useState('2');
  const [volume, setVolume] = useState('1.5');
  const [pitch, setPitch] = useState('200');
  const [reverbAmount, setReverbAmount] = useState('50');
  const [output, setOutput] = useState('');

  const generate = () => {
    let cmd = `sox ${inputFile} ${outputFile}`;

    switch (effect) {
      case 'trim':
        cmd += ` trim ${trimStart} ${trimEnd}`;
        break;
      case 'fade':
        cmd += ` fade t ${fadeIn} 0 ${fadeOut}`;
        break;
      case 'rate':
        cmd += ` rate ${rate}`;
        break;
      case 'channels':
        cmd += ` channels ${channels}`;
        break;
      case 'volume':
        cmd += ` vol ${volume}`;
        break;
      case 'normalize':
        cmd += ` norm`;
        break;
      case 'reverse':
        cmd += ` reverse`;
        break;
      case 'pitch':
        cmd += ` pitch ${pitch}`;
        break;
      case 'reverb':
        cmd += ` reverb ${reverbAmount}`;
        break;
      case 'speed':
        cmd += ` speed ${volume}`;
        break;
      case 'silence':
        cmd += ` silence 1 0.1 1% reverse silence 1 0.1 1% reverse`;
        break;
      case 'combine':
        cmd = `sox ${inputFile} ${outputFile} trim ${trimStart} ${trimEnd} fade t ${fadeIn} 0 ${fadeOut} norm`;
        break;
    }

    setOutput(cmd);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-input-file`} className="block text-sm font-medium text-gray-700 mb-1">Input File</label>
              <input id={`${toolId}-input-file`} type="text" value={inputFile} onChange={(e) => setInputFile(e.target.value)} className="input-field" aria-label={`Input file for ${toolName}`} />
            </div>
            <div>
              <label htmlFor={`${toolId}-output-file`} className="block text-sm font-medium text-gray-700 mb-1">Output File</label>
              <input id={`${toolId}-output-file`} type="text" value={outputFile} onChange={(e) => setOutputFile(e.target.value)} className="input-field" aria-label="Output file" />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-effect`} className="block text-sm font-medium text-gray-700 mb-1">Effect</label>
            <select id={`${toolId}-effect`} value={effect} onChange={(e) => setEffect(e.target.value)} className="input-field" aria-label="SoX effect">
              <option value="trim">Trim / Cut</option>
              <option value="fade">Fade In/Out</option>
              <option value="rate">Change Sample Rate</option>
              <option value="channels">Change Channels</option>
              <option value="volume">Adjust Volume</option>
              <option value="normalize">Normalize</option>
              <option value="reverse">Reverse</option>
              <option value="pitch">Pitch Shift</option>
              <option value="reverb">Reverb</option>
              <option value="speed">Change Speed</option>
              <option value="silence">Remove Silence</option>
              <option value="combine">Trim + Fade + Normalize</option>
            </select>
          </div>
          {effect === 'trim' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor={`${toolId}-trim-start`} className="block text-sm font-medium text-gray-700 mb-1">Start (seconds)</label>
                <input id={`${toolId}-trim-start`} type="text" value={trimStart} onChange={(e) => setTrimStart(e.target.value)} className="input-field" aria-label="Trim start" />
              </div>
              <div>
                <label htmlFor={`${toolId}-trim-end`} className="block text-sm font-medium text-gray-700 mb-1">Duration (seconds)</label>
                <input id={`${toolId}-trim-end`} type="text" value={trimEnd} onChange={(e) => setTrimEnd(e.target.value)} className="input-field" aria-label="Trim duration" />
              </div>
            </div>
          )}
          {effect === 'fade' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor={`${toolId}-fade-in`} className="block text-sm font-medium text-gray-700 mb-1">Fade In (seconds)</label>
                <input id={`${toolId}-fade-in`} type="text" value={fadeIn} onChange={(e) => setFadeIn(e.target.value)} className="input-field" aria-label="Fade in duration" />
              </div>
              <div>
                <label htmlFor={`${toolId}-fade-out`} className="block text-sm font-medium text-gray-700 mb-1">Fade Out (seconds)</label>
                <input id={`${toolId}-fade-out`} type="text" value={fadeOut} onChange={(e) => setFadeOut(e.target.value)} className="input-field" aria-label="Fade out duration" />
              </div>
            </div>
          )}
          {effect === 'rate' && (
            <div>
              <label htmlFor={`${toolId}-rate`} className="block text-sm font-medium text-gray-700 mb-1">Sample Rate (Hz)</label>
              <input id={`${toolId}-rate`} type="text" value={rate} onChange={(e) => setRate(e.target.value)} className="input-field" aria-label="Sample rate" />
            </div>
          )}
          {effect === 'channels' && (
            <div>
              <label htmlFor={`${toolId}-channels`} className="block text-sm font-medium text-gray-700 mb-1">Channels</label>
              <input id={`${toolId}-channels`} type="text" value={channels} onChange={(e) => setChannels(e.target.value)} className="input-field" aria-label="Number of channels" />
            </div>
          )}
          {(effect === 'volume' || effect === 'speed') && (
            <div>
              <label htmlFor={`${toolId}-volume`} className="block text-sm font-medium text-gray-700 mb-1">{effect === 'volume' ? 'Volume Factor' : 'Speed Factor'}</label>
              <input id={`${toolId}-volume`} type="text" value={volume} onChange={(e) => setVolume(e.target.value)} className="input-field" aria-label={effect === 'volume' ? 'Volume factor' : 'Speed factor'} />
            </div>
          )}
          {effect === 'pitch' && (
            <div>
              <label htmlFor={`${toolId}-pitch`} className="block text-sm font-medium text-gray-700 mb-1">Pitch Shift (cents)</label>
              <input id={`${toolId}-pitch`} type="text" value={pitch} onChange={(e) => setPitch(e.target.value)} className="input-field" aria-label="Pitch shift in cents" />
            </div>
          )}
          {effect === 'reverb' && (
            <div>
              <label htmlFor={`${toolId}-reverb`} className="block text-sm font-medium text-gray-700 mb-1">Reverb Amount (0-100)</label>
              <input id={`${toolId}-reverb`} type="text" value={reverbAmount} onChange={(e) => setReverbAmount(e.target.value)} className="input-field" aria-label="Reverb amount" />
            </div>
          )}
          {effect === 'combine' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label htmlFor={`${toolId}-c-start`} className="block text-sm font-medium text-gray-700 mb-1">Start</label>
                <input id={`${toolId}-c-start`} type="text" value={trimStart} onChange={(e) => setTrimStart(e.target.value)} className="input-field" aria-label="Start time" />
              </div>
              <div>
                <label htmlFor={`${toolId}-c-dur`} className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <input id={`${toolId}-c-dur`} type="text" value={trimEnd} onChange={(e) => setTrimEnd(e.target.value)} className="input-field" aria-label="Duration" />
              </div>
              <div>
                <label htmlFor={`${toolId}-c-fi`} className="block text-sm font-medium text-gray-700 mb-1">Fade In</label>
                <input id={`${toolId}-c-fi`} type="text" value={fadeIn} onChange={(e) => setFadeIn(e.target.value)} className="input-field" aria-label="Fade in" />
              </div>
              <div>
                <label htmlFor={`${toolId}-c-fo`} className="block text-sm font-medium text-gray-700 mb-1">Fade Out</label>
                <input id={`${toolId}-c-fo`} type="text" value={fadeOut} onChange={(e) => setFadeOut(e.target.value)} className="input-field" aria-label="Fade out" />
              </div>
            </div>
          )}
          <button onClick={generate} className="btn-primary">Generate Command</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated SoX Command</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
