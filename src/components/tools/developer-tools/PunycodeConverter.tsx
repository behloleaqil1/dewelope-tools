'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PunycodeConverter - Converts between Unicode domain names and Punycode (xn--) encoding.
 */
export default function PunycodeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState<string | undefined>();

  // Punycode encoding/decoding implementation
  const BASE = 36;
  const TMIN = 1;
  const TMAX = 26;
  const SKEW = 38;
  const DAMP = 700;
  const INITIAL_BIAS = 72;
  const INITIAL_N = 128;

  function adapt(delta: number, numPoints: number, firstTime: boolean): number {
    let d = firstTime ? Math.floor(delta / DAMP) : Math.floor(delta / 2);
    d += Math.floor(d / numPoints);
    let k = 0;
    while (d > ((BASE - TMIN) * TMAX) / 2) {
      d = Math.floor(d / (BASE - TMIN));
      k += BASE;
    }
    return k + Math.floor(((BASE - TMIN + 1) * d) / (d + SKEW));
  }

  function digitToChar(d: number): string {
    return String.fromCharCode(d < 26 ? d + 97 : d - 26 + 48);
  }

  function charToDigit(c: number): number {
    if (c >= 48 && c <= 57) return c - 48 + 26;
    if (c >= 65 && c <= 90) return c - 65;
    if (c >= 97 && c <= 122) return c - 97;
    return BASE;
  }

  function punycodeEncode(input: string): string {
    const output: string[] = [];
    const codePoints = Array.from(input).map((c) => c.codePointAt(0)!);
    const basicChars = codePoints.filter((cp) => cp < 128);
    
    for (const cp of basicChars) {
      output.push(String.fromCharCode(cp));
    }

    let handledCount = basicChars.length;
    const basicLength = basicChars.length;

    if (basicLength > 0) output.push('-');

    let n = INITIAL_N;
    let delta = 0;
    let bias = INITIAL_BIAS;

    while (handledCount < codePoints.length) {
      let m = Infinity;
      for (const cp of codePoints) {
        if (cp >= n && cp < m) m = cp;
      }

      delta += (m - n) * (handledCount + 1);
      n = m;

      for (const cp of codePoints) {
        if (cp < n) delta++;
        if (cp === n) {
          let q = delta;
          let k = BASE;
          while (true) {
            const t = k <= bias ? TMIN : k >= bias + TMAX ? TMAX : k - bias;
            if (q < t) break;
            output.push(digitToChar(t + ((q - t) % (BASE - t))));
            q = Math.floor((q - t) / (BASE - t));
            k += BASE;
          }
          output.push(digitToChar(q));
          bias = adapt(delta, handledCount + 1, handledCount === basicLength);
          delta = 0;
          handledCount++;
        }
      }
      delta++;
      n++;
    }

    return output.join('');
  }

  function punycodeDecode(input: string): string {
    const output: number[] = [];
    let i = 0;
    let n = INITIAL_N;
    let bias = INITIAL_BIAS;

    let basicEnd = input.lastIndexOf('-');
    if (basicEnd < 0) basicEnd = 0;

    for (let j = 0; j < basicEnd; j++) {
      output.push(input.charCodeAt(j));
    }

    let pos = basicEnd > 0 ? basicEnd + 1 : 0;

    while (pos < input.length) {
      const oldi = i;
      let w = 1;
      let k = BASE;

      while (true) {
        if (pos >= input.length) throw new Error('Invalid Punycode');
        const digit = charToDigit(input.charCodeAt(pos++));
        if (digit >= BASE) throw new Error('Invalid Punycode');
        i += digit * w;
        const t = k <= bias ? TMIN : k >= bias + TMAX ? TMAX : k - bias;
        if (digit < t) break;
        w *= BASE - t;
        k += BASE;
      }

      const len = output.length + 1;
      bias = adapt(i - oldi, len, oldi === 0);
      n += Math.floor(i / len);
      i %= len;
      output.splice(i, 0, n);
      i++;
    }

    return String.fromCodePoint(...output);
  }

  function encodeDomain(domain: string): string {
    return domain
      .split('.')
      .map((label) => {
        const hasNonAscii = /[^\x00-\x7F]/.test(label);
        if (hasNonAscii) {
          return 'xn--' + punycodeEncode(label);
        }
        return label;
      })
      .join('.');
  }

  function decodeDomain(domain: string): string {
    return domain
      .split('.')
      .map((label) => {
        if (label.toLowerCase().startsWith('xn--')) {
          return punycodeDecode(label.slice(4));
        }
        return label;
      })
      .join('.');
  }

  function convert() {
    setError(undefined);
    setOutput('');

    if (!input.trim()) {
      setError('Please enter a domain name');
      return;
    }

    try {
      if (mode === 'encode') {
        setOutput(encodeDomain(input.trim()));
      } else {
        setOutput(decodeDomain(input.trim()));
      }
    } catch {
      setError('Invalid input for conversion');
    }
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          {mode === 'encode' ? 'Unicode Domain Name' : 'Punycode Domain Name'}
        </label>
        <input
          id={`${toolId}-input`}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encode' ? 'e.g. münchen.de or 日本語.jp' : 'e.g. xn--mnchen-3ya.de'}
          aria-label={`Input for ${toolName}`}
          className="input-field"
        />
        <div className="flex gap-3 mt-3">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="radio"
              name={`${toolId}-mode`}
              checked={mode === 'encode'}
              onChange={() => setMode('encode')}
              className="text-blue-600"
            />
            Unicode → Punycode
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="radio"
              name={`${toolId}-mode`}
              checked={mode === 'decode'}
              onChange={() => setMode('decode')}
              className="text-blue-600"
            />
            Punycode → Unicode
          </label>
        </div>
      </InputArea>

      <button onClick={convert} aria-label="Convert domain" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-xl font-bold text-blue-600 font-mono break-all">{output}</div>
              <div className="text-xs text-gray-500 mt-1">{mode === 'encode' ? 'Punycode' : 'Unicode'}</div>
            </div>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
