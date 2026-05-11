'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const EMOJI_MAP: Record<string, string> = {
  'love': '❤️', 'heart': '❤️', 'happy': '😊', 'sad': '😢', 'angry': '😠',
  'fire': '🔥', 'hot': '🔥', 'cool': '😎', 'sun': '☀️', 'moon': '🌙',
  'star': '⭐', 'rain': '🌧️', 'snow': '❄️', 'cloud': '☁️', 'thunder': '⚡',
  'music': '🎵', 'phone': '📱', 'computer': '💻', 'book': '📖', 'money': '💰',
  'time': '⏰', 'clock': '🕐', 'home': '🏠', 'car': '🚗', 'plane': '✈️',
  'food': '🍔', 'pizza': '🍕', 'coffee': '☕', 'beer': '🍺', 'wine': '🍷',
  'dog': '🐕', 'cat': '🐈', 'fish': '🐟', 'bird': '🐦', 'tree': '🌳',
  'flower': '🌸', 'rocket': '🚀', 'world': '🌍', 'earth': '🌍', 'water': '💧',
  'smile': '😊', 'laugh': '😂', 'cry': '😭', 'think': '🤔', 'sleep': '😴',
  'party': '🎉', 'gift': '🎁', 'cake': '🎂', 'ring': '💍', 'key': '🔑',
  'lock': '🔒', 'light': '💡', 'bomb': '💣', 'warning': '⚠️', 'check': '✅',
  'cross': '❌', 'question': '❓', 'idea': '💡', 'eyes': '👀', 'hand': '✋',
  'thumbs up': '👍', 'thumbs down': '👎', 'clap': '👏', 'wave': '👋', 'pray': '🙏',
  'run': '🏃', 'walk': '🚶', 'dance': '💃', 'swim': '🏊', 'bike': '🚴',
  'football': '⚽', 'basketball': '🏀', 'tennis': '🎾', 'golf': '⛳', 'trophy': '🏆',
};

/**
 * TextToEmojiReplace - Replace common words with emoji equivalents in text.
 */
export default function TextToEmojiReplace({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [replaceCount, setReplaceCount] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input.trim()) {
      setOutput('');
      setReplaceCount(0);
      return;
    }

    debounceRef.current = setTimeout(() => {
      let result = input;
      let count = 0;

      // Sort keys by length (longest first) to match multi-word phrases first
      const sortedKeys = Object.keys(EMOJI_MAP).sort((a, b) => b.length - a.length);

      for (const word of sortedKeys) {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        const matches = result.match(regex);
        if (matches) {
          count += matches.length;
          result = result.replace(regex, EMOJI_MAP[word]);
        }
      }

      setOutput(result);
      setReplaceCount(count);
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text to emojify
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="I love coffee and pizza! The sun is hot today. Time to party!"
          aria-label={`Text input for ${toolName}`}
          className="input-field h-40 resize-y font-mono text-sm"
        />
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Emojified Text ({replaceCount} replacement{replaceCount !== 1 ? 's' : ''})
              </label>
              <CopyToClipboard text={output} />
            </div>
            <pre className="whitespace-pre-wrap text-sm text-gray-800 p-4 bg-gray-50 rounded-lg border border-gray-100 max-h-64 overflow-y-auto">
              {output}
            </pre>
          </div>
        )}
      </OutputArea>

      <details className="text-sm text-gray-600">
        <summary className="cursor-pointer font-medium">Supported words ({Object.keys(EMOJI_MAP).length})</summary>
        <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1 text-xs">
          {Object.entries(EMOJI_MAP).map(([word, emoji]) => (
            <span key={word} className="bg-gray-50 px-2 py-1 rounded">{word} → {emoji}</span>
          ))}
        </div>
      </details>
    </div>
  );
}
