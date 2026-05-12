'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToMorseFlashcard - Show Morse code as flashcards for learning.
 */
export default function TextToMorseFlashcard({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [cards, setCards] = useState<{ char: string; morse: string }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const morseMap: Record<string, string> = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
    '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
    '8': '---..', '9': '----.', '.': '.-.-.-', ',': '--..--', '?': '..--..',
  };

  const generateCards = () => {
    const chars = input.toUpperCase().split('').filter((c) => morseMap[c]);
    const unique = [...new Set(chars)];
    const flashcards = unique.map((char) => ({ char, morse: morseMap[char] }));
    setCards(flashcards);
    setCurrentIndex(0);
    setShowAnswer(false);
  };

  const next = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
    }
  };

  const copyText = cards.map((c) => `${c.char} = ${c.morse}`).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Enter text to create flashcards</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter text to learn its Morse code..." aria-label={`Text input for ${toolName}`} className="input-field h-24 resize-y" />
      </InputArea>

      <button onClick={generateCards} className="btn-primary" aria-label="Generate flashcards">Generate Flashcards</button>

      <OutputArea hasContent={cards.length > 0}>
        {cards.length > 0 && (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 text-center">Card {currentIndex + 1} of {cards.length}</div>
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 text-center min-h-[160px] flex flex-col items-center justify-center cursor-pointer" onClick={() => setShowAnswer(!showAnswer)} role="button" tabIndex={0} aria-label="Click to reveal answer" onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setShowAnswer(!showAnswer); }}>
              <div className="text-4xl font-bold text-gray-800 mb-2">{cards[currentIndex].char}</div>
              {showAnswer ? (
                <div className="text-3xl font-mono text-blue-600 tracking-widest">{cards[currentIndex].morse}</div>
              ) : (
                <div className="text-sm text-gray-400 mt-2">Click to reveal Morse code</div>
              )}
            </div>
            <div className="flex justify-center gap-3">
              <button onClick={prev} disabled={currentIndex === 0} className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed" aria-label="Previous card">← Previous</button>
              <button onClick={() => setShowAnswer(!showAnswer)} className="px-4 py-2 text-sm rounded-lg border border-blue-300 text-blue-700 hover:bg-blue-50" aria-label="Flip card">{showAnswer ? 'Hide' : 'Reveal'}</button>
              <button onClick={next} disabled={currentIndex === cards.length - 1} className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed" aria-label="Next card">Next →</button>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">All Cards Reference</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {cards.map((card, i) => (
                  <div key={i} className={`text-center p-2 rounded border text-xs ${i === currentIndex ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
                    <div className="font-bold">{card.char}</div>
                    <div className="font-mono text-gray-600">{card.morse}</div>
                  </div>
                ))}
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
