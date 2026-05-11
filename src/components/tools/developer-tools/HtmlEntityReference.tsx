'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * HtmlEntityReference - Searchable reference of HTML entities with name, number, and character.
 * Allows filtering by keyword and copying entity codes.
 */

const HTML_ENTITIES = [
  { char: '&', name: '&amp;', number: '&#38;', desc: 'Ampersand' },
  { char: '<', name: '&lt;', number: '&#60;', desc: 'Less than' },
  { char: '>', name: '&gt;', number: '&#62;', desc: 'Greater than' },
  { char: '"', name: '&quot;', number: '&#34;', desc: 'Double quote' },
  { char: "'", name: '&apos;', number: '&#39;', desc: 'Apostrophe' },
  { char: ' ', name: '&nbsp;', number: '&#160;', desc: 'Non-breaking space' },
  { char: '©', name: '&copy;', number: '&#169;', desc: 'Copyright' },
  { char: '®', name: '&reg;', number: '&#174;', desc: 'Registered' },
  { char: '™', name: '&trade;', number: '&#8482;', desc: 'Trademark' },
  { char: '€', name: '&euro;', number: '&#8364;', desc: 'Euro' },
  { char: '£', name: '&pound;', number: '&#163;', desc: 'Pound' },
  { char: '¥', name: '&yen;', number: '&#165;', desc: 'Yen' },
  { char: '¢', name: '&cent;', number: '&#162;', desc: 'Cent' },
  { char: '§', name: '&sect;', number: '&#167;', desc: 'Section' },
  { char: '¶', name: '&para;', number: '&#182;', desc: 'Paragraph' },
  { char: '†', name: '&dagger;', number: '&#8224;', desc: 'Dagger' },
  { char: '‡', name: '&Dagger;', number: '&#8225;', desc: 'Double dagger' },
  { char: '•', name: '&bull;', number: '&#8226;', desc: 'Bullet' },
  { char: '…', name: '&hellip;', number: '&#8230;', desc: 'Ellipsis' },
  { char: '–', name: '&ndash;', number: '&#8211;', desc: 'En dash' },
  { char: '—', name: '&mdash;', number: '&#8212;', desc: 'Em dash' },
  { char: '°', name: '&deg;', number: '&#176;', desc: 'Degree' },
  { char: '±', name: '&plusmn;', number: '&#177;', desc: 'Plus-minus' },
  { char: '×', name: '&times;', number: '&#215;', desc: 'Multiplication' },
  { char: '÷', name: '&divide;', number: '&#247;', desc: 'Division' },
  { char: '¼', name: '&frac14;', number: '&#188;', desc: 'One quarter' },
  { char: '½', name: '&frac12;', number: '&#189;', desc: 'One half' },
  { char: '¾', name: '&frac34;', number: '&#190;', desc: 'Three quarters' },
  { char: '∞', name: '&infin;', number: '&#8734;', desc: 'Infinity' },
  { char: '≠', name: '&ne;', number: '&#8800;', desc: 'Not equal' },
  { char: '≤', name: '&le;', number: '&#8804;', desc: 'Less or equal' },
  { char: '≥', name: '&ge;', number: '&#8805;', desc: 'Greater or equal' },
  { char: '←', name: '&larr;', number: '&#8592;', desc: 'Left arrow' },
  { char: '→', name: '&rarr;', number: '&#8594;', desc: 'Right arrow' },
  { char: '↑', name: '&uarr;', number: '&#8593;', desc: 'Up arrow' },
  { char: '↓', name: '&darr;', number: '&#8595;', desc: 'Down arrow' },
  { char: '↔', name: '&harr;', number: '&#8596;', desc: 'Left-right arrow' },
  { char: '♠', name: '&spades;', number: '&#9824;', desc: 'Spade' },
  { char: '♣', name: '&clubs;', number: '&#9827;', desc: 'Club' },
  { char: '♥', name: '&hearts;', number: '&#9829;', desc: 'Heart' },
  { char: '♦', name: '&diams;', number: '&#9830;', desc: 'Diamond' },
  { char: '★', name: '&#9733;', number: '&#9733;', desc: 'Star filled' },
  { char: '☆', name: '&#9734;', number: '&#9734;', desc: 'Star empty' },
  { char: '✓', name: '&#10003;', number: '&#10003;', desc: 'Check mark' },
  { char: '✗', name: '&#10007;', number: '&#10007;', desc: 'Cross mark' },
  { char: '∑', name: '&sum;', number: '&#8721;', desc: 'Summation' },
  { char: '√', name: '&radic;', number: '&#8730;', desc: 'Square root' },
  { char: 'π', name: '&pi;', number: '&#960;', desc: 'Pi' },
  { char: 'α', name: '&alpha;', number: '&#945;', desc: 'Alpha' },
  { char: 'β', name: '&beta;', number: '&#946;', desc: 'Beta' },
  { char: 'γ', name: '&gamma;', number: '&#947;', desc: 'Gamma' },
  { char: 'δ', name: '&delta;', number: '&#948;', desc: 'Delta' },
  { char: 'λ', name: '&lambda;', number: '&#955;', desc: 'Lambda' },
  { char: 'μ', name: '&mu;', number: '&#956;', desc: 'Mu' },
  { char: 'Ω', name: '&Omega;', number: '&#937;', desc: 'Omega' },
];

export default function HtmlEntityReference({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState('');

  const filtered = HTML_ENTITIES.filter((entity) => {
    const q = search.toLowerCase();
    return (
      entity.char.includes(search) ||
      entity.name.toLowerCase().includes(q) ||
      entity.number.includes(q) ||
      entity.desc.toLowerCase().includes(q)
    );
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(''), 1500);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-search`} className="block text-sm font-medium text-gray-700 mb-1">
          Search HTML Entities
        </label>
        <input
          id={`${toolId}-search`}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by character, name, number, or description..."
          aria-label={`Search input for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <OutputArea hasContent={filtered.length > 0}>
        <div className="text-sm text-gray-500 mb-2">{filtered.length} entities found</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left p-2 font-medium text-gray-700">Char</th>
                <th className="text-left p-2 font-medium text-gray-700">Name</th>
                <th className="text-left p-2 font-medium text-gray-700">Number</th>
                <th className="text-left p-2 font-medium text-gray-700">Description</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entity, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-2 text-2xl text-center">{entity.char}</td>
                  <td className="p-2 font-mono">
                    <button
                      onClick={() => handleCopy(entity.name)}
                      className="hover:text-blue-600 cursor-pointer"
                      title="Click to copy"
                      aria-label={`Copy ${entity.name}`}
                    >
                      {entity.name}
                      {copied === entity.name && <span className="ml-1 text-green-600 text-xs">✓</span>}
                    </button>
                  </td>
                  <td className="p-2 font-mono">
                    <button
                      onClick={() => handleCopy(entity.number)}
                      className="hover:text-blue-600 cursor-pointer"
                      title="Click to copy"
                      aria-label={`Copy ${entity.number}`}
                    >
                      {entity.number}
                      {copied === entity.number && <span className="ml-1 text-green-600 text-xs">✓</span>}
                    </button>
                  </td>
                  <td className="p-2 text-gray-600">{entity.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="mt-3">
            <CopyToClipboard text={filtered.map((e) => `${e.char}\t${e.name}\t${e.number}\t${e.desc}`).join('\n')} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
