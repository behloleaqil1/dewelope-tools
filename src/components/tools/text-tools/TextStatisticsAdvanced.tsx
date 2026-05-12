'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextStatisticsAdvanced - Advanced text readability statistics including
 * Gunning Fog Index, Coleman-Liau Index, Flesch-Kincaid, and more.
 */
export default function TextStatisticsAdvanced({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<Record<string, string | number> | null>(null);

  const countSyllables = (word: string): number => {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
  };

  const analyze = () => {
    if (!input.trim()) {
      setResults(null);
      return;
    }

    const text = input.trim();
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.replace(/[^a-zA-Z0-9]/g, '').length > 0);
    const totalWords = words.length;
    const totalSentences = Math.max(sentences.length, 1);

    const syllableCounts = words.map(w => countSyllables(w));
    const totalSyllables = syllableCounts.reduce((a, b) => a + b, 0);
    const complexWords = words.filter(w => countSyllables(w) >= 3).length;

    // Gunning Fog Index
    const gunningFog = 0.4 * ((totalWords / totalSentences) + 100 * (complexWords / totalWords));

    // Coleman-Liau Index
    const chars = words.join('').replace(/[^a-zA-Z0-9]/g, '').length;
    const L = (chars / totalWords) * 100;
    const S = (totalSentences / totalWords) * 100;
    const colemanLiau = 0.0588 * L - 0.296 * S - 15.8;

    // Flesch-Kincaid Grade Level
    const fleschKincaid = 0.39 * (totalWords / totalSentences) + 11.8 * (totalSyllables / totalWords) - 15.59;

    // Flesch Reading Ease
    const fleschEase = 206.835 - 1.015 * (totalWords / totalSentences) - 84.6 * (totalSyllables / totalWords);

    // ARI (Automated Readability Index)
    const ari = 4.71 * (chars / totalWords) + 0.5 * (totalWords / totalSentences) - 21.43;

    // SMOG Index
    const smog = totalSentences >= 3
      ? 1.0430 * Math.sqrt(complexWords * (30 / totalSentences)) + 3.1291
      : 0;

    // Average word length
    const avgWordLength = (chars / totalWords).toFixed(1);

    // Average sentence length
    const avgSentenceLength = (totalWords / totalSentences).toFixed(1);

    setResults({
      'Total Words': totalWords,
      'Total Sentences': totalSentences,
      'Total Syllables': totalSyllables,
      'Complex Words (3+ syllables)': complexWords,
      'Avg Word Length': `${avgWordLength} chars`,
      'Avg Sentence Length': `${avgSentenceLength} words`,
      'Gunning Fog Index': gunningFog.toFixed(2),
      'Coleman-Liau Index': colemanLiau.toFixed(2),
      'Flesch-Kincaid Grade': fleschKincaid.toFixed(2),
      'Flesch Reading Ease': fleschEase.toFixed(2),
      'Automated Readability Index': ari.toFixed(2),
      'SMOG Index': smog > 0 ? smog.toFixed(2) : 'N/A (need 30+ sentences)',
    });
  };

  const getReadingLevel = (score: number): string => {
    if (score <= 6) return 'Elementary';
    if (score <= 8) return 'Middle School';
    if (score <= 12) return 'High School';
    if (score <= 16) return 'College';
    return 'Graduate';
  };

  const copyText = results
    ? Object.entries(results).map(([k, v]) => `${k}: ${v}`).join('\n')
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter Text to Analyze
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your text here to calculate readability scores..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-48 resize-y"
        />
      </InputArea>

      <button onClick={analyze} aria-label="Analyze text" className="btn-primary">
        Analyze Text
      </button>

      <OutputArea hasContent={results !== null}>
        {results && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(results).map(([key, value]) => (
                <div key={key} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="text-xs text-gray-500">{key}</div>
                  <div className="text-lg font-semibold text-gray-800">{value}</div>
                </div>
              ))}
            </div>
            {results['Gunning Fog Index'] && typeof results['Gunning Fog Index'] === 'string' && (
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-sm text-blue-800">
                <strong>Reading Level (Gunning Fog):</strong> {getReadingLevel(parseFloat(results['Gunning Fog Index'] as string))}
              </div>
            )}
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
