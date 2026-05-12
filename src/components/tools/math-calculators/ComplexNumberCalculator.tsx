'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

type Operation = 'add' | 'subtract' | 'multiply' | 'divide' | 'modulus' | 'conjugate';

interface Complex {
  real: number;
  imag: number;
}

/**
 * ComplexNumberCalculator - Add, subtract, multiply, and divide complex numbers.
 * Also computes modulus and conjugate.
 */
export default function ComplexNumberCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [realA, setRealA] = useState('');
  const [imagA, setImagA] = useState('');
  const [realB, setRealB] = useState('');
  const [imagB, setImagB] = useState('');
  const [operation, setOperation] = useState<Operation>('add');
  const [result, setResult] = useState<string>('');
  const [formula, setFormula] = useState<string>('');

  function formatComplex(c: Complex): string {
    const sign = c.imag >= 0 ? '+' : '-';
    return `${c.real.toFixed(4)} ${sign} ${Math.abs(c.imag).toFixed(4)}i`;
  }

  function handleCalculate() {
    const a: Complex = { real: parseFloat(realA) || 0, imag: parseFloat(imagA) || 0 };
    const b: Complex = { real: parseFloat(realB) || 0, imag: parseFloat(imagB) || 0 };

    let res: Complex | null = null;
    let formulaStr = '';
    let resultStr = '';

    switch (operation) {
      case 'add':
        res = { real: a.real + b.real, imag: a.imag + b.imag };
        formulaStr = `(${formatComplex(a)}) + (${formatComplex(b)})`;
        break;
      case 'subtract':
        res = { real: a.real - b.real, imag: a.imag - b.imag };
        formulaStr = `(${formatComplex(a)}) - (${formatComplex(b)})`;
        break;
      case 'multiply':
        res = {
          real: a.real * b.real - a.imag * b.imag,
          imag: a.real * b.imag + a.imag * b.real,
        };
        formulaStr = `(${formatComplex(a)}) × (${formatComplex(b)})`;
        break;
      case 'divide': {
        const denom = b.real * b.real + b.imag * b.imag;
        if (denom === 0) {
          setResult('Error: Division by zero (denominator is 0 + 0i)');
          setFormula('');
          return;
        }
        res = {
          real: (a.real * b.real + a.imag * b.imag) / denom,
          imag: (a.imag * b.real - a.real * b.imag) / denom,
        };
        formulaStr = `(${formatComplex(a)}) ÷ (${formatComplex(b)})`;
        break;
      }
      case 'modulus': {
        const modA = Math.sqrt(a.real * a.real + a.imag * a.imag);
        const modB = Math.sqrt(b.real * b.real + b.imag * b.imag);
        resultStr = `|z₁| = |${formatComplex(a)}| = ${modA.toFixed(6)}\n|z₂| = |${formatComplex(b)}| = ${modB.toFixed(6)}`;
        formulaStr = '|z| = √(a² + b²)';
        setResult(resultStr);
        setFormula(formulaStr);
        return;
      }
      case 'conjugate': {
        const conjA: Complex = { real: a.real, imag: -a.imag };
        const conjB: Complex = { real: b.real, imag: -b.imag };
        resultStr = `z̄₁ = ${formatComplex(conjA)}\nz̄₂ = ${formatComplex(conjB)}`;
        formulaStr = 'Conjugate of a + bi = a - bi';
        setResult(resultStr);
        setFormula(formulaStr);
        return;
      }
    }

    if (res) {
      resultStr = formatComplex(res);
      setResult(resultStr);
      setFormula(formulaStr + ' = ' + resultStr);
    }
  }

  const copyText = result ? `${formula}\nResult: ${result}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-2 gap-3">
        <InputArea>
          <label className="block text-sm font-medium text-gray-700 mb-1">z₁ Real Part (a)</label>
          <input
            type="text"
            inputMode="decimal"
            value={realA}
            onChange={(e) => setRealA(e.target.value)}
            placeholder="e.g. 3"
            aria-label={`Real part of z1 for ${toolName}`}
            className="input-field"
          />
        </InputArea>
        <InputArea>
          <label className="block text-sm font-medium text-gray-700 mb-1">z₁ Imaginary Part (b)</label>
          <input
            type="text"
            inputMode="decimal"
            value={imagA}
            onChange={(e) => setImagA(e.target.value)}
            placeholder="e.g. 4"
            aria-label={`Imaginary part of z1 for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      </div>

      <InputArea>
        <label htmlFor={`${toolId}-op`} className="block text-sm font-medium text-gray-700 mb-1">Operation</label>
        <select
          id={`${toolId}-op`}
          value={operation}
          onChange={(e) => setOperation(e.target.value as Operation)}
          aria-label={`Operation for ${toolName}`}
          className="input-field"
        >
          <option value="add">Add (+)</option>
          <option value="subtract">Subtract (−)</option>
          <option value="multiply">Multiply (×)</option>
          <option value="divide">Divide (÷)</option>
          <option value="modulus">Modulus (|z|)</option>
          <option value="conjugate">Conjugate (z̄)</option>
        </select>
      </InputArea>

      <div className="grid grid-cols-2 gap-3">
        <InputArea>
          <label className="block text-sm font-medium text-gray-700 mb-1">z₂ Real Part (c)</label>
          <input
            type="text"
            inputMode="decimal"
            value={realB}
            onChange={(e) => setRealB(e.target.value)}
            placeholder="e.g. 1"
            aria-label={`Real part of z2 for ${toolName}`}
            className="input-field"
          />
        </InputArea>
        <InputArea>
          <label className="block text-sm font-medium text-gray-700 mb-1">z₂ Imaginary Part (d)</label>
          <input
            type="text"
            inputMode="decimal"
            value={imagB}
            onChange={(e) => setImagB(e.target.value)}
            placeholder="e.g. 2"
            aria-label={`Imaginary part of z2 for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      </div>

      <button onClick={handleCalculate} aria-label="Calculate complex numbers" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <pre className="text-lg font-bold text-gray-800 font-mono whitespace-pre-wrap">{result}</pre>
            </div>
            {formula && (
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
                {formula}
              </div>
            )}
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
