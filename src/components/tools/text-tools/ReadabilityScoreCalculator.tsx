'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ReadabilityScoreCalculator - Calculates Flesch-Kincaid and Gunning Fog readability scores.
 */
export default function ReadabilityScoreCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<{ fleschReading: number; fleschGrade: number; gunningFog: number; sentences: number; words: number; syllables: number; complexWords: number; level: string } | null>(null);

  const countSyllables = (word: string): number => {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
  };

  const analyze = () => {
    setError(undefined);
    setResult(null);
    if (!text.trim()) { setError('Please enter text to analyze'); return; }

    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.replace(/[^a-zA-Z]/g, '').length > 0);

    if (words.length < 10) { setError('Please enter at least 10 words for accurate analysis'); return; }

    const totalSyllables = words.reduce((sum, w) => sum + countSyllables(w), 0);
    const complexWords = words.filter(w => countSyllables(w) >= 3).length;

    const sentenceCount = Math.max(sentences.length, 1);
    const wordCount = words.length;

    // Flesch Reading Ease
    const fleschReading = 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (totalSyllables / wordCount);

    // Flesch-Kincaid Grade Level
    const fleschGrade = 0.39 * (wordCount / sentenceCount) + 11.8 * (totalSyllables / wordCount) - 15.59;

    // Gunning Fog Index
    const gunningFog = 0.4 * ((wordCount / sentenceCount) + 100 * (complexWords / wordCount));

    let level: string;
    if (fleschReading >= 90) level = 'Very Easy (5th grade)';
    else if (fleschReading >= 80) level = 'Easy (6th grade)';
    else if (fleschReading >= 70) level = 'Fairly Easy (7th grade)';
    else if (fleschReading >= 60) level = 'Standard (8th-9th grade)';
    else if (fleschReading >= 50) level = 'Fairly Difficult (10th-12th grade)';
    else if (fleschReading >= 30) level = 'Difficult (College)';
    else level = 'Very Difficult (Graduate)';

    setResult({ fleschReading: Math.max(0, fleschReading), fleschGrade: Math.max(0, fleschGrade), gunningFog, sentences: sentenceCount, words: wordCount, syllables: totalSyllables, complexWords, level });
  };

  const copyText = result ? `Flesch Reading Ease: ${result.fleschReading.toFixed(1)}\nFlesch-Kincaid Grade: ${result.fleschGrade.toFixed(1)}\nGunning Fog Index: ${result.gunningFog.toFixed(1)}\nLevel: ${result.level}\nWords: ${result.words}\nSentences: ${result.sentences}\nSyllables: ${result.syllables}\nComplex Words: ${result.complexWords}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Text to Analyze</label>
        <textarea id={`${toolId}-input`} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste your text here (at least 10 words)..." aria-label={`Text input for ${toolName}`} className="input-field min-h-[120px]" />
      </InputArea>
      <button onClick={analyze} aria-label="Calculate readability scores" className="btn-primary">Analyze</button>
      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
              <div className="text-sm text-gray-600">{result.level}</div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.fleschReading.toFixed(1)}</div>
                <div className="text-xs text-gray-500">Flesch Reading Ease</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-green-600">{result.fleschGrade.toFixed(1)}</div>
                <div className="text-xs text-gray-500">F-K Grade Level</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-purple-600">{result.gunningFog.toFixed(1)}</div>
                <div className="text-xs text-gray-500">Gunning Fog</div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div className="text-center"><div className="text-sm font-bold text-gray-700">{result.words}</div><div className="text-xs text-gray-500">Words</div></div>
              <div className="text-center"><div className="text-sm font-bold text-gray-700">{result.sentences}</div><div className="text-xs text-gray-500">Sentences</div></div>
              <div className="text-center"><div className="text-sm font-bold text-gray-700">{result.syllables}</div><div className="text-xs text-gray-500">Syllables</div></div>
              <div className="text-center"><div className="text-sm font-bold text-gray-700">{result.complexWords}</div><div className="text-xs text-gray-500">Complex</div></div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
