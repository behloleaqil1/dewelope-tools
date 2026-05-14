'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  avgWordLength: number;
  avgSentenceLength: number;
  longestWord: string;
  shortestWord: string;
  uniqueWords: number;
  readingTime: string;
  speakingTime: string;
}

/**
 * TextStatisticsAnalyzer - Provides detailed text statistics
 */
export default function TextStatisticsAnalyzer({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<TextStats | null>(null);

  function analyze() {
    if (!input.trim()) return;

    const words = input.trim().split(/\s+/).filter(w => w.length > 0);
    const sentences = input.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = input.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const uniqueWords = new Set(words.map(w => w.toLowerCase().replace(/[^a-z]/g, ''))).size;
    const totalWordLength = words.reduce((sum, w) => sum + w.replace(/[^a-zA-Z]/g, '').length, 0);
    const avgWordLength = words.length > 0 ? totalWordLength / words.length : 0;
    const avgSentenceLength = sentences.length > 0 ? words.length / sentences.length : 0;
    const sorted = [...words].sort((a, b) => a.length - b.length);
    const readingMinutes = Math.ceil(words.length / 200);
    const speakingMinutes = Math.ceil(words.length / 130);

    setResult({
      characters: input.length,
      charactersNoSpaces: input.replace(/\s/g, '').length,
      words: words.length,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
      avgWordLength,
      avgSentenceLength,
      longestWord: sorted.length > 0 ? sorted[sorted.length - 1] : '',
      shortestWord: sorted.length > 0 ? sorted[0] : '',
      uniqueWords,
      readingTime: `~${readingMinutes} min`,
      speakingTime: `~${speakingMinutes} min`,
    });
  }

  const copyText = result ? `Characters: ${result.characters}\nWords: ${result.words}\nSentences: ${result.sentences}\nParagraphs: ${result.paragraphs}\nAvg Word Length: ${result.avgWordLength.toFixed(1)}\nAvg Sentence Length: ${result.avgSentenceLength.toFixed(1)} words\nUnique Words: ${result.uniqueWords}\nReading Time: ${result.readingTime}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Text Input</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste your text here for detailed statistics" aria-label={`Text input for ${toolName}`} className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y" />
      </InputArea>

      <button onClick={analyze} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Analyze</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center"><div className="text-lg font-bold text-blue-600">{result.characters}</div><div className="text-xs text-gray-500">Characters</div></div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-center"><div className="text-lg font-bold text-green-600">{result.words}</div><div className="text-xs text-gray-500">Words</div></div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 text-center"><div className="text-lg font-bold text-purple-600">{result.sentences}</div><div className="text-xs text-gray-500">Sentences</div></div>
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 text-center"><div className="text-lg font-bold text-orange-600">{result.avgWordLength.toFixed(1)}</div><div className="text-xs text-gray-500">Avg Word Length</div></div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center"><div className="text-lg font-bold text-gray-600">{result.uniqueWords}</div><div className="text-xs text-gray-500">Unique Words</div></div>
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-center"><div className="text-lg font-bold text-yellow-600">{result.readingTime}</div><div className="text-xs text-gray-500">Reading Time</div></div>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Longest word: <span className="font-mono">{result.longestWord}</span></p>
              <p>Shortest word: <span className="font-mono">{result.shortestWord}</span></p>
              <p>Speaking time: {result.speakingTime}</p>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
