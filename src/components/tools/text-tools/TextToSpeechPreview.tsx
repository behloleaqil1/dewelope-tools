'use client';

import { useState, useEffect } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';

/**
 * TextToSpeechPreview - Uses Web Speech API to preview text as speech with voice/rate/pitch controls.
 */
export default function TextToSpeechPreview({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [text, setText] = useState('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [voiceIndex, setVoiceIndex] = useState(0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setSupported(false);
      return;
    }
    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speak = () => {
    setError(undefined);
    if (!text.trim()) { setError('Please enter text to speak'); return; }
    if (!supported) { setError('Speech synthesis not supported in this browser'); return; }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    if (voices[voiceIndex]) utterance.voice = voices[voiceIndex];
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-text`} className="block text-sm font-medium text-gray-700 mb-1">Text to Speak</label>
        <textarea id={`${toolId}-text`} value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text to hear it spoken aloud..." aria-label={`Text input for ${toolName}`} className="input-field min-h-[100px]" />
      </InputArea>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label htmlFor={`${toolId}-voice`} className="block text-sm font-medium text-gray-700 mb-1">Voice</label>
          <select id={`${toolId}-voice`} value={voiceIndex} onChange={(e) => setVoiceIndex(parseInt(e.target.value))} aria-label="Select voice" className="input-field">
            {voices.length > 0 ? voices.map((v, i) => (
              <option key={i} value={i}>{v.name} ({v.lang})</option>
            )) : <option value={0}>Default</option>}
          </select>
        </div>
        <div>
          <label htmlFor={`${toolId}-rate`} className="block text-sm font-medium text-gray-700 mb-1">Rate: {rate.toFixed(1)}x</label>
          <input id={`${toolId}-rate`} type="range" min="0.5" max="2" step="0.1" value={rate} onChange={(e) => setRate(parseFloat(e.target.value))} aria-label="Speech rate" className="w-full" />
        </div>
        <div>
          <label htmlFor={`${toolId}-pitch`} className="block text-sm font-medium text-gray-700 mb-1">Pitch: {pitch.toFixed(1)}</label>
          <input id={`${toolId}-pitch`} type="range" min="0.5" max="2" step="0.1" value={pitch} onChange={(e) => setPitch(parseFloat(e.target.value))} aria-label="Speech pitch" className="w-full" />
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={speak} disabled={isSpeaking} aria-label="Speak text" className="btn-primary disabled:opacity-50">
          {isSpeaking ? '🔊 Speaking...' : '▶ Speak'}
        </button>
        {isSpeaking && (
          <button onClick={stop} aria-label="Stop speaking" className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">⏹ Stop</button>
        )}
      </div>
      <OutputArea hasContent={!supported}>
        {!supported && (
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-sm text-yellow-800">
            Web Speech API is not supported in this browser. Try Chrome, Edge, or Safari.
          </div>
        )}
      </OutputArea>
    </div>
  );
}
